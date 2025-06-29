# Hướng Dẫn Tích Hợp Rasa Chatbot với Website Sun Movement

Tài liệu này hướng dẫn cách tích hợp và cấu hình Rasa Chatbot với website Sun Movement.

## Các thành phần đã tích hợp

1. **Widget trò chuyện Rasa**: Một widget trò chuyện đã được thêm vào trang web, thay thế cho nút liên hệ Messenger cũ.
2. **API Proxy**: Một API proxy đã được tạo để kết nối frontend với Rasa server.
3. **Xử lý lỗi**: Hệ thống xử lý lỗi khi Rasa server không khả dụng.
4. **Script khởi động**: Một script để khởi động đồng thời cả Rasa server và frontend.

## Cài đặt và Chạy

### Cách 1: Sử dụng script tự động (Khuyến nghị)

1. Chạy script `start-website-with-chatbot.bat`:
   ```
   d:\DATN\DATN\start-website-with-chatbot.bat
   ```
   
   Script này sẽ khởi động:
   - Rasa API Server (cổng 5005)
   - Rasa Action Server (cổng 5055)
   - Next.js Frontend (cổng 3000)

2. Truy cập website tại: http://localhost:3000

### Cách 2: Khởi động thủ công

1. Khởi động Rasa server:
   ```
   cd d:\DATN\DATN\sun-movement-chatbot
   rasa_env_310\Scripts\activate
   rasa run --cors "*" --enable-api -p 5005
   ```

2. Khởi động Rasa Action server trong một terminal khác:
   ```
   cd d:\DATN\DATN\sun-movement-chatbot
   rasa_env_310\Scripts\activate
   rasa run actions
   ```

3. Khởi động frontend:
   ```
   cd d:\DATN\DATN\sun-movement-frontend
   npm run dev
   ```

4. Truy cập website tại: http://localhost:3000

## Cấu trúc Mã Nguồn

### Frontend Components

- `src/components/ui/rasa-chatbot.tsx`: Widget trò chuyện Rasa
- `src/components/ui/chatbot-error-handler.tsx`: Xử lý lỗi khi không kết nối được với Rasa

### API Routes

- `src/app/api/chatbot/route.ts`: Proxy API cho Rasa Webhook
- `src/app/api/chatbot/status/route.ts`: API kiểm tra trạng thái Rasa server

## Tùy chỉnh và Cấu hình

### Thay đổi giao diện chatbot

Bạn có thể điều chỉnh giao diện chatbot trong file `src/components/ui/rasa-chatbot.tsx`.

### Thay đổi cổng của Rasa server

Nếu bạn muốn thay đổi cổng của Rasa server, bạn cần cập nhật:

1. Trong file `sun-movement-chatbot/start-chatbot.bat`
2. Trong API Proxy: `src/app/api/chatbot/route.ts`
3. Trong status check API: `src/app/api/chatbot/status/route.ts`

## Xử lý Sự cố

### Chatbot không phản hồi

1. Kiểm tra Rasa server có đang chạy không:
   - Truy cập http://localhost:5005/health

2. Kiểm tra kết nối frontend với Rasa server:
   - Truy cập http://localhost:3000/api/chatbot/status

3. Kiểm tra logs trong console của trình duyệt.

### Vấn đề cấu hình Rasa

Nếu có vấn đề với bot Rasa, kiểm tra các file cấu hình trong thư mục `sun-movement-chatbot`:
- `domain.yml`: Cấu hình domain của bot
- `config.yml`: Cấu hình model và pipeline
- `endpoints.yml`: Cấu hình endpoint
- `credentials.yml`: Cấu hình kết nối

## Triển khai Production

Để triển khai lên môi trường production:

1. Cập nhật URL Rasa server trong các API route:
   - `src/app/api/chatbot/route.ts`
   - `src/app/api/chatbot/status/route.ts`

2. Đảm bảo Rasa server được cấu hình đúng CORS trong production:
   ```
   rasa run --cors "*" --enable-api -p 5005
   ```

3. Tạo một script khởi động cho môi trường production.

## Đảm bảo an toàn

Trong môi trường production, bạn nên:

1. Giới hạn CORS chỉ cho domain chính thức.
2. Thêm xác thực cho Rasa API (nếu cần).
3. Sử dụng HTTPS cho cả frontend và Rasa server.
