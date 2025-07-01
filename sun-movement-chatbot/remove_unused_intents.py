#!/usr/bin/env python3
"""
Script để xóa các intent không được sử dụng khỏi nlu.yml
"""

import yaml
import re

# Danh sách các intent cần xóa (không được sử dụng trong stories)
UNUSED_INTENTS = [
    'delivery_tracking',
    'material_info', 
    'product_comparison',
    'product_size',
    'warranty_info'
]

def remove_unused_intents(file_path):
    """Xóa các intent không sử dụng khỏi file NLU"""
    
    # Đọc file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Tạo backup
    backup_file = file_path + '.backup2'
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Backup created: {backup_file}")
    
    # Xóa từng intent
    for intent in UNUSED_INTENTS:
        # Pattern để match intent và tất cả examples của nó
        pattern = rf'- intent: {intent}\s*\n  examples:.*?(?=\n- intent:|\n\n|\Z)'
        content = re.sub(pattern, '', content, flags=re.DOTALL)
        print(f"Removed intent: {intent}")
    
    # Làm sạch các dòng trống thừa
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    # Ghi lại file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Unused intents removed successfully!")

if __name__ == "__main__":
    file_path = "data/nlu.yml"
    remove_unused_intents(file_path)
