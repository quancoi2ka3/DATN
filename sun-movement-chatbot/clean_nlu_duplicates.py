#!/usr/bin/env python3
"""
Script để làm sạch các ví dụ trùng lặp trong nlu.yml
"""

import yaml
import sys
from collections import defaultdict

def clean_nlu_duplicates(file_path):
    """Làm sạch các ví dụ trùng lặp trong file NLU"""
    
    # Đọc file NLU
    with open(file_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    # Theo dõi các ví dụ đã thấy
    seen_examples = defaultdict(list)
    duplicates_found = []
    
    # Kiểm tra từng intent
    for nlu_data in data.get('nlu', []):
        intent_name = nlu_data.get('intent')
        examples = nlu_data.get('examples', '').strip()
        
        if examples:
            # Tách các ví dụ
            example_lines = [line.strip() for line in examples.split('\n') if line.strip() and line.strip().startswith('-')]
            example_texts = [line[1:].strip() for line in example_lines]  # Bỏ dấu '-'
            
            # Kiểm tra trùng lặp
            unique_examples = []
            for example in example_texts:
                if example in seen_examples:
                    duplicates_found.append({
                        'example': example,
                        'current_intent': intent_name,
                        'previous_intents': seen_examples[example]
                    })
                    print(f"DUPLICATE: '{example}' found in {intent_name} (already in {seen_examples[example]})")
                else:
                    unique_examples.append(example)
                    seen_examples[example].append(intent_name)
            
            # Cập nhật examples với danh sách unique
            if unique_examples:
                new_examples = '\n'.join([f'    - {ex}' for ex in unique_examples])
                nlu_data['examples'] = new_examples
    
    # Tạo file backup
    backup_file = file_path + '.backup'
    import shutil
    shutil.copy(file_path, backup_file)
    print(f"Backup created: {backup_file}")
    
    # Ghi lại file đã làm sạch
    with open(file_path, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    
    print(f"\nFound {len(duplicates_found)} duplicates")
    print("File cleaned successfully!")
    
    return duplicates_found

if __name__ == "__main__":
    file_path = "data/nlu.yml"
    duplicates = clean_nlu_duplicates(file_path)
    
    if duplicates:
        print("\n=== DUPLICATE REPORT ===")
        for dup in duplicates:
            print(f"'{dup['example']}' -> {dup['current_intent']} (conflicts with {dup['previous_intents']})")
