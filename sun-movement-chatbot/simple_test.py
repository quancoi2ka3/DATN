#!/usr/bin/env python3
"""
Script đơn giản để test các câu hỏi ngắn với Rasa và lưu kết quả ra file
"""

import requests
import json
import time

RASA_WEBHOOK_URL = "http://localhost:5005/webhooks/rest/webhook"
FRONTEND_PROXY_URL = "http://localhost:3000/api/chatbot"

# Danh sách các tin nhắn ngắn để test
TEST_MESSAGES = [
    "sản phẩm",
    "dịch vụ",
    "giá",
    "địa chỉ",
    "liên hệ"
]

# Mở file để ghi kết quả
result_file = open("chatbot_test_results.txt", "w", encoding="utf-8")

def write_to_file(text):
    """Ghi văn bản vào file và đồng thời in ra màn hình"""
    print(text)
    result_file.write(text + "\n")

def test_via_rasa_direct():
    """Test trực tiếp qua Rasa webhook"""
    write_to_file("\n=== TEST QUA RASA TRỰC TIẾP ===")
    
    for message in TEST_MESSAGES:
        write_to_file(f"\n>>> Gửi: '{message}'")
        
        try:
            payload = {
                "sender": "test_user",
                "message": message
            }
            
            response = requests.post(
                RASA_WEBHOOK_URL,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                responses = response.json()
                
                if responses:
                    write_to_file("Phản hồi Rasa:")
                    for idx, resp in enumerate(responses):
                        write_to_file(f"  {resp.get('text', 'Không có nội dung')}")
                else:
                    write_to_file("Không nhận được phản hồi (mảng rỗng)")
            else:
                write_to_file(f"Lỗi - Status code: {response.status_code}")
                
        except Exception as e:
            write_to_file(f"Lỗi: {str(e)}")
        
        time.sleep(1)

def test_via_frontend_proxy():
    """Test thông qua API proxy frontend"""
    write_to_file("\n=== TEST QUA API PROXY FRONTEND ===")
    
    for message in TEST_MESSAGES:
        write_to_file(f"\n>>> Gửi: '{message}'")
        
        try:
            payload = {
                "sender": "test_user",
                "message": message
            }
            
            response = requests.post(
                FRONTEND_PROXY_URL,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                responses = response.json()
                
                if responses:
                    write_to_file("Phản hồi từ API proxy:")
                    for idx, resp in enumerate(responses):
                        write_to_file(f"  {resp.get('text', 'Không có nội dung')}")
                else:
                    write_to_file("Không nhận được phản hồi (mảng rỗng)")
            else:
                write_to_file(f"Lỗi - Status code: {response.status_code}")
                
        except Exception as e:
            write_to_file(f"Lỗi: {str(e)}")
        
        time.sleep(1)

if __name__ == "__main__":
    write_to_file("=== TEST RASA CHATBOT VỚI CÂU HỎI NGẮN ===")
    
    # Test cả hai phương thức
    test_via_rasa_direct()
    test_via_frontend_proxy()
    
    write_to_file("\n=== HOÀN THÀNH ===")
    
    # Đóng file kết quả
    result_file.close()
    print(f"Kết quả đã được lưu vào file chatbot_test_results.txt")
