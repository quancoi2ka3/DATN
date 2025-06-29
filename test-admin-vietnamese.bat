@echo off
echo =======================================================
echo KIỂM TRA VIỆT HÓA ADMIN INTERFACE
echo =======================================================

cd /d "d:\DATN\DATN\sun-movement-backend"

echo.
echo Đang build project...
dotnet build --no-restore -q

if %ERRORLEVEL% equ 0 (
    echo ✓ Build thành công!
    echo.
    echo Đang khởi động server...
    echo Server sẽ chạy tại: https://localhost:7001
    echo.
    echo Các trang đã được việt hóa:
    echo - Trang chủ Admin: https://localhost:7001/admin
    echo - Phân tích dữ liệu: https://localhost:7001/admin/AnalyticsAdmin
    echo - Quản lý sản phẩm (với tính năng giá vốn): https://localhost:7001/admin/ProductsAdmin
    echo.
    echo Nhấn Ctrl+C để dừng server
    dotnet run --project SunMovement.Web
) else (
    echo ✗ Build thất bại!
    echo Vui lòng kiểm tra lỗi ở trên
    pause
)
