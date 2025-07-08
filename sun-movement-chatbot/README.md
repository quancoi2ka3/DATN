# Sun Movement Chatbot

Đây là mã nguồn chatbot dựa trên Rasa cho hệ thống Sun Movement. Chatbot này hỗ trợ giao tiếp bằng tiếng Việt và được thiết kế để trả lời các câu hỏi về sản phẩm, dịch vụ và chính sách của Sun Movement.

## Cấu trúc thư mục

- `actions/`: Chứa các custom actions của Rasa
- `data/`: Chứa dữ liệu huấn luyện (nlu, stories, rules)
- `models/`: Chứa các model đã được huấn luyện (không được commit lên GitHub)
- `tests/`: Chứa các test case
- `config.yml`: File cấu hình Rasa
- `domain.yml`: File định nghĩa domain cho Rasa
- `credentials.yml`: Cấu hình xác thực cho các kênh tích hợp
- `endpoints.yml`: Cấu hình endpoints cho Rasa
- `requirements.txt`: Danh sách các thư viện cần thiết

## Thiết lập môi trường

### Sử dụng script tự động

Chạy script `setup-rasa-environment.bat` từ thư mục gốc của dự án:

```bash
cd /path/to/DATN
./setup-rasa-environment.bat
```

### Thiết lập thủ công

1. Tạo môi trường ảo Python 3.10:
   ```bash
   python -m venv rasa_env_310
   ```

2. Kích hoạt môi trường ảo:
   ```bash
   # Windows
   rasa_env_310\Scripts\activate
   
   # Linux/Mac
   source rasa_env_310/bin/activate
   ```

3. Cài đặt các phụ thuộc:
   ```bash
   pip install -r requirements.txt
   ```

## Huấn luyện model

```bash
# Kích hoạt môi trường nếu chưa
rasa_env_310\Scripts\activate

# Huấn luyện model
rasa train
```

## Chạy chatbot

```bash
# Chạy Rasa server

rasa run --enable-api --cors "*" --port 5005
# Trong một terminal khác, chạy action server
rasa run actions --port 5055
```

## Kiểm tra chatbot

```bash
# Tương tác với chatbot qua terminal
rasa shell
```

## Câu hỏi thường gặp

1. **Lỗi thiếu thư viện khi cài đặt Rasa**
   
   Một số thư viện như tensorflow có thể yêu cầu các công cụ build. Đảm bảo bạn đã cài đặt các công cụ build cần thiết cho hệ điều hành của mình.

2. **Lỗi khi huấn luyện model**
   
   Đảm bảo bạn đang sử dụng Python 3.10 và đã cài đặt đầy đủ các thư viện trong requirements.txt.

3. **Chatbot không hiểu tiếng Việt**
   
   Đảm bảo các thư viện xử lý ngôn ngữ tiếng Việt như pyvi và underthesea đã được cài đặt đúng cách.
