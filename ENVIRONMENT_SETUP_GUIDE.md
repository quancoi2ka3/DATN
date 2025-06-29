# Hướng dẫn Thiết lập Môi trường cho Dự án Sun Movement

Dự án này sử dụng Rasa cho chatbot và các công nghệ web khác cho backend/frontend. Dưới đây là hướng dẫn để thiết lập môi trường phát triển trên máy tính của bạn.

## 1. Thiết lập môi trường cho Chatbot (Rasa)

### Yêu cầu
- Python 3.10 (Khuyến nghị sử dụng phiên bản này để tránh xung đột)
- pip (được cài đặt cùng Python)
- virtualenv hoặc Anaconda (tùy chọn)

### Các bước thiết lập

#### Tạo môi trường ảo:
```bash
# Di chuyển đến thư mục chatbot
cd sun-movement-chatbot

# Tạo môi trường ảo với Python 3.10
python -m venv rasa_env_310
# HOẶC với anaconda
# conda create -n rasa_env_310 python=3.10

# Kích hoạt môi trường ảo
# Trên Windows
rasa_env_310\Scripts\activate
# Trên macOS/Linux
# source rasa_env_310/bin/activate
```

#### Cài đặt các gói phụ thuộc:
```bash
# Đảm bảo pip được cập nhật
pip install --upgrade pip

# Cài đặt Rasa và các phụ thuộc
pip install rasa==3.6.2
pip install rasa-sdk==3.6.1

# Nếu cần các gói bổ sung
pip install pandas scikit-learn
```

#### Kiểm tra cài đặt:
```bash
# Kiểm tra phiên bản Rasa
rasa --version
```

## 2. Khởi động Chatbot

```bash
# Trong thư mục sun-movement-chatbot với môi trường ảo đã kích hoạt:

# Khởi động Rasa server
rasa run --enable-api --cors "*" --port 5005

# Trong một terminal khác, khởi động action server
rasa run actions --port 5055
```

## 3. Thiết lập Môi trường cho Backend

```bash
# Di chuyển đến thư mục backend
cd sun-movement-backend

# Cài đặt các phụ thuộc
# Tùy thuộc vào nền tảng backend của bạn (Node.js, .NET, etc.)
# Ví dụ với Node.js:
npm install
```

## 4. Thiết lập Môi trường cho Frontend

```bash
# Di chuyển đến thư mục frontend
cd sun-movement-frontend

# Cài đặt các phụ thuộc
npm install

# Khởi động ứng dụng
npm start
```

## Lưu ý

- Không commit các thư mục môi trường ảo (rasa_env_310, venv, node_modules) lên GitHub
- Luôn cập nhật file .gitignore khi thêm các file/thư mục cần bỏ qua
- Sử dụng `requirements.txt` hoặc `package.json` để quản lý phụ thuộc thay vì commit toàn bộ thư mục môi trường

## Khắc phục sự cố

Nếu gặp lỗi khi cài đặt Rasa hoặc các phụ thuộc:

1. Kiểm tra phiên bản Python (phải là 3.10.x)
2. Đảm bảo đã cài đặt các công cụ build cần thiết
   - Windows: Visual C++ Build Tools
   - Linux: build-essential
3. Xem logs và tìm kiếm lỗi cụ thể
4. Tham khảo [tài liệu chính thức của Rasa](https://rasa.com/docs/rasa/installation/) để biết thêm chi tiết
