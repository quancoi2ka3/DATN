# HƯỚNG DẪN SỬ DỤNG CHATBOT TIẾNG VIỆT CHO SUN MOVEMENT

## Giới thiệu

Chatbot tiếng Việt của Sun Movement là trợ lý ảo thông minh được thiết kế để hỗ trợ khách hàng với nhiều chức năng, từ tư vấn sản phẩm đến cung cấp thông tin về dịch vụ, giá cả và chính sách của cửa hàng. Chatbot được tối ưu hóa để trò chuyện hoàn toàn bằng tiếng Việt, với khả năng hiểu ngữ cảnh và cung cấp thông tin chính xác, đa dạng.

## Các chức năng chính

Chatbot có khả năng trả lời các loại câu hỏi sau:

1. **Chào hỏi và tương tác cơ bản**
   - Chào hỏi, cảm ơn, tạm biệt
   - Hỏi về khả năng của chatbot

2. **Tư vấn sản phẩm**
   - Thông tin về các loại sản phẩm
   - Tìm kiếm sản phẩm theo nhu cầu
   - Giá cả và khuyến mãi

3. **Thông tin về cửa hàng**
   - Vị trí và giờ mở cửa
   - Phương thức thanh toán
   - Chính sách giao hàng và đổi trả

4. **Dịch vụ huấn luyện**
   - Thông tin về PT (Huấn luyện viên cá nhân)
   - Giá cả và các gói tập

5. **Tư vấn sức khỏe**
   - Dinh dưỡng cho người tập luyện
   - Lịch tập luyện theo mục tiêu

## Các câu lệnh và ngữ cảnh mẫu

### 1. Tương tác cơ bản

- "Xin chào" / "Chào shop" / "Có ai ở đó không"
- "Cảm ơn bạn" / "Cảm ơn đã tư vấn"
- "Tạm biệt" / "Hẹn gặp lại"

### 2. Hỏi về khả năng của chatbot

- "Bạn có thể làm gì?"
- "Bạn giúp được gì cho tôi"
- "Bạn là ai?"

### 3. Tư vấn sản phẩm

- "Tôi cần mua quần áo tập gym"
- "Tư vấn về thực phẩm bổ sung"
- "Sản phẩm nào tốt cho người mới tập?"
- "Nên mua loại whey protein nào?"

### 4. Tìm kiếm và giá cả

- "Tìm giày chạy bộ"
- "Giá của whey protein là bao nhiêu?"
- "Có khuyến mãi gì không?"

### 5. Chính sách và dịch vụ

- "Chính sách đổi trả như thế nào?"
- "Phí vận chuyển là bao nhiêu?"
- "Phương thức thanh toán nào được chấp nhận?"
- "Cửa hàng ở đâu?"

### 6. Dịch vụ huấn luyện

- "Tôi cần tìm PT"
- "Giá dịch vụ PT là bao nhiêu?"
- "Có PT cho người mới tập không?"

### 7. Tư vấn tập luyện và dinh dưỡng

- "Tư vấn chế độ ăn tăng cơ"
- "Lịch tập cho người mới"
- "Nên ăn gì sau khi tập?"

## Cách train và cải thiện chatbot

### Train model mới

Để train model mới sau khi chỉnh sửa dữ liệu:

1. Chạy file `train-vietnamese-chatbot.bat`
2. Đợi quá trình train hoàn tất
3. Khởi động lại chatbot bằng `start-fixed-rasa-chatbot.bat`

### Cải thiện dữ liệu

Nếu bạn muốn cải thiện chatbot, bạn có thể chỉnh sửa các file sau:

1. **nlu.yml** - Thêm intent và examples
   - Mỗi intent thể hiện một ý định của người dùng
   - Thêm nhiều examples để chatbot hiểu được đa dạng cách diễn đạt

2. **domain.yml** - Thêm responses
   - Đa dạng hóa responses để chatbot không bị lặp lại
   - Thêm mới các loại responses cần thiết

3. **stories.yml** - Thêm luồng hội thoại
   - Tạo ra các luồng hội thoại đa dạng
   - Đảm bảo luồng hội thoại theo logic tự nhiên

4. **rules.yml** - Thêm các quy tắc cố định
   - Quy tắc cho các hành động nhất định phải xảy ra
   - Thận trọng để tránh xung đột với stories

### Kiểm tra chất lượng

Sau khi train, bạn nên kiểm tra chất lượng chatbot bằng cách:

1. Chạy `test-chatbot-scenarios.bat` để kiểm tra các kịch bản cơ bản
2. Thử nghiệm trực tiếp trên website
3. Thu thập phản hồi từ người dùng thật và cải thiện dần dần

## Lưu ý quan trọng

1. **Tiếng Việt có dấu**: Luôn sử dụng tiếng Việt có dấu trong examples và responses
2. **Đa dạng cách diễn đạt**: Thêm nhiều cách diễn đạt khác nhau cho cùng một ý
3. **Không xung đột**: Đảm bảo không có xung đột giữa rules và stories
4. **Hậu kỳ**: Sau khi train, nên kiểm tra lỗi và hiệu chỉnh dữ liệu

## Hỗ trợ

Nếu gặp khó khăn trong quá trình sử dụng hay phát triển chatbot, vui lòng liên hệ đội phát triển qua email: support@sunmovement.vn
