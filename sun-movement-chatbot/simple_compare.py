#!/usr/bin/env python3
"""
Script đơn giản để so sánh kết quả giữa Rasa server và API proxy của frontend
Không phụ thuộc vào thư viện ngoài
"""

import requests
import json
import time

# URL của Rasa server và API proxy
RASA_WEBHOOK_URL = "http://localhost:5005/webhooks/rest/webhook"
FRONTEND_PROXY_URL = "http://localhost:3000/api/chatbot"

# Danh sách các câu hỏi để kiểm tra
TEST_MESSAGES = [
    "xin chào",
    "sản phẩm",
    "giá",
    "dịch vụ",
    "liên hệ",
    "thành viên",
    "phương thức thanh toán",
    "địa chỉ cửa hàng",
    "lịch hoạt động"
]

def get_rasa_response(message):
    """Lấy phản hồi trực tiếp từ Rasa webhook"""
    try:
        response = requests.post(
            RASA_WEBHOOK_URL,
            json={"sender": "simple_tester", "message": message},
            timeout=5
        )
        
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Lỗi khi gọi Rasa webhook: {str(e)}")
        return None

def get_proxy_response(message):
    """Lấy phản hồi từ API proxy của frontend"""
    try:
        response = requests.post(
            FRONTEND_PROXY_URL,
            json={"sender": "simple_tester", "message": message},
            timeout=5
        )
        
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Lỗi khi gọi API proxy: {str(e)}")
        return None

def extract_text_content(response):
    """Trích xuất nội dung văn bản từ phản hồi"""
    if not response:
        return "Không có phản hồi"
    
    text_content = []
    for item in response:
        if "text" in item:
            text_content.append(item["text"])
    
    return "\n".join(text_content) if text_content else "Không có nội dung văn bản"

def compare_responses():
    """So sánh phản hồi từ Rasa và từ API proxy"""
    print("\n" + "="*80)
    print("SO SÁNH PHẢN HỒI TỪ RASA VÀ TỪ API PROXY")
    print("="*80 + "\n")
    
    # Mở file để ghi kết quả
    results_file = open("simple_comparison_results.txt", "w", encoding="utf-8")
    results_file.write("KẾT QUẢ SO SÁNH PHẢN HỒI\n")
    results_file.write("=" * 50 + "\n\n")
    
    # Đếm số lượng trả lời giống nhau và khác nhau
    same_count = 0
    diff_count = 0
    payment_method_count = 0
    
    for message in TEST_MESSAGES:
        print(f"\nĐang kiểm tra tin nhắn: '{message}'")
        results_file.write(f"\nKiểm tra tin nhắn: '{message}'\n")
        results_file.write("-" * 40 + "\n")
        
        # Lấy phản hồi từ cả hai nguồn
        rasa_response = get_rasa_response(message)
        proxy_response = get_proxy_response(message)
        
        # Trích xuất nội dung văn bản
        rasa_text = extract_text_content(rasa_response)
        proxy_text = extract_text_content(proxy_response)
        
        # Hiển thị kết quả
        print(f"Phản hồi từ Rasa:")
        print(f"{rasa_text[:100]}..." if len(rasa_text) > 100 else rasa_text)
        print("\nPhản hồi từ API proxy:")
        print(f"{proxy_text[:100]}..." if len(proxy_text) > 100 else proxy_text)
        
        # Kiểm tra nếu phản hồi proxy là về phương thức thanh toán
        is_payment_method = "phương thức thanh toán" in proxy_text.lower() or "thanh toán" in proxy_text.lower()
        if is_payment_method:
            payment_method_count += 1
            print("\nKết quả: Phản hồi proxy là về PHƯƠNG THỨC THANH TOÁN")
        
        # Xác định xem phản hồi có giống nhau không
        is_same = rasa_text == proxy_text
        if is_same:
            same_count += 1
            print("\nKết quả: Phản hồi GIỐNG NHAU")
        else:
            diff_count += 1
            print("\nKết quả: Phản hồi KHÁC NHAU")
        
        # Ghi chi tiết vào file
        results_file.write(f"Phản hồi từ Rasa:\n{rasa_text}\n\n")
        results_file.write(f"Phản hồi từ API proxy:\n{proxy_text}\n\n")
        results_file.write(f"Kết quả: {'Giống nhau' if is_same else 'Khác nhau'}\n")
        if is_payment_method:
            results_file.write("Phát hiện nội dung về phương thức thanh toán\n")
        results_file.write("\n")
        
        # Delay để tránh quá tải
        time.sleep(0.5)
    
    # Hiển thị tổng kết
    print("\n" + "="*80)
    print(f"TỔNG KẾT: Kiểm tra {len(TEST_MESSAGES)} tin nhắn")
    print(f"- Phản hồi giống nhau: {same_count}/{len(TEST_MESSAGES)}")
    print(f"- Phản hồi khác nhau: {diff_count}/{len(TEST_MESSAGES)}")
    print(f"- Số phản hồi là về phương thức thanh toán: {payment_method_count}/{len(TEST_MESSAGES)}")
    print("="*80)
    
    # Ghi tổng kết vào file
    results_file.write("\nTỔNG KẾT:\n")
    results_file.write(f"- Tổng số tin nhắn kiểm tra: {len(TEST_MESSAGES)}\n")
    results_file.write(f"- Phản hồi giống nhau: {same_count}/{len(TEST_MESSAGES)}\n")
    results_file.write(f"- Phản hồi khác nhau: {diff_count}/{len(TEST_MESSAGES)}\n")
    results_file.write(f"- Số phản hồi là về phương thức thanh toán: {payment_method_count}/{len(TEST_MESSAGES)}\n")
    
    # Kết luận về vấn đề
    if payment_method_count > len(TEST_MESSAGES) // 2:
        conclusion = """
KẾT LUẬN: Có vấn đề với API proxy trong frontend!
API proxy đang ghi đè lên kết quả từ Rasa server và trả về thông tin thanh toán cho nhiều câu hỏi khác nhau.
Nguyên nhân có thể là:
1. Lỗi trong hàm getSmartResponse trong file route.ts
2. Logic xử lý fallback không chính xác
3. Điều kiện kiểm tra intent không đúng

Kiểm tra file route.ts và các chức năng xử lý phản hồi.
"""
        print(conclusion)
        results_file.write(conclusion)
    
    # Đóng file kết quả
    results_file.close()
    
    print(f"\nKết quả chi tiết đã được lưu vào file 'simple_comparison_results.txt'")

if __name__ == "__main__":
    compare_responses()
