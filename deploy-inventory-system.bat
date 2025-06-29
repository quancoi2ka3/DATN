@echo off
echo =======================================================
echo TRIỂN KHAI HỆ THỐNG QUẢN LÝ KHO VÀ MÃ GIẢM GIÁ
echo =======================================================

cd /d "d:\DATN\DATN\sun-movement-backend"

echo.
echo Bước 1: Dừng tất cả tiến trình dotnet...
taskkill /f /im dotnet.exe >nul 2>&1

echo.
echo Bước 2: Clean và rebuild project...
dotnet clean -v q
dotnet restore -v q  
dotnet build -v q

if %ERRORLEVEL% neq 0 (
    echo ✗ Build thất bại! Vui lòng kiểm tra lỗi compile.
    echo.
    echo Các lỗi thường gặp:
    echo - UnitOfWork chưa implement đầy đủ interface members
    echo - Repository classes chưa được tạo
    echo - Missing using statements
    echo.
    echo Hãy chạy test-database-schema.bat để kiểm tra chi tiết
    pause
    exit /b 1
)

echo ✓ Build thành công!

echo.
echo Bước 3: Cập nhật database với schema mới...
dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web

if %ERRORLEVEL% neq 0 (
    echo ✗ Cập nhật database thất bại!
    pause
    exit /b 1
)

echo ✓ Database đã được cập nhật!

echo.
echo Bước 4: Khởi động server...
echo Server sẽ chạy tại: https://localhost:7001
echo.
echo Các tính năng mới đã được thêm:
echo - Quản lý nhà cung cấp: https://localhost:7001/admin/SuppliersAdmin
echo - Dashboard kho hàng: https://localhost:7001/admin/InventoryDashboard (sẽ có sau khi hoàn thiện)
echo - Quản lý mã giảm giá: https://localhost:7001/admin/CouponsAdmin (sẽ có sau khi hoàn thiện)
echo.
echo LƯU Ý: Một số tính năng nâng cao đang được hoàn thiện.
echo.
echo Nhấn Ctrl+C để dừng server
dotnet run --project SunMovement.Web
