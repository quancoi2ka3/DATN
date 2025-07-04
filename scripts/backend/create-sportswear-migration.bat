@echo off
setlocal EnableDelayedExpansion
echo ===============================================================
echo            TẠO MIGRATION MỚI CHO SPORTSWEAR MODEL
echo ===============================================================
echo.

set BACKEND_DIR=d:\DATN\DATN\sun-movement-backend
set WEB_PROJECT=%BACKEND_DIR%\SunMovement.Web

if not exist "%BACKEND_DIR%" (
    echo [LỖI] Không tìm thấy thư mục backend tại %BACKEND_DIR%
    pause
    exit /b 1
)

echo [BƯỚC 1] Chuyển đến thư mục Web project...
cd /d "%WEB_PROJECT%"

echo [BƯỚC 2] Biên dịch project để đảm bảo không có lỗi...
dotnet build

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Biên dịch không thành công!
    echo Cần sửa lỗi biên dịch trước khi tạo migration.
    pause
    exit /b 1
)

echo.
echo [OK] Biên dịch thành công!
echo.

echo [BƯỚC 3] Nhập tên cho migration mới...
set /p MIGRATION_NAME="Nhập tên migration (ví dụ: UpdateSportswearProducts): "

echo.
echo [BƯỚC 4] Đang tạo migration '%MIGRATION_NAME%'...
dotnet ef migrations add %MIGRATION_NAME% --context ApplicationDbContext --verbose

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Tạo migration không thành công! 
    echo.
    echo Các nguyên nhân có thể:
    echo 1. Lỗi cú pháp trong các lớp model
    echo 2. Thiếu tham chiếu đến DbContext
    echo 3. Tên migration đã tồn tại
    echo.
    echo Bạn có muốn thử lại với tên khác không?
    choice /C YN /M "Thử lại với tên khác"
    
    if !errorlevel! equ 1 (
        echo.
        set /p NEW_MIGRATION_NAME="Nhập tên migration mới: "
        echo.
        echo Đang tạo migration '!NEW_MIGRATION_NAME!'...
        dotnet ef migrations add !NEW_MIGRATION_NAME! --context ApplicationDbContext --verbose
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Vẫn không thể tạo migration.
            echo Vui lòng xem lỗi chi tiết ở trên và sửa lỗi trong code trước.
            pause
            exit /b 1
        ) else (
            set MIGRATION_NAME=!NEW_MIGRATION_NAME!
            goto :MIGRATION_SUCCESS
        )
    ) else (
        echo.
        echo Bạn có thể kiểm tra lỗi và thử lại sau.
        pause
        exit /b 1
    )
)

:MIGRATION_SUCCESS
echo.
echo [OK] Migration '%MIGRATION_NAME%' đã được tạo thành công!
echo.

echo [BƯỚC 5] Bạn có muốn cập nhật database ngay không?
choice /C YN /M "Cập nhật database"

if %errorlevel% equ 1 (
    echo.
    echo [BƯỚC 6] Đang cập nhật database...
    dotnet ef database update
    
    if %errorlevel% neq 0 (
        echo.
        echo [LỖI] Cập nhật database không thành công!
        echo Kiểm tra kết nối đến database và các lỗi khác.
        pause
        exit /b 1
    )
    
    echo.
    echo [OK] Database đã được cập nhật thành công với migration '%MIGRATION_NAME%'!
    echo Bạn có thể tiếp tục với quá trình seed dữ liệu.
) else (
    echo.
    echo Bạn đã chọn không cập nhật database ngay.
    echo Bạn có thể cập nhật database sau bằng lệnh:
    echo.
    echo     cd %WEB_PROJECT%
    echo     dotnet ef database update
    echo.
)

echo ✅ HOÀN THÀNH TẠO MIGRATION!
echo.
pause
