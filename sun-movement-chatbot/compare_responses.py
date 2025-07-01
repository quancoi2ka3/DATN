#!/usr/bin/env python3
"""
Script để phân tích so sánh phản hồi từ Rasa server và từ API proxy frontend
Giúp xác định vấn đề và điểm khác biệt giữa hai kết quả
"""

import requests
import json
import time
import os
from tabulate import tabulate  # Cài đặt: pip install tabulate

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
            json={"sender": "comparison_tester", "message": message},
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
            json={"sender": "comparison_tester", "message": message},
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
    results_file = open("comparison_results.txt", "w", encoding="utf-8")
    results_file.write("KẾT QUẢ SO SÁNH PHẢN HỒI\n")
    results_file.write("=" * 50 + "\n\n")
    
    # Tạo danh sách để hiển thị bảng so sánh
    comparison_table = []
    
    for message in TEST_MESSAGES:
        print(f"Đang kiểm tra tin nhắn: '{message}'")
        results_file.write(f"\nKiểm tra tin nhắn: '{message}'\n")
        results_file.write("-" * 40 + "\n")
        
        # Lấy phản hồi từ cả hai nguồn
        rasa_response = get_rasa_response(message)
        proxy_response = get_proxy_response(message)
        
        # Trích xuất nội dung văn bản
        rasa_text = extract_text_content(rasa_response)
        proxy_text = extract_text_content(proxy_response)
        
        # Xác định xem phản hồi có giống nhau không
        is_same = rasa_text == proxy_text
        
        # Thêm vào bảng so sánh
        comparison_table.append([
            message,
            rasa_text[:30] + "..." if len(rasa_text) > 30 else rasa_text,
            proxy_text[:30] + "..." if len(proxy_text) > 30 else proxy_text,
            "Giống nhau" if is_same else "Khác nhau"
        ])
        
        # Ghi chi tiết vào file
        results_file.write(f"Phản hồi từ Rasa:\n{rasa_text}\n\n")
        results_file.write(f"Phản hồi từ API proxy:\n{proxy_text}\n\n")
        results_file.write(f"Kết quả: {'Giống nhau' if is_same else 'Khác nhau'}\n\n")
        
        # Delay để tránh quá tải
        time.sleep(0.5)
    
    # Hiển thị bảng so sánh
    print("\n" + tabulate(
        comparison_table,
        headers=["Tin nhắn", "Phản hồi Rasa", "Phản hồi API proxy", "Kết quả"],
        tablefmt="grid"
    ))
    
    # Đóng file kết quả
    results_file.close()
    
    print("\nKết quả chi tiết đã được lưu vào file 'comparison_results.txt'")

if __name__ == "__main__":
    try:
        # Kiểm tra xem có thể import tabulate không
        import tabulate
        compare_responses()
    except ImportError:
        print("\nLỗi: Thư viện 'tabulate' chưa được cài đặt.")
        print("Bạn có thể cài đặt thư viện này bằng lệnh: pip install tabulate")
        print("Hoặc tiếp tục chạy mà không có định dạng bảng? (y/n)")
        choice = input()
        if choice.lower() in ['y', 'yes']:
            print("Tiếp tục chạy mà không có định dạng bảng...")
            compare_responses()
    except Exception as e:
        print(f"\nĐã xảy ra lỗi: {str(e)}")
