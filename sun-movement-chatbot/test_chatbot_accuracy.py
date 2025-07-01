#!/usr/bin/env python3
"""
Script để kiểm tra hiệu quả trả lời của chatbot Sun Movement
So sánh phản hồi trực tiếp từ Rasa với phản hồi qua API proxy
Sử dụng các câu hỏi từ file nlu.yml để test
"""

import requests
import json
import time
import yaml
import re
import os
import sys
import random
from datetime import datetime

# Cấu hình URL
RASA_SERVER = "http://localhost:5005"
RASA_WEBHOOK_URL = f"{RASA_SERVER}/webhooks/rest/webhook"
FRONTEND_API_URL = "http://localhost:3000/api/chatbot"

# Đường dẫn đến file nlu.yml
NLU_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "nlu.yml")

# Tạo thư mục logs nếu chưa tồn tại
LOGS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

# Tên file log
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
LOG_FILE = os.path.join(LOGS_DIR, f"chatbot_test_{timestamp}.log")
REPORT_FILE = os.path.join(LOGS_DIR, f"chatbot_report_{timestamp}.html")

# Cấu hình số lượng và thời gian
MAX_TEST_PER_INTENT = 5  # Số câu hỏi tối đa để test cho mỗi intent
TIMEOUT = 10  # Thời gian chờ phản hồi (giây)
DELAY = 0.5  # Thời gian chờ giữa các request (giây)

def load_nlu_examples():
    """Đọc file nlu.yml và trích xuất các ví dụ cho từng intent"""
    print(f"Đọc dữ liệu từ file: {NLU_FILE}")
    
    try:
        with open(NLU_FILE, 'r', encoding='utf-8') as file:
            nlu_data = yaml.safe_load(file)
            
        intent_examples = {}
        
        # Trích xuất các ví dụ cho từng intent
        for item in nlu_data.get('nlu', []):
            if 'intent' in item and 'examples' in item:
                intent = item['intent']
                # Xử lý chuỗi examples để tách thành list
                examples_text = item['examples']
                examples = []
                for line in examples_text.split('\n'):
                    # Loại bỏ dấu gạch đầu dòng và khoảng trắng
                    example = re.sub(r'^\s*-\s*', '', line).strip()
                    if example:
                        examples.append(example)
                
                intent_examples[intent] = examples
                
        return intent_examples
    except Exception as e:
        print(f"Lỗi khi đọc file nlu.yml: {e}")
        return {}

def get_rasa_response(message):
    """Gửi tin nhắn đến Rasa webhook và nhận phản hồi"""
    try:
        response = requests.post(
            RASA_WEBHOOK_URL,
            json={"sender": f"test_user_{int(time.time())}", "message": message},
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Lỗi từ Rasa webhook: {response.status_code} {response.text}")
            return []
    except Exception as e:
        print(f"Lỗi kết nối đến Rasa webhook: {e}")
        return []

def get_frontend_response(message):
    """Gửi tin nhắn qua API proxy frontend và nhận phản hồi"""
    try:
        response = requests.post(
            FRONTEND_API_URL,
            json={"sender": f"test_user_{int(time.time())}", "message": message},
            timeout=TIMEOUT
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Lỗi từ API proxy: {response.status_code} {response.text}")
            return []
    except Exception as e:
        print(f"Lỗi kết nối đến API proxy: {e}")
        return []

def extract_text(response):
    """Trích xuất văn bản từ phản hồi"""
    if not response:
        return "Không có phản hồi"
    
    texts = []
    for item in response:
        if "text" in item:
            texts.append(item["text"])
    
    return "\n".join(texts) if texts else "Không có văn bản"

def write_log(message):
    """Ghi log vào file"""
    with open(LOG_FILE, 'a', encoding='utf-8') as log_file:
        log_file.write(f"{message}\n")

def check_for_payment_keywords(text):
    """Kiểm tra xem phản hồi có chứa từ khóa về thanh toán không"""
    payment_keywords = ["phương thức thanh toán", "tiền mặt", "chuyển khoản", 
                       "thẻ tín dụng", "ví điện tử", "cod", "trả góp"]
    
    for keyword in payment_keywords:
        if keyword in text.lower():
            return True
    return False

def check_intent_in_response(intent, text):
    """Kiểm tra xem phản hồi có phù hợp với intent không"""
    # Mapping giữa intent và từ khóa cần có trong phản hồi
    intent_keywords = {
        "greet": ["chào", "xin chào", "sun movement"],
        "goodbye": ["tạm biệt", "hẹn gặp lại", "chúc", "ngày tốt"],
        "thank": ["không có gì", "vui", "giúp", "hỗ trợ"],
        "product_info": ["sản phẩm", "thiết bị", "dụng cụ", "gym"],
        "price_query": ["giá", "gói", "phí", "đồng", "tiết kiệm"],
        "discount_info": ["khuyến mãi", "ưu đãi", "giảm giá"],
        "shipping_info": ["vận chuyển", "giao hàng", "ship"],
        "return_policy": ["đổi trả", "hoàn tiền", "lỗi"],
        "contact_support": ["hỗ trợ", "liên hệ", "hotline"],
        "payment_methods": ["thanh toán", "tiền mặt", "chuyển khoản", "thẻ"],
        "store_location": ["địa chỉ", "cửa hàng", "showroom"],
        "service_info": ["dịch vụ", "yoga", "personal training", "tư vấn"],
        "schedule_info": ["lịch", "giờ", "hoạt động", "mở cửa"],
        "membership_info": ["thành viên", "hội viên", "quyền lợi", "gói"]
    }
    
    if intent in intent_keywords:
        for keyword in intent_keywords[intent]:
            if keyword in text.lower():
                return True
    
    return False

def run_tests():
    """Chạy các bài test và ghi kết quả"""
    # Đọc dữ liệu từ file nlu.yml
    intent_examples = load_nlu_examples()
    
    if not intent_examples:
        print("Không thể đọc dữ liệu từ file nlu.yml. Thoát...")
        return
    
    # Khởi tạo thống kê
    total_tests = 0
    correct_responses = 0
    payment_responses = 0
    incorrect_responses = 0
    
    # Khởi tạo file log
    write_log("========== KIỂM TRA HIỆU QUẢ CHATBOT ==========")
    write_log(f"Thời gian: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    write_log(f"Số intent: {len(intent_examples)}")
    write_log("=" * 50)
    write_log("")
    
    # Khởi tạo dữ liệu cho báo cáo HTML
    html_results = []
    
    # Chạy test cho từng intent
    for intent, examples in intent_examples.items():
        print(f"\nĐang kiểm tra intent: {intent}")
        write_log(f"\n== Intent: {intent} ==")
        
        # Lấy ngẫu nhiên tối đa MAX_TEST_PER_INTENT câu hỏi
        test_examples = random.sample(examples, min(MAX_TEST_PER_INTENT, len(examples)))
        
        for idx, example in enumerate(test_examples, 1):
            print(f"  Câu hỏi {idx}/{len(test_examples)}: '{example}'")
            write_log(f"\nCâu hỏi {idx}: '{example}'")
            
            # Lấy phản hồi từ cả hai nguồn
            rasa_response = get_rasa_response(example)
            time.sleep(DELAY)
            frontend_response = get_frontend_response(example)
            
            # Trích xuất văn bản
            rasa_text = extract_text(rasa_response)
            frontend_text = extract_text(frontend_response)
            
            # Ghi log
            write_log(f"Phản hồi từ Rasa:\n{rasa_text}")
            write_log(f"Phản hồi từ API proxy:\n{frontend_text}")
            
            # Kiểm tra phản hồi
            is_payment_response = check_for_payment_keywords(frontend_text)
            is_correct_intent = check_intent_in_response(intent, frontend_text)
            
            # Cập nhật thống kê
            total_tests += 1
            
            if is_payment_response and intent != "payment_methods":
                result = "LỖI - PHẢN HỒI VỀ THANH TOÁN"
                payment_responses += 1
                write_log(f"Kết quả: {result}")
            elif is_correct_intent:
                result = "ĐÚNG - PHẢN HỒI PHÙ HỢP VỚI INTENT"
                correct_responses += 1
                write_log(f"Kết quả: {result}")
            else:
                result = "SAI - PHẢN HỒI KHÔNG PHÙ HỢP"
                incorrect_responses += 1
                write_log(f"Kết quả: {result}")
            
            # Thêm kết quả vào danh sách cho báo cáo HTML
            html_results.append({
                "intent": intent,
                "question": example,
                "rasa_response": rasa_text,
                "frontend_response": frontend_text,
                "result": result
            })
            
            # Delay giữa các request
            time.sleep(DELAY)
    
    # Ghi tổng kết vào log
    write_log("\n" + "=" * 50)
    write_log("TỔNG KẾT:")
    write_log(f"Tổng số test: {total_tests}")
    write_log(f"Phản hồi đúng intent: {correct_responses} ({(correct_responses/total_tests)*100:.1f}%)")
    write_log(f"Phản hồi sai về thanh toán: {payment_responses} ({(payment_responses/total_tests)*100:.1f}%)")
    write_log(f"Phản hồi sai khác: {incorrect_responses} ({(incorrect_responses/total_tests)*100:.1f}%)")
    
    # Tạo báo cáo HTML
    generate_html_report(html_results, total_tests, correct_responses, payment_responses, incorrect_responses)
    
    print("\n" + "=" * 50)
    print(f"TỔNG KẾT: Đã kiểm tra {total_tests} câu hỏi")
    print(f"- Phản hồi đúng intent: {correct_responses} ({(correct_responses/total_tests)*100:.1f}%)")
    print(f"- Phản hồi sai về thanh toán: {payment_responses} ({(payment_responses/total_tests)*100:.1f}%)")
    print(f"- Phản hồi sai khác: {incorrect_responses} ({(incorrect_responses/total_tests)*100:.1f}%)")
    print("=" * 50)
    print(f"Chi tiết đã được ghi vào file: {LOG_FILE}")
    print(f"Báo cáo HTML: {REPORT_FILE}")

def generate_html_report(results, total, correct, payment, incorrect):
    """Tạo báo cáo HTML từ kết quả test"""
    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo cáo kiểm tra Chatbot Sun Movement</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }}
        h1, h2 {{
            color: #1a73e8;
        }}
        .summary {{
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .summary-item {{
            margin-bottom: 8px;
        }}
        .correct {{
            color: #0b8043;
        }}
        .incorrect {{
            color: #d93025;
        }}
        .payment-error {{
            color: #ea8600;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }}
        th {{
            background-color: #1a73e8;
            color: white;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        .result-ĐÚNG {{
            color: #0b8043;
            font-weight: bold;
        }}
        .result-SAI, .result-LỖI {{
            color: #d93025;
            font-weight: bold;
        }}
        .response {{
            white-space: pre-line;
            max-width: 400px;
        }}
        .timestamp {{
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <h1>Báo cáo kiểm tra Chatbot Sun Movement</h1>
    <div class="timestamp">Ngày tạo: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</div>
    
    <div class="summary">
        <h2>Tổng kết</h2>
        <div class="summary-item">Tổng số câu hỏi kiểm tra: <strong>{total}</strong></div>
        <div class="summary-item correct">Phản hồi đúng intent: <strong>{correct}</strong> ({(correct/total)*100:.1f}%)</div>
        <div class="summary-item payment-error">Phản hồi sai về thanh toán: <strong>{payment}</strong> ({(payment/total)*100:.1f}%)</div>
        <div class="summary-item incorrect">Phản hồi sai khác: <strong>{incorrect}</strong> ({(incorrect/total)*100:.1f}%)</div>
    </div>
    
    <h2>Chi tiết kết quả</h2>
    <table>
        <thead>
            <tr>
                <th>STT</th>
                <th>Intent</th>
                <th>Câu hỏi</th>
                <th>Phản hồi API proxy</th>
                <th>Phản hồi Rasa</th>
                <th>Kết quả</th>
            </tr>
        </thead>
        <tbody>
"""
    
    # Thêm dòng cho từng kết quả
    for idx, result in enumerate(results, 1):
        result_class = ""
        if "ĐÚNG" in result["result"]:
            result_class = "result-ĐÚNG"
        elif "LỖI" in result["result"]:
            result_class = "result-LỖI"
        else:
            result_class = "result-SAI"
            
        html_content += f"""
            <tr>
                <td>{idx}</td>
                <td>{result["intent"]}</td>
                <td>{result["question"]}</td>
                <td class="response">{result["frontend_response"]}</td>
                <td class="response">{result["rasa_response"]}</td>
                <td class="{result_class}">{result["result"]}</td>
            </tr>"""
    
    # Kết thúc HTML
    html_content += """
        </tbody>
    </table>
</body>
</html>"""
    
    # Ghi file HTML
    with open(REPORT_FILE, 'w', encoding='utf-8') as html_file:
        html_file.write(html_content)

def check_services_running():
    """Kiểm tra xem các dịch vụ cần thiết đã chạy chưa"""
    services = [
        {"name": "Rasa Server", "url": f"{RASA_SERVER}/status"},
        {"name": "Frontend API", "url": "http://localhost:3000"}
    ]
    
    all_running = True
    
    print("Kiểm tra các dịch vụ...")
    for service in services:
        try:
            response = requests.get(service["url"], timeout=5)
            if response.status_code < 400:
                print(f"✓ {service['name']} đang chạy")
            else:
                print(f"✗ {service['name']} không phản hồi đúng (Mã: {response.status_code})")
                all_running = False
        except Exception as e:
            print(f"✗ {service['name']} không hoạt động: {e}")
            all_running = False
    
    if not all_running:
        print("\nMột số dịch vụ không hoạt động. Vui lòng khởi động đầy đủ trước khi chạy test.")
        return False
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("KIỂM TRA HIỆU QUẢ CHATBOT SUN MOVEMENT")
    print("=" * 60)
    print()
    
    if check_services_running():
        print("\nBắt đầu chạy các test...")
        run_tests()
    else:
        print("\nHãy chạy file start-chatbot.bat để khởi động Rasa và đảm bảo frontend đang chạy.")
