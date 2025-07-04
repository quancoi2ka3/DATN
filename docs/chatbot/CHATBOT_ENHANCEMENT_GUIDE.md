# Sun Movement Chatbot - Hướng Dẫn Triển Khai và Sử Dụng

## Giới Thiệu

Chatbot Sun Movement đã được cập nhật toàn diện với dữ liệu thực tế từ dự án, tập trung vào tối ưu hóa SEO và trải nghiệm người dùng. Chatbot hỗ trợ tìm kiếm thông tin về sản phẩm, dịch vụ, dinh dưỡng và lịch tập luyện.

## Các Tính Năng Chính

1. **Tìm kiếm Sản phẩm**: Tìm kiếm sản phẩm theo tên, danh mục hoặc mô tả
2. **Thông tin Dịch vụ**: Cung cấp chi tiết về các dịch vụ có sẵn
3. **Kế hoạch Dinh dưỡng**: Tư vấn dinh dưỡng theo mục tiêu người dùng
4. **Kế hoạch Tập luyện**: Đề xuất lịch tập dựa trên mục tiêu và cấp độ

## Dữ Liệu Thực Tế Được Sử Dụng

Chatbot sử dụng dữ liệu thực tế từ các file JSON:
- `products.json`: Danh sách sản phẩm
- `services.json`: Thông tin dịch vụ
- `nutrition.json`: Kế hoạch dinh dưỡng
- `workout.json`: Lịch tập luyện

## Cách Khởi Động Chatbot

1. Sử dụng file `retrain-enhanced-chatbot.bat` để huấn luyện lại và khởi động chatbot
2. Hoặc chạy từng lệnh:
   ```bash
   # Huấn luyện model
   cd D:\DATN\DATN\sun-movement-chatbot
   rasa train
   
   # Khởi động action server
   rasa run actions
   
   # Khởi động Rasa server
   rasa run --enable-api --cors "*"
   ```

## Các Cải Tiến SEO

1. **Tích hợp từ khóa**: Đã thêm từ khóa SEO vào responses của chatbot
2. **Liên kết nội bộ**: Thêm links đến trang web chính thức trong responses
3. **Nội dung chuyên sâu**: Cung cấp thông tin chi tiết về sản phẩm, dinh dưỡng, tập luyện
4. **Tối ưu trải nghiệm**: Cải thiện cách hiển thị thông tin và CTA

## Custom Actions

1. `action_search_product`: Tìm kiếm sản phẩm từ dữ liệu thực
2. `action_get_service_info`: Cung cấp thông tin dịch vụ
3. `action_get_nutrition_info`: Tư vấn kế hoạch dinh dưỡng
4. `action_get_workout_plan`: Đề xuất lịch tập luyện

## Các Intent và Entities Chính

### Intent
- `search_product`: Tìm kiếm sản phẩm
- `service_info`: Tìm thông tin dịch vụ
- `nutrition_advice`: Tư vấn dinh dưỡng
- `workout_plan`: Kế hoạch tập luyện

### Entities
- `product`, `product_category`: Sản phẩm và danh mục sản phẩm
- `service`, `service_type`: Dịch vụ và loại dịch vụ
- `nutrition_goal`: Mục tiêu dinh dưỡng
- `workout_goal`, `experience_level`: Mục tiêu tập luyện và cấp độ kinh nghiệm

## Lưu ý Quan Trọng

1. Chatbot sử dụng **dữ liệu thực tế** từ dự án
2. Các đường dẫn và thông tin sản phẩm được lấy từ cấu trúc backend thực tế
3. Mọi thay đổi cần đảm bảo tính nhất quán với dữ liệu từ backend

## Hướng Dẫn Test

1. Test tìm kiếm sản phẩm: "Tôi muốn tìm whey protein"
2. Test tư vấn dinh dưỡng: "Tôi cần chế độ ăn để tăng cơ"
3. Test kế hoạch tập luyện: "Cho tôi lịch tập giảm cân"
4. Test thông tin dịch vụ: "Thông tin về lớp yoga"

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề hoặc cần hỗ trợ thêm, vui lòng liên hệ qua email: [contact@sunmovement.vn](mailto:contact@sunmovement.vn)
