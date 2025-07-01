# Giỏ Hàng - Hướng Dẫn Kiểm Thử Xác Thực

## Sửa Lỗi Đã Thực Hiện

Chúng tôi đã sửa lỗi quan trọng trong hệ thống giỏ hàng liên quan đến xác thực người dùng:

1. **Vấn đề**: Khi người dùng đã đăng nhập, backend vẫn nhận diện là khách (guest session) khi thêm sản phẩm vào giỏ hàng
2. **Nguyên nhân**: API request không gửi cookies/credentials đến backend, khiến backend không nhận ra phiên đăng nhập
3. **Giải pháp**: Thêm tùy chọn `credentials: 'include'` và chuyển tiếp cookies vào tất cả các API requests liên quan đến giỏ hàng

## Cách Kiểm Thử

### 1. Kiểm tra Xác Thực Giỏ Hàng

1. **Đăng nhập** vào hệ thống với tài khoản của bạn
2. Mở **DevTools** (F12) và chuyển đến tab Network
3. **Thêm sản phẩm** vào giỏ hàng
4. Trong DevTools, kiểm tra request đến `/api/cart`:
   - Xác nhận rằng request có **Cookie header**
   - Xác nhận request có **credentials: 'include'**
5. Kiểm tra response từ backend:
   - **userId** trong response nên khớp với ID người dùng đã đăng nhập
   - Không nên có thông báo lỗi về xác thực hoặc phiên làm việc

### 2. Kiểm tra Tích Hợp Giỏ Hàng

1. **Đăng xuất** khỏi hệ thống và thêm một số sản phẩm vào giỏ hàng
2. **Đăng nhập** vào hệ thống
3. Kiểm tra giỏ hàng:
   - Các sản phẩm đã thêm trước đó vẫn còn trong giỏ hàng
   - Giỏ hàng hiển thị đúng thông tin người dùng

### 3. Kiểm tra Xử Lý Lỗi

1. Thử thêm sản phẩm không tồn tại hoặc đã hết hàng vào giỏ hàng
2. Xác nhận rằng ứng dụng hiển thị thông báo lỗi phù hợp
3. Xác nhận rằng lỗi được ghi lại trong console

## Quy Trình Kiểm Thử Tự Động

Nếu bạn muốn chạy các bài kiểm thử tự động:

```bash
# Chạy bộ kiểm thử toàn diện
npm run test:cart-auth

# Chạy kiểm thử hiệu suất giỏ hàng
npm run test:cart-performance
```

## Xác Nhận Sửa Lỗi

Nếu tất cả các bước kiểm thử trên đều thành công, vấn đề xác thực giỏ hàng đã được khắc phục. Người dùng đã đăng nhập sẽ luôn được nhận diện đúng khi tương tác với giỏ hàng, và thông tin giỏ hàng sẽ được lưu trữ chính xác trong cơ sở dữ liệu của họ.

## Báo Cáo Sự Cố

Nếu bạn gặp bất kỳ vấn đề nào trong quá trình kiểm thử, vui lòng ghi lại:

1. **Các bước** để tái hiện lỗi
2. **Thông báo lỗi** hiển thị (nếu có)
3. **Logs từ Console** trong DevTools
4. **Screenshots** của vấn đề (nếu có thể)

Gửi báo cáo lỗi cho team phát triển để được hỗ trợ.
