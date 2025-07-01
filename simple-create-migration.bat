@echo off
echo ===============================================================
echo                     TẠO MIGRATION ĐƠN GIẢN
echo ===============================================================
echo.
echo Script này tạo migration mới một cách đơn giản và trực tiếp.
echo.

cd /d d:\DATN\DATN\sun-movement-backend\SunMovement.Web

echo Đang biên dịch project...
dotnet build

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Biên dịch không thành công!
    pause
    exit /b 1
)

echo.
set /p MIGRATION_NAME="Nhập tên cho migration (ví dụ: FixSportswearWebpImages): "

echo.
echo Đang tạo migration '%MIGRATION_NAME%'...
dotnet ef migrations add %MIGRATION_NAME% --context ApplicationDbContext

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Tạo migration không thành công!
    echo Xem lỗi ở trên để biết chi tiết.
    pause
    exit /b 1
)

echo.
echo [THÀNH CÔNG] Đã tạo migration '%MIGRATION_NAME%'!
echo.

echo Bạn có muốn cập nhật database không?
choice /C YN /M "Cập nhật database"

if %errorlevel% equ 1 (
    echo.
    echo Đang cập nhật database...
    dotnet ef database update
    
    if %errorlevel% neq 0 (
        echo.
        echo [LỖI] Cập nhật database không thành công!
        pause
        exit /b 1
    )
    
    echo.
    echo [THÀNH CÔNG] Database đã được cập nhật!
) else (
    echo.
    echo Bạn có thể cập nhật database sau bằng lệnh:
    echo dotnet ef database update
)

echo.
echo ✅ HOÀN THÀNH!
pause
