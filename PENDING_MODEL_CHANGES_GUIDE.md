# HƯỚNG DẪN XỬ LÝ LỖI PENDINGMODELCHANGESWARNING

## Mô tả lỗi

Lỗi `PendingModelChangesWarning` xảy ra khi Entity Framework Core phát hiện ra rằng có thay đổi trong các entity model (các lớp đại diện cho các bảng dữ liệu) mà chưa được tạo thành migration mới. Lỗi này có thể xuất hiện khi:

1. Bạn đã thêm, xóa hoặc sửa đổi thuộc tính trong các entity class
2. Bạn đã thay đổi quan hệ giữa các entity (one-to-many, many-to-many, v.v.)
3. Bạn đã thêm entity mới mà chưa tạo migration

## Cách xử lý

### Cách 1: Tạo migration mới (KHUYẾN NGHỊ)

Đây là cách tiếp cận chính thống và đảm bảo tính nhất quán giữa model code và cấu trúc database.

```cmd
# Di chuyển đến thư mục project chứa DbContext
cd d:\DATN\DATN\sun-movement-backend\SunMovement.Web

# Tạo migration mới
dotnet ef migrations add UpdateSportswearModels --context ApplicationDbContext

# Cập nhật database
dotnet ef database update
```

### Cách 2: Bỏ qua cảnh báo (CHỈ DÙNG TRONG MÔI TRƯỜNG PHÁT TRIỂN)

Đây là giải pháp tạm thời, chỉ nên dùng khi bạn đang phát triển và chắc chắn rằng những thay đổi trong model không ảnh hưởng đến dữ liệu hiện có. **Không khuyến nghị** sử dụng trong môi trường production!

1. Mở file `ApplicationDbContext.cs` trong `SunMovement.Infrastructure/Data/`
2. Thêm phương thức `OnConfiguring` hoặc chỉnh sửa phương thức này nếu đã tồn tại:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

// ...

protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.ConfigureWarnings(warnings => 
        warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    
    // Nếu đã có code khác trong OnConfiguring, giữ nguyên code đó
    base.OnConfiguring(optionsBuilder); 
}
```

## Phân tích sâu hơn về lỗi

Để phân tích chính xác lỗi, bạn có thể xem sự khác biệt giữa model hiện tại và cơ sở dữ liệu bằng cách tạo một script SQL:

```cmd
dotnet ef dbcontext script --context ApplicationDbContext
```

Lệnh này sẽ tạo ra một script SQL đại diện cho cơ sở dữ liệu theo model hiện tại. Bạn có thể so sánh script này với schema hiện tại của database để xác định sự khác biệt.

## Kiểm tra thay đổi trong model

Có thể kiểm tra xem model có thay đổi so với migration cuối cùng không bằng lệnh:

```cmd
dotnet ef migrations has-pending-model-changes --context ApplicationDbContext
```

## Lời khuyên

- Luôn tạo migration mới khi có thay đổi trong model
- Kiểm tra kỹ các migration trước khi áp dụng vào production
- Đối với các thay đổi phức tạp (thay đổi cấu trúc bảng đã có dữ liệu), hãy xem xét việc tạo các migration có thao tác tùy chỉnh để bảo toàn dữ liệu
