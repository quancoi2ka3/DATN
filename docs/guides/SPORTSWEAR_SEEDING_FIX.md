# HƯỚNG DẪN KHẮC PHỤC LỖI SEED DỮ LIỆU SPORTSWEAR

## Lỗi PendingModelChangesWarning khi Seed Dữ Liệu

Khi gặp lỗi `PendingModelChangesWarning` trong quá trình seed dữ liệu sportswear, có thể sử dụng một trong các cách sau để khắc phục:

### Cách 1: Sử dụng script tự động

Chạy file batch `fix-model-changes-warning.bat` và làm theo hướng dẫn:

```
d:\DATN\DATN\fix-model-changes-warning.bat
```

### Cách 2: Tạo migration mới thủ công

```cmd
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web
dotnet ef migrations add UpdateSportswearModels --context ApplicationDbContext
dotnet ef database update
```

### Cách 3: Bỏ qua cảnh báo tạm thời

Mở file `ApplicationDbContext.cs` trong `SunMovement.Infrastructure\Data\` và thêm phương thức sau:

```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.ConfigureWarnings(warnings => 
        warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    base.OnConfiguring(optionsBuilder);
}
```

## Vấn đề về hình ảnh .webp

Đảm bảo:

1. Tất cả hình ảnh .webp đã được đặt trong thư mục `wwwroot/images/products`
2. Đường dẫn hình ảnh trong `SeedProducts.cs` đã được cập nhật để sử dụng định dạng .webp

Có thể kiểm tra bằng cách chạy script:

```
d:\DATN\DATN\fix-sportswear-images-webp.bat
```

## Kiểm tra sau khi seed

Sau khi seed thành công:

1. Truy cập trang admin và kiểm tra danh sách sản phẩm
2. Kiểm tra cả hình ảnh và thông tin sản phẩm
3. Nếu hình ảnh không hiển thị, kiểm tra lại đường dẫn và định dạng file

## Nếu tiếp tục gặp vấn đề

Chạy script để seed lại hoàn toàn (force):

```cmd
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web
dotnet run
```

Sau đó truy cập: `http://localhost:5000/api/seed/sportswear/force`
