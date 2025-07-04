# Hướng dẫn khắc phục vấn đề hình ảnh .webp cho sportswear

## Vấn đề

Các file hình ảnh sản phẩm sportswear đang sử dụng định dạng `.webp` thay vì `.jpg` như đã cấu hình ban đầu trong mã nguồn.

## Giải pháp đã thực hiện

1. **Cập nhật tất cả đường dẫn hình ảnh**: Đã sửa tất cả đường dẫn hình ảnh trong file `SeedProducts.cs` từ định dạng `.jpg` sang `.webp`.

2. **Cập nhật tập lệnh batch**: Đã sửa file `prepare-sportswear-images.bat` để sử dụng định dạng `.webp`.

3. **Tạo tập lệnh kiểm tra mới**: Đã tạo tập lệnh `fix-sportswear-images-webp.bat` để kiểm tra sự tồn tại của các file hình ảnh `.webp` và hỗ trợ seed lại dữ liệu.

## Cách sử dụng

### Kiểm tra hình ảnh

1. Chạy tập lệnh `fix-sportswear-images-webp.bat`
2. Chọn tùy chọn 1 để kiểm tra các file hình ảnh `.webp` có tồn tại không
3. Đảm bảo tất cả các file hình ảnh đã được đặt trong thư mục `wwwroot/images/products`

### Seed lại dữ liệu

1. Chạy tập lệnh `fix-sportswear-images-webp.bat`
2. Chọn tùy chọn 2 để seed lại dữ liệu với các hình ảnh `.webp`
3. Khi ứng dụng được khởi động, mở trình duyệt và truy cập:
   - `http://localhost:5000/api/seed/sportswear/force`

## Danh sách file hình ảnh cần có

```
ao-polo-den.webp
ao-polo-trang.webp
ao-polo-xam.webp
short-da-ca-xam.webp
tshirt-training-do.webp
tshirt-training-xam.webp
tshirt-training-navy.webp
tshirt-training-tim-den.webp
tshirt-casual-den.webp
tshirt-casual-trang.webp
quan-the-thao-dai.webp
ao-thun-the-thao-nam.webp
ao-thun-the-thao-nu.webp
quan-short-the-thao-nam.webp
quan-legging-nu.webp
ao-khoac-gio.webp
ao-ba-lo-nam.webp
ao-bra-nu.webp
quan-jogger.webp
bo-do-the-thao-nam.webp
bo-do-the-thao-nu.webp
ao-hoodie.webp
ao-the-thao-dai-tay.webp
quan-short-the-thao-nu.webp
ao-tank-top-nu.webp
ao-giu-nhiet.webp
```

## Lưu ý quan trọng

1. **Vị trí file hình ảnh**: Tất cả các file hình ảnh `.webp` phải được đặt trong thư mục `wwwroot/images/products` của dự án backend.

2. **Quyền truy cập**: Đảm bảo thư mục hình ảnh có quyền đọc/ghi.

3. **Tên file phân biệt chữ hoa/thường**: Tên file hình ảnh phải khớp chính xác với tên được sử dụng trong mã nguồn (chữ thường, dấu gạch ngang).

4. **MIME Type**: Đảm bảo rằng server của bạn đã cấu hình để hỗ trợ MIME Type cho định dạng `.webp` (image/webp). Nếu không, bạn có thể gặp vấn đề khi hiển thị hình ảnh trên web.

5. **Tương thích trình duyệt**: Định dạng `.webp` không được hỗ trợ bởi tất cả các trình duyệt cũ, nhưng hầu hết các trình duyệt hiện đại đều hỗ trợ.
