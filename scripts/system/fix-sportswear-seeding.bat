@echo off
echo ===============================================================
echo      KHẮC PHỤC VẤN ĐỀ SEEDING DỮ LIỆU SPORTSWEAR VÀ LỖI MIGRATION
echo ===============================================================
echo.
echo Tool này giải quyết lỗi PendingModelChangesWarning và các vấn đề seeding dữ liệu
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

echo [BƯỚC 4] Kiểm tra cấu trúc database...
cd /d "%BACKEND_DIR%\SunMovement.Web"

echo Kiểm tra model changes...
dotnet ef migrations has-pending-model-changes

if %errorlevel% equ 0 (
    echo.
    echo [CẢNH BÁO] Phát hiện thay đổi trong model!
    echo Bạn cần tạo migration mới trước khi tiếp tục.
    echo.
    choice /C YN /M "Tạo migration mới ngay bây giờ (Y) hoặc bỏ qua (N)"
    if !errorlevel! equ 1 (
        set /p MIGRATION_NAME="Nhập tên migration (ví dụ: UpdateSportswearModels): "
        echo.
        echo Đang tạo migration mới...
        dotnet ef migrations add %MIGRATION_NAME% --context ApplicationDbContext
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Tạo migration không thành công!
            pause
            exit /b 1
        )
        
        echo.
        echo [OK] Đã tạo migration mới thành công!
    ) else (
        echo Bạn đã chọn bỏ qua. Lưu ý rằng điều này có thể gây lỗi sau này.
    )
)

echo.
echo Đang cập nhật database...
dotnet ef database update

if %errorlevel% neq 0 (
    echo.
    echo [CẢNH BÁO] Cập nhật database không thành công.
    echo Có thể bạn cần tạo migration mới hoặc sửa lỗi trong mô hình dữ liệu.
    echo.
    choice /C YN /M "Vẫn tiếp tục (Y) hoặc hủy bỏ (N)"
    if !errorlevel! equ 2 (
        echo Đã hủy quá trình.
        pause
        exit /b 1
    )
) else (
    echo.
    echo [OK] Cấu trúc database đã được cập nhật!
)

echo.
echo [BƯỚC 5] Chọn phương pháp seed data:
echo 1. Tạo mới (không xóa dữ liệu cũ nếu có)
echo 2. Xóa dữ liệu cũ và tạo mới (nếu dữ liệu cũ tồn tại)
echo 3. Tạo migration mới và áp dụng
echo 4. Sửa lỗi 'PendingModelChangesWarning' (Migration Conflict)
echo 5. Thoát

choice /C 12345 /M "Lựa chọn của bạn"

if %errorlevel% equ 1 (
    echo.
    echo [THỰC HIỆN] Seed dữ liệu mới...
    echo.
    echo Bạn cần đăng nhập với tài khoản admin để thực hiện thao tác này.
    echo Sau khi tiếp tục, hãy mở trình duyệt và truy cập:
    echo     http://localhost:5000/api/seed/sportswear
    echo.
    pause
    dotnet run
) else if %errorlevel% equ 2 (
    echo.
    echo [THỰC HIỆN] Xóa dữ liệu cũ và tạo mới...
    echo.
    echo Bạn cần đăng nhập với tài khoản admin để thực hiện thao tác này.
    echo Sau khi tiếp tục, hãy mở trình duyệt và truy cập:
    echo     http://localhost:5000/api/seed/sportswear/force
    echo.
    pause
    dotnet run
) else if %errorlevel% equ 3 (
    echo.
    echo [THỰC HIỆN] Tạo migration mới cho sportswear...
    echo.
    
    set /p MIGRATION_NAME="Nhập tên migration (ví dụ: AddSportswearProducts): "
    
    dotnet ef migrations add %MIGRATION_NAME% --context ApplicationDbContext
    
    if %errorlevel% neq 0 (
        echo.
        echo [LỖI] Tạo migration không thành công!
        pause
        exit /b 1
    )
    
    echo.
    echo [OK] Đã tạo migration mới!
    echo.
    echo [THỰC HIỆN] Áp dụng migration...
    
    dotnet ef database update --context ApplicationDbContext
    
    if %errorlevel% neq 0 (
        echo.
        echo [LỖI] Áp dụng migration không thành công!
        pause
        exit /b 1
    )
    
    echo.
    echo [OK] Đã áp dụng migration!
    echo.
    echo Bây giờ chạy seed data...
    
    dotnet run seed
) else if %errorlevel% equ 4 (
    echo.
    echo [THỰC HIỆN] Sửa lỗi 'PendingModelChangesWarning'...
    echo.
    
    echo ===================================================================
    echo LỖI PENDINGMODELCHANGESWARNING LÀ GÌ?
    echo ===================================================================
    echo Lỗi này xảy ra khi Entity Framework Core phát hiện các thay đổi
    echo trong mô hình dữ liệu (các entity class) mà chưa được áp dụng
    echo vào cơ sở dữ liệu thông qua migration.
    echo.
    echo Nguyên nhân thường gặp:
    echo 1. Đã thêm/sửa/xóa thuộc tính trong các entity class
    echo 2. Đã thay đổi quan hệ giữa các entity
    echo 3. Đã thêm entity mới mà chưa tạo migration
    echo.
    echo Có hai cách giải quyết:
    echo.
    echo 1. Tạo migration mới (KHUYẾN NGHỊ)
    echo    - Đây là cách an toàn và chính thống
    echo    - Cập nhật cấu trúc database theo model mới
    echo.
    echo 2. Bỏ qua cảnh báo (CHỈ DÙNG KHI PHÁT TRIỂN)
    echo    - Chỉ là giải pháp tạm thời
    echo    - Không nên sử dụng trong môi trường production
    echo    - Có thể gây mất đồng bộ giữa code và database
    echo ===================================================================
    echo.
    
    choice /C 12 /M "Lựa chọn cách giải quyết"
    
    if !errorlevel! equ 1 (
        echo.
        set /p MIGRATION_NAME="Nhập tên migration mới (ví dụ: FixSportswearWebpImages): "
        
        dotnet ef migrations add %MIGRATION_NAME% --context ApplicationDbContext
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Tạo migration không thành công!
            pause
            exit /b 1
        )
        
        echo.
        echo [OK] Đã tạo migration mới!
        echo.
        echo [THỰC HIỆN] Áp dụng migration...
        
        dotnet ef database update
        
        if !errorlevel! neq 0 (
            echo.
            echo [LỖI] Áp dụng migration không thành công!
            pause
            exit /b 1
        )
        
        echo.
        echo [OK] Đã áp dụng migration thành công!
        echo.
        echo Tiếp theo sẽ chạy seed dữ liệu...
        echo.
        
        echo Bạn muốn seed dữ liệu bằng cách nào?
        echo 1. API endpoint (cần chạy ứng dụng)
        echo 2. Bỏ qua bước seed
        
        choice /C 12 /M "Lựa chọn của bạn"
        
        if !errorlevel! equ 1 (
            echo.
            echo Khởi động ứng dụng...
            echo Sau khi ứng dụng chạy, truy cập: http://localhost:5000/api/seed/sportswear/force
            echo.
            pause
            dotnet run
        ) else (
            echo.
            echo Bạn có thể chạy lại script này và chọn tùy chọn 2 sau để seed dữ liệu.
        )
    ) else (
        echo.
        echo [THỰC HIỆN] Tạo một thay đổi tạm thời để bỏ qua cảnh báo...
        echo.
        
        echo ===================================================================
        echo HƯỚNG DẪN TẠM THỜI BỎ QUA CẢNH BÁO
        echo ===================================================================
        echo.
        echo Để bỏ qua cảnh báo, bạn cần thêm đoạn code sau vào lớp ApplicationDbContext
        echo trong file SunMovement.Infrastructure/Data/ApplicationDbContext.cs:
        echo.
        echo protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        echo {
        echo     optionsBuilder.ConfigureWarnings(warnings =^> 
        echo         warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        echo     base.OnConfiguring(optionsBuilder);
        echo }
        echo.
        echo Nếu phương thức OnConfiguring đã tồn tại, chỉ cần thêm dòng
        echo configureWarnings vào trong phương thức đó.
        echo.
        echo Sau khi thêm đoạn code trên, biên dịch lại project và chạy lệnh seed.
        echo ===================================================================
        echo.
        
        set /p CHECK_PATH="Đường dẫn đầy đủ đến file ApplicationDbContext.cs là gì? (Nhấn Enter nếu đúng đường dẫn mặc định: %BACKEND_DIR%\SunMovement.Infrastructure\Data\ApplicationDbContext.cs): "
        
        if "!CHECK_PATH!"=="" (
            set CHECK_PATH=%BACKEND_DIR%\SunMovement.Infrastructure\Data\ApplicationDbContext.cs
        )
        
        if not exist "!CHECK_PATH!" (
            echo [LỖI] File không tồn tại tại đường dẫn: !CHECK_PATH!
            echo Vui lòng kiểm tra lại đường dẫn và thêm code thủ công.
        ) else (
            echo.
            echo Bạn có muốn tạo file tạm thời có hướng dẫn chi tiết không?
            choice /C YN /M "Tạo file hướng dẫn"
            
            if !errorlevel! equ 1 (
                echo // HƯỚNG DẪN TẠM THỜI BỎ QUA CẢNH BÁO PENDINGMODELCHANGESWARNING > "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo // ================================================================== >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo. >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo // Thêm đoạn code sau vào lớp ApplicationDbContext: >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo. >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo using Microsoft.EntityFrameworkCore; >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo using Microsoft.EntityFrameworkCore.Diagnostics; >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo. >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo // { >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo //     optionsBuilder.ConfigureWarnings(warnings =^> warnings.Ignore(RelationalEventId.PendingModelChangesWarning)); >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo //     base.OnConfiguring(optionsBuilder); >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo // } >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo. >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                echo // LƯU Ý: Đây chỉ là giải pháp tạm thời. Nên tạo migration mới sớm nhất có thể. >> "%BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs"
                
                echo.
                echo [THÔNG BÁO] Tạo file hướng dẫn thành công tại:
                echo     %BACKEND_DIR%\SunMovement.Web\FixModelWarning.cs
                echo.
            )
            
            echo Bạn có muốn mở file ApplicationDbContext.cs để chỉnh sửa ngay không?
            choice /C YN /M "Mở file để chỉnh sửa"
            
            if !errorlevel! equ 1 (
                start "" "!CHECK_PATH!"
                echo.
                echo [THÔNG BÁO] Đã mở file để chỉnh sửa.
                echo Sau khi chỉnh sửa, lưu lại và chạy lại seed dữ liệu.
                echo.
            )
        )
        
        echo Lưu ý: Đây chỉ là giải pháp tạm thời. Nên tạo migration mới sớm nhất có thể.
        echo.
    )
) else (
    echo Đã hủy thao tác.
    exit /b 0
)

echo.
echo ✅ HOÀN THÀNH THAO TÁC!
echo.
echo Nếu dữ liệu vẫn không xuất hiện trên trang admin, vui lòng kiểm tra:
echo 1. Lỗi trong quá trình seed data (xem logs)
echo 2. Kiểm tra kết nối đến cơ sở dữ liệu
echo 3. Kiểm tra các đường dẫn hình ảnh trong thư mục wwwroot
echo.

pause
