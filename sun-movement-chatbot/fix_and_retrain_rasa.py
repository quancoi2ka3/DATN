"""
Fix và retrain model Rasa
"""
import os
import sys
import yaml
import shutil
import subprocess
from pathlib import Path

def print_section(title):
    """In tiêu đề phần"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")

def backup_file(file_path):
    """Tạo bản sao lưu của file"""
    if os.path.exists(file_path):
        backup_path = f"{file_path}.bak"
        shutil.copy2(file_path, backup_path)
        print(f"Đã sao lưu file {file_path} -> {backup_path}")
        return True
    return False

def fix_domain_file(chatbot_dir):
    """Sửa file domain.yml"""
    print_section("SỬA FILE DOMAIN.YML")
    
    domain_file = os.path.join(chatbot_dir, "domain.yml")
    if not os.path.exists(domain_file):
        print(f"Không tìm thấy file domain.yml trong {chatbot_dir}")
        return False
    
    try:
        # Tạo bản sao lưu
        backup_file(domain_file)
        
        # Đọc nội dung file
        with open(domain_file, 'r', encoding='utf-8') as f:
            domain_data = yaml.safe_load(f)
        
        # Sửa phản hồi thanh toán
        modified = False
        if 'responses' in domain_data:
            for resp_name in domain_data['responses']:
                if 'payment' in resp_name.lower() or 'thanh_toán' in resp_name.lower() or 'thanh_toan' in resp_name.lower():
                    # Đánh dấu phản hồi để dễ nhận biết
                    domain_data['responses'][resp_name] = [
                        {
                            'text': '[FIXED] 💳 Phương thức thanh toán:\n• Tiền mặt tại cửa hàng\n• Chuyển khoản ngân hàng\n• Thẻ tín dụng/ghi nợ\n• Ví điện tử (MoMo, ZaloPay)'
                        }
                    ]
                    print(f"Đã sửa phản hồi: {resp_name}")
                    modified = True
        
        # Thêm utter_default và utter_fallback rõ ràng
        if 'responses' not in domain_data:
            domain_data['responses'] = {}
            
        # Thêm phản hồi fallback rõ ràng
        domain_data['responses']['utter_default'] = [
            {
                'text': '[FIXED] Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n• Sản phẩm và dịch vụ\n• Giá cả và khuyến mại\n• Lịch tập và đăng ký\n• Liên hệ và hỗ trợ'
            }
        ]
        domain_data['responses']['utter_fallback'] = [
            {
                'text': '[FIXED] Xin lỗi, tôi không hiểu ý của bạn. Tôi có thể trợ giúp về:\n• Sản phẩm và dịch vụ\n• Giá cả và khuyến mại\n• Lịch tập và đăng ký\n• Liên hệ và hỗ trợ'
            }
        ]
        print("Đã thêm utter_default và utter_fallback rõ ràng")
        modified = True
            
        # Ghi lại file nếu có thay đổi
        if modified:
            with open(domain_file, 'w', encoding='utf-8') as f:
                yaml.dump(domain_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            print(f"Đã lưu thay đổi vào {domain_file}")
            return True
        else:
            print("Không có thay đổi nào được thực hiện")
            return False
            
    except Exception as e:
        print(f"Lỗi khi sửa domain.yml: {str(e)}")
        return False

def fix_rules_file(chatbot_dir):
    """Sửa file rules.yml"""
    print_section("SỬA FILE RULES.YML")
    
    rules_file = os.path.join(chatbot_dir, "data", "rules.yml")
    if not os.path.exists(rules_file):
        print(f"Không tìm thấy file rules.yml trong {os.path.join(chatbot_dir, 'data')}")
        return False
    
    try:
        # Tạo bản sao lưu
        backup_file(rules_file)
        
        # Đọc nội dung file
        with open(rules_file, 'r', encoding='utf-8') as f:
            rules_data = yaml.safe_load(f)
        
        # Kiểm tra và sửa các rule
        modified = False
        problematic_rules = []
        
        if 'rules' in rules_data:
            # Tìm các rule có vấn đề
            for i, rule in enumerate(rules_data['rules']):
                if 'steps' in rule:
                    for step in rule['steps']:
                        if 'action' in step and ('payment' in step['action'].lower() or 'thanh_toán' in step['action'].lower()):
                            # Đánh dấu rule có vấn đề
                            problematic_rules.append(i)
                            break
            
            # Sửa hoặc xóa các rule có vấn đề
            if problematic_rules:
                print(f"Tìm thấy {len(problematic_rules)} rule có vấn đề")
                
                # Tùy chọn 1: Xóa các rule có vấn đề
                # for index in sorted(problematic_rules, reverse=True):
                #     del rules_data['rules'][index]
                #     print(f"Đã xóa rule có vấn đề ở vị trí {index}")
                
                # Tùy chọn 2: Sửa các rule để chúng chỉ trả về action khi thực sự cần
                for index in problematic_rules:
                    rule = rules_data['rules'][index]
                    rule_name = rule.get('rule', f"Rule #{index}")
                    print(f"Đang sửa {rule_name}...")
                    
                    # Làm cho rule chặt chẽ hơn
                    if 'steps' in rule:
                        for step in rule['steps']:
                            if 'action' in step and ('payment' in step['action'].lower() or 'thanh_toán' in step['action'].lower()):
                                # Đảm bảo rule chỉ khớp với intent thanh toán cụ thể
                                if not any('intent' in s and ('payment' in s.get('intent', '').lower() or 'thanh_toán' in s.get('intent', '').lower()) for s in rule['steps']):
                                    print(f"  Thêm điều kiện intent payment_inquiry vào rule")
                                    rule['steps'].insert(0, {'intent': 'payment_inquiry'})
                
                modified = True
            
            # Thêm rule fallback rõ ràng
            has_fallback_rule = any('fallback' in rule.get('rule', '').lower() for rule in rules_data['rules'])
            
            if not has_fallback_rule:
                print("Thêm rule fallback rõ ràng")
                fallback_rule = {
                    'rule': 'Rule fallback',
                    'steps': [
                        {'intent': 'nlu_fallback'},
                        {'action': 'utter_fallback'}
                    ]
                }
                rules_data['rules'].append(fallback_rule)
                modified = True
        
        # Ghi lại file nếu có thay đổi
        if modified:
            with open(rules_file, 'w', encoding='utf-8') as f:
                yaml.dump(rules_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            print(f"Đã lưu thay đổi vào {rules_file}")
            return True
        else:
            print("Không có thay đổi nào được thực hiện")
            return False
            
    except Exception as e:
        print(f"Lỗi khi sửa rules.yml: {str(e)}")
        return False

def fix_config_file(chatbot_dir):
    """Sửa file config.yml"""
    print_section("SỬA FILE CONFIG.YML")
    
    config_file = os.path.join(chatbot_dir, "config.yml")
    if not os.path.exists(config_file):
        print(f"Không tìm thấy file config.yml trong {chatbot_dir}")
        return False
    
    try:
        # Tạo bản sao lưu
        backup_file(config_file)
        
        # Đọc nội dung file
        with open(config_file, 'r', encoding='utf-8') as f:
            config_data = yaml.safe_load(f)
        
        # Kiểm tra và sửa pipeline
        modified = False
        has_fallback_classifier = False
        
        if 'pipeline' in config_data:
            for component in config_data['pipeline']:
                if isinstance(component, dict) and 'name' in component and 'FallbackClassifier' in component['name']:
                    has_fallback_classifier = True
                    # Điều chỉnh threshold của FallbackClassifier
                    if 'threshold' in component and component['threshold'] < 0.7:
                        old_threshold = component['threshold']
                        component['threshold'] = 0.7
                        print(f"Đã tăng threshold của FallbackClassifier từ {old_threshold} lên 0.7")
                        modified = True
            
            # Thêm FallbackClassifier nếu chưa có
            if not has_fallback_classifier:
                print("Thêm FallbackClassifier vào pipeline")
                config_data['pipeline'].append({
                    'name': 'FallbackClassifier',
                    'threshold': 0.7,
                    'ambiguity_threshold': 0.1
                })
                modified = True
        
        # Kiểm tra và sửa policies
        has_rule_policy = False
        if 'policies' in config_data:
            for policy in config_data['policies']:
                if isinstance(policy, dict) and 'name' in policy and 'RulePolicy' in policy['name']:
                    has_rule_policy = True
            
            # Thêm RulePolicy nếu chưa có
            if not has_rule_policy:
                print("Thêm RulePolicy vào policies")
                config_data['policies'].append({
                    'name': 'RulePolicy',
                    'core_fallback_threshold': 0.3,
                    'core_fallback_action_name': 'utter_fallback',
                    'enable_fallback_prediction': True
                })
                modified = True
        
        # Ghi lại file nếu có thay đổi
        if modified:
            with open(config_file, 'w', encoding='utf-8') as f:
                yaml.dump(config_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            print(f"Đã lưu thay đổi vào {config_file}")
            return True
        else:
            print("Không có thay đổi nào được thực hiện")
            return False
            
    except Exception as e:
        print(f"Lỗi khi sửa config.yml: {str(e)}")
        return False

def clean_models_folder(chatbot_dir):
    """Xóa các model cũ"""
    print_section("XÓA CÁC MODEL CŨ")
    
    models_dir = os.path.join(chatbot_dir, "models")
    if not os.path.exists(models_dir):
        print(f"Không tìm thấy thư mục models trong {chatbot_dir}")
        os.makedirs(models_dir)
        print(f"Đã tạo thư mục models mới")
        return True
    
    try:
        # Liệt kê các file model
        models = [f for f in os.listdir(models_dir) if os.path.isfile(os.path.join(models_dir, f)) and f.endswith('.tar.gz')]
        
        if models:
            # Tạo thư mục backup
            backup_dir = os.path.join(chatbot_dir, "models_backup")
            os.makedirs(backup_dir, exist_ok=True)
            
            # Di chuyển các model cũ vào thư mục backup
            for model in models:
                src = os.path.join(models_dir, model)
                dst = os.path.join(backup_dir, model)
                shutil.move(src, dst)
                print(f"Đã di chuyển {model} -> {dst}")
            
            print(f"Đã di chuyển {len(models)} model cũ vào thư mục backup")
            return True
        else:
            print("Không tìm thấy model nào để xóa")
            return True
            
    except Exception as e:
        print(f"Lỗi khi xóa models cũ: {str(e)}")
        return False

def train_new_model(chatbot_dir):
    """Train model mới"""
    print_section("TRAIN MODEL MỚI")
    
    try:
        # Chuyển đến thư mục chatbot
        current_dir = os.getcwd()
        os.chdir(chatbot_dir)
        
        print("Đang train model mới... (có thể mất vài phút)")
        
        # Chạy lệnh train
        result = subprocess.run(
            ["rasa", "train", "--force"],
            capture_output=True,
            text=True
        )
        
        # Khôi phục thư mục làm việc
        os.chdir(current_dir)
        
        # Kiểm tra kết quả
        if result.returncode == 0:
            print("Train model thành công!")
            print(result.stdout)
            return True
        else:
            print("Lỗi khi train model:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"Lỗi khi train model: {str(e)}")
        return False

def restart_rasa_server(chatbot_dir):
    """Khởi động lại Rasa server"""
    print_section("KHỞI ĐỘNG LẠI RASA SERVER")
    
    try:
        # Kiểm tra nếu Rasa server đang chạy
        try:
            import requests
            requests.get("http://localhost:5005/status", timeout=2)
            
            print("Rasa server đang chạy, cần dừng lại trước...")
            
            # Tìm và dừng process Rasa
            if os.name == 'nt':  # Windows
                subprocess.run(["taskkill", "/f", "/im", "rasa.exe"], capture_output=True)
                subprocess.run(["taskkill", "/f", "/fi", "WINDOWTITLE eq *rasa*"], capture_output=True)
            else:  # Linux/Mac
                subprocess.run(["pkill", "-f", "rasa run"], capture_output=True)
                
            print("Đã dừng Rasa server")
            
        except:
            print("Rasa server không chạy, tiếp tục...")
        
        print("Đang khởi động Rasa server với model mới...")
        
        # Chạy Rasa server trong một terminal riêng biệt
        if os.name == 'nt':  # Windows
            subprocess.Popen(
                ["start", "cmd", "/k", "cd", "/d", chatbot_dir, "&&", "rasa", "run", "--enable-api", "--cors", "*"],
                shell=True
            )
        else:  # Linux/Mac
            subprocess.Popen(
                ["gnome-terminal", "--", "bash", "-c", f"cd {chatbot_dir} && rasa run --enable-api --cors '*'; read"],
                start_new_session=True
            )
            
        print("Đã khởi động Rasa server")
        print("Vui lòng đợi vài giây để server khởi động hoàn tất...")
        
        return True
            
    except Exception as e:
        print(f"Lỗi khi khởi động lại Rasa server: {str(e)}")
        return False

def main():
    """Hàm chính để thực hiện các bước sửa chữa"""
    print("\n===== KHẮC PHỤC VÀ RETRAIN MODEL RASA =====\n")
    
    # Xác định đường dẫn thư mục chatbot
    chatbot_dir = os.path.join("d:", "DATN", "DATN", "sun-movement-chatbot")
    if not os.path.exists(chatbot_dir):
        print(f"Không tìm thấy thư mục chatbot tại {chatbot_dir}")
        sys.exit(1)
        
    print(f"Thư mục chatbot: {chatbot_dir}")
    
    # Thực hiện các bước sửa chữa
    fixed_domain = fix_domain_file(chatbot_dir)
    fixed_rules = fix_rules_file(chatbot_dir)
    fixed_config = fix_config_file(chatbot_dir)
    cleaned_models = clean_models_folder(chatbot_dir)
    
    # Train model mới nếu đã sửa ít nhất một file
    if fixed_domain or fixed_rules or fixed_config or cleaned_models:
        print("\nĐã sửa xong cấu hình, bắt đầu train model mới...")
        trained = train_new_model(chatbot_dir)
        
        if trained:
            restart_rasa_server(chatbot_dir)
            print("\nĐã hoàn tất quá trình khắc phục và retrain model!")
            print("Vui lòng đợi Rasa server khởi động hoàn tất (khoảng 30 giây)")
            print("Sau đó chạy script kiểm tra để xác nhận vấn đề đã được khắc phục.")
        else:
            print("\nTrain model thất bại. Vui lòng kiểm tra lỗi và thử lại.")
    else:
        print("\nKhông có thay đổi nào được thực hiện, không cần train lại model.")

if __name__ == "__main__":
    main()
