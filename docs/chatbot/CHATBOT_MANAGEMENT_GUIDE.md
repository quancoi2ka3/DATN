# HƯỚNG DẪN QUẢN LÝ CHATBOT TIẾNG VIỆT CHO SUN MOVEMENT

## Giới thiệu

Tài liệu này cung cấp hướng dẫn đầy đủ về cách quản lý, vận hành và phát triển chatbot tiếng Việt tích hợp vào website Sun Movement.

## Các script quản lý

| Script | Chức năng |
|--------|-----------|
| `stop-and-train-rasa.bat` | Dừng tiến trình Rasa, validate data và train model mới |
| `start-fixed-rasa-chatbot.bat` | Khởi động Rasa server với model mới đã sửa xung đột |
| `check-chatbot-conflicts.bat` | Kiểm tra xung đột giữa rules và stories |
| `test-chatbot-scenarios.bat` | Kiểm thử nhanh các kịch bản hội thoại |

## Quy trình phát triển

1. **Kiểm tra cấu trúc dữ liệu hiện có**
   - File nlu.yml: Chứa các intent và examples
   - File domain.yml: Chứa các intent, entities, responses
   - File stories.yml: Chứa các luồng hội thoại
   - File rules.yml: Chứa các quy tắc cố định

2. **Thêm intent và examples**
   - Mở file nlu.yml
   - Thêm intent mới hoặc examples cho intent hiện có
   - Lưu ý sử dụng tiếng Việt có dấu

3. **Thêm responses**
   - Mở file domain.yml
   - Thêm responses mới trong mục responses
   - Nếu thêm intent mới, nhớ thêm vào mục intents

4. **Thêm luồng hội thoại**
   - Mở file stories.yml
   - Thêm story mới hoặc chỉnh sửa story hiện có
   - **Quan trọng**: Tuân thủ các quy tắc trong rules.yml
   - Tránh xung đột giữa rules và stories

5. **Train model**
   - Chạy script stop-and-train-rasa.bat
   - Kiểm tra các lỗi và cảnh báo
   - Sửa xung đột nếu cần

6. **Test chatbot**
   - Chạy script start-fixed-rasa-chatbot.bat để khởi động server
   - Chạy script test-chatbot-scenarios.bat để test các kịch bản
   - Hoặc test bằng website frontend

## Xử lý xung đột Rules vs Stories

Đây là lỗi thường gặp nhất khi phát triển Rasa chatbot. Xung đột xảy ra khi:

1. Một intent có rule riêng nhưng được sử dụng trong stories với action khác
2. Một intent xuất hiện trong nhiều rules với các action khác nhau

**Cách giải quyết:**
- Xem chi tiết trong file RASA_CONFLICT_RESOLUTION_GUIDE.md
- Sử dụng script check-chatbot-conflicts.bat để kiểm tra
- Điều chỉnh stories để tuân theo rules

## Cách định nghĩa ý định hội thoại

**Quy trình thêm intent mới:**

1. Thêm intent và ví dụ vào nlu.yml:
   ```yaml
   - intent: product_consultation
     examples: |
       - tư vấn sản phẩm
       - giúp tôi chọn sản phẩm
       - nên mua sản phẩm nào
   ```

2. Thêm intent vào domain.yml:
   ```yaml
   intents:
     - product_consultation
   ```

3. Thêm response vào domain.yml:
   ```yaml
   responses:
     utter_product_consultation:
       - text: "Tôi có thể tư vấn cho bạn về các sản phẩm."
   ```

4. Thêm rule vào rules.yml:
   ```yaml
   - rule: Cung cấp tư vấn sản phẩm
     steps:
     - intent: product_consultation
     - action: utter_product_consultation
   ```

5. Thêm vào story nếu cần, tuân thủ rules:
   ```yaml
   - story: tư vấn sản phẩm và cảm ơn
     steps:
     - intent: product_consultation
     - action: utter_product_consultation
     - intent: thank
     - action: utter_thank
   ```

## Liên hệ hỗ trợ

Nếu có vấn đề phức tạp, hãy xem tài liệu chính thức của Rasa tại https://rasa.com/docs/
