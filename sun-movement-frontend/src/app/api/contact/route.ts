import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, type EmailData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, type = 'general' } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Địa chỉ email không hợp lệ.' },
        { status: 400 }
      );
    }

    // Prepare contact data
    const contactData: EmailData = {
      name,
      email,
      phone,
      subject,
      message,
      type,
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('vi-VN'),
    };

    console.log('Contact form submission:', contactData);

    try {
      // Send email
      await sendContactEmail(contactData);
      
      return NextResponse.json({
        success: true,
        message: 'Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi qua email trong vòng 24 giờ.',
      });
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Still return success to user but log the error
      // In production, you might want to save to database as fallback
      return NextResponse.json({
        success: true,
        message: 'Tin nhắn đã được ghi nhận. Chúng tôi sẽ phản hồi sớm nhất có thể.',
        warning: 'Email service temporarily unavailable'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Messenger.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}


