# Hướng Dẫn Sửa Lỗi Chatbot

## Vấn Đề Đã Gặp

Trong quá trình triển khai chatbot, đã gặp các lỗi sau khi train mô hình:
```
Contradicting rules or stories found:
- Mâu thuẫn giữa utter_ask_more_help và action_listen sau intent thank
- Mâu thuẫn giữa nhiều rules cho cùng một intent (nutrition_advice, workout_plan, service_info)
```

## Giải Pháp Đã Thực Hiện

### 1. Sửa lỗi trong Stories
- Đã xóa bỏ action `utter_ask_more_help` sau action `utter_thank` trong stories
- Cập nhật các stories để tuân theo quy tắc của Rasa về trình tự actions

### 2. Giải quyết xung đột trong Rules
- Xóa bỏ các rules trùng lặp cho cùng một intent
- Giữ lại một phiên bản duy nhất của rule cho mỗi intent
- Ưu tiên các custom actions (action_get_*) thay vì utter responses trực tiếp

### 3. Sửa lỗi cú pháp YAML
- Đã xóa bỏ các phần YAML không hợp lệ trong file domain.yml
- Sửa các lỗi định dạng để đảm bảo file hợp lệ

## Cấu Trúc Rules Mới
- `nutrition_advice` -> `action_get_nutrition_info`
- `workout_plan` -> `action_get_workout_plan`
- `service_info` -> `action_get_service_info`

## Cách Chạy Lại Chatbot
1. Sử dụng file `fixed-retrain-enhanced-chatbot.bat` để huấn luyện và khởi động lại chatbot
2. Kiểm tra kết quả bằng cách tương tác với chatbot qua API hoặc frontend

## Lưu Ý Quan Trọng
- Khi thêm mới rules hoặc stories, cần đảm bảo không tạo ra mâu thuẫn với các rules/stories hiện có
- Mỗi intent chỉ nên được xử lý bởi một action (hoặc utter) duy nhất trong rules
- Trong stories có thể linh hoạt hơn, nhưng cần tuân thủ trình tự hợp lý
