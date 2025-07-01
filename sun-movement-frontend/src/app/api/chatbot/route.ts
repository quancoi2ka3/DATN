import { NextRequest, NextResponse } from 'next/server';

const RASA_SERVER_URL = 'http://localhost:5005';
const RASA_WEBHOOK_URL = `${RASA_SERVER_URL}/webhooks/rest/webhook`;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sender } = body;

    // Debug log để xác định vấn đề
    console.log(`Chatbot request received: message="${message}", sender="${sender}"`);

    // If this is a connection test, try to ping the webhook directly
    if (sender === 'connection_test' && message === 'ping') {
      try {
        const webhookTest = await fetch(RASA_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: 'health_check',
            message: 'ping'
          }),
          signal: AbortSignal.timeout(8000),
        });
        
        if (webhookTest.ok) {
          return NextResponse.json([{ text: "Connection successful" }]);
        } else {
          throw new Error(`Webhook returned status: ${webhookTest.status}`);
        }
      } catch (healthError) {
        console.error("Rasa connection test failed:", healthError);
        return NextResponse.json(
          { error: 'Rasa server is not available or not ready yet. Please wait a moment and try again.' },
          { status: 503 }
        );
      }
    }

    // First, try to get response from Rasa (với debug logs chi tiết)
    let rasaResponse = [];
    try {
      console.log(`Sending request to Rasa webhook: ${RASA_WEBHOOK_URL}`);
      console.log(`Request body: ${JSON.stringify(body)}`);
      
      const response = await fetch(RASA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: sender || 'web_user', 
          message: message.trim()
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        rasaResponse = await response.json();
        console.log(`Rasa response received: ${JSON.stringify(rasaResponse)}`);
      } else {
        console.error(`Rasa webhook error: ${response.status} ${response.statusText}`);
      }
    } catch (rasaError) {
      console.error('Rasa connection failed:', rasaError);
    }

    // [DEBUGGING] Ghi log chi tiết về câu hỏi và các bước xử lý
    const lowerMessage = message.toLowerCase().trim();
    console.log(`[DEBUG-FLOW] Nhận được tin nhắn: '${message}'`);
    console.log(`[DEBUG-FLOW] Rasa response có ${rasaResponse ? rasaResponse.length : 0} phản hồi`);
    
    // Ghi log trạng thái tin nhắn
    console.log(`[DEBUG-INTENT] Tin nhắn '${message}' đã được xử lý qua route.ts API`);
    
    // Kiểm tra Rasa response
    if (rasaResponse && Array.isArray(rasaResponse) && rasaResponse.length > 0) {
      console.log(`[DEBUG-RASA] Rasa response details: ${JSON.stringify(rasaResponse)}`);
      
      // Kiểm tra xem phản hồi Rasa có phải fallback không
      const isFallback = isRasaFallback(rasaResponse);
      console.log(`[DEBUG-FLOW] Rasa response là fallback: ${isFallback}`);
      
      // Nếu Rasa trả về phản hồi không phải fallback, sử dụng nó
      if (!isFallback) {
        console.log(`[DEBUG-FLOW] Sử dụng phản hồi từ Rasa vì có phản hồi hợp lệ`);
        return NextResponse.json(rasaResponse);
      }
    } else {
      console.log(`[DEBUG-RASA] Rasa không có phản hồi hợp lệ`);
    }
    
    /**
     * Danh sách từ khóa đơn lẻ cần xử lý đặc biệt qua smart response
     * Chỉ bao gồm các từ khóa CHÍNH XÁC, không phải từ khóa con
     */
    const simpleKeywords = [
      'sản phẩm', 'sp', 
      'giá', 'phí', 'giá cả',
      'dịch vụ', 
      'liên hệ', 'địa chỉ', 'số điện thoại', 'email', 
      'lịch', 'giờ', 'thời gian', 
      'thành viên', 'hội viên', 'membership'
      // Bỏ 'thanh toán' và 'payment' khỏi danh sách từ khóa đơn lẻ
    ];
    
    // Chỉ khớp khi tin nhắn CHÍNH XÁC là một từ khóa đơn lẻ
    // Không áp dụng cho câu hỏi phức tạp có chứa từ khóa
    const isSimpleQuery = simpleKeywords.includes(lowerMessage);
    
    // Xử lý đặc biệt cho câu chào đơn giản
    if (lowerMessage === 'xin chào' || lowerMessage === 'chào' || lowerMessage === 'hi' || lowerMessage === 'hello') {
      console.log(`[DEBUG-FLOW] Phát hiện câu chào đơn giản: "${lowerMessage}"`);
      return NextResponse.json([{ 
        text: "Xin chào! Tôi là trợ lý ảo của Sun Movement. Tôi có thể giúp bạn tìm hiểu về sản phẩm, dịch vụ, giá cả và thông tin liên hệ. Bạn cần hỗ trợ gì?" 
      }]);
    }
    
    // CHỈ sử dụng smart response nếu Rasa không có phản hồi hợp lệ hoặc là fallback
    if (rasaResponse && Array.isArray(rasaResponse) && rasaResponse.length > 0 && !isRasaFallback(rasaResponse)) {
      console.log(`[DEBUG-FLOW] Sử dụng phản hồi từ Rasa vì có phản hồi hợp lệ, BỎ QUA smart response`);
      return NextResponse.json(rasaResponse);
    }
    
    console.log(`[DEBUG-FLOW] Rasa không có phản hồi hợp lệ, thử dùng smart response`);
    
    // Chỉ xử lý qua smart response nếu không có phản hồi hợp lệ từ Rasa
    // Hoặc phản hồi là fallback
    
    // Kiểm tra nếu Rasa trả về phản hồi hợp lệ (không phải fallback)
    const rasaHasValidResponse = rasaResponse && 
                                 Array.isArray(rasaResponse) && 
                                 rasaResponse.length > 0 && 
                                 !isRasaFallback(rasaResponse);
    
    console.log(`[DEBUG-FLOW] Rasa có phản hồi hợp lệ: ${rasaHasValidResponse}`);
    
    // Nếu Rasa đã có phản hồi hợp lệ, dùng luôn và không gọi getSmartResponse
    if (rasaHasValidResponse) {
      console.log(`[DEBUG-FLOW] Sử dụng phản hồi trực tiếp từ Rasa và bỏ qua smart response`);
      return NextResponse.json(rasaResponse);
    }
    
    // Chỉ sử dụng smart response nếu Rasa không có phản hồi hợp lệ
    console.log(`[DEBUG-FLOW] Rasa không có phản hồi hợp lệ, thử dùng smart response`);
    
    // Xử lý từ khóa đơn lẻ
    if (isSimpleQuery) {
      console.log(`[DEBUG-FLOW] Phát hiện từ khóa đơn lẻ chính xác: "${lowerMessage}"`);
      const smartResponse = await getSmartResponse(message);
      
      if (smartResponse) {
        console.log(`[DEBUG-FLOW] Tìm thấy smart response cho từ khóa: ${smartResponse.substring(0, 50)}...`);
        return NextResponse.json([{ text: smartResponse }]);
      }
    }
    
    // Đối với các câu hỏi khác, chỉ dùng smart response nếu có từ khóa cụ thể
    console.log(`[DEBUG-FLOW] Kiểm tra từ khóa trong câu hỏi phức tạp: "${lowerMessage}"`);
    const smartResponse = await getSmartResponse(message);
    
    if (smartResponse) {
      console.log(`[DEBUG-FLOW] Tìm thấy smart response: ${smartResponse.substring(0, 50)}...`);
      return NextResponse.json([{ text: smartResponse }]);
    }
    
    // Nếu cả Rasa và getSmartResponse đều không có kết quả, trả về thông báo fallback
    console.log(`[DEBUG-FLOW] Không có phản hồi nào hợp lệ, trả về fallback response`);
    

    // Fallback response
    console.log('Using fallback response');
    return NextResponse.json([
      {
        text: "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n• Sản phẩm và dịch vụ\n• Giá cả và khuyến mại\n• Lịch tập và đăng ký\n• Liên hệ và hỗ trợ"
      }
    ]);

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    // Check if it's a timeout error
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request to chat service timed out. The server might be starting up.' },
        { status: 504 }
      );
    }
    
    // Check if it's a network error (connection refused)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Cannot connect to chat service. Please make sure Rasa server is running.' },
        { status: 503 }
      );
    }
    
    // General server error
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Kiểm tra xem phản hồi từ Rasa có phải là fallback hay không
 */
function isRasaFallback(responses: any[]): boolean {
  // Nếu không có phản hồi hoặc không phải mảng
  if (!Array.isArray(responses) || responses.length === 0) {
    console.log(`[DEBUG-FALLBACK] Không có phản hồi hoặc không phải mảng`);
    return true;
  }
  
  // Kiểm tra các mẫu phản hồi fallback phổ biến
  const fallbackPatterns = [
    'tôi không hiểu',
    'không thể xử lý',
    'không hiểu câu hỏi',
    'xin lỗi, tôi không',
    'tôi không biết',
    'bạn có thể hỏi về',  // Thường xuất hiện trong fallback mặc định
    'tôi không chắc',
    'bạn có thể nói rõ hơn',
    'bạn có thể diễn đạt lại',
    'không rõ'
  ];
  
  // Các mẫu chào hỏi hợp lệ (không phải fallback)
  const greetingPatterns = [
    'xin chào',
    'chào bạn',
    'tôi là trợ lý',
    'tôi có thể giúp',
    'sun movement',
    'rất vui được gặp bạn'
  ];
  
  // Hàm kiểm tra nếu một phản hồi là fallback
  const isFallbackResponse = (response: any) => {
    // Kiểm tra cấu trúc response
    if (!response || !response.text) {
      console.log(`[DEBUG-FALLBACK] Phát hiện phản hồi không có text`);
      return true; // Không có text là fallback
    }
    
    const text = response.text.toLowerCase();
    console.log(`[DEBUG-FALLBACK] Đang kiểm tra phản hồi: "${text.substring(0, 50)}..."`);
    
    // Kiểm tra intent nếu có
    if (response.intent && 
       (response.intent === 'nlu_fallback' || 
        response.intent === 'out_of_scope' || 
        response.intent.includes('fallback'))) {
      console.log(`[DEBUG-FALLBACK] Phát hiện intent fallback: ${response.intent}`);
      return true;
    }
    
    // Kiểm tra nếu là chào hỏi hợp lệ (không phải fallback)
    for (const pattern of greetingPatterns) {
      if (text.includes(pattern)) {
        console.log(`[DEBUG-FALLBACK] Phát hiện mẫu chào hỏi hợp lệ: "${pattern}"`);
        return false;
      }
    }
    
    // Kiểm tra độ tin cậy (confidence) nếu có
    if (response.confidence && response.confidence < 0.3) {
      console.log(`[DEBUG-FALLBACK] Phát hiện confidence thấp: ${response.confidence}`);
      return true;
    }
    
    // Nếu nội dung quá ngắn (ít hơn 30 ký tự), có thể là phản hồi lỗi
    // Trừ khi đó là câu chào hoặc cảm ơn
    if (text.length < 30 && !text.includes('chào') && !text.includes('vui') && !text.includes('cảm ơn')) {
      console.log(`[DEBUG-FALLBACK] Phản hồi quá ngắn (${text.length} ký tự)`);
      return true;
    }
    
    // Kiểm tra các mẫu fallback
    for (const pattern of fallbackPatterns) {
      if (text.includes(pattern)) {
        console.log(`[DEBUG-FALLBACK] Phát hiện mẫu fallback: "${pattern}"`);
        return true;
      }
    }
    
    console.log(`[DEBUG-FALLBACK] Phản hồi có vẻ hợp lệ`);
    return false;
  };
  
  // Kiểm tra từng phản hồi
  const allResponsesAreFallback = responses.every(isFallbackResponse);
  
  console.log(`[DEBUG-FALLBACK] Kết luận: ${allResponsesAreFallback ? 'TẤT CẢ phản hồi là fallback' : 'CÓ phản hồi hợp lệ'}`);
  
  // Một phản hồi được coi là fallback nếu tất cả các tin nhắn trong đó đều là fallback
  return allResponsesAreFallback;
}

async function getSmartResponse(message: string): Promise<string | null> {
  const lowerMessage = message.toLowerCase().trim();
  
  try {
    // DEBUG: Ghi log để theo dõi tin nhắn vào hàm
    console.log(`[DEBUG-SMART] Bắt đầu xử lý tin nhắn: '${message}'`);
    console.log(`[DEBUG-SMART] Lowercase: '${lowerMessage}'`);
    
    // Xử lý đặc biệt cho các từ khóa đơn lẻ CHÍNH XÁC
    switch (lowerMessage) {
      // Xử lý các trường hợp chào hỏi
      case 'xin chào':
      case 'chào':
      case 'hi':
      case 'hello':
        console.log(`[DEBUG-SMART] Phát hiện lời chào chính xác: "${lowerMessage}"`);
        return "Xin chào! Tôi là trợ lý ảo của Sun Movement. Tôi có thể giúp bạn tìm hiểu về sản phẩm, dịch vụ, giá cả và thông tin liên hệ. Bạn cần hỗ trợ gì?";
      
      // Xử lý các trường hợp trợ giúp
      case 'trợ giúp':
      case 'giúp đỡ':
      case 'help':
        console.log(`[DEBUG-SMART] Phát hiện yêu cầu trợ giúp chính xác: "${lowerMessage}"`);
        return "Tôi có thể giúp bạn với những thông tin sau:\n• Sản phẩm và dịch vụ\n• Giá cả và khuyến mãi\n• Lịch tập và đăng ký\n• Liên hệ và hỗ trợ\n\nBạn cần tìm hiểu về vấn đề nào?";
        
      case 'sản phẩm':
      case 'sp':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa sản phẩm chính xác: "${lowerMessage}"`);
        return await getProductInfo(message);
        
      case 'dịch vụ':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa dịch vụ chính xác: "${lowerMessage}"`);
        return await getServiceInfo(message);
        
      case 'giá':
      case 'giá cả':
      case 'phí':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa giá chính xác: "${lowerMessage}"`);
        return await getPriceInfo(message);
      case 'liên hệ':
      case 'địa chỉ':
      case 'số điện thoại':
      case 'email':
      case 'ở đâu':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa liên hệ chính xác: "${lowerMessage}"`);
        return getContactInfo();
        
      case 'lịch':
      case 'giờ':
      case 'thời gian':
      case 'mở cửa':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa lịch chính xác: "${lowerMessage}"`);
        return getScheduleInfo();
        
      case 'thành viên':
      case 'hội viên':
      case 'membership':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa thành viên chính xác: "${lowerMessage}"`);
        return getMembershipInfo();
        
      case 'thanh toán':
      case 'phương thức thanh toán':
      case 'cách thanh toán':
      case 'trả tiền':
      case 'payment':
        console.log(`[DEBUG-SMART] Phát hiện từ khóa thanh toán chính xác: "${lowerMessage}"`);
        return getPaymentMethodsInfo();
        
      default:
        console.log(`[DEBUG-SMART] Không khớp từ khóa đơn lẻ chính xác, kiểm tra từ khóa phức tạp`);
        break;
    }
    
    // Kiểm tra các từ khóa phức tạp với điều kiện CHẶT CHẼ
    console.log(`[DEBUG-SMART] Bắt đầu kiểm tra từ khóa phức tạp cho: '${lowerMessage}'`);
    
    // Kiểm tra sản phẩm với điều kiện chặt chẽ
    if (lowerMessage.includes('sản phẩm') || 
        (lowerMessage.includes('thiết bị') && (lowerMessage.includes('gym') || lowerMessage.includes('tập'))) || 
        (lowerMessage.includes('dụng cụ') && lowerMessage.includes('tập')) ||
        lowerMessage.includes('máy tập')) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về sản phẩm`);
      return await getProductInfo(message);
    }
    
    // Kiểm tra dịch vụ với điều kiện chặt chẽ
    if (lowerMessage.includes('dịch vụ') ||
        lowerMessage.includes('lớp học') || 
        (lowerMessage.includes('tập luyện') && !lowerMessage.includes('thiết bị')) || 
        lowerMessage.includes('yoga') || 
        (lowerMessage.includes('gym') && !lowerMessage.includes('thiết bị')) || 
        lowerMessage.includes('fitness')) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về dịch vụ`);
      return await getServiceInfo(message);
    }

    // Kiểm tra giá cả với điều kiện chặt chẽ
    if (lowerMessage.includes('giá') ||
        lowerMessage.includes('bao nhiêu') || 
        lowerMessage.includes('chi phí') || 
        lowerMessage.includes('phí') || 
        lowerMessage.includes('học phí')) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về giá`);
      return await getPriceInfo(message);
    }

    // Kiểm tra liên hệ với điều kiện chặt chẽ
    if (lowerMessage.includes('liên hệ') ||
        lowerMessage.includes('địa chỉ') ||
        lowerMessage.includes('số điện thoại') || 
        lowerMessage.includes('email') ||
        lowerMessage.includes('ở đâu')) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về liên hệ`);
      return getContactInfo();
    }

    // Kiểm tra lịch với điều kiện chặt chẽ
    if (lowerMessage.includes('lịch') ||
        lowerMessage.includes('giờ') || 
        lowerMessage.includes('thời gian') || 
        lowerMessage.includes('mở cửa') || 
        lowerMessage.includes('đóng cửa')) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về lịch`);
      return getScheduleInfo();
    }

    // Kiểm tra thành viên với điều kiện chặt chẽ
    if (lowerMessage.includes('thành viên') ||
        lowerMessage.includes('hội viên') ||
        lowerMessage.includes('đăng ký') || 
        lowerMessage.includes('membership')) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về thành viên`);
      return getMembershipInfo();
    }
    
    // Kiểm tra thanh toán với điều kiện CỰC KỲ CHẶT CHẼ (đặt cuối cùng)
    // Phải có "thanh toán" + ("phương thức" hoặc "cách thức" hoặc "hình thức") 
    // Hoặc "trả tiền bằng" + (thẻ hoặc tiền mặt hoặc momo)
    if (
        // Chỉ khớp khi có cụm từ đủ cụ thể về phương thức thanh toán
        (lowerMessage.includes('thanh toán') && 
         (lowerMessage.includes('phương thức') || 
          lowerMessage.includes('cách thức') || 
          lowerMessage.includes('hình thức') ||
          lowerMessage.includes('bằng thẻ') || 
          lowerMessage.includes('bằng tiền mặt') || 
          lowerMessage.includes('bằng momo'))) || 
        // HOẶC chính xác từ khóa "payment method" (tiếng Anh)
        (lowerMessage === 'payment method') || 
        // HOẶC "trả tiền bằng" + phương tiện cụ thể
        (lowerMessage.includes('trả tiền bằng') && 
         (lowerMessage.includes('thẻ') || 
          lowerMessage.includes('tiền mặt') || 
          lowerMessage.includes('momo') ||
          lowerMessage.includes('online') ||
          lowerMessage.includes('ngân hàng')))
       ) {
      console.log(`[DEBUG-SMART] Phát hiện từ khóa phức tạp về thanh toán với điều kiện cực kỳ chặt chẽ`);
      return getPaymentMethodsInfo();
    }
    
    console.log(`[DEBUG-SMART] Không tìm thấy từ khóa phù hợp nào cho tin nhắn: "${lowerMessage}"`);
    return null;

  } catch (error) {
    console.error('[DEBUG-SMART] Lỗi trong smart response:', error);
    return null;
  }
}

async function getProductInfo(message: string): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/Products`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const products = await response.json();
      
      if (products && products.length > 0) {
        const featuredProducts = products.slice(0, 3);
        let responseText = "🏋️ **Sản phẩm nổi bật của Sun Movement:**\n\n";
        
        featuredProducts.forEach((product: any, index: number) => {
          responseText += `${index + 1}. **${product.name}**\n`;
          responseText += `   💰 Giá: ${product.price?.toLocaleString('vi-VN')}đ\n`;
          if (product.description) {
            responseText += `   📝 ${product.description.substring(0, 100)}...\n`;
          }
          responseText += "\n";
        });
        
        responseText += "Bạn có thể xem thêm sản phẩm khác trên website của chúng tôi!";
        return responseText;
      }
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  
  return "🏋️ Sun Movement có đa dạng các sản phẩm tập luyện chất lượng cao như:\n• Thiết bị gym chuyên nghiệp\n• Dụng cụ yoga và pilates\n• Phụ kiện tập luyện\n• Thực phẩm bổ sung\n\nBạn muốn tìm hiểu về sản phẩm nào cụ thể?";
}

async function getServiceInfo(message: string): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/Services`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const services = await response.json();
      
      if (services && services.length > 0) {
        const featuredServices = services.slice(0, 3);
        let responseText = "🧘 **Dịch vụ tại Sun Movement:**\n\n";
        
        featuredServices.forEach((service: any, index: number) => {
          responseText += `${index + 1}. **${service.name}**\n`;
          responseText += `   💰 Giá: ${service.price?.toLocaleString('vi-VN')}đ\n`;
          if (service.description) {
            responseText += `   📝 ${service.description.substring(0, 100)}...\n`;
          }
          responseText += "\n";
        });
        
        responseText += "Đăng ký ngay để nhận ưu đái đặc biệt!";
        return responseText;
      }
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
  
  return "🧘 **Dịch vụ tại Sun Movement:**\n• Lớp Yoga cơ bản & nâng cao\n• Personal Training 1-1\n• Group Fitness Classes\n• Tư vấn dinh dưỡng\n• Massage thư giãn\n\nBạn quan tâm đến dịch vụ nào?";
}

async function getPriceInfo(message: string): Promise<string> {
  return "💰 **Bảng giá dịch vụ Sun Movement:**\n\n" +
         "🏃 **Gói tập:**\n" +
         "• Gói 1 tháng: 500.000đ\n" +
         "• Gói 3 tháng: 1.350.000đ (Tiết kiệm 150.000đ)\n" +
         "• Gói 6 tháng: 2.400.000đ (Tiết kiệm 600.000đ)\n" +
         "• Gói 1 năm: 4.200.000đ (Tiết kiệm 1.800.000đ)\n\n" +
         "🧘 **Lớp học đặc biệt:**\n" +
         "• Yoga: 200.000đ/buổi\n" +
         "• Personal Training: 500.000đ/buổi\n\n" +
         "💥 **Ưu đãi hiện tại:** Giảm 20% cho thành viên mới!";
}

function getContactInfo(): string {
  return "📞 **Thông tin liên hệ Sun Movement:**\n\n" +
         "🏢 **Địa chỉ:** Tầng 11, số 300 Đê La Thành nhỏ, Thổ Quan, Đống Đa, Hà Nội\n" +
         "📱 **Hotline:** 08999139393\n" +
         "📧 **Email:** contact@sunmovement.vn\n" +
         "🌐 **Website:** sunmovement.vn\n" +
         "⏰ **Giờ làm việc:** 6:00 - 22:00 hàng ngày\n\n" +
         "Hãy liên hệ với chúng tôi để được tư vấn miễn phí!";
}

function getScheduleInfo(): string {
  return "⏰ **Lịch hoạt động Sun Movement:**\n\n" +
         "🌅 **Sáng:**\n" +
         "• 6:00 - 9:00: Yoga buổi sáng\n" +
         "• 9:00 - 11:00: Gym & Cardio\n\n" +
         "🌞 **Trưa:**\n" +
         "• 11:00 - 14:00: Personal Training\n" +
         "• 14:00 - 16:00: Lớp nhóm\n\n" +
         "🌆 **Chiều/Tối:**\n" +
         "• 16:00 - 19:00: Peak hours - Tất cả dịch vụ\n" +
         "• 19:00 - 22:00: Yoga thư giãn\n\n" +
         "📅 **Mở cửa:** Thứ 2 - Chủ nhật (6:00 - 22:00)";
}

function getMembershipInfo(): string {
  return "🌟 **Thông tin thành viên Sun Movement:**\n\n" +
         "📊 **Các gói thành viên:**\n" +
         "• Basic: 500.000đ/tháng\n" +
         "• Premium: 800.000đ/tháng\n" +
         "• VIP: 1.200.000đ/tháng\n\n" +
         "✨ **Quyền lợi thành viên:**\n" +
         "• Sử dụng đầy đủ trang thiết bị\n" +
         "• Tham gia các lớp nhóm miễn phí\n" +
         "• Tư vấn dinh dưỡng cá nhân\n" +
         "• Giảm giá dịch vụ bổ sung\n\n" +
         "💳 **Đăng ký thành viên tại quầy lễ tân hoặc website của chúng tôi!**";
}

function getPaymentMethodsInfo(): string {
  return "💳 **Phương thức thanh toán:**\n" +
         "• Tiền mặt tại cửa hàng\n" +
         "• Chuyển khoản ngân hàng\n" +
         "• Thẻ tín dụng/ghi nợ\n" +
         "• Ví điện tử (MoMo, ZaloPay)\n" +
         "• COD (thanh toán khi nhận hàng)\n" +
         "• Trả góp 0% qua thẻ tín dụng";
}
