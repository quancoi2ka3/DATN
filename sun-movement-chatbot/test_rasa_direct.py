#!/usr/bin/env python3
"""
Script đơn giản để test Rasa server trực tiếp
"""
import requests
import json
import time

# URL của Rasa server
RASA_SERVER = "http://localhost:5005"
RASA_PARSE_URL = f"{RASA_SERVER}/model/parse"
RASA_WEBHOOK_URL = f"{RASA_SERVER}/webhooks/rest/webhook"

# Danh sách câu hỏi test
TEST_MESSAGES = [
    "xin chào",
    "sản phẩm",
    "giá",
    "dịch vụ",
    "thanh toán",
    "địa chỉ"
]

def test_rasa_direct():
    """Test trực tiếp với Rasa server"""
    print("\n" + "="*50)
    print("TEST TRỰC TIẾP VỚI RASA SERVER")
    print("="*50 + "\n")
    
    for message in TEST_MESSAGES:
        print(f"\nTesting message: '{message}'")
        
        # Parse intent
        try:
            parse_response = requests.post(
                RASA_PARSE_URL,
                json={"text": message},
                timeout=5
            )
            
            if parse_response.status_code == 200:
                parse_result = parse_response.json()
                intent = parse_result.get("intent", {})
                print(f"Intent: {intent.get('name', 'unknown')} (confidence: {intent.get('confidence', 0):.4f})")
            else:
                print(f"Error in parse - Status code: {parse_response.status_code}")
        except Exception as e:
            print(f"Error during parse: {str(e)}")
        
        # Test webhook
        try:
            webhook_response = requests.post(
                RASA_WEBHOOK_URL,
                json={"sender": "direct_tester", "message": message},
                timeout=5
            )
            
            if webhook_response.status_code == 200:
                webhook_result = webhook_response.json()
                
                print(f"Webhook response:")
                if webhook_result:
                    for idx, resp in enumerate(webhook_result):
                        print(f"  {idx+1}. {resp.get('text', 'No text')[:100]}")
                else:
                    print("  No response")
            else:
                print(f"Error in webhook - Status code: {webhook_response.status_code}")
        except Exception as e:
            print(f"Error during webhook call: {str(e)}")
        
        # Delay to prevent overload
        time.sleep(1)

if __name__ == "__main__":
    test_rasa_direct()
