@echo off
setlocal EnableDelayedExpansion
echo ===============================================================
echo      SỬA LỖI PENDINGMODELCHANGESWARNING TRONG EF CORE
echo ===============================================================
echo.
echo Tool này giúp kiểm tra và sửa lỗi PendingModelChangesWarning
echo khi làm việc với Entity Framework Core
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

echo [BƯỚC 2] Chuyển đến thư mục chứa DbContext...
cd /d "%BACKEND_DIR%\SunMovement.Web"

echo [BƯỚC 3] Kiểm tra model changes...
dotnet ef migrations has-pending-model-changes

if %errorlevel% equ 0 (
    echo.
    echo [PHÁT HIỆN] Có thay đổi trong model chưa được tạo migration!
    echo.
    echo Có các cách xử lý sau:
    echo 1. Tạo migration mới (KHUYẾN NGHỊ)
    echo 2. Hiển thị script SQL từ model hiện tại (để phân tích)
    echo 3. Bỏ qua cảnh báo tạm thời (chỉ cho môi trường phát triển)
    echo 4. Xem hướng dẫn chi tiết
    echo 5. Thoát
    echo.
    
    choice /C 12345 /M "Lựa chọn của bạn"
    
    if !errorlevel! equ 1 (
        echo.
        set /p MIGRATION_NAME="Nhập tên migration (ví dụ: UpdateSportswearImages): "
        
        echo.
        echo [THỰC HIỆN] Đang tạo migration mới '%MIGRATION_NAME%'...
        
        echo.
        echo Kiểm tra project...
        dotnet build
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Biên dịch project không thành công!
            echo Cần sửa lỗi biên dịch trước khi tạo migration.
            pause
            exit /b 1
        )
        
        echo.
        echo Project đã được biên dịch thành công.
        echo Đang tạo migration '%MIGRATION_NAME%'...
        
        cd /d "%BACKEND_DIR%\SunMovement.Web"
        dotnet ef migrations add !MIGRATION_NAME! --context ApplicationDbContext --verbose
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Tạo migration không thành công!
            echo.
            echo Các nguyên nhân có thể:
            echo 1. Lỗi cú pháp trong các lớp model
            echo 2. Thiếu tham chiếu đến DbContext
            echo 3. Tên migration đã tồn tại
            echo.
            echo Hãy thử các bước sau:
            echo - Kiểm tra các lỗi trong output ở trên
            echo - Thử một tên migration khác
            echo - Kiểm tra lại các lớp model
            pause
            exit /b 1
        )
        
        echo.
        echo [OK] Migration '!MIGRATION_NAME!' đã được tạo thành công!
        echo.
        echo Bạn có muốn cập nhật database ngay không?
        choice /C YN /M "Cập nhật database"
        
        if !errorlevel! equ 1 (
            echo.
            echo [THỰC HIỆN] Đang cập nhật database...
            dotnet ef database update
            
            if !errorlevel! neq 0 (
                echo.
                echo [LỖI] Cập nhật database không thành công!
                pause
                exit /b 1
            )
            
            echo.
            echo [OK] Database đã được cập nhật thành công!
        ) else (
            echo.
            echo Bạn có thể cập nhật database sau bằng lệnh:
            echo     dotnet ef database update
        )
    ) else if !errorlevel! equ 2 (
        echo.
        echo [THỰC HIỆN] Tạo script SQL từ model hiện tại...
        
        set SCRIPT_PATH=%BACKEND_DIR%\SunMovement.Web\model_script.sql
        
        dotnet ef dbcontext script --context ApplicationDbContext > "%SCRIPT_PATH%"
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Tạo script không thành công!
            pause
            exit /b 1
        )
        
        echo.
        echo [OK] Script SQL đã được tạo tại: %SCRIPT_PATH%
        echo Bạn có thể sử dụng script này để phân tích sự khác biệt giữa
        echo model hiện tại và cơ sở dữ liệu.
        
        choice /C YN /M "Mở file script để xem"
        
        if !errorlevel! equ 1 (
            start "" "%SCRIPT_PATH%"
        )
    ) else if !errorlevel! equ 3 (
        echo.
        echo [THỰC HIỆN] Tạo hướng dẫn bỏ qua cảnh báo...
        
        set DBCONTEXT_PATH=%BACKEND_DIR%\SunMovement.Infrastructure\Data\ApplicationDbContext.cs
        set FIX_PATH=%BACKEND_DIR%\SunMovement.Web\IgnoreModelWarning.cs
        
        if not exist "%DBCONTEXT_PATH%" (
            echo.
            echo [LỖI] Không tìm thấy file ApplicationDbContext.cs tại:
            echo %DBCONTEXT_PATH%
            
            set /p DBCONTEXT_PATH="Vui lòng nhập đường dẫn đầy đủ đến file ApplicationDbContext.cs: "
            
            if not exist "!DBCONTEXT_PATH!" (
                echo.
                echo [LỖI] File vẫn không tồn tại tại đường dẫn đã nhập!
                pause
                exit /b 1
            )
        )
        
        echo // HƯỚNG DẪN TẠM THỜI BỎ QUA CẢNH BÁO PENDINGMODELCHANGESWARNING > "%FIX_PATH%"
        echo // ================================================================== >> "%FIX_PATH%"
        echo. >> "%FIX_PATH%"
        echo // Thêm đoạn code sau vào lớp ApplicationDbContext trong file: >> "%FIX_PATH%"
        echo // %DBCONTEXT_PATH% >> "%FIX_PATH%"
        echo. >> "%FIX_PATH%"
        echo using Microsoft.EntityFrameworkCore; >> "%FIX_PATH%"
        echo using Microsoft.EntityFrameworkCore.Diagnostics; >> "%FIX_PATH%"
        echo. >> "%FIX_PATH%"
        echo // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) >> "%FIX_PATH%"
        echo // { >> "%FIX_PATH%"
        echo //     optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning)); >> "%FIX_PATH%"
        echo //     base.OnConfiguring(optionsBuilder); >> "%FIX_PATH%"
        echo // } >> "%FIX_PATH%"
        echo. >> "%FIX_PATH%"
        echo // LƯU Ý: Đây chỉ là giải pháp tạm thời. Nên tạo migration mới sớm nhất có thể. >> "%FIX_PATH%"
        
        echo.
        echo [OK] Hướng dẫn đã được tạo tại: %FIX_PATH%
        echo.
        
        choice /C YN /M "Mở file ApplicationDbContext.cs để chỉnh sửa ngay"
        
        if !errorlevel! equ 1 (
            start "" "%DBCONTEXT_PATH%"
        )
        
        echo.
        echo Lưu ý: Sau khi thêm code vào ApplicationDbContext.cs, bạn cần biên dịch lại
        echo        project để áp dụng thay đổi.
    ) else if !errorlevel! equ 4 (
        echo.
        echo [THỰC HIỆN] Mở hướng dẫn chi tiết...
        
        set GUIDE_PATH=d:\DATN\DATN\PENDING_MODEL_CHANGES_GUIDE.md
        
        if exist "%GUIDE_PATH%" (
            start "" "%GUIDE_PATH%"
        ) else (
            echo [LỖI] Không tìm thấy file hướng dẫn tại: %GUIDE_PATH%
        )
    ) else (
        echo.
        echo Đã hủy thao tác.
    )
) else (
    echo.
    echo [OK] Không phát hiện thay đổi nào trong model!
    echo Model hiện tại phù hợp với các migration đã tạo.
)

echo.
echo ✅ HOÀN THÀNH KIỂM TRA!
echo.
pause
