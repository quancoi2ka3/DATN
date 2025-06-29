# HƯỚNG DẪN GIẢI QUYẾT XUNG ĐỘT STORIES VÀ RULES TRONG RASA

## 1. Nguyên tắc cơ bản

Xung đột trong Rasa xảy ra khi một story và một rule có cùng một chuỗi intent (ý định người dùng) nhưng dự đoán các action khác nhau. Có một số quy tắc nên tuân theo:

- **Rules luôn có độ ưu tiên cao hơn Stories**
- Nếu một rule đã định nghĩa cho intent A, thì tất cả các stories chứa intent A phải tuân theo action được quy định trong rule
- Không nên đưa cùng intent vào nhiều rule khác nhau với các action khác nhau

## 2. Các xung đột phổ biến

### 2.1. Xung đột với intent `affirm` (xác nhận)

```yaml
# RULE:
- rule: Hỏi thêm trợ giúp khi người dùng đồng ý
  steps:
  - intent: affirm
  - action: utter_ask_more_help

# STORY CÓ XUNG ĐỘT:
- story: story_xung_dot
  steps:
  - intent: greet
  - action: utter_greet
  - intent: affirm
  - action: action_khac # XẢY RA XUNG ĐỘT!
```

### 2.2. Xung đột với intent `thank` (cảm ơn)

```yaml
# RULE:
- rule: Luôn cảm ơn khi người dùng cảm ơn
  steps:
  - intent: thank
  - action: utter_thank

# STORY CÓ XUNG ĐỘT:
- story: story_xung_dot
  steps: 
  - intent: thank
  - action: action_khac # XẢY RA XUNG ĐỘT!
```

## 3. Cách giải quyết

### 3.1. Phương pháp loại bỏ

Loại bỏ intent gây xung đột khỏi story và tạo story mới với luồng phù hợp. Ví dụ:

```yaml
# Thay vì:
- story: story_xung_dot
  steps:
  - intent: greet
  - action: utter_greet
  - intent: affirm
  - action: action_khac  # xung đột với rule

# Tách thành:
- story: story_khong_xung_dot
  steps:
  - intent: greet
  - action: utter_greet
  
# Và dựa vào rule để xử lý affirm
```

### 3.2. Phương pháp điều chỉnh rule

Nếu rule không phù hợp với hầu hết các trường hợp sử dụng, có thể cân nhắc điều chỉnh rule:

```yaml
# Thay đổi rule để phù hợp hơn:
- rule: Hỏi thêm trợ giúp khi người dùng đồng ý trong ngữ cảnh hỏi
  condition:
  # Thêm điều kiện ngữ cảnh
  - slot_was_set:
      - context: question
  steps:
  - intent: affirm
  - action: utter_ask_more_help
```

### 3.3. Phương pháp thêm ngữ cảnh

Thêm intent cụ thể hơn thay vì dùng intent chung chung:

```yaml
# Thay vì dùng intent: affirm chung chung
# Tạo intent cụ thể hơn: affirm_consultation, affirm_order, v.v.
```

## 4. Kiểm tra và sửa lỗi

Luôn chạy lệnh `rasa data validate` trước khi train model và kiểm tra kỹ các cảnh báo.

```bash
rasa data validate
```

Nếu xuất hiện lỗi tương tự:
```
InvalidRule: Contradicting rules or stories found
- the prediction of the action 'X' in story 'Y' is contradicting with rule(s) 'Z'
```

Hãy tìm và sửa story 'Y' để tuân theo quy tắc của rule 'Z'.

## 5. Tổng kết

- **Rules** nên được dùng cho các hành vi mặc định đơn giản, không phụ thuộc vào ngữ cảnh
- **Stories** nên dùng cho các cuộc hội thoại phức tạp, nhiều bước
- Nếu một intent đã có rule, hãy cẩn thận khi sử dụng trong stories
- Validate dữ liệu trước khi train để phát hiện xung đột sớm

Tài liệu tham khảo: https://rasa.com/docs/rasa/rules
