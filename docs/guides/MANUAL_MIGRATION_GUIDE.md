# HƯỚNG DẪN TẠO MIGRATION THỦ CÔNG

Nếu bạn gặp vấn đề khi tạo migration thông qua script tự động, bạn có thể thực hiện các bước sau để tạo migration thủ công:

## Bước 1: Mở Command Prompt

Nhấn phím `Win + R`, gõ `cmd` và nhấn Enter để mở Command Prompt.

## Bước 2: Di chuyển đến thư mục project

```
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web
```

## Bước 3: Kiểm tra trạng thái model changes

```
dotnet ef migrations has-pending-model-changes
```

Nếu kết quả trả về là `True`, điều này xác nhận rằng có thay đổi model cần tạo migration.

## Bước 4: Biên dịch project

```
dotnet build
```

Đảm bảo project biên dịch thành công không có lỗi.

## Bước 5: Tạo migration mới

```
dotnet ef migrations add TenMigration --context ApplicationDbContext
```

Thay `TenMigration` bằng tên bạn muốn đặt cho migration, ví dụ: `UpdateSportswearModels`

## Bước 6: Kiểm tra migration đã tạo

Migration mới sẽ được tạo trong thư mục:
```
d:\DATN\DATN\sun-movement-backend\SunMovement.Infrastructure\Data\Migrations\
```

Kiểm tra xem có các file mới được tạo với tên bắt đầu bằng timestamp và tên migration của bạn không.

## Bước 7: Cập nhật database

```
dotnet ef database update
```

## Xử lý các lỗi thường gặp

### Lỗi 1: "No DbContext was found"

Đảm bảo bạn đang ở đúng thư mục project (SunMovement.Web) và DbContext đã được đăng ký đúng cách.

### Lỗi 2: "Build failed"

Kiểm tra lỗi biên dịch trong output và sửa các lỗi cú pháp trong code.

### Lỗi 3: "The name 'XXX' is used by an existing migration"

Chọn một tên migration khác và thử lại.

### Lỗi 4: "Unable to create an object of type 'ApplicationDbContext'"

Kiểm tra constructor của ApplicationDbContext và đảm bảo nó có thể được khởi tạo trong quá trình tạo migration.

## Sử dụng Verbose mode để xem thêm chi tiết

Thêm flag `--verbose` để xem thông tin chi tiết hơn:

```
dotnet ef migrations add TenMigration --context ApplicationDbContext --verbose
```

## Tạm thời bỏ qua cảnh báo PendingModelChangesWarning

Nếu bạn quyết định tạm thời bỏ qua cảnh báo thay vì tạo migration mới, hãy thêm đoạn code sau vào lớp `ApplicationDbContext`:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

// Trong lớp ApplicationDbContext
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.ConfigureWarnings(warnings => 
        warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    base.OnConfiguring(optionsBuilder);
}
```
