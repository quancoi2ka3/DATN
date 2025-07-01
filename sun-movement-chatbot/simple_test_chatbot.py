#!/usr/bin/env python3
"""
Script kiểm tra đơn giản để test chatbot với các câu hỏi ngắn gọn
"""

import requests
import json
import time
import os

# Cấu hình URL
RASA_WEBHOOK_URL = "http://localhost:5005/webhooks/rest/webhook"
FRONTEND_PROXY_URL = "http://localhost:3000/api/chatbot"

# Danh sách các tin nhắn ngắn gọn để test
TEST_MESSAGES = [
    "sản phẩm",
    "giá",
    "dịch vụ",
    "địa chỉ",
    "liên hệ",
    "lịch",
    "thành viên",
    "sp"  # Từ khóa rút gọn
]

def test_chatbot_responses():
    """Test chatbot với các câu hỏi ngắn gọn"""
    print("=" * 50)
    print("TEST CHATBOT VỚI CÁC CÂU HỎI NGẮN GỌN")
    print("=" * 50)
    print("\n1. Test thông qua API proxy của frontend\n")
    
    results_file = open("simple_test_results.txt", "w", encoding="utf-8")
    results_file.write("KẾT QUẢ TEST CHATBOT\n")
    results_file.write("=" * 50 + "\n\n")
    
    for message in TEST_MESSAGES:
        try:
            print(f"\nTesting message: '{message}'")
            results_file.write(f"\nTesting message: '{message}'\n")
            
            # Test qua API proxy
            response = requests.post(
                FRONTEND_PROXY_URL,
                json={"sender": "test_user", "message": message},
                timeout=10
            )
            
            if response.status_code == 200:
                responses = response.json()
                
                if responses:
                    print(f"✓ Nhận được phản hồi từ proxy:")
                    results_file.write(f"✓ Nhận được phản hồi từ proxy:\n")
                    
                    for idx, resp in enumerate(responses):
                        resp_text = resp.get('text', 'Không có nội dung')
                        print(f"  {idx+1}. {resp_text[:50]}...")
                        results_file.write(f"  {idx+1}. {resp_text}\n")
                else:
                    print("✗ Không có phản hồi (mảng rỗng)")
                    results_file.write("✗ Không có phản hồi (mảng rỗng)\n")
            else:
                print(f"✗ Lỗi - Status code: {response.status_code}")
                results_file.write(f"✗ Lỗi - Status code: {response.status_code}\n")
                
        except Exception as e:
            error_message = f"✗ Lỗi khi gửi tin nhắn: {str(e)}"
            print(error_message)
            results_file.write(error_message + "\n")
        
        time.sleep(0.5)  # Delay giữa các request
    
    results_file.close()
    print("\n" + "=" * 50)
    print(f"Kết quả chi tiết đã được lưu vào file 'simple_test_results.txt'")
    print("=" * 50)

if __name__ == "__main__":
    test_chatbot_responses()
