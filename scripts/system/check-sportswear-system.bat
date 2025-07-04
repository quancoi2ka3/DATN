@echo off
echo ===============================================================
echo     KIỂM TRA TOÀN DIỆN HỆ THỐNG SUN-MOVEMENT SPORTSWEAR
echo ===============================================================
echo.

set BACKEND_DIR=d:\DATN\DATN\sun-movement-backend
set FRONTEND_DIR=d:\DATN\DATN\sun-movement-frontend
set IMAGES_DIR=%BACKEND_DIR%\SunMovement.Web\wwwroot\images\products

echo [KIỂM TRA] Backend directory...
if not exist "%BACKEND_DIR%" (
    echo [LỖI] Không tìm thấy thư mục backend tại %BACKEND_DIR%
    set BACKEND_OK=false
) else (
    echo [OK] Backend directory tồn tại
    set BACKEND_OK=true
)

echo [KIỂM TRA] Frontend directory...
if not exist "%FRONTEND_DIR%" (
    echo [LỖI] Không tìm thấy thư mục frontend tại %FRONTEND_DIR%
    set FRONTEND_OK=false
) else (
    echo [OK] Frontend directory tồn tại
    set FRONTEND_OK=true
)

echo [KIỂM TRA] Product images directory...
if not exist "%IMAGES_DIR%" (
    echo [LỖI] Không tìm thấy thư mục hình ảnh sản phẩm tại %IMAGES_DIR%
    echo Cần tạo thư mục này để lưu trữ hình ảnh sản phẩm
    set IMAGES_OK=false
) else (
    echo [OK] Product images directory tồn tại
    set IMAGES_OK=true
)

echo.
echo ===============================================================
echo                   KIỂM TRA WEBP IMAGES
echo ===============================================================

if "%IMAGES_OK%"=="true" (
    echo [KIỂM TRA] Số lượng hình ảnh .webp...
    set WEBP_COUNT=0
    for %%f in ("%IMAGES_DIR%\*.webp") do set /a WEBP_COUNT+=1
    
    echo Đã tìm thấy %WEBP_COUNT% hình ảnh .webp trong thư mục
    
    if %WEBP_COUNT% LSS 10 (
        echo [CẢNH BÁO] Số lượng hình ảnh .webp có vẻ ít. Cần kiểm tra lại!
        echo Hãy chạy script prepare-sportswear-images.bat để tạo cấu trúc thư mục hình ảnh.
    ) else (
        echo [OK] Số lượng hình ảnh .webp có vẻ hợp lý
    )
) else (
    echo [BỎ QUA] Không thể kiểm tra hình ảnh do thư mục không tồn tại
)

echo.
echo ===============================================================
echo               KIỂM TRA CẤU HÌNH DATABASE
echo ===============================================================

if "%BACKEND_OK%"=="true" (
    echo [KIỂM TRA] ConnectionString trong appsettings.json...
    
    set APPSETTINGS_PATH=%BACKEND_DIR%\SunMovement.Web\appsettings.json
    
    if not exist "%APPSETTINGS_PATH%" (
        echo [LỖI] Không tìm thấy file appsettings.json tại %APPSETTINGS_PATH%
    ) else (
        echo [OK] File appsettings.json tồn tại
        echo [THÔNG TIN] Để kiểm tra ConnectionString, mở file:
        echo   %APPSETTINGS_PATH%
        echo   và xác nhận cấu hình "ConnectionStrings" đã chính xác
    )
    
    echo.
    echo [KIỂM TRA] Lỗi PendingModelChangesWarning...
    
    cd /d "%BACKEND_DIR%\SunMovement.Web"
    
    dotnet ef migrations has-pending-model-changes >nul 2>&1
    
    if %errorlevel% equ 0 (
        echo [CẢNH BÁO] Phát hiện PendingModelChangesWarning!
        echo Có thay đổi trong model chưa được tạo migration.
        echo Sử dụng một trong các script sau để khắc phục:
        echo   - fix-model-changes-warning.bat
        echo   - fix-sportswear-seeding.bat (Tùy chọn 4)
    ) else (
        echo [OK] Không phát hiện PendingModelChangesWarning
    )
) else (
    echo [BỎ QUA] Không thể kiểm tra cấu hình database do thư mục backend không tồn tại
)

echo.
echo ===============================================================
echo               KIỂM TRA CÁC FILE SCRIPT VÀ HƯỚNG DẪN
echo ===============================================================

set SCRIPTS_OK=true

for %%f in (
    "d:\DATN\DATN\fix-sportswear-seeding.bat"
    "d:\DATN\DATN\fix-model-changes-warning.bat"
    "d:\DATN\DATN\prepare-sportswear-images.bat"
    "d:\DATN\DATN\fix-sportswear-images-webp.bat"
    "d:\DATN\DATN\SPORTSWEAR_SEEDING_FIX.md"
    "d:\DATN\DATN\PENDING_MODEL_CHANGES_GUIDE.md"
) do (
    if not exist "%%f" (
        echo [LỖI] Không tìm thấy file %%f
        set SCRIPTS_OK=false
    ) else (
        echo [OK] File %%f tồn tại
    )
)

echo.
echo ===============================================================
echo               PHÂN TÍCH KẾT QUẢ KIỂM TRA
echo ===============================================================
echo.

if "%BACKEND_OK%"=="false" (
    echo [LỖI NGHIÊM TRỌNG] Backend directory không tồn tại!
    echo Cần kiểm tra lại đường dẫn và cấu trúc thư mục.
)

if "%IMAGES_OK%"=="false" (
    echo [LỖI] Thư mục hình ảnh sản phẩm không tồn tại!
    echo Cần tạo thư mục này để lưu trữ hình ảnh sản phẩm.
)

if "%SCRIPTS_OK%"=="false" (
    echo [LỖI] Một số script và file hướng dẫn không tồn tại!
    echo Cần tạo lại các file này để hỗ trợ quá trình seeding và xử lý lỗi.
)

echo.
echo ===============================================================
echo                    HƯỚNG DẪN TIẾP THEO
echo ===============================================================
echo.
echo Dựa vào kết quả kiểm tra, hãy làm theo các bước sau:
echo.
echo 1. Nếu phát hiện lỗi PendingModelChangesWarning:
echo    - Chạy fix-model-changes-warning.bat để tạo migration mới
echo    - HOẶC bỏ qua cảnh báo tạm thời theo hướng dẫn
echo.
echo 2. Nếu thiếu hình ảnh .webp:
echo    - Chạy prepare-sportswear-images.bat để tạo cấu trúc thư mục
echo    - Thêm hình ảnh .webp vào thư mục wwwroot/images/products
echo.
echo 3. Để seed dữ liệu sportswear:
echo    - Chạy fix-sportswear-seeding.bat và chọn tùy chọn phù hợp
echo      (Tùy chọn 1 để thêm mới, Tùy chọn 2 để xóa và thêm lại)
echo.
echo 4. Sau khi seed, kiểm tra trang admin để xác nhận dữ liệu đã hiển thị
echo    đúng với đầy đủ hình ảnh và thông tin.
echo.

pause
