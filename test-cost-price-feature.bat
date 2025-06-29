@echo off
echo =======================================================
echo KIỂM TRA TÍNH NĂNG GIÁ VỐN VÀ LỢI NHUẬN
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
    echo Admin panel: https://localhost:7001/admin
    echo.
    echo Bạn có thể kiểm tra các tính năng sau:
    echo - Tạo sản phẩm mới với giá vốn
    echo - Xem lợi nhuận tự động tính toán
    echo - Danh sách sản phẩm hiển thị lợi nhuận
    echo.
    echo Nhấn Ctrl+C để dừng server
    dotnet run --project SunMovement.Web
) else (
    echo ✗ Build thất bại!
    echo Vui lòng kiểm tra lỗi ở trên
    pause
)
