#!/usr/bin/env python3
"""
Script để sửa các lỗi trong cấu hình Rasa
"""

import yaml
import os
import sys

def add_out_of_scope_intent():
    """Thêm intent out_of_scope vào nlu.yml"""
    
    nlu_file = "data/nlu.yml"
    
    # Đọc file hiện tại
    with open(nlu_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    # Kiểm tra xem intent đã tồn tại chưa
    intent_exists = False
    for item in data.get('nlu', []):
        if item.get('intent') == 'out_of_scope':
            intent_exists = True
            break
    
    # Nếu chưa có, thêm vào
    if not intent_exists:
        data['nlu'].append({
            'intent': 'out_of_scope',
            'examples': '    - hello\n    - hi\n    - hey there\n    - good morning\n    - good evening\n    - how are you\n    - what\'s up\n    - nice to meet you\n    - I want to speak English\n    - do you speak English\n    - can we talk in English\n    - English please\n    - switch to English\n    - I don\'t speak Vietnamese\n    - English only'
        })
        
        # Lưu lại
        with open(nlu_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True)
        
        print(f"Đã thêm intent 'out_of_scope' vào {nlu_file}")
    else:
        print(f"Intent 'out_of_scope' đã tồn tại trong {nlu_file}")

def add_missing_intents_to_domain():
    """Thêm intent out_of_scope vào domain.yml nếu chưa có"""
    
    domain_file = "domain.yml"
    
    # Đọc file hiện tại
    with open(domain_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    # Kiểm tra xem intent đã tồn tại chưa
    if 'out_of_scope' not in data.get('intents', []):
        data['intents'].append('out_of_scope')
        
        # Lưu lại
        with open(domain_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True)
        
        print(f"Đã thêm intent 'out_of_scope' vào {domain_file}")
    else:
        print(f"Intent 'out_of_scope' đã tồn tại trong {domain_file}")

def ensure_actions_in_domain():
    """Kiểm tra và thêm actions vào domain.yml nếu chưa có"""
    
    domain_file = "domain.yml"
    missing_actions = ['action_check_product_availability', 'action_reject_english']
    
    # Đọc file hiện tại
    with open(domain_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    actions = data.get('actions', [])
    actions_added = []
    
    for action in missing_actions:
        if action not in actions:
            actions.append(action)
            actions_added.append(action)
    
    if actions_added:
        data['actions'] = actions
        
        # Lưu lại
        with open(domain_file, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, default_flow_style=False, allow_unicode=True)
        
        print(f"Đã thêm các actions vào {domain_file}: {', '.join(actions_added)}")
    else:
        print(f"Tất cả actions đã tồn tại trong {domain_file}")

if __name__ == "__main__":
    print("Sửa lỗi cấu hình Rasa...")
    add_out_of_scope_intent()
    add_missing_intents_to_domain()
    ensure_actions_in_domain()
    print("Hoàn tất!")
