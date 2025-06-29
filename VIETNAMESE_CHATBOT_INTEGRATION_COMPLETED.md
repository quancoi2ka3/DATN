# NĂng cấp Chatbot Rasa Sun Movement - Tiếng Việt và Tích hợp dữ liệu backend

## Tổng quan

Tài liệu này mô tả các nâng cấp đã thực hiện để cải thiện chatbot Rasa của Sun Movement:

1. **Hỗ trợ hoàn toàn tiếng Việt** - Chatbot giờ chỉ giao tiếp bằng tiếng Việt và từ chối trả lời các câu hỏi tiếng Anh
2. **Hiểu ngữ cảnh tốt hơn** - Đã mở rộng và đa dạng hóa các intent, entities, examples, stories và rules
3. **Tích hợp dữ liệu backend** - Kết nối với dữ liệu sản phẩm, dịch vụ và FAQ từ backend
4. **Tự động hóa quy trình** - Các script hỗ trợ train, test, vận hành và debug hệ thống

## Cấu trúc dự án

```
sun-movement-chatbot/
├── actions/
│   ├── __init__.py
│   └── actions.py          # Custom actions kết nối với backend
├── data/
│   ├── nlu.yml             # Intent và examples tiếng Việt
│   ├── stories.yml         # Các kịch bản hội thoại
│   ├── rules.yml           # Quy tắc phản hồi
│   └── dummy_data/         # Dữ liệu mẫu cho testing
│       ├── products.json
│       ├── services.json
│       └── faqs.json
├── config.yml              # Cấu hình NLU pipeline cho tiếng Việt
├── domain.yml              # Định nghĩa intent, entities, slots, responses
├── endpoints.yml           # Kết nối với Action Server
└── models/                 # Thư mục chứa model đã train
```

## Các custom action đã triển khai

1. **action_search_product**: Tìm kiếm sản phẩm theo tên hoặc danh mục
2. **action_check_order**: Kiểm tra tình trạng đơn hàng
3. **action_get_faq**: Trả lời câu hỏi thường gặp từ dữ liệu backend
4. **action_get_service_info**: Cung cấp thông tin chi tiết về dịch vụ
5. **action_check_product_availability**: Kiểm tra tình trạng tồn kho sản phẩm
6. **action_reject_english**: Từ chối trả lời khi người dùng hỏi bằng tiếng Anh

## Quy trình tích hợp dữ liệu backend

Các custom action đã được thiết kế để tương tác với backend thông qua REST API:

1. **Dữ liệu sản phẩm**: `/api/products` và `/api/products/search?q={query}`
2. **Dữ liệu dịch vụ**: `/api/services` và `/api/services/search?name={name}`
3. **Dữ liệu FAQ**: `/api/faqs/search` (POST với query parameter)

Trong trường hợp không kết nối được với backend, các action sẽ sử dụng dữ liệu mẫu từ thư mục `dummy_data` để đảm bảo chatbot vẫn hoạt động.

## Các script hỗ trợ

1. **start-full-system.bat**: Khởi động toàn bộ hệ thống (Backend + Frontend + Chatbot + Action Server)
2. **stop-all-services.bat**: Dừng tất cả các dịch vụ
3. **train-vietnamese-chatbot.bat**: Train lại model chatbot tiếng Việt
4. **start-action-server.bat**: Khởi động riêng action server
5. **test-vietnamese-chatbot-advanced.bat**: Kiểm tra các kịch bản hội thoại nâng cao
6. **create-dummy-data.bat**: Tạo dữ liệu mẫu cho testing

## Hướng dẫn vận hành

### Khởi động hệ thống

```batch
start-full-system.bat
```

### Dừng hệ thống

```batch
stop-all-services.bat
```

### Train lại model

```batch
train-vietnamese-chatbot.bat
```

### Kiểm tra chatbot

```batch
test-vietnamese-chatbot-advanced.bat
```

## Hướng dẫn mở rộng

### Thêm intent mới

1. Thêm intent vào `domain.yml`
2. Thêm ví dụ cho intent trong `data/nlu.yml`
3. Cập nhật rules hoặc stories

### Thêm custom action mới

1. Thêm class action mới trong `actions/actions.py`
2. Đăng ký action trong `domain.yml`
3. Cập nhật rules hoặc stories để kích hoạt action

### Thêm dữ liệu mới

1. Thêm dữ liệu mẫu vào `data/dummy_data/`
2. Cập nhật custom action để sử dụng dữ liệu mới
3. Cập nhật API endpoint trong các custom action

## Lưu ý quan trọng

1. **Ưu tiên tiếng Việt**: Chatbot đã được cấu hình để chỉ phản hồi các câu hỏi tiếng Việt
2. **Tích hợp dữ liệu động**: Action server sẽ kết nối với backend API hoặc sử dụng dữ liệu mẫu khi cần
3. **Logging**: Các custom action đã được thêm logging để dễ dàng debug
4. **Bộ nhớ ngữ cảnh**: Sử dụng slots để lưu trữ thông tin giữa các lượt hội thoại

## Tài liệu tham khảo

- [VIETNAMESE_CHATBOT_ADVANCED_GUIDE.md](d:\DATN\DATN\VIETNAMESE_CHATBOT_ADVANCED_GUIDE.md): Hướng dẫn chi tiết về quản lý và vận hành chatbot
- [RASA_CHATBOT_INTEGRATION_GUIDE.md](d:\DATN\DATN\RASA_CHATBOT_INTEGRATION_GUIDE.md): Hướng dẫn tích hợp chatbot với frontend và backend
