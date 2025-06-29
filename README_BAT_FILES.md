# HỆ THỐNG SUN MOVEMENT - HƯỚNG DẪN NHANH

## File Script Quản Lý Hệ Thống

Các file script (.bat) sau đây được sử dụng để quản lý hệ thống Sun Movement:

### Khởi động và dừng hệ thống

- **start-full-system.bat**: Khởi động đầy đủ hệ thống (Backend + Frontend + Chatbot + Action Server)
- **stop-all-services.bat**: Dừng tất cả các dịch vụ
- **restart-specific-service.bat**: Khởi động lại một dịch vụ cụ thể

### Quản lý chatbot

- **train-vietnamese-chatbot.bat**: Train lại chatbot tiếng Việt
- **start-action-server.bat**: Khởi động Rasa Action Server riêng biệt
- **create-dummy-data.bat**: Tạo dữ liệu mẫu cho chatbot
- **test-vietnamese-chatbot-advanced.bat**: Kiểm tra chatbot với các kịch bản nâng cao

### Khởi động thành phần riêng lẻ

- **start-backend-server.bat**: Khởi động backend

### Kiểm tra và sửa lỗi

- **check-system-status.bat**: Kiểm tra trạng thái hệ thống
- **check-rasa-status.bat**: Kiểm tra trạng thái Rasa
- **fix-rasa-503-error.bat**: Sửa lỗi 503 của Rasa

## Tài liệu hướng dẫn chi tiết

- [VIETNAMESE_CHATBOT_ADVANCED_GUIDE.md](./VIETNAMESE_CHATBOT_ADVANCED_GUIDE.md): Hướng dẫn chi tiết về quản lý và vận hành chatbot
- [VIETNAMESE_CHATBOT_INTEGRATION_COMPLETED.md](./VIETNAMESE_CHATBOT_INTEGRATION_COMPLETED.md): Thông tin về quá trình tích hợp chatbot
- [RASA_CHATBOT_INTEGRATION_GUIDE.md](./RASA_CHATBOT_INTEGRATION_GUIDE.md): Hướng dẫn tích hợp chatbot với frontend và backend
