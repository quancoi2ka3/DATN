from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import requests
import json
import logging
import os

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# URL API backend
BASE_URL = "http://localhost:5000/api"  # Điều chỉnh URL phù hợp với backend của bạn

# Path tới dữ liệu mẫu
DUMMY_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "dummy_data")

# Hàm để tải dữ liệu mẫu
def load_dummy_data(file_name):
    try:
        file_path = os.path.join(DUMMY_DATA_PATH, file_name)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as file:
                return json.load(file)
        else:
            logger.warning(f"File dữ liệu mẫu không tồn tại: {file_path}")
            return None
    except Exception as e:
        logger.error(f"Lỗi khi đọc file dữ liệu mẫu {file_name}: {str(e)}")
        return None

class ActionSearchProduct(Action):
    def name(self) -> Text:
        return "action_search_product"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        product = tracker.get_slot("product")
        product_category = tracker.get_slot("product_category")
        
        search_term = product if product else product_category
        
        if not search_term:
            dispatcher.utter_message(text="Bạn muốn tìm sản phẩm gì?")
            return []
        
        try:
            # Thử tải dữ liệu mẫu từ file JSON thực tế
            dummy_data = load_dummy_data("products.json")
            
            if dummy_data and "products" in dummy_data:
                # Tìm kiếm trong dữ liệu mẫu
                products = []
                for product_data in dummy_data["products"]:
                    if search_term.lower() in product_data["name"].lower() or (
                        "category" in product_data and 
                        search_term.lower() in product_data["category"].lower()
                    ) or (
                        "subCategory" in product_data and
                        search_term.lower() in product_data["subCategory"].lower()
                    ) or (
                        "description" in product_data and
                        search_term.lower() in product_data["description"].lower()
                    ):
                        products.append(product_data)
            else:
                # Gọi API tìm kiếm sản phẩm
                try:
                    # response = requests.get(f"{BASE_URL}/products/search?q={search_term}")
                    # if response.status_code == 200:
                    #     products = response.json()
                    # else:
                    #     products = []
                    
                    # Mô phỏng dữ liệu khi không có dữ liệu mẫu hoặc API
                    products = [
                        {"name": f"Sun Movement {search_term} Premium", "price": "850000", "discountPrice": "750000", "description": f"Sản phẩm {search_term} cao cấp từ Sun Movement", "slug": f"sun-movement-{search_term.lower().replace(' ', '-')}-premium"},
                        {"name": f"Sun Movement {search_term} Standard", "price": "650000", "discountPrice": None, "description": f"Sản phẩm {search_term} chất lượng tốt từ Sun Movement", "slug": f"sun-movement-{search_term.lower().replace(' ', '-')}-standard"},
                        {"name": f"Sun Movement {search_term} Basic", "price": "450000", "discountPrice": None, "description": f"Sản phẩm {search_term} cơ bản từ Sun Movement", "slug": f"sun-movement-{search_term.lower().replace(' ', '-')}-basic"}
                    ]
                except Exception as e:
                    logger.error(f"Lỗi khi gọi API: {str(e)}")
                    products = []
                
            if products and len(products) > 0:
                # Tạo tiêu đề SEO-friendly
                message = f"🔍 **Top sản phẩm {search_term} chất lượng cao tại Sun Movement**\n\n"
                message += f"Chúng tôi tìm thấy {len(products)} sản phẩm phù hợp với yêu cầu của bạn:\n\n"
                
                # Hiển thị tối đa 5 sản phẩm với định dạng phong phú hơn
                for i, product in enumerate(products[:5], 1):
                    price = product["price"] if isinstance(product["price"], str) else f"{product['price']:,}"
                    # Tạo tên sản phẩm với format markdown để SEO
                    product_name = product.get("name", "")
                    slug = product.get("slug", product_name.lower().replace(" ", "-"))
                    product_url = f"https://www.sunmovement.vn/products/{slug}"
                    
                    message += f"{i}. **{product_name}**\n"
                    
                    # Thêm mô tả ngắn nếu có
                    if "description" in product and product["description"]:
                        message += f"   {product['description']}\n"
                    
                    message += f"   💰 Giá: {price}đ"
                    
                    discount_price = product.get("discountPrice")
                    if discount_price:
                        discount_price = discount_price if isinstance(discount_price, str) else f"{discount_price:,}"
                        # Tính phần trăm giảm giá nếu có thể
                        if isinstance(product["price"], (int, float)) and isinstance(discount_price, str):
                            discount_price_num = int(discount_price.replace(",", ""))
                            discount_percent = round((product["price"] - discount_price_num) / product["price"] * 100)
                            message += f" (🔥 Giảm: {discount_price}đ - Tiết kiệm {discount_percent}%)"
                        else:
                            message += f" (🔥 Giảm: {discount_price}đ)"
                    
                    # Thêm thông tin về danh mục và tồn kho
                    if "category" in product:
                        message += f"\n   📋 Danh mục: {product['category']}"
                        if "subCategory" in product:
                            message += f" > {product['subCategory']}"
                    
                    if "stockQuantity" in product:
                        stock = "✅ Còn hàng" if product["stockQuantity"] > 0 else "❌ Hết hàng"
                        message += f"\n   📦 Tình trạng: {stock}"
                    
                    # Thêm link đến sản phẩm
                    message += f"\n   [👉 Xem chi tiết và mua hàng]({product_url})\n\n"
                
                # Thêm thông tin bổ sung nếu có nhiều sản phẩm
                if len(products) > 5:
                    category_url = f"https://www.sunmovement.vn/collections/{search_term.lower().replace(' ', '-')}"
                    message += f"\n**[👉 Xem thêm {len(products) - 5} sản phẩm {search_term} khác tại đây]({category_url})**"
                
                # Thêm lời khuyên hoặc khuyến mãi để tăng tỷ lệ chuyển đổi
                message += f"\n\n💡 **Lời khuyên**: Khi chọn {search_term}, hãy chú ý đến chất lượng và thông số kỹ thuật phù hợp với nhu cầu của bạn. Cần tư vấn thêm? Liên hệ hotline 1900.xxxx hoặc chat với chúng tôi!"
                
                if any(p.get("discountPrice") for p in products):
                    message += "\n\n🎁 **Ưu đãi**: Mua ngay hôm nay để hưởng giá ưu đãi và freeship cho đơn hàng từ 500.000đ!"
                
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text=f"Rất tiếc, tôi không tìm thấy sản phẩm nào về '{search_term}'. Bạn có thể thử tìm với từ khóa khác.")
        except Exception as e:
            logger.error(f"Error in action_search_product: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi kết nối với hệ thống. Vui lòng thử lại sau.")
            
        return [SlotSet("product", None), SlotSet("product_category", None)]

class ActionCheckOrder(Action):
    def name(self) -> Text:
        return "action_check_order"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        order_id = tracker.get_slot("order_id")
        
        if not order_id:
            dispatcher.utter_message(text="Vui lòng cung cấp mã đơn hàng để tôi kiểm tra giúp bạn.")
            return []
        
        try:
            # Gọi API kiểm tra đơn hàng
            # response = requests.get(f"{BASE_URL}/orders/{order_id}")
            
            # Mô phỏng phản hồi API
            # if response.status_code == 200:
            #    order = response.json()
            
            # Mô phỏng dữ liệu đơn hàng
            if order_id.startswith("SM"):
                order = {
                    "status": "Đang giao hàng",
                    "estimatedDeliveryDate": "30/06/2025"
                }
                
                message = f"Đơn hàng {order_id} của bạn đang ở trạng thái: {order['status']}.\n"
                if order['status'] == 'Đang giao hàng':
                    message += f"Dự kiến giao hàng vào ngày {order['estimatedDeliveryDate']}."
                
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text=f"Không tìm thấy đơn hàng với mã {order_id}. Vui lòng kiểm tra lại mã đơn hàng.")
        except Exception as e:
            logger.error(f"Error in action_check_order: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi kết nối với hệ thống. Vui lòng thử lại sau.")
            
        return []

class ActionFetchDiscountInfo(Action):
    def name(self) -> Text:
        return "action_fetch_discount_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Gọi API lấy thông tin khuyến mãi đang hoạt động
            # response = requests.get(f"{BASE_URL}/coupons/active")
            
            # Mô phỏng phản hồi API
            # if response.status_code == 200:
            #    coupons = response.json()
            
            # Mô phỏng dữ liệu khuyến mãi
            coupons = [
                {"code": "SUMMER25", "description": "Giảm 25% cho tất cả sản phẩm", "endDate": "15/07/2025"},
                {"code": "FREESHIP", "description": "Miễn phí vận chuyển cho đơn hàng trên 300.000đ", "endDate": "10/07/2025"}
            ]
            
            if coupons and len(coupons) > 0:
                message = "Hiện tại Sun Movement đang có các chương trình khuyến mãi sau:\n\n"
                
                for i, coupon in enumerate(coupons, 1):
                    message += f"{i}. {coupon['description']} - Mã: {coupon['code']}"
                    if coupon.get('endDate'):
                        message += f" (Hết hạn: {coupon['endDate']})"
                    message += "\n"
                
                message += "\nBạn có thể sử dụng các mã này khi thanh toán trên website hoặc tại cửa hàng."
                
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text="Hiện tại chưa có chương trình khuyến mãi nào đang diễn ra. Vui lòng theo dõi website hoặc fanpage của chúng tôi để cập nhật thông tin mới nhất.")
        
        # except Exception as e:
        except:
            dispatcher.utter_message(text="Đã xảy ra lỗi khi kết nối với hệ thống. Vui lòng thử lại sau.")
            
        return []

class ActionGetFAQ(Action):
    def name(self) -> Text:
        return "action_get_faq"

    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy nội dung câu hỏi từ tin nhắn người dùng
        query = tracker.latest_message.get('text')
        
        try:
            # Thử tải dữ liệu mẫu trước
            dummy_data = load_dummy_data("faqs.json")
            
            if dummy_data and "faqs" in dummy_data:
                # Tìm kiếm trong dữ liệu mẫu
                best_match = None
                highest_match_count = 0
                
                for faq in dummy_data["faqs"]:
                    # Đơn giản hóa: Tìm kiếm từ khóa trong câu hỏi
                    query_words = set(query.lower().split())
                    question_words = set(faq["question"].lower().split())
                    
                    match_count = len(query_words.intersection(question_words))
                    if match_count > highest_match_count:
                        highest_match_count = match_count
                        best_match = faq
                
                if best_match and highest_match_count >= 2:  # Yêu cầu ít nhất 2 từ khớp
                    dispatcher.utter_message(text=best_match["answer"])
                    return []
            
            # Nếu không có dữ liệu mẫu hoặc không tìm thấy kết quả phù hợp
            # Mô phỏng dữ liệu FAQ
            faqs = {
                "giờ làm việc": "Chúng tôi mở cửa từ 6:00 đến 22:00 các ngày trong tuần, cuối tuần từ 8:00 đến 20:00.",
                "đổi trả": "Chính sách đổi trả của Sun Movement cho phép bạn đổi sản phẩm trong vòng 7 ngày nếu còn nguyên tem nhãn và hoá đơn mua hàng.",
                "bảo hành": "Các sản phẩm của chúng tôi được bảo hành từ 6-12 tháng tuỳ loại sản phẩm. Chi tiết bảo hành được ghi rõ trên phiếu bảo hành đi kèm.",
                "thanh toán": "Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản ngân hàng, và tất cả các loại thẻ tín dụng/ghi nợ phổ biến.",
                "huấn luyện viên": "Đội ngũ huấn luyện viên của Sun Movement gồm các chuyên gia được đào tạo chuyên nghiệp với chứng chỉ quốc tế về fitness và dinh dưỡng.",
                "thành viên": "Chương trình thành viên của chúng tôi có 3 hạng: Bạc, Vàng, và Kim cương với nhiều đặc quyền khác nhau. Bạn có thể đăng ký tại quầy lễ tân hoặc trên website.",
                "ship": "Chúng tôi giao hàng miễn phí trong nội thành cho đơn hàng từ 500.000đ trở lên, thời gian giao hàng từ 1-3 ngày làm việc.",
                "liên hệ": "Bạn có thể liên hệ với Sun Movement qua số điện thoại 1900 6789, email info@sunmovement.vn hoặc trực tiếp tại các cửa hàng."
            }
            
            # Tìm từ khóa trong câu hỏi
            found_answer = None
            for keyword, answer in faqs.items():
                if keyword.lower() in query.lower():
                    found_answer = answer
                    break
            
            if found_answer:
                dispatcher.utter_message(text=found_answer)
            else:
                # Nếu không tìm thấy câu trả lời phù hợp, sử dụng phản hồi mặc định
                dispatcher.utter_message(response="utter_default")
                
        except Exception as e:
            logger.error(f"Error in action_get_faq: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi tìm kiếm thông tin. Vui lòng thử lại sau.")
            
        return []

class ActionGetProductInfo(Action):
    def name(self) -> Text:
        return "action_get_product_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            # Thử gọi API backend để lấy sản phẩm thực
            response = requests.get(f"{BASE_URL}/Products", timeout=5)
            
            if response.status_code == 200:
                products = response.json()
                
                if products and len(products) > 0:
                    featured_products = products[:3]  # Lấy 3 sản phẩm đầu tiên
                    
                    message = "🏋️ **Sản phẩm nổi bật của Sun Movement:**\n\n"
                    
                    for i, product in enumerate(featured_products, 1):
                        message += f"{i}. **{product.get('name', 'N/A')}**\n"
                        price = product.get('price', 0)
                        message += f"   💰 Giá: {price:,}đ\n"
                        
                        description = product.get('description', '')
                        if description:
                            short_desc = description[:100] + "..." if len(description) > 100 else description
                            message += f"   📝 {short_desc}\n"
                        message += "\n"
                    
                    message += "Bạn có thể xem thêm sản phẩm khác trên website của chúng tôi!"
                    dispatcher.utter_message(text=message)
                else:
                    dispatcher.utter_message(response="utter_product_info")
            else:
                dispatcher.utter_message(response="utter_product_info")
                
        except Exception as e:
            logger.error(f"Lỗi khi gọi API products: {str(e)}")
            dispatcher.utter_message(response="utter_product_info")
        
        return []

class ActionGetServiceInfo(Action):
    def name(self) -> Text:
        return "action_get_service_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        service_name = tracker.get_slot("service")
        service_type = tracker.get_slot("service_type")
        
        search_term = service_name if service_name else service_type
        
        if not search_term:
            dispatcher.utter_message(text="Bạn muốn tìm hiểu về dịch vụ nào tại Sun Movement?")
            return []
        
        try:
            # Tải dữ liệu dịch vụ từ file mẫu
            service_data = load_dummy_data("services.json")
            
            if service_data and "services" in service_data:
                # Tìm kiếm dịch vụ phù hợp
                services = []
                for service in service_data["services"]:
                    if search_term.lower() in service["name"].lower() or (
                        "type" in service and search_term.lower() in service["type"].lower()
                    ) or (
                        "description" in service and search_term.lower() in service["description"].lower()
                    ):
                        services.append(service)
                
                if services:
                    message = f"🧘‍♂️ **Dịch vụ tại Sun Movement phù hợp với '{search_term}'**\n\n"
                    
                    # Hiển thị chi tiết các dịch vụ
                    for i, service in enumerate(services[:3], 1):
                        service_name = service.get("name", "")
                        slug = service.get("slug", service_name.lower().replace(" ", "-"))
                        service_url = f"https://www.sunmovement.vn/services/{slug}"
                        
                        message += f"{i}. **{service_name}**\n"
                        
                        if "description" in service:
                            message += f"   {service['description']}\n"
                        
                        price = service["price"] if isinstance(service["price"], str) else f"{service['price']:,}"
                        message += f"   💰 Giá: {price}đ"
                        
                        if "duration" in service and "durationUnit" in service:
                            message += f" / {service['duration']} {service['durationUnit']}\n"
                        else:
                            message += "\n"
                        
                        # Thêm link đến trang dịch vụ
                        message += f"   [👉 Đặt lịch và xem thêm]({service_url})\n\n"
                    
                    # Thêm CTA để tăng tỷ lệ chuyển đổi
                    message += "\n**Lợi ích khi sử dụng dịch vụ tại Sun Movement:**\n"
                    message += "• Huấn luyện viên chuyên nghiệp, được chứng nhận\n"
                    message += "• Thiết bị hiện đại, không gian thoáng mát\n"
                    message += "• Lịch trình linh hoạt, phù hợp với nhu cầu cá nhân\n"
                    message += "• Giá cả hợp lý với nhiều gói ưu đãi\n\n"
                    
                    message += "📱 **Đặt lịch ngay:** Gọi 1900.xxxx hoặc đặt lịch trực tuyến tại website của chúng tôi để nhận ưu đãi đặc biệt dành cho hội viên mới!"
                    
                    dispatcher.utter_message(text=message)
                else:
                    # Gợi ý các dịch vụ phổ biến nếu không tìm thấy
                    popular_services = ", ".join([s["name"] for s in service_data["services"][:3]])
                    dispatcher.utter_message(text=f"Rất tiếc, chúng tôi không tìm thấy dịch vụ nào phù hợp với '{search_term}'. Bạn có thể tham khảo một số dịch vụ phổ biến như: {popular_services}. Hoặc liên hệ trực tiếp để được tư vấn chi tiết.")
            else:
                dispatcher.utter_message(text="Rất tiếc, hiện tại thông tin về dịch vụ chưa có sẵn. Bạn có thể liên hệ trực tiếp với chúng tôi để được tư vấn chi tiết.")
        except Exception as e:
            logger.error(f"Error in action_get_service_info: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi tìm kiếm thông tin dịch vụ. Vui lòng thử lại sau.")
        
        return []

class ActionGetPriceInfo(Action):
    def name(self) -> Text:
        return "action_get_price_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Trả về thông tin giá cố định hoặc có thể lấy từ database
        dispatcher.utter_message(response="utter_price_info")
        return []

class ActionGetServiceInfo(Action):
    def name(self) -> Text:
        return "action_get_service_info"

    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy tên dịch vụ từ entity được trích xuất hoặc slot
        service_name = next(tracker.get_latest_entity_values("service"), None)
        
        if not service_name:
            service_name = tracker.get_slot("service")
            
        if not service_name:
            dispatcher.utter_message(text="Bạn muốn biết thông tin về dịch vụ nào?")
            return []
            
        try:
            # Thử tải dữ liệu mẫu trước
            dummy_data = load_dummy_data("services.json")
            
            if dummy_data and "services" in dummy_data:
                # Tìm kiếm trong dữ liệu mẫu
                found_service = None
                for service in dummy_data["services"]:
                    if service_name.lower() in service["name"].lower() or service["type"].lower() in service_name.lower():
                        found_service = service
                        break
                
                if found_service:
                    # Tạo tin nhắn phản hồi
                    message = (f"Thông tin dịch vụ {found_service['name']}:\n\n"
                              f"- Mô tả: {found_service['description']}\n"
                              f"- Giá: {found_service['price']:,}đ/buổi\n"
                              f"- Loại: {found_service['type']}\n")
                    
                    # Thêm thông tin về tính năng
                    if found_service.get('features'):
                        try:
                            features = json.loads(found_service['features'])
                            message += "- Tính năng:\n"
                            for feature in features:
                                message += f"  • {feature}\n"
                        except:
                            pass
                    
                    dispatcher.utter_message(text=message)
                    return [SlotSet("service", service_name)]
            
            # Nếu không có dữ liệu mẫu hoặc không tìm thấy dịch vụ
            # Mô phỏng dữ liệu dịch vụ
            services = {
                "yoga": {
                    "name": "Lớp Yoga",
                    "description": "Lớp học Yoga chuyên sâu với các huấn luyện viên có chứng chỉ quốc tế.",
                    "price": 300000,
                    "type": "Yoga",
                    "features": ["Giảm căng thẳng", "Tăng độ dẻo dai", "Cải thiện thể chất và tinh thần"]
                },
                "calisthenics": {
                    "name": "Lớp Calisthenics",
                    "description": "Phương pháp luyện tập sử dụng trọng lượng cơ thể giúp phát triển sức mạnh và sự linh hoạt.",
                    "price": 350000,
                    "type": "Calisthenics",
                    "features": ["Tăng sức mạnh cơ bắp", "Cải thiện sự cân bằng", "Phát triển cơ đều đặn"]
                },
                "pt": {
                    "name": "Huấn luyện viên cá nhân",
                    "description": "Chương trình tập luyện được thiết kế riêng với sự hướng dẫn của huấn luyện viên cá nhân.",
                    "price": 500000,
                    "type": "Strength",
                    "features": ["Chương trình tập cá nhân hóa", "Theo dõi tiến độ chặt chẽ", "Đạt mục tiêu nhanh hơn"]
                }
            }
            
            # Tìm dịch vụ phù hợp
            found_service = None
            for key, service in services.items():
                if key in service_name.lower() or service_name.lower() in key:
                    found_service = service
                    break
            
            if found_service:
                # Tạo tin nhắn phản hồi
                message = (f"Thông tin dịch vụ {found_service['name']}:\n\n"
                          f"- Mô tả: {found_service['description']}\n"
                          f"- Giá: {found_service['price']:,}đ/buổi\n"
                          f"- Loại: {found_service['type']}\n")
                
                # Thêm thông tin về tính năng
                if found_service.get('features'):
                    message += "- Tính năng:\n"
                    for feature in found_service['features']:
                        message += f"  • {feature}\n"
                
                dispatcher.utter_message(text=message)
                
                # Lưu thông tin dịch vụ vào slot
                return [SlotSet("service", service_name)]
            else:
                dispatcher.utter_message(text=f"Tôi không tìm thấy thông tin về dịch vụ '{service_name}'. Bạn có thể cho biết thêm chi tiết hoặc tìm kiếm dịch vụ khác không?")
                
        except Exception as e:
            logger.error(f"Error in action_get_service_info: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi tìm kiếm thông tin dịch vụ. Vui lòng thử lại sau.")
            
        return []

class ActionCheckProductAvailability(Action):
    def name(self) -> Text:
        return "action_check_product_availability"

    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Lấy tên sản phẩm từ entity được trích xuất hoặc slot
        product_name = next(tracker.get_latest_entity_values("product"), None)
        
        if not product_name:
            product_name = tracker.get_slot("product")
            
        if not product_name:
            dispatcher.utter_message(text="Bạn muốn kiểm tra tình trạng sản phẩm nào?")
            return []
            
        try:
            # Thử tải dữ liệu mẫu trước
            dummy_data = load_dummy_data("products.json")
            
            if dummy_data and "products" in dummy_data:
                # Tìm kiếm trong dữ liệu mẫu
                found_product = None
                for product in dummy_data["products"]:
                    if product_name.lower() in product["name"].lower():
                        found_product = product
                        break
                
                if found_product:
                    # Kiểm tra tình trạng tồn kho
                    if "stockQuantity" in found_product:
                        if found_product["stockQuantity"] > 0:
                            dispatcher.utter_message(text=f"Sản phẩm {found_product['name']} hiện đang còn {found_product['stockQuantity']} sản phẩm trong kho.")
                        else:
                            dispatcher.utter_message(text=f"Rất tiếc, sản phẩm {found_product['name']} hiện đang hết hàng. Bạn có thể đặt trước hoặc xem các sản phẩm tương tự.")
                        
                        return [SlotSet("product", product_name)]
            
            # Nếu không có dữ liệu mẫu hoặc không tìm thấy sản phẩm
            # Mô phỏng dữ liệu sản phẩm
            products = {
                "áo": {
                    "name": "Áo thể thao Sun Movement",
                    "stockQuantity": 15
                },
                "quần": {
                    "name": "Quần thể thao Sun Movement",
                    "stockQuantity": 8
                },
                "giày": {
                    "name": "Giày tập gym Sun Movement",
                    "stockQuantity": 0
                },
                "protein": {
                    "name": "Bột Protein Sun Movement",
                    "stockQuantity": 20
                }
            }
            
            # Tìm sản phẩm phù hợp
            found_product = None
            for key, product in products.items():
                if key in product_name.lower():
                    found_product = product
                    break
            
            if found_product:
                # Kiểm tra tình trạng tồn kho
                if found_product.get('stockQuantity') is not None:
                    if found_product['stockQuantity'] > 0:
                        dispatcher.utter_message(text=f"Sản phẩm {found_product['name']} hiện đang còn {found_product['stockQuantity']} sản phẩm trong kho.")
                    else:
                        dispatcher.utter_message(text=f"Rất tiếc, sản phẩm {found_product['name']} hiện đang hết hàng. Bạn có thể đặt trước hoặc xem các sản phẩm tương tự.")
                else:
                    dispatcher.utter_message(text=f"Tôi không có thông tin về tình trạng tồn kho của sản phẩm {found_product['name']}. Vui lòng liên hệ với cửa hàng để biết thêm chi tiết.")
                
                # Lưu thông tin sản phẩm vào slot
                return [SlotSet("product", product_name)]
            else:
                dispatcher.utter_message(text=f"Tôi không tìm thấy thông tin về sản phẩm '{product_name}'. Bạn có thể cho biết thêm chi tiết không?")
                
        except Exception as e:
            logger.error(f"Error in action_check_product_availability: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi kiểm tra tình trạng sản phẩm. Vui lòng thử lại sau.")
            
        return []

class ActionRejectEnglish(Action):
    def name(self) -> Text:
        return "action_reject_english"

    def run(self, 
            dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(text="Xin lỗi, tôi chỉ có thể trả lời các câu hỏi bằng tiếng Việt. Vui lòng sử dụng tiếng Việt để giao tiếp với tôi.")
        return []

class ActionGetNutritionInfo(Action):
    def name(self) -> Text:
        return "action_get_nutrition_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        goal = tracker.get_slot("nutrition_goal")
        
        if not goal:
            dispatcher.utter_message(text="Bạn muốn tìm kế hoạch dinh dưỡng cho mục tiêu gì? (Ví dụ: tăng cơ, giảm cân, sức khỏe tổng quát...)")
            return []
        
        try:
            # Tải dữ liệu dinh dưỡng từ file mẫu
            nutrition_data = load_dummy_data("nutrition.json")
            
            if nutrition_data and "nutrition_plans" in nutrition_data:
                # Tìm kiếm kế hoạch dinh dưỡng phù hợp
                plans = []
                for plan in nutrition_data["nutrition_plans"]:
                    plan_goal = plan.get("goal", "").lower() if "goal" in plan else ""
                    plan_name = plan.get("name", "").lower()
                    plan_desc = plan.get("description", "").lower()
                    
                    if (goal.lower() in plan_goal or 
                        goal.lower() in plan_name or 
                        goal.lower() in plan_desc):
                        plans.append(plan)
                
                if plans:
                    # Chọn kế hoạch phù hợp nhất
                    plan = plans[0]
                    
                    message = f"📋 **Kế hoạch dinh dưỡng cho {goal}**\n\n"
                    message += f"**{plan['name']}**\n"
                    message += f"{plan['description']}\n\n"
                    
                    # Thông tin về macro
                    if "macroRatio" in plan:
                        message += f"**Tỷ lệ dinh dưỡng**: {plan['macroRatio']['protein']}% protein, {plan['macroRatio']['carbs']}% carbs, {plan['macroRatio']['fat']}% fat\n"
                    
                    if "dailyCalories" in plan:
                        message += f"**Lượng calo mỗi ngày**: {plan['dailyCalories']} kcal\n\n"
                    
                    # Thông tin về bữa ăn
                    if "mealPlan" in plan:
                        message += "**Lịch ăn trong ngày**:\n"
                        for meal in plan["mealPlan"]:
                            message += f"- {meal['mealName']}:\n"
                            for food in meal["foods"]:
                                message += f"  • {food}\n"
                            message += "\n"
                    
                    message += "\n🔍 *Lưu ý: Kế hoạch dinh dưỡng này chỉ mang tính tham khảo. Để có chế độ ăn phù hợp với cơ thể, bạn nên tham khảo ý kiến từ chuyên gia dinh dưỡng.*"
                    
                    # Thêm link SEO
                    message += "\n\nXem thêm các bài viết về [dinh dưỡng thể thao](https://www.sunmovement.vn/blogs/nutrition) và [thực phẩm bổ sung](https://www.sunmovement.vn/collections/supplements) tại website chính thức của chúng tôi."
                    
                    dispatcher.utter_message(text=message)
                else:
                    dispatcher.utter_message(text=f"Hiện tại chúng tôi chưa có kế hoạch dinh dưỡng cụ thể cho mục tiêu '{goal}'. Bạn có thể tham khảo các bài viết về dinh dưỡng tại website của chúng tôi hoặc đặt lịch tư vấn với chuyên gia dinh dưỡng.")
            else:
                dispatcher.utter_message(text="Rất tiếc, hiện tại thông tin về kế hoạch dinh dưỡng chưa có sẵn. Bạn có thể liên hệ trực tiếp với chúng tôi để được tư vấn chi tiết.")
        except Exception as e:
            logger.error(f"Error in action_get_nutrition_info: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi tìm kiếm thông tin dinh dưỡng. Vui lòng thử lại sau.")
        
        return []

class ActionGetWorkoutPlan(Action):
    def name(self) -> Text:
        return "action_get_workout_plan"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        goal = tracker.get_slot("workout_goal")
        level = tracker.get_slot("experience_level")
        
        if not goal:
            dispatcher.utter_message(text="Bạn muốn tìm kế hoạch tập luyện cho mục tiêu gì? (Ví dụ: tăng cơ, giảm cân, sức bền...)")
            return []
        
        try:
            # Tải dữ liệu tập luyện từ file mẫu
            workout_data = load_dummy_data("workout.json")
            
            if workout_data and "workout_plans" in workout_data:
                # Tìm kiếm kế hoạch tập luyện phù hợp
                plans = []
                for plan in workout_data["workout_plans"]:
                    plan_goal = plan.get("goal", "").lower() if "goal" in plan else ""
                    plan_level = plan.get("level", "").lower() if "level" in plan else ""
                    plan_name = plan.get("name", "").lower()
                    plan_desc = plan.get("description", "").lower()
                    
                    goal_match = goal.lower() in plan_goal or goal.lower() in plan_name or goal.lower() in plan_desc
                    level_match = True if not level else (level.lower() in plan_level)
                    
                    if goal_match and level_match:
                        plans.append(plan)
                
                if plans:
                    # Chọn kế hoạch phù hợp nhất
                    plan = plans[0]
                    
                    message = f"💪 **Kế hoạch tập luyện cho {goal}**\n\n"
                    message += f"**{plan['name']}**\n"
                    message += f"{plan['description']}\n\n"
                    
                    if "level" in plan:
                        message += f"**Cấp độ**: {plan['level']}\n"
                    
                    if "duration" in plan:
                        message += f"**Thời gian**: {plan['duration']}\n\n"
                    
                    # Lịch tập hàng tuần
                    if "schedule" in plan:
                        message += "**Lịch tập hàng tuần**:\n"
                        for day in plan["schedule"][:3]:  # Giới hạn 3 ngày để không quá dài
                            message += f"- {day['day']} ({day['bodyParts']}):\n"
                            for ex in day["exercises"][:3]:  # Giới hạn 3 bài tập mỗi ngày
                                message += f"  • {ex['name']}: {ex['sets']} set x {ex['reps']} reps (nghỉ {ex['rest']})\n"
                            
                            if len(day["exercises"]) > 3:
                                message += f"  • ... và {len(day['exercises']) - 3} bài tập khác\n"
                            message += "\n"
                        
                        if len(plan["schedule"]) > 3:
                            message += f"- ... và lịch tập cho {len(plan['schedule']) - 3} ngày khác\n\n"
                    
                    message += "\n🔍 *Lưu ý: Kế hoạch tập luyện này chỉ mang tính tham khảo. Để có chương trình phù hợp với cơ thể, bạn nên tham khảo ý kiến từ huấn luyện viên cá nhân.*"
                    
                    # Thêm link SEO
                    message += "\n\nXem thêm các [thiết bị tập luyện](https://www.sunmovement.vn/collections/equipment) và [dịch vụ huấn luyện cá nhân](https://www.sunmovement.vn/pages/personal-training) tại website chính thức của chúng tôi."
                    
                    dispatcher.utter_message(text=message)
                else:
                    dispatcher.utter_message(text=f"Hiện tại chúng tôi chưa có kế hoạch tập luyện cụ thể cho mục tiêu '{goal}'{' với cấp độ ' + level if level else ''}. Bạn có thể đặt lịch tư vấn với huấn luyện viên để có chương trình phù hợp.")
            else:
                dispatcher.utter_message(text="Rất tiếc, hiện tại thông tin về kế hoạch tập luyện chưa có sẵn. Bạn có thể liên hệ trực tiếp với chúng tôi để được tư vấn chi tiết.")
        except Exception as e:
            logger.error(f"Error in action_get_workout_plan: {str(e)}")
            dispatcher.utter_message(text="Đã xảy ra lỗi khi tìm kiếm thông tin tập luyện. Vui lòng thử lại sau.")
        
        return []
