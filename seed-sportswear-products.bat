@echo off
echo ===============================================================
echo           SEEDING DỮ LIỆU SẢN PHẨM SPORTSWEAR
echo ===============================================================
echo.

set BACKEND_DIR=d:\DATN\DATN\sun-movement-backend

echo [BƯỚC 1] Kiểm tra thư mục backend...
if not exist "%BACKEND_DIR%" (
    echo [LỖI] Không tìm thấy thư mục backend tại %BACKEND_DIR%
    pause
    exit /b 1
) else (
    echo [OK] Thư mục backend tồn tại
)

echo [BƯỚC 2] Chuyển đến thư mục backend...
cd /d "%BACKEND_DIR%"

echo [BƯỚC 3] Đang biên dịch project...
dotnet build

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Biên dịch không thành công!
    pause
    exit /b 1
) else (
    echo.
    echo [OK] Biên dịch thành công!
)

echo [BƯỚC 4] Đang chạy ứng dụng để thực hiện seed data...
cd /d "%BACKEND_DIR%\SunMovement.Web"
dotnet run seed

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Thực hiện seed data không thành công!
    pause
    exit /b 1
) else (
    echo.
    echo ✅ SEED DATA THÀNH CÔNG!
    echo Đã thêm 20 sản phẩm sportswear vào database.
    echo.
)

pause
