@echo off
echo =======================================================
echo KIỂM TRA BUILD VÀ DATABASE SCHEMA
echo =======================================================

cd /d "d:\DATN\DATN\sun-movement-backend"

echo.
echo Bước 1: Clean và rebuild...
dotnet clean -v q
dotnet build -v q

if %ERRORLEVEL% neq 0 (
    echo ✗ Build THẤT BẠI!
    echo.
    echo Lỗi thường gặp và cách khắc phục:
    echo 1. Thiếu using statements trong UnitOfWork.cs
    echo 2. Repository classes chưa được tạo đúng namespace
    echo 3. Interface members chưa được implement đầy đủ
    echo.
    pause
    exit /b 1
)

echo ✓ Build THÀNH CÔNG!

echo.
echo Bước 2: Kiểm tra migration...
dotnet ef migrations list --project SunMovement.Infrastructure --startup-project SunMovement.Web

echo.
echo Bước 3: Cập nhật database...
dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web

if %ERRORLEVEL% neq 0 (
    echo ✗ Cập nhật database THẤT BẠI!
    pause
    exit /b 1
)

echo ✓ Database đã được cập nhật!

echo.
echo =======================================================
echo TẤT CẢ KIỂM TRA THÀNH CÔNG!
echo =======================================================
echo.
echo Hệ thống đã sẵn sàng với các tính năng mới:
echo ✓ Quản lý nhà cung cấp (Supplier)
echo ✓ Lịch sử giao dịch kho (InventoryTransaction)  
echo ✓ Quan hệ sản phẩm-nhà cung cấp (ProductSupplier)
echo ✓ Hệ thống mã giảm giá (Coupon)
echo ✓ Lịch sử sử dụng mã giảm giá (CouponUsageHistory)
echo ✓ Mở rộng Product với thông tin kho hàng
echo ✓ Mở rộng Order với thông tin mã giảm giá
echo.
echo Để khởi động server, chạy: dotnet run --project SunMovement.Web
echo.
pause
