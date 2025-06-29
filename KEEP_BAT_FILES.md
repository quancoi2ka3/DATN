# DANH SÁCH CÁC FILE .BAT CẦN GIỮ LẠI

## File khởi động và dừng hệ thống chính
- start-full-system.bat               # Khởi động đầy đủ hệ thống (Backend, Frontend, Chatbot, Action Server)
- stop-all-services.bat               # Dừng tất cả các dịch vụ
- restart-specific-service.bat        # Khởi động lại một dịch vụ cụ thể

## File quản lý chatbot Rasa
- start-action-server.bat             # Khởi động Rasa Action Server
- train-vietnamese-chatbot.bat        # Train lại chatbot tiếng Việt
- create-dummy-data.bat               # Tạo dữ liệu mẫu cho chatbot
- test-vietnamese-chatbot-advanced.bat # Kiểm tra chatbot với các kịch bản nâng cao

## File khởi động thành phần riêng lẻ (cần thiết cho việc debug riêng từng thành phần)
- start-backend-server.bat            # Khởi động backend
- check-system-status.bat             # Kiểm tra trạng thái hệ thống

## File hỗ trợ quan trọng
- fix-rasa-503-error.bat              # Sửa lỗi 503 của Rasa
- check-rasa-status.bat               # Kiểm tra trạng thái Rasa
