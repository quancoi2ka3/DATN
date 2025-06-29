#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để validate cấu trúc stories và rules trong Rasa
"""

import yaml
import sys
import os

def validate_yaml_file(filepath, expected_key):
    """Validate cấu trúc file YAML"""
    try:
        if not os.path.exists(filepath):
            print(f"! Không tìm thấy file: {filepath}")
            return False
            
        with open(filepath, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            
        print(f"✓ {os.path.basename(filepath)} có cú pháp YAML hợp lệ")
        
        if expected_key not in data:
            print(f"! Không tìm thấy key '{expected_key}' trong {filepath}")
            return False
            
        items = data[expected_key]
        if not isinstance(items, list):
            print(f"! Key '{expected_key}' phải là một list")
            return False
            
        # Validate từng item
        for i, item in enumerate(items):
            if expected_key == 'stories':
                if 'story' not in item:
                    print(f"! Story {i+1} thiếu tên story")
                    return False
                if 'steps' not in item:
                    print(f"! Story {i+1} ({item.get('story', 'unnamed')}) thiếu steps")
                    return False
                if not isinstance(item['steps'], list):
                    print(f"! Story {i+1} ({item.get('story', 'unnamed')}) - steps phải là list")
                    return False
                    
            elif expected_key == 'rules':
                if 'rule' not in item:
                    print(f"! Rule {i+1} thiếu tên rule")
                    return False
                if 'steps' not in item:
                    print(f"! Rule {i+1} ({item.get('rule', 'unnamed')}) thiếu steps")
                    return False
                if not isinstance(item['steps'], list):
                    print(f"! Rule {i+1} ({item.get('rule', 'unnamed')}) - steps phải là list")
                    return False
                    
        print(f"✓ Tất cả {len(items)} {expected_key} có cấu trúc hợp lệ")
        return True
        
    except yaml.YAMLError as e:
        print(f"! Lỗi cú pháp YAML trong {filepath}: {e}")
        return False
    except Exception as e:
        print(f"! Lỗi khi đọc {filepath}: {e}")
        return False

def main():
    print("================================")
    print("   VALIDATE RASA DATA FILES")
    print("================================")
    
    # Chuyển đến thư mục chatbot
    chatbot_dir = r"d:\DATN\DATN\sun-movement-chatbot"
    if os.path.exists(chatbot_dir):
        os.chdir(chatbot_dir)
        print(f"Đang kiểm tra trong: {chatbot_dir}")
    else:
        print(f"! Không tìm thấy thư mục: {chatbot_dir}")
        return False
    
    success = True
    
    # Validate stories.yml
    print("\n[1/4] Kiểm tra stories.yml...")
    if not validate_yaml_file("data/stories.yml", "stories"):
        success = False
    
    # Validate rules.yml
    print("\n[2/4] Kiểm tra rules.yml...")
    if not validate_yaml_file("data/rules.yml", "rules"):
        success = False
    
    # Validate nlu.yml
    print("\n[3/4] Kiểm tra nlu.yml...")
    if not validate_yaml_file("data/nlu.yml", "nlu"):
        success = False
    
    # Validate domain.yml
    print("\n[4/4] Kiểm tra domain.yml...")
    try:
        with open("domain.yml", 'r', encoding='utf-8') as f:
            domain = yaml.safe_load(f)
        print("✓ domain.yml có cú pháp YAML hợp lệ")
        
        required_keys = ['intents', 'responses', 'actions']
        for key in required_keys:
            if key not in domain:
                print(f"! domain.yml thiếu key '{key}'")
                success = False
            else:
                print(f"✓ domain.yml có key '{key}'")
                
    except Exception as e:
        print(f"! Lỗi domain.yml: {e}")
        success = False
    
    print("\n================================")
    if success:
        print("✓ TẤT CẢ FILES HỢP LỆ!")
        print("Bây giờ bạn có thể train model an toàn.")
    else:
        print("! CÓ LỖI TRONG CẤU TRÚC FILES")
        print("Vui lòng sửa lỗi trước khi train.")
    print("================================")
    
    return success

if __name__ == "__main__":
    success = main()
    input("\nNhấn Enter để tiếp tục...")
    sys.exit(0 if success else 1)
