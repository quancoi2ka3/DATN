#!/usr/bin/env python3
"""
Script để kiểm tra trực tiếp Rasa server
Kiểm tra cả khả năng phân loại intent và phản hồi webhook
"""

import requests
import json
import time
import os

# URL của Rasa server
RASA_SERVER = "http://localhost:5005"
RASA_PARSE_URL = f"{RASA_SERVER}/model/parse"
RASA_WEBHOOK_URL = f"{RASA_SERVER}/webhooks/rest/webhook"
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

def test_rasa_parse():
    """Kiểm tra khả năng phân loại intent của Rasa"""
    print("\n" + "="*60)
    print("KIỂM TRA PHÂN LOẠI INTENT TRỰC TIẾP VỚI RASA")
    print("="*60)
    
    results_file = open("test_parse_results.txt", "w", encoding="utf-8")
    results_file.write("KẾT QUẢ PHÂN LOẠI INTENT\n")
    results_file.write("=" * 50 + "\n\n")
    
    for message in TEST_MESSAGES:
        try:
            print(f"\nKiểm tra tin nhắn: '{message}'")
            results_file.write(f"\nKiểm tra tin nhắn: '{message}'\n")
            
            # Gửi request tới Rasa server
            response = requests.post(
                RASA_PARSE_URL,
                json={"text": message},
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                intent = result.get("intent", {})
                
                # Hiển thị intent được nhận diện
                print(f"Intent: {intent.get('name', 'N/A')} (độ tin cậy: {intent.get('confidence', 0):.4f})")
                results_file.write(f"Intent: {intent.get('name', 'N/A')} (độ tin cậy: {intent.get('confidence', 0):.4f})\n")
                
                # Ghi chi tiết kết quả vào file
                results_file.write(f"Chi tiết: {json.dumps(result, indent=2, ensure_ascii=False)}\n")
                
            else:
                print(f"Lỗi - Status code: {response.status_code}")
                results_file.write(f"Lỗi - Status code: {response.status_code}\n")
                
        except Exception as e:
            error_message = f"Lỗi khi gửi tin nhắn: {str(e)}"
            print(error_message)
            results_file.write(error_message + "\n")
        
        time.sleep(0.5)
    
    results_file.close()

def test_rasa_webhook():
    """Kiểm tra phản hồi webhook của Rasa"""
    print("\n" + "="*60)
    print("KIỂM TRA PHẢN HỒI WEBHOOK CỦA RASA")
    print("="*60)
    
    results_file = open("test_webhook_results.txt", "w", encoding="utf-8")
    results_file.write("KẾT QUẢ PHẢN HỒI WEBHOOK RASA\n")
    results_file.write("=" * 50 + "\n\n")
    
    for message in TEST_MESSAGES:
        try:
            print(f"\nKiểm tra tin nhắn: '{message}'")
            results_file.write(f"\nKiểm tra tin nhắn: '{message}'\n")
            
            # Gửi request tới webhook Rasa
            response = requests.post(
                RASA_WEBHOOK_URL,
                json={"sender": "tester", "message": message},
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Hiển thị phản hồi từ webhook
                if result:
                    print(f"Phản hồi: {json.dumps(result, ensure_ascii=False)[:100]}...")
                    results_file.write(f"Phản hồi: {json.dumps(result, indent=2, ensure_ascii=False)}\n")
                else:
                    print("Không có phản hồi")
                    results_file.write("Không có phản hồi\n")
                
            else:
                print(f"Lỗi - Status code: {response.status_code}")
                results_file.write(f"Lỗi - Status code: {response.status_code}\n")
                
        except Exception as e:
            error_message = f"Lỗi khi gửi tin nhắn: {str(e)}"
            print(error_message)
            results_file.write(error_message + "\n")
        
        time.sleep(0.5)
    
    results_file.close()

def test_frontend_proxy():
    """Kiểm tra phản hồi qua API proxy của frontend"""
    print("\n" + "="*60)
    print("KIỂM TRA PHẢN HỒI QUA API PROXY CỦA FRONTEND")
    print("="*60)
    
    results_file = open("test_frontend_results.txt", "w", encoding="utf-8")
    results_file.write("KẾT QUẢ PHẢN HỒI QUA API PROXY\n")
    results_file.write("=" * 50 + "\n\n")
    
    for message in TEST_MESSAGES:
        try:
            print(f"\nKiểm tra tin nhắn: '{message}'")
            results_file.write(f"\nKiểm tra tin nhắn: '{message}'\n")
            
            # Gửi request tới API proxy
            response = requests.post(
                FRONTEND_PROXY_URL,
                json={"sender": "tester", "message": message},
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Hiển thị phản hồi từ API proxy
                if result:
                    print(f"Phản hồi: {json.dumps(result, ensure_ascii=False)[:100]}...")
                    results_file.write(f"Phản hồi: {json.dumps(result, indent=2, ensure_ascii=False)}\n")
                else:
                    print("Không có phản hồi")
                    results_file.write("Không có phản hồi\n")
                
            else:
                print(f"Lỗi - Status code: {response.status_code}")
                results_file.write(f"Lỗi - Status code: {response.status_code}\n")
                
        except Exception as e:
            error_message = f"Lỗi khi gửi tin nhắn: {str(e)}"
            print(error_message)
            results_file.write(error_message + "\n")
        
        time.sleep(0.5)
    
    results_file.close()

if __name__ == "__main__":
    test_rasa_parse()
    test_rasa_webhook()
    test_frontend_proxy()
    
    print("\n" + "="*60)
    print("KIỂM TRA HOÀN TẤT")
    print("Kết quả chi tiết đã được lưu vào các file:")
    print("- test_parse_results.txt (kết quả phân loại intent)")
    print("- test_webhook_results.txt (kết quả phản hồi webhook)")
    print("- test_frontend_results.txt (kết quả phản hồi qua API proxy)")
    print("="*60)
