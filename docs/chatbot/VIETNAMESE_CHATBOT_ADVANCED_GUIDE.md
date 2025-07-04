# HƯỚNG DẪN QUẢN LÝ VÀ VẬN HÀNH CHATBOT TIẾNG VIỆT SUN MOVEMENT

## TỔNG QUAN

Hệ thống chatbot Rasa của Sun Movement đã được nâng cấp để:
- Giao tiếp hoàn toàn bằng tiếng Việt
- Hiểu ngữ cảnh và đa dạng hội thoại
- Từ chối trả lời các câu hỏi bằng tiếng Anh
- Tích hợp với dữ liệu động từ backend về sản phẩm, dịch vụ và FAQs

## CÁC THÀNH PHẦN CHÍNH

1. **Rasa Core & NLU**: Xử lý hiểu ngôn ngữ tự nhiên và quản lý hội thoại
2. **Action Server**: Xử lý các tương tác phức tạp và tích hợp với backend
3. **Frontend Integration**: Tích hợp chatbot vào giao diện người dùng

## QUY TRÌNH VẬN HÀNH

### 1. Khởi động hệ thống

Để khởi động toàn bộ hệ thống (bao gồm backend, frontend và chatbot):
```
start-full-system.bat
```

Để chỉ khởi động chatbot và action server:
```
start-chatbot-only.bat
start-action-server.bat
```

### 2. Huấn luyện lại chatbot

Khi có thay đổi về dữ liệu đầu vào hoặc cấu hình:
```
train-vietnamese-chatbot.bat
```

### 3. Kiểm tra hoạt động

Sau khi khởi động hoặc huấn luyện lại:
```
test-chatbot-scenarios.bat
test-vietnamese-chatbot-advanced.bat
```

### 4. Dừng hệ thống

Để dừng toàn bộ hệ thống:
```
stop-all-services.bat
```

## CẤU TRÚC DỮ LIỆU CHATBOT

### 1. Dữ liệu NLU

- **intents**: Xác định ý định của người dùng (nlu.yml)
  - greet, goodbye, thank, search_product, product_info, ...

- **entities**: Trích xuất thông tin cụ thể (nlu.yml)
  - product, product_category, order_id

- **slots**: Lưu trữ thông tin trong hội thoại (domain.yml)
  - product, product_category, order_id

### 2. Cấu trúc hội thoại

- **stories**: Mẫu hội thoại nhiều bước (stories.yml)
- **rules**: Phản ứng đơn giản với intent (rules.yml)

### 3. Hành động

- **responses**: Phản hồi đơn giản (domain.yml)
  - utter_greet, utter_goodbye, ...

- **custom actions**: Hành động phức tạp (actions.py)
  - action_search_product, action_get_product_info, ...

## HƯỚNG DẪN MỞ RỘNG

### 1. Thêm intent mới

1. Thêm intent mới vào `domain.yml`
2. Thêm ví dụ cho intent trong `data/nlu.yml`
3. Thêm rule hoặc story trong `data/rules.yml` hoặc `data/stories.yml`
4. Thêm response hoặc custom action

### 2. Thêm custom action

1. Thêm action mới trong `actions/actions.py`
2. Đăng ký action trong `domain.yml`
3. Thêm rule hoặc story để kích hoạt action

### 3. Tích hợp dữ liệu mới

1. Xác định nguồn dữ liệu trong backend (API)
2. Cập nhật custom actions để truy vấn dữ liệu
3. Cập nhật format phản hồi để hiển thị dữ liệu

## XỬ LÝ SỰ CỐ

### 1. Lỗi kết nối

- Kiểm tra cổng 5005 (Rasa server) và 5055 (Action server)
- Sử dụng `check-system-status.bat` để xác định vấn đề

### 2. Lỗi huấn luyện

- Kiểm tra lỗi cấu hình với `rasa data validate`
- Xóa cache với tùy chọn trong `train-vietnamese-chatbot.bat`

### 3. Lỗi nhận dạng intent

- Thêm nhiều ví dụ đa dạng cho intent trong `nlu.yml`
- Điều chỉnh ngưỡng độ tin cậy trong `config.yml`

### 4. Lỗi tích hợp backend

- Kiểm tra URL và format API trong `actions/actions.py`
- Sử dụng try-catch và logging để ghi nhận lỗi

## HƯỚNG DẪN NÂNG CẤP

### 1. Cải thiện hiểu ngôn ngữ

- Thêm nhiều ví dụ đa dạng cho mỗi intent
- Cân nhắc sử dụng pre-trained Vietnamese embeddings

### 2. Mở rộng tích hợp dữ liệu

- Tích hợp với thêm nhiều API backend
- Xem xét trích xuất thông tin từ cơ sở dữ liệu

### 3. Cải thiện trải nghiệm người dùng

- Thêm rich responses (hình ảnh, nút, carousel)
- Cải thiện bộ nhớ ngữ cảnh qua các phiên hội thoại

## GIÁM SÁT VÀ ĐÁNH GIÁ

### 1. Theo dõi hoạt động

- Kiểm tra logs trong thư mục `logs`
- Sử dụng `check-chatbot-performance.bat` để xem thống kê

### 2. Thu thập phản hồi

- Xem xét thêm cơ chế đánh giá từ người dùng
- Lưu các hội thoại thất bại để phân tích

## LIÊN HỆ HỖ TRỢ

Nếu cần hỗ trợ thêm, vui lòng liên hệ:
- Email: support@sunmovement.vn
- Điện thoại: 1900 6789
