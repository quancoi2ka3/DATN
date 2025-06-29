#!/usr/bin/env python3
"""
Quick validation script for Rasa data
"""
import os
import yaml
import sys

def check_files_exist():
    """Check if required files exist"""
    required_files = [
        'config.yml',
        'domain.yml', 
        'data/nlu.yml',
        'data/stories.yml',
        'data/rules.yml'
    ]
    
    print("=== CHECKING FILES ===")
    all_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - MISSING!")
            all_exist = False
    
    return all_exist

def validate_yaml_syntax():
    """Check YAML syntax"""
    files_to_check = [
        'config.yml',
        'domain.yml',
        'data/nlu.yml', 
        'data/stories.yml',
        'data/rules.yml'
    ]
    
    print("\n=== CHECKING YAML SYNTAX ===")
    all_valid = True
    
    for file in files_to_check:
        if not os.path.exists(file):
            continue
            
        try:
            with open(file, 'r', encoding='utf-8') as f:
                yaml.safe_load(f)
            print(f"✅ {file} - Valid YAML")
        except yaml.YAMLError as e:
            print(f"❌ {file} - YAML Error: {e}")
            all_valid = False
        except Exception as e:
            print(f"❌ {file} - Error: {e}")
            all_valid = False
    
    return all_valid

def check_domain_consistency():
    """Check if domain.yml is consistent with training data"""
    print("\n=== CHECKING DOMAIN CONSISTENCY ===")
    
    try:
        # Load domain
        with open('domain.yml', 'r', encoding='utf-8') as f:
            domain = yaml.safe_load(f)
        
        # Load NLU data
        with open('data/nlu.yml', 'r', encoding='utf-8') as f:
            nlu_data = yaml.safe_load(f)
        
        # Extract intents from NLU
        nlu_intents = set()
        if 'nlu' in nlu_data:
            for item in nlu_data['nlu']:
                if 'intent' in item:
                    nlu_intents.add(item['intent'])
        
        # Extract intents from domain
        domain_intents = set(domain.get('intents', []))
        
        # Check consistency
        missing_in_domain = nlu_intents - domain_intents
        missing_in_nlu = domain_intents - nlu_intents
        
        if missing_in_domain:
            print(f"❌ Intents in NLU but missing in domain: {missing_in_domain}")
        
        if missing_in_nlu:
            print(f"⚠️  Intents in domain but missing in NLU: {missing_in_nlu}")
        
        if not missing_in_domain and not missing_in_nlu:
            print("✅ Domain and NLU intents are consistent")
        
        return len(missing_in_domain) == 0
        
    except Exception as e:
        print(f"❌ Error checking domain consistency: {e}")
        return False

def main():
    """Main validation function"""
    print("RASA DATA VALIDATION")
    print("=" * 50)
    
    # Change to chatbot directory
    chatbot_dir = r"d:\DATN\DATN\sun-movement-chatbot"
    if os.path.exists(chatbot_dir):
        os.chdir(chatbot_dir)
        print(f"Working directory: {os.getcwd()}")
    else:
        print(f"❌ Chatbot directory not found: {chatbot_dir}")
        return False
    
    # Run checks
    files_ok = check_files_exist()
    yaml_ok = validate_yaml_syntax()
    domain_ok = check_domain_consistency()
    
    print("\n" + "=" * 50)
    if files_ok and yaml_ok and domain_ok:
        print("✅ ALL CHECKS PASSED - Ready to train!")
        return True
    else:
        print("❌ SOME CHECKS FAILED - Please fix issues before training")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
