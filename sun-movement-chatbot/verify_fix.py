"""
Kiểm tra nhanh xem việc sửa đổi logic route.ts đã khắc phục vấn đề chatbot chưa
Phần này sẽ test một số câu hỏi cụ thể và phân tích phản hồi
"""

import requests
import time
import os
import json
from datetime import datetime
from colorama import init, Fore, Style

# Khởi tạo colorama
init()

# URL API
CHATBOT_API = "http://localhost:3000/api/chatbot"  # API proxy (route.ts)
RASA_API = "http://localhost:5005/webhooks/rest/webhook"  # API Rasa trực tiếp

def print_colored(text, color=Fore.WHITE):
    """In văn bản có màu"""
    print(f"{color}{text}{Style.RESET_ALL}")

def test_response(message, sender="test_user"):
    """Test phản hồi của cả API proxy và Rasa trực tiếp"""
    print_colored(f"\n== Kiểm tra câu hỏi: '{message}' ==", Fore.CYAN)
    
    # Gọi API proxy (route.ts)
    try:
        proxy_response = requests.post(
            CHATBOT_API,
            json={"message": message, "sender": sender},
            timeout=10
        ).json()
        
        proxy_text = proxy_response[0]["text"] if proxy_response and len(proxy_response) > 0 and "text" in proxy_response[0] else "Không có phản hồi"
        print_colored(f"API proxy trả lời: {proxy_text[:100]}...", Fore.GREEN)
    except Exception as e:
        print_colored(f"Lỗi khi gọi API proxy: {str(e)}", Fore.RED)
        proxy_text = "ERROR"
    
    # Gọi Rasa API trực tiếp
    try:
        rasa_response = requests.post(
            RASA_API,
            json={"message": message, "sender": sender},
            timeout=10
        ).json()
        
        rasa_text = rasa_response[0]["text"] if rasa_response and len(rasa_response) > 0 and "text" in rasa_response[0] else "Không có phản hồi"
        print_colored(f"Rasa trực tiếp: {rasa_text[:100]}...", Fore.YELLOW)
    except Exception as e:
        print_colored(f"Lỗi khi gọi Rasa API: {str(e)}", Fore.RED)
        rasa_text = "ERROR"
    
    # So sánh phản hồi
    if "thanh toán" in proxy_text.lower() and "phương thức thanh toán" in proxy_text.lower():
        if "thanh toán" in message.lower() or "payment" in message.lower():
            print_colored("✓ OK: Phản hồi về thanh toán cho câu hỏi về thanh toán", Fore.GREEN)
        else:
            print_colored("✗ FAIL: Phản hồi về thanh toán cho câu hỏi không liên quan đến thanh toán", Fore.RED)
            return False
    
    return True

def main():
    print_colored("===== KIỂM TRA SỬA LỖI CHATBOT =====", Fore.CYAN)
    print_colored("Kiểm tra xem việc sửa đổi logic route.ts đã khắc phục vấn đề chưa...\n", Fore.WHITE)
    
    # Danh sách câu hỏi để test
    test_questions = [
        "xin chào",
        "sản phẩm",
        "dịch vụ",
        "giá cả",
        "liên hệ",
        "lịch tập",
        "thanh toán bằng thẻ",
        "phương thức thanh toán",
        "sun movement có những sản phẩm gì?",
        "tôi muốn tìm hiểu về dịch vụ yoga",
        "các gói tập gym có giá thế nào?",
        "địa chỉ của sun movement ở đâu?",
        "lịch tập trong tuần",
        "tôi có thể thanh toán bằng cách nào?",
        "có khóa học yoga cho người mới bắt đầu không?",
        "tôi muốn đăng ký làm thành viên"
    ]
    
    # Kết quả kiểm tra
    success_count = 0
    fail_count = 0
    
    # Thực hiện kiểm tra
    for question in test_questions:
        if test_response(question):
            success_count += 1
        else:
            fail_count += 1
        time.sleep(1)  # Tránh gửi quá nhiều request
    
    # Kết quả tổng thể
    print_colored("\n===== KẾT QUẢ KIỂM TRA =====", Fore.CYAN)
    print_colored(f"Tổng số câu hỏi kiểm tra: {len(test_questions)}", Fore.WHITE)
    print_colored(f"Đúng: {success_count}", Fore.GREEN)
    print_colored(f"Sai: {fail_count}", Fore.RED)
    
    if fail_count == 0:
        print_colored("\n✓ Việc sửa lỗi đã thành công! Chatbot không còn trả về thông tin thanh toán cho mọi câu hỏi.", Fore.GREEN)
    else:
        print_colored("\n✗ Vẫn còn lỗi! Chatbot vẫn trả về thông tin thanh toán cho một số câu hỏi không liên quan.", Fore.RED)
        print_colored("Hãy kiểm tra lại logic trong route.ts và đảm bảo frontend đã được khởi động lại.", Fore.YELLOW)

if __name__ == "__main__":
    main()
