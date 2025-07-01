#!/usr/bin/env python3
"""
Script debug đơn giản để kiểm tra logic xử lý chatbot
"""

import requests
import json
import time

# URL
FRONTEND_API_URL = "http://localhost:3000/api/chatbot"
RASA_WEBHOOK_URL = "http://localhost:5005/webhooks/rest/webhook"

# Test messages
test_messages = [
    "xin chào",
    "sản phẩm", 
    "dịch vụ",
    "giá",
    "liên hệ",
    "tôi muốn hỏi về sản phẩm",
    "có sản phẩm gì",
    "shop bán gì"
]

def test_frontend_direct():
    """Test trực tiếp với API frontend"""
    print("=== KIỂM TRA TRỰC TIẾP VỚI API FRONTEND ===")
    
    for message in test_messages:
        print(f"\nTin nhắn: '{message}'")
        try:
            response = requests.post(
                FRONTEND_API_URL,
                json={"sender": "debug_test", "message": message},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result and len(result) > 0 and "text" in result[0]:
                    text = result[0]["text"]
                    print(f"Phản hồi: {text[:100]}...")
                    
                    # Kiểm tra xem có phải về thanh toán không
                    if "phương thức thanh toán" in text.lower():
                        print("❌ LỖI: Trả về thông tin thanh toán!")
                    else:
                        print("✅ OK: Không phải thông tin thanh toán")
                else:
                    print("❓ Không có phản hồi text")
            else:
                print(f"❌ Lỗi HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Lỗi: {e}")
        
        time.sleep(0.5)

def test_rasa_direct():
    """Test trực tiếp với Rasa"""
    print("\n=== KIỂM TRA TRỰC TIẾP VỚI RASA ===")
    
    for message in test_messages:
        print(f"\nTin nhắn: '{message}'")
        try:
            response = requests.post(
                RASA_WEBHOOK_URL,
                json={"sender": "debug_test", "message": message},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result and len(result) > 0 and "text" in result[0]:
                    text = result[0]["text"]
                    print(f"Phản hồi: {text[:100]}...")
                else:
                    print("❓ Không có phản hồi text từ Rasa")
            else:
                print(f"❌ Lỗi HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Lỗi: {e}")
        
        time.sleep(0.5)

if __name__ == "__main__":
    print("SCRIPT DEBUG CHATBOT")
    print("=" * 50)
    
    test_rasa_direct()
    test_frontend_direct()
    
    print("\n" + "=" * 50)
    print("Kiểm tra hoàn tất!")
