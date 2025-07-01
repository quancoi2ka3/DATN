#!/usr/bin/env python3
"""
Script để kiểm tra chi tiết về hoạt động của webhook Rasa,
đặc biệt tập trung vào phản hồi cho các intent cụ thể
"""

import requests
import json
import sys
import time
import os

RASA_SERVER_URL = "http://localhost:5005"
RASA_WEBHOOK_URL = f"{RASA_SERVER_URL}/webhooks/rest/webhook"
FRONTEND_PROXY_URL = "http://localhost:3000/api/chatbot"

# Danh sách các tin nhắn để test theo từng intent
TEST_MESSAGES = [
    # Intent: greet
    {"message": "xin chào", "intent": "greet", "description": "Chào hỏi"},
    {"message": "chào bạn", "intent": "greet", "description": "Chào hỏi"},
    
    # Intent: product_info
    {"message": "sản phẩm", "intent": "product_info", "description": "Thông tin sản phẩm"},
    {"message": "các sản phẩm", "intent": "product_info", "description": "Thông tin sản phẩm"},
    {"message": "sản phẩm của shop", "intent": "product_info", "description": "Thông tin sản phẩm"},
    
    # Intent: service_info
    {"message": "dịch vụ", "intent": "service_info", "description": "Thông tin dịch vụ"},
    {"message": "các dịch vụ", "intent": "service_info", "description": "Thông tin dịch vụ"},
    {"message": "dịch vụ gì", "intent": "service_info", "description": "Thông tin dịch vụ"},
    
    # Intent: price_query
    {"message": "giá", "intent": "price_query", "description": "Truy vấn giá"},
    {"message": "giá bao nhiêu", "intent": "price_query", "description": "Truy vấn giá"},
    {"message": "giá các gói tập", "intent": "price_query", "description": "Truy vấn giá"},
    
    # Intent: contact_info
    {"message": "liên hệ", "intent": "contact_info", "description": "Thông tin liên hệ"},
    {"message": "địa chỉ", "intent": "contact_info", "description": "Thông tin liên hệ"},
    {"message": "số điện thoại", "intent": "contact_info", "description": "Thông tin liên hệ"},
    
    # Intent: schedule_info
    {"message": "lịch", "intent": "schedule_info", "description": "Thông tin lịch"},
    {"message": "giờ hoạt động", "intent": "schedule_info", "description": "Thông tin lịch"},
    {"message": "giờ mở cửa", "intent": "schedule_info", "description": "Thông tin lịch"},
    
    # Intent: membership_info
    {"message": "thành viên", "intent": "membership_info", "description": "Thông tin thành viên"},
    {"message": "hội viên", "intent": "membership_info", "description": "Thông tin thành viên"}
]

def print_header(text):
    """In tiêu đề có định dạng"""
    print(f"\n{text}")
    print("=" * len(text))

def print_section(text):
    """In phần có định dạng"""
    print(f"\n{text}")
    print("-" * len(text))

def check_rasa_status():
    """Kiểm tra trạng thái và model Rasa đang chạy"""
    print_section("Kiểm tra trạng thái và model Rasa")
    
    try:
        response = requests.get(f"{RASA_SERVER_URL}/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            
            print("✓ Rasa server đang hoạt động")
            print(f"Model ID: {data.get('model_id', 'N/A')}")
            print(f"Fingerprint: {data.get('fingerprint', 'N/A')}")
            if 'model_file' in data:
                print(f"Model file: {data.get('model_file', 'N/A')}")
            
            return True
        else:
            print(f"✗ Lỗi kết nối đến Rasa - Status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Lỗi kết nối đến Rasa: {str(e)}")
        return False

def test_rasa_directly():
    """Test kết nối trực tiếp đến webhook Rasa"""
    print_section("Test kết nối trực tiếp đến webhook Rasa")
    
    successful_tests = 0
    failed_tests = 0
    
    for test in TEST_MESSAGES:
        try:
            message = test["message"]
            intent = test["intent"]
            description = test["description"]
            
            print(f"\nTesting: '{message}' ({description})")
            
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
                    print("✓ Phản hồi nhận được:")
                    for idx, resp in enumerate(responses):
                        print(f"  {idx+1}. {resp.get('text', 'Không có nội dung')}")
                    
                    successful_tests += 1
                else:
                    print("⚠ Không có phản hồi (mảng rỗng)")
                    failed_tests += 1
            else:
                print(f"✗ Lỗi - Status code: {response.status_code}")
                failed_tests += 1
                
        except Exception as e:
            print(f"✗ Lỗi khi gửi tin nhắn: {str(e)}")
            failed_tests += 1
        
        time.sleep(0.5)  # Delay giữa các request
        
    return successful_tests, failed_tests

def test_frontend_proxy():
    """Test kết nối qua API proxy của frontend"""
    print_section("Test kết nối qua API proxy của frontend")
    
    successful_tests = 0
    failed_tests = 0
    
    # Chọn một số tin nhắn để test qua proxy
    proxy_tests = TEST_MESSAGES[::3]  # Lấy mỗi phần tử thứ 3
    
    for test in proxy_tests:
        try:
            message = test["message"]
            intent = test["intent"]
            description = test["description"]
            
            print(f"\nTesting via proxy: '{message}' ({description})")
            
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
                
                if responses and len(responses) > 0 and not any("không hiểu" in str(r.get("text", "")).lower() for r in responses):
                    print("✓ Phản hồi proxy nhận được:")
                    for idx, resp in enumerate(responses):
                        print(f"  {idx+1}. {resp.get('text', 'Không có nội dung')}")
                    
                    successful_tests += 1
                else:
                    fallback_text = next((r.get("text", "") for r in responses if "không hiểu" in str(r.get("text", "")).lower()), "")
                    print(f"⚠ Phản hồi mặc định (fallback): {fallback_text}")
                    failed_tests += 1
            else:
                print(f"✗ Lỗi proxy - Status code: {response.status_code}")
                failed_tests += 1
                
        except Exception as e:
            print(f"✗ Lỗi khi gửi tin nhắn qua proxy: {str(e)}")
            failed_tests += 1
        
        time.sleep(0.5)  # Delay giữa các request
        
    return successful_tests, failed_tests

def print_summary(direct_results, proxy_results):
    """In tổng kết kết quả test"""
    print_section("Tổng kết kết quả")
    
    direct_success, direct_fail = direct_results
    proxy_success, proxy_fail = proxy_results
    
    total_direct = direct_success + direct_fail
    total_proxy = proxy_success + proxy_fail
    
    direct_success_rate = (direct_success / total_direct * 100) if total_direct > 0 else 0
    proxy_success_rate = (proxy_success / total_proxy * 100) if total_proxy > 0 else 0
    
    print(f"Kết nối trực tiếp:")
    print(f"  ✓ Thành công: {direct_success}/{total_direct} ({direct_success_rate:.1f}%)")
    print(f"  ✗ Thất bại: {direct_fail}/{total_direct} ({100-direct_success_rate:.1f}%)")
    
    print(f"\nKết nối qua proxy:")
    print(f"  ✓ Thành công: {proxy_success}/{total_proxy} ({proxy_success_rate:.1f}%)")
    print(f"  ✗ Thất bại: {proxy_fail}/{total_proxy} ({100-proxy_success_rate:.1f}%)")
    
    # Phân tích và đưa ra kết luận
    if direct_success_rate > 80 and proxy_success_rate < 50:
        print("\nKẾT LUẬN: Rasa server hoạt động bình thường nhưng có vấn đề với API proxy. Kiểm tra file route.ts trong frontend.")
    elif direct_success_rate < 50 and proxy_success_rate < 50:
        print("\nKẾT LUẬN: Có vấn đề với cả Rasa server và API proxy. Kiểm tra lại model, dữ liệu train và kết nối.")
    elif direct_success_rate > 80 and proxy_success_rate > 80:
        print("\nKẾT LUẬN: Hệ thống hoạt động tốt. Vấn đề có thể nằm ở giao diện frontend hoặc ngữ cảnh đặc biệt.")
    else:
        print("\nKẾT LUẬN: Có một số vấn đề cần được khắc phục. Kiểm tra các intent cụ thể đang gặp vấn đề.")

def main():
    """Hàm chính chạy toàn bộ kiểm tra"""
    print_header("KIỂM TRA CHI TIẾT KẾT NỐI RASA WEBHOOK")
    
    # Kiểm tra Rasa status
    if not check_rasa_status():
        print("\nKhông thể kết nối đến Rasa server. Vui lòng đảm bảo server đang chạy.")
        return
    
    # Test kết nối trực tiếp
    direct_results = test_rasa_directly()
    
    # Test kết nối qua proxy
    proxy_results = test_frontend_proxy()
    
    # In tổng kết
    print_summary(direct_results, proxy_results)
    
    print_header("KẾT THÚC KIỂM TRA")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nKiểm tra bị dừng bởi người dùng.")
    except Exception as e:
        print(f"Lỗi không mong muốn: {str(e)}")
