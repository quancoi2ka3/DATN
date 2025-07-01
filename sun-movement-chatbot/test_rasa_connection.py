#!/usr/bin/env python3
"""
Script để kiểm tra kết nối giữa frontend và Rasa server
"""

import requests
import json
import sys
import time

RASA_SERVER_URL = "http://localhost:5005"
RASA_WEBHOOK_URL = f"{RASA_SERVER_URL}/webhooks/rest/webhook"
TEST_MESSAGES = [
    "xin chào",
    "giá",
    "sản phẩm", 
    "dịch vụ",
    "địa chỉ",
    "liên hệ"
]

def test_connection():
    """Kiểm tra kết nối tới Rasa server"""
    try:
        response = requests.get(f"{RASA_SERVER_URL}/status")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Kết nối thành công đến Rasa server!")
            print(f"- Model ID: {data.get('model_id')}")
            print(f"- Model file: {data.get('model_file')}")
            return True
        else:
            print(f"❌ Kết nối thất bại - Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Lỗi kết nối: {str(e)}")
        return False

def test_messages():
    """Gửi tin nhắn test tới Rasa server và hiển thị phản hồi"""
    print("\n🔍 Kiểm tra các tin nhắn mẫu:")
    
    for message in TEST_MESSAGES:
        try:
            print(f"\n📝 Gửi: \"{message}\"")
            
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
                    print(f"✅ Nhận được phản hồi:")
                    for idx, resp in enumerate(responses):
                        print(f"  {idx+1}. {resp.get('text', 'Không có nội dung')}")
                else:
                    print(f"⚠️ Không nhận được phản hồi (mảng rỗng)")
            else:
                print(f"❌ Lỗi - Status code: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Lỗi khi gửi tin nhắn: {str(e)}")
        
        time.sleep(1)  # Đợi 1 giây giữa các tin nhắn

if __name__ == "__main__":
    print("==================================")
    print("KIỂM TRA KẾT NỐI CHATBOT RASA")
    print("==================================")
    
    if test_connection():
        test_messages()
    
    print("\n==================================")
    print("HOÀN TẤT KIỂM TRA")
    print("==================================")
