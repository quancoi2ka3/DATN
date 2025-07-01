"""
Kiểm tra trực tiếp model Rasa để xác định nguyên nhân gây ra vấn đề
"""
import requests
import json
import os
import sys

def test_rasa_directly(message):
    """Test trực tiếp API model/parse của Rasa để xem intent nhận diện"""
    print(f"\n{'='*50}")
    print(f"Câu hỏi: '{message}'")
    
    try:
        # Gọi API parse để xem intent được nhận diện
        parse_url = "http://localhost:5005/model/parse"
        parse_response = requests.post(parse_url, json={"text": message}, timeout=5)
        parse_data = parse_response.json()
        
        print(f"Intent được nhận diện: {parse_data.get('intent', {}).get('name')}")
        print(f"Confidence: {parse_data.get('intent', {}).get('confidence'):.4f}")
        print(f"Entities: {parse_data.get('entities')}")
        
        # Gọi webhook để xem phản hồi thực tế
        webhook_url = "http://localhost:5005/webhooks/rest/webhook"
        webhook_response = requests.post(
            webhook_url, 
            json={"message": message, "sender": "tester"},
            timeout=5
        )
        
        if webhook_response.ok:
            responses = webhook_response.json()
            if responses:
                print("\nPhản hồi từ webhook:")
                for i, resp in enumerate(responses):
                    print(f"{i+1}. {resp.get('text', '')[:100]}...")
            else:
                print("\nKhông có phản hồi từ webhook")
        else:
            print(f"\nLỗi khi gọi webhook: {webhook_response.status_code}")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra: {str(e)}")
    
    print(f"{'='*50}")

def get_rasa_status():
    """Kiểm tra trạng thái Rasa và model đang được sử dụng"""
    try:
        status_url = "http://localhost:5005/status"
        response = requests.get(status_url, timeout=5)
        status_data = response.json()
        
        print(f"\n{'='*50}")
        print("THÔNG TIN RASA SERVER:")
        print(f"Fingerprint: {status_data.get('fingerprint')}")
        print(f"Model ID: {status_data.get('model_id')}")
        print(f"Model file: {status_data.get('model_file')}")
        print(f"{'='*50}\n")
        
        return status_data
    except Exception as e:
        print(f"Không thể kết nối đến Rasa server: {str(e)}")
        return None

def main():
    """Hàm chính để chạy các kiểm tra"""
    print("\n===== KIỂM TRA TRỰC TIẾP MODEL RASA =====\n")
    
    # Kiểm tra trạng thái Rasa
    status_data = get_rasa_status()
    if not status_data:
        print("Không thể kết nối đến Rasa server. Hãy đảm bảo Rasa đang chạy.")
        sys.exit(1)
    
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
    ]
    
    # Thực hiện kiểm tra từng câu hỏi
    for question in test_questions:
        test_rasa_directly(question)
    
    print("\nKiểm tra hoàn tất!")
    print("Nếu mọi câu hỏi đều nhận diện là cùng một intent hoặc trả về cùng một phản hồi,")
    print("đó là dấu hiệu có vấn đề với model Rasa hoặc cấu hình của nó.")

if __name__ == "__main__":
    main()
