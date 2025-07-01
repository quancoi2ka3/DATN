# Hướng dẫn khắc phục vấn đề seeding dữ liệu sportswear

## Vấn đề

Khi thực hiện seeding dữ liệu cho 20 sản phẩm sportswear, dữ liệu không xuất hiện trong trang quản trị admin.

## Nguyên nhân có thể

1. **Vấn đề bất đồng bộ**: Trong mã ban đầu, chúng ta sử dụng phương thức `context.Products.Any()` không bất đồng bộ trong một phương thức `async`.

2. **Vấn đề migration**: Có thể cần phải thêm migration mới để cập nhật cấu trúc dữ liệu.

3. **Vấn đề thứ tự thực thi**: DbInitializer có thể chưa gọi đến phương thức seed sportswear.

4. **Vấn đề về đường dẫn hình ảnh**: Các đường dẫn hình ảnh trong dữ liệu seed có thể không tồn tại trong thư mục wwwroot.

## Giải pháp đã thực hiện

1. **Sửa lỗi bất đồng bộ**: Đã sửa `context.Products.Any()` thành `await context.Products.AnyAsync()`.

2. **Thêm API endpoint**: Đã tạo các endpoint API để:
   - Seed dữ liệu mới: `/api/seed/sportswear`
   - Xóa dữ liệu cũ và tạo mới: `/api/seed/sportswear/force`

3. **Tạo tập lệnh batch mới**: `fix-sportswear-seeding.bat` cung cấp nhiều tùy chọn để khắc phục vấn đề.

## Cách khắc phục

### Phương pháp 1: Sử dụng tập lệnh batch

1. Chạy tệp `fix-sportswear-seeding.bat`
2. Chọn một trong các tùy chọn sau:
   - **Tùy chọn 1**: Tạo mới (không xóa dữ liệu cũ nếu có)
   - **Tùy chọn 2**: Xóa dữ liệu cũ và tạo mới
   - **Tùy chọn 3**: Tạo migration mới và áp dụng

### Phương pháp 2: Sử dụng API trực tiếp

1. Khởi động dự án backend: `dotnet run --project SunMovement.Web`
2. Đăng nhập vào hệ thống với tài khoản admin
3. Truy cập một trong các URL sau:
   - `http://localhost:5000/api/seed/sportswear` (giữ dữ liệu cũ)
   - `http://localhost:5000/api/seed/sportswear/force` (xóa dữ liệu cũ)

### Phương pháp 3: Kiểm tra thư mục hình ảnh

Đảm bảo thư mục `wwwroot/images/products` tồn tại và có quyền ghi. Các hình ảnh sản phẩm cần được đặt ở đây với cấu trúc như sau:

```
wwwroot/
  images/
    products/
      ao-polo-den.jpg
      ao-polo-trang.jpg
      ao-polo-xam.jpg
      short-da-ca-xam.jpg
      tshirt-training-do.jpg
      ...
```

## Lưu ý quan trọng

- Sau khi thực hiện seeding, bạn cần làm mới trang quản trị admin để thấy các sản phẩm mới.
- Nếu sử dụng SQL Server, đảm bảo người dùng có quyền ghi vào database.
- Nếu sản phẩm xuất hiện nhưng không có hình ảnh, kiểm tra đường dẫn hình ảnh trong thư mục wwwroot.
