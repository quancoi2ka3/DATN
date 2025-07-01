"""
Sửa lỗi file cấu hình Rasa trước khi train lại model
"""
import os
import sys
import yaml
import shutil
from pathlib import Path

def print_header(message):
    """In tiêu đề với định dạng đẹp"""
    print("\n" + "=" * 60)
    print(message)
    print("=" * 60)

def backup_file(file_path):
    """Tạo bản sao lưu cho file"""
    if os.path.exists(file_path):
        backup_path = file_path + ".bak"
        shutil.copy2(file_path, backup_path)
        print(f"✅ Đã sao lưu file: {file_path} -> {backup_path}")
        return True
    else:
        print(f"❌ Không tìm thấy file: {file_path}")
        return False

def fix_domain_file(chatbot_dir):
    """Sửa file domain.yml để tránh phản hồi thanh toán mặc định"""
    domain_file = os.path.join(chatbot_dir, "domain.yml")
    if not os.path.exists(domain_file):
        print(f"❌ Không tìm thấy file domain.yml tại {domain_file}")
        return False
    
    print_header("ĐANG SỬA FILE DOMAIN.YML")
    
    # Tạo bản sao lưu
    backup_file(domain_file)
    
    try:
        # Đọc file domain.yml
        with open(domain_file, 'r', encoding='utf-8') as f:
            domain_data = yaml.safe_load(f)
        
        # Kiểm tra và sửa các phản hồi
        if 'responses' in domain_data:
            # Đánh dấu các phản hồi payment để debug
            for key in domain_data['responses']:
                if 'payment' in key.lower() or 'thanh_toan' in key.lower():
                    print(f"🔍 Tìm thấy phản hồi thanh toán: {key}")
                    for i, response in enumerate(domain_data['responses'][key]):
                        if 'text' in response:
                            # Đánh dấu phản hồi để dễ theo dõi
                            original_text = response['text']
                            domain_data['responses'][key][i]['text'] = f"[FIXED PAYMENT] {original_text}"
                            print(f"✅ Đã sửa phản hồi thanh toán")
            
            # Đảm bảo có phản hồi fallback tốt
            if 'utter_fallback' not in domain_data['responses']:
                domain_data['responses']['utter_fallback'] = [
                    {'text': "Xin lỗi, tôi không hiểu ý của bạn. Tôi có thể giúp bạn với:\n- Thông tin về sản phẩm\n- Dịch vụ của Sun Movement\n- Giá cả và khuyến mãi\n- Liên hệ và hỗ trợ"}
                ]
                print("✅ Đã thêm phản hồi utter_fallback")
            
            # Đảm bảo có phản hồi default tốt
            if 'utter_default' not in domain_data['responses']:
                domain_data['responses']['utter_default'] = [
                    {'text': "Xin lỗi, tôi không thể xử lý yêu cầu này. Tôi có thể giúp bạn với các chủ đề về Sun Movement."}
                ]
                print("✅ Đã thêm phản hồi utter_default")
        
        # Ghi lại file
        with open(domain_file, 'w', encoding='utf-8') as f:
            yaml.dump(domain_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            
        print("✅ Đã lưu thay đổi vào domain.yml")
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi sửa domain.yml: {str(e)}")
        return False

def fix_config_file(chatbot_dir):
    """Sửa file config.yml để cải thiện fallback policy"""
    config_file = os.path.join(chatbot_dir, "config.yml")
    if not os.path.exists(config_file):
        print(f"❌ Không tìm thấy file config.yml tại {config_file}")
        return False
    
    print_header("ĐANG SỬA FILE CONFIG.YML")
    
    # Tạo bản sao lưu
    backup_file(config_file)
    
    try:
        # Đọc file config.yml
        with open(config_file, 'r', encoding='utf-8') as f:
            config_data = yaml.safe_load(f)
        
        modified = False
        
        # Kiểm tra và sửa pipeline
        if 'pipeline' in config_data:
            # Kiểm tra FallbackClassifier
            has_fallback = False
            for i, component in enumerate(config_data['pipeline']):
                if isinstance(component, dict) and 'name' in component and 'FallbackClassifier' in component['name']:
                    has_fallback = True
                    # Điều chỉnh ngưỡng confidence
                    if 'threshold' in component and component['threshold'] < 0.7:
                        old_threshold = component['threshold']
                        config_data['pipeline'][i]['threshold'] = 0.7
                        print(f"✅ Đã điều chỉnh threshold của FallbackClassifier từ {old_threshold} thành 0.7")
                        modified = True
            
            # Thêm FallbackClassifier nếu chưa có
            if not has_fallback:
                config_data['pipeline'].append({
                    'name': 'FallbackClassifier',
                    'threshold': 0.7,
                    'ambiguity_threshold': 0.1
                })
                print("✅ Đã thêm FallbackClassifier vào pipeline")
                modified = True
        
        # Kiểm tra và sửa policies
        if 'policies' in config_data:
            # Kiểm tra RulePolicy
            has_rule_policy = False
            for i, policy in enumerate(config_data['policies']):
                if isinstance(policy, dict) and 'name' in policy and 'RulePolicy' in policy['name']:
                    has_rule_policy = True
                    # Đảm bảo có fallback action
                    if 'core_fallback_action_name' not in policy:
                        config_data['policies'][i]['core_fallback_action_name'] = 'utter_fallback'
                        config_data['policies'][i]['core_fallback_threshold'] = 0.3
                        config_data['policies'][i]['enable_fallback_prediction'] = True
                        print("✅ Đã cấu hình RulePolicy với fallback")
                        modified = True
            
            # Thêm RulePolicy nếu chưa có
            if not has_rule_policy:
                config_data['policies'].append({
                    'name': 'RulePolicy',
                    'core_fallback_threshold': 0.3,
                    'core_fallback_action_name': 'utter_fallback',
                    'enable_fallback_prediction': True
                })
                print("✅ Đã thêm RulePolicy với fallback configuration")
                modified = True
        
        # Ghi lại file nếu có thay đổi
        if modified:
            with open(config_file, 'w', encoding='utf-8') as f:
                yaml.dump(config_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            print("✅ Đã lưu thay đổi vào config.yml")
        else:
            print("ℹ️ Không cần thay đổi config.yml")
            
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi sửa config.yml: {str(e)}")
        return False

def fix_rules_file(chatbot_dir):
    """Sửa file rules.yml để tránh luôn trả về thông tin thanh toán"""
    rules_file = os.path.join(chatbot_dir, "data", "rules.yml")
    if not os.path.exists(rules_file):
        print(f"❌ Không tìm thấy file rules.yml tại {rules_file}")
        return False
    
    print_header("ĐANG SỬA FILE RULES.YML")
    
    # Tạo bản sao lưu
    backup_file(rules_file)
    
    try:
        # Đọc file rules.yml
        with open(rules_file, 'r', encoding='utf-8') as f:
            rules_data = yaml.safe_load(f)
        
        modified = False
        
        # Kiểm tra và sửa rules
        if 'rules' in rules_data:
            problematic_rules = []
            
            # Tìm các rule có vấn đề (payment action không có payment intent)
            for i, rule in enumerate(rules_data['rules']):
                if 'steps' in rule:
                    has_payment_action = False
                    has_payment_intent = False
                    
                    for step in rule['steps']:
                        if 'action' in step and ('payment' in step['action'].lower() or 'thanh_toan' in step['action'].lower()):
                            has_payment_action = True
                        if 'intent' in step and ('payment' in step['intent'].lower() or 'thanh_toan' in step['intent'].lower()):
                            has_payment_intent = True
                    
                    # Nếu có action payment nhưng không có intent payment, đánh dấu là có vấn đề
                    if has_payment_action and not has_payment_intent:
                        problematic_rules.append(i)
                        print(f"🔍 Tìm thấy rule có vấn đề: {rule.get('rule', f'Rule #{i}')}")
            
            # Sửa hoặc xóa các rule có vấn đề
            for index in problematic_rules:
                rule_name = rules_data['rules'][index].get('rule', f'Rule #{index}')
                
                # Thêm điều kiện intent payment nếu chưa có
                if 'steps' in rules_data['rules'][index]:
                    rules_data['rules'][index]['steps'].insert(0, {'intent': 'payment_inquiry'})
                    print(f"✅ Đã thêm intent payment_inquiry vào {rule_name}")
                    modified = True
            
            # Đảm bảo có rule fallback
            has_fallback_rule = False
            for rule in rules_data['rules']:
                if 'rule' in rule and 'fallback' in rule['rule'].lower():
                    has_fallback_rule = True
                    break
            
            if not has_fallback_rule:
                rules_data['rules'].append({
                    'rule': 'Fallback Rule',
                    'steps': [
                        {'intent': 'nlu_fallback'},
                        {'action': 'utter_fallback'}
                    ]
                })
                print("✅ Đã thêm fallback rule")
                modified = True
        
        # Ghi lại file nếu có thay đổi
        if modified:
            with open(rules_file, 'w', encoding='utf-8') as f:
                yaml.dump(rules_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            print("✅ Đã lưu thay đổi vào rules.yml")
        else:
            print("ℹ️ Không cần thay đổi rules.yml")
            
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi sửa rules.yml: {str(e)}")
        return False

def fix_nlu_file(chatbot_dir):
    """Kiểm tra và sửa file nlu.yml nếu cần thiết"""
    nlu_file = os.path.join(chatbot_dir, "data", "nlu.yml")
    if not os.path.exists(nlu_file):
        print(f"❌ Không tìm thấy file nlu.yml tại {nlu_file}")
        return False
    
    print_header("ĐANG KIỂM TRA FILE NLU.YML")
    
    # Tạo bản sao lưu
    backup_file(nlu_file)
    
    try:
        # Đọc file nlu.yml
        with open(nlu_file, 'r', encoding='utf-8') as f:
            nlu_data = yaml.safe_load(f)
        
        modified = False
        
        # Kiểm tra và sửa NLU
        if 'nlu' in nlu_data:
            # Kiểm tra xem có intent payment_inquiry chưa
            has_payment_intent = False
            for item in nlu_data['nlu']:
                if 'intent' in item and ('payment_inquiry' == item['intent'] or 'payment' in item['intent'].lower() or 'thanh_toan' in item['intent'].lower()):
                    has_payment_intent = True
                    print(f"✅ Đã tìm thấy intent thanh toán: {item['intent']}")
            
            # Thêm intent payment_inquiry nếu chưa có
            if not has_payment_intent:
                nlu_data['nlu'].append({
                    'intent': 'payment_inquiry',
                    'examples': "- thanh toán\n- phương thức thanh toán\n- tôi có thể thanh toán bằng gì\n- trả tiền bằng gì\n- cách thanh toán\n- payment\n- payment method\n- làm sao để thanh toán\n- thanh toán như thế nào\n- thanh toán qua thẻ\n- thanh toán bằng tiền mặt\n- có thể thanh toán online không"
                })
                print("✅ Đã thêm intent payment_inquiry")
                modified = True
        
        # Ghi lại file nếu có thay đổi
        if modified:
            with open(nlu_file, 'w', encoding='utf-8') as f:
                yaml.dump(nlu_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
            print("✅ Đã lưu thay đổi vào nlu.yml")
        else:
            print("ℹ️ Không cần thay đổi nlu.yml")
            
        return True
        
    except Exception as e:
        print(f"❌ Lỗi khi kiểm tra nlu.yml: {str(e)}")
        return False

def main():
    """Hàm chính để thực hiện việc sửa chữa"""
    print_header("BẮT ĐẦU SỬA LỖI FILE CẤU HÌNH RASA")
    
    # Xác định đường dẫn
    chatbot_dir = os.path.join("d:", "DATN", "DATN", "sun-movement-chatbot")
    
    if not os.path.exists(chatbot_dir):
        print(f"❌ Không tìm thấy thư mục Rasa tại {chatbot_dir}")
        sys.exit(1)
    
    # Sửa các file cấu hình
    fix_domain_file(chatbot_dir)
    fix_config_file(chatbot_dir)
    fix_rules_file(chatbot_dir)
    fix_nlu_file(chatbot_dir)
    
    print_header("ĐÃ HOÀN THÀNH VIỆC SỬA LỖI FILE CẤU HÌNH")
    print("""
Các file cấu hình đã được sửa chữa và sẵn sàng để train lại model.
Bây giờ bạn có thể chạy lệnh sau để train model:

cd /d d:\\DATN\\DATN\\sun-movement-chatbot
rasa train --force
    """)

if __name__ == "__main__":
    main()
