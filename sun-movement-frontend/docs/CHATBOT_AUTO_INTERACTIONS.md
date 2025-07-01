# Tính Năng Tương Tác Chatbot Tự Động - Sun Movement

Tài liệu này mô tả tính năng tương tác tự động của chatbot trên website Sun Movement.

## Tổng Quan

Chatbot Sun Movement đã được nâng cấp với các tính năng tương tác chủ động để thu hút sự chú ý của khách hàng và cung cấp hỗ trợ kịp thời. Thay vì chỉ hiển thị biểu tượng robot thụ động, chatbot giờ đây sẽ chủ động gợi ý và tương tác với người dùng theo các cách sau:

## Tính Năng Chính

### 1. Tin Nhắn Gợi Ý Định Kỳ (30 giây)

- Mỗi 30 giây, chatbot sẽ hiển thị một bong bóng tin nhắn với các gợi ý hữu ích
- Gợi ý sẽ luân phiên giữa các chủ đề khác nhau như khóa học, sản phẩm, khuyến mãi...
- Người dùng có thể đóng gợi ý hoặc click vào chatbot để bắt đầu tương tác

### 2. Gợi Ý Nhanh Trong Chat

- Khi mở chatbot, người dùng thấy ngay các nút gợi ý nhanh để chọn
- Giúp người dùng biết được chatbot có thể giúp gì mà không cần tự nhập
- Tăng tỉ lệ tương tác bằng cách giảm rào cản nhập liệu

## Danh Sách Gợi Ý

### Bong Bóng Gợi Ý 30 Giây

1. 👋 Bạn cần hỗ trợ gì không?
2. 🏋️‍♂️ Khám phá các gói tập luyện của chúng tôi?
3. 💪 Bạn muốn biết thêm về các khóa học Calisthenics?
4. 🧘‍♀️ Lịch học Yoga tuần này có nhiều giờ mới!
5. 👟 Bạn đã xem bộ sưu tập sportswear mới chưa?
6. 🥤 Bạn cần tư vấn về các sản phẩm supplements?
7. 🎯 Đặt lịch tập thử miễn phí ngay hôm nay!
8. 📅 Có sự kiện đặc biệt vào cuối tuần này!
9. ⏰ Đừng bỏ lỡ ưu đãi giảm 20% khi đăng ký hôm nay!
10. 🔥 Bạn muốn tìm hiểu về chương trình giảm cân không?
11. 🍎 Hãy hỏi tôi về chế độ dinh dưỡng phù hợp nhé!

### Gợi Ý Nhanh Trong Chat

1. Đăng ký tập thử miễn phí
2. Giá các gói tập
3. Lịch học Yoga
4. Giờ mở cửa
5. Các khóa học Calisthenics
6. Sản phẩm bổ sung dinh dưỡng

## Các Yếu Tố Thiết Kế

- **Thời gian hiển thị**: Tin nhắn đầu tiên xuất hiện sau 10 giây khi người dùng vào trang, sau đó cứ mỗi 30 giây sẽ hiển thị một tin nhắn mới
- **Animation**: Các gợi ý có hiệu ứng nổi lên và nhấp nhô nhẹ để thu hút sự chú ý
- **Khả năng đóng**: Người dùng có thể đóng gợi ý nếu không muốn xem
- **Responsive**: Hoạt động tốt trên cả desktop và mobile

## Lợi Ích Kinh Doanh

1. **Tăng tỉ lệ tương tác**: Biến chatbot từ công cụ bị động thành kênh tiếp cận chủ động
2. **Giảm tỷ lệ thoát**: Giữ chân người dùng bằng các gợi ý hữu ích
3. **Tăng trải nghiệm**: Tạo cảm giác thân thiện và sinh động cho website
4. **Tăng tỷ lệ chuyển đổi**: Nhắc nhở người dùng về các dịch vụ/sản phẩm đang có

## Cập Nhật và Bảo Trì

Các gợi ý có thể được chỉnh sửa trong file `chat-suggestion.tsx` và `quick-suggestions.tsx` để phù hợp với các chương trình khuyến mãi hoặc sự kiện mới của Sun Movement.

---

*Tính năng này là một phần của dự án cải thiện trải nghiệm người dùng và tăng tỷ lệ tương tác cho website Sun Movement.*
