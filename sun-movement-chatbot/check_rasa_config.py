"""
Kiểm tra các file cấu hình Rasa để tìm nguyên nhân gây ra vấn đề
"""
import os
import yaml
import json
import sys
from pathlib import Path

def print_section(title):
    """In tiêu đề phần"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")

def check_domain_file(chatbot_dir):
    """Kiểm tra file domain.yml"""
    print_section("KIỂM TRA DOMAIN.YML")
    
    domain_file = os.path.join(chatbot_dir, "domain.yml")
    if not os.path.exists(domain_file):
        print(f"Không tìm thấy file domain.yml trong {chatbot_dir}")
        return
    
    try:
        with open(domain_file, 'r', encoding='utf-8') as f:
            domain_data = yaml.safe_load(f)
            
        # Kiểm tra các phản hồi mặc định
        print("\n1. Kiểm tra các phản hồi mặc định:")
        default_responses = []
        if 'responses' in domain_data:
            for resp_name, resp_content in domain_data['responses'].items():
                if 'default' in resp_name.lower() or 'fallback' in resp_name.lower() or 'payment' in resp_name.lower():
                    default_responses.append((resp_name, resp_content))
        
        if default_responses:
            print("Tìm thấy các phản hồi có thể liên quan đến vấn đề:")
            for name, content in default_responses:
                print(f"\n- {name}:")
                print(json.dumps(content, indent=2, ensure_ascii=False))
        else:
            print("Không tìm thấy phản hồi mặc định hoặc fallback đáng ngờ")
        
        # Kiểm tra intents
        print("\n2. Danh sách tất cả các intent:")
        if 'intents' in domain_data:
            for intent in domain_data['intents']:
                print(f"- {intent}")
        else:
            print("Không tìm thấy danh sách intent")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra domain.yml: {str(e)}")

def check_rules_file(chatbot_dir):
    """Kiểm tra file rules.yml"""
    print_section("KIỂM TRA RULES.YML")
    
    rules_file = os.path.join(chatbot_dir, "data", "rules.yml")
    if not os.path.exists(rules_file):
        print(f"Không tìm thấy file rules.yml trong {os.path.join(chatbot_dir, 'data')}")
        return
    
    try:
        with open(rules_file, 'r', encoding='utf-8') as f:
            rules_data = yaml.safe_load(f)
            
        if 'rules' in rules_data:
            for i, rule in enumerate(rules_data['rules']):
                print(f"\nRule #{i+1}: {rule.get('rule')}")
                
                # Kiểm tra các rule có thể gây vấn đề
                if 'steps' in rule:
                    steps = rule['steps']
                    for step in steps:
                        if 'intent' in step:
                            print(f"  - Intent: {step['intent']}")
                        if 'action' in step:
                            action = step['action']
                            print(f"  - Action: {action}")
                            
                            # Đánh dấu các action đáng ngờ
                            if 'fallback' in action.lower() or 'payment' in action.lower() or 'default' in action.lower():
                                print(f"  ⚠️ ACTION ĐÁNG NGỜ: {action}")
        else:
            print("Không tìm thấy rules trong file")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra rules.yml: {str(e)}")

def check_stories_file(chatbot_dir):
    """Kiểm tra file stories.yml"""
    print_section("KIỂM TRA STORIES.YML")
    
    stories_file = os.path.join(chatbot_dir, "data", "stories.yml")
    if not os.path.exists(stories_file):
        print(f"Không tìm thấy file stories.yml trong {os.path.join(chatbot_dir, 'data')}")
        return
    
    try:
        with open(stories_file, 'r', encoding='utf-8') as f:
            stories_data = yaml.safe_load(f)
            
        if 'stories' in stories_data:
            payment_related_stories = []
            for story in stories_data['stories']:
                if 'story' in story and ('payment' in story['story'].lower() or 'thanh toán' in story['story'].lower()):
                    payment_related_stories.append(story)
                    
                # Kiểm tra các bước trong story
                if 'steps' in story:
                    for step in story['steps']:
                        if 'action' in step and 'payment' in step['action'].lower():
                            if story not in payment_related_stories:
                                payment_related_stories.append(story)
            
            if payment_related_stories:
                print(f"\nTìm thấy {len(payment_related_stories)} story liên quan đến thanh toán:")
                for i, story in enumerate(payment_related_stories):
                    print(f"\nStory #{i+1}: {story.get('story')}")
                    if 'steps' in story:
                        for step in story['steps']:
                            if 'intent' in step:
                                print(f"  - Intent: {step['intent']}")
                            if 'action' in step:
                                print(f"  - Action: {step['action']}")
            else:
                print("Không tìm thấy story nào liên quan đến thanh toán")
        else:
            print("Không tìm thấy stories trong file")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra stories.yml: {str(e)}")

def check_nlu_file(chatbot_dir):
    """Kiểm tra file nlu.yml"""
    print_section("KIỂM TRA NLU.YML")
    
    nlu_file = os.path.join(chatbot_dir, "data", "nlu.yml")
    if not os.path.exists(nlu_file):
        print(f"Không tìm thấy file nlu.yml trong {os.path.join(chatbot_dir, 'data')}")
        return
    
    try:
        with open(nlu_file, 'r', encoding='utf-8') as f:
            nlu_data = yaml.safe_load(f)
            
        if 'nlu' in nlu_data:
            # Đếm số lượng ví dụ cho mỗi intent
            intent_examples = {}
            for item in nlu_data['nlu']:
                if 'intent' in item:
                    intent_name = item['intent']
                    examples = item.get('examples', '')
                    example_count = examples.count('\n- ') if examples else 0
                    intent_examples[intent_name] = example_count
            
            # In ra các intent và số lượng ví dụ
            print("\nThống kê số lượng ví dụ cho mỗi intent:")
            for intent, count in intent_examples.items():
                print(f"- {intent}: {count} ví dụ")
            
            # Tìm các intent liên quan đến thanh toán
            payment_intents = [intent for intent in intent_examples.keys() 
                              if 'payment' in intent.lower() or 'thanh toán' in intent.lower()]
            
            if payment_intents:
                print("\nCác intent liên quan đến thanh toán:")
                for intent in payment_intents:
                    print(f"- {intent}")
                    
                    # Tìm và in ra các ví dụ cho intent này
                    for item in nlu_data['nlu']:
                        if 'intent' in item and item['intent'] == intent:
                            examples = item.get('examples', '')
                            if examples:
                                print("  Ví dụ:")
                                for line in examples.split('\n'):
                                    if line.strip().startswith('- '):
                                        print(f"  {line}")
        else:
            print("Không tìm thấy dữ liệu NLU trong file")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra nlu.yml: {str(e)}")

def check_config_file(chatbot_dir):
    """Kiểm tra file config.yml"""
    print_section("KIỂM TRA CONFIG.YML")
    
    config_file = os.path.join(chatbot_dir, "config.yml")
    if not os.path.exists(config_file):
        print(f"Không tìm thấy file config.yml trong {chatbot_dir}")
        return
    
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            config_data = yaml.safe_load(f)
            
        # Kiểm tra pipeline
        if 'pipeline' in config_data:
            print("\nPipeline:")
            for component in config_data['pipeline']:
                if isinstance(component, dict):
                    name = component.get('name', 'Unknown')
                    print(f"- {name}")
                    
                    # Kiểm tra các tham số quan trọng
                    if 'threshold' in component:
                        print(f"  Threshold: {component['threshold']}")
                    if 'fallback_classifier' in name.lower():
                        print(f"  ⚠️ FALLBACK CLASSIFIER: {json.dumps(component, indent=2)}")
                else:
                    print(f"- {component}")
        else:
            print("Không tìm thấy pipeline trong file cấu hình")
        
        # Kiểm tra policies
        if 'policies' in config_data:
            print("\nPolicies:")
            for policy in config_data['policies']:
                if isinstance(policy, dict):
                    name = policy.get('name', 'Unknown')
                    print(f"- {name}")
                    
                    # Kiểm tra các tham số quan trọng
                    if 'threshold' in policy:
                        print(f"  Threshold: {policy['threshold']}")
                    if 'fallback' in name.lower():
                        print(f"  ⚠️ FALLBACK POLICY: {json.dumps(policy, indent=2)}")
                else:
                    print(f"- {policy}")
        else:
            print("Không tìm thấy policies trong file cấu hình")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra config.yml: {str(e)}")

def check_models_folder(chatbot_dir):
    """Kiểm tra thư mục models"""
    print_section("KIỂM TRA THƯ MỤC MODELS")
    
    models_dir = os.path.join(chatbot_dir, "models")
    if not os.path.exists(models_dir):
        print(f"Không tìm thấy thư mục models trong {chatbot_dir}")
        return
    
    try:
        # Liệt kê các file model
        models = [f for f in os.listdir(models_dir) if os.path.isfile(os.path.join(models_dir, f)) and f.endswith('.tar.gz')]
        
        if models:
            print(f"\nTìm thấy {len(models)} model:")
            for i, model in enumerate(sorted(models)):
                model_path = os.path.join(models_dir, model)
                model_size = os.path.getsize(model_path) / (1024 * 1024)  # Đổi sang MB
                model_time = os.path.getmtime(model_path)
                print(f"{i+1}. {model} - {model_size:.2f} MB - Thời gian: {model_time}")
        else:
            print("Không tìm thấy model nào trong thư mục")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra thư mục models: {str(e)}")

def main():
    """Hàm chính để chạy các kiểm tra"""
    print("\n===== KIỂM TRA CẤU HÌNH RASA =====\n")
    
    # Xác định đường dẫn thư mục chatbot
    chatbot_dir = os.path.join("d:", "DATN", "DATN", "sun-movement-chatbot")
    if not os.path.exists(chatbot_dir):
        print(f"Không tìm thấy thư mục chatbot tại {chatbot_dir}")
        sys.exit(1)
        
    print(f"Thư mục chatbot: {chatbot_dir}")
    
    # Chạy các kiểm tra
    check_domain_file(chatbot_dir)
    check_rules_file(chatbot_dir)
    check_stories_file(chatbot_dir)
    check_nlu_file(chatbot_dir)
    check_config_file(chatbot_dir)
    check_models_folder(chatbot_dir)
    
    print("\n===== KẾT THÚC KIỂM TRA CẤU HÌNH RASA =====")
    print("\nDựa trên kết quả kiểm tra, hãy tìm xem có bất kỳ rule nào luôn trả về phản hồi thanh toán")
    print("hoặc có fallback action nào được thiết lập để trả về thông tin thanh toán.")

if __name__ == "__main__":
    main()
