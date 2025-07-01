@echo off
echo ===============================================================
echo           KHẮC PHỤC ĐỊNH DẠNG HÌNH ẢNH WEBP
echo ===============================================================
echo.

set BACKEND_DIR=d:\DATN\DATN\sun-movement-backend
set IMAGE_DIR=%BACKEND_DIR%\SunMovement.Web\wwwroot\images\sportswear

echo [BƯỚC 1] Kiểm tra thư mục hình ảnh...
if not exist "%IMAGE_DIR%" (
    echo [TẠO] Tạo thư mục hình ảnh tại %IMAGE_DIR%
    mkdir "%IMAGE_DIR%"
    echo.
)

echo [BƯỚC 2] Chọn chức năng:
echo 1. Kiểm tra các hình ảnh .webp hiện có
echo 2. Seed lại dữ liệu với hình ảnh .webp
echo 3. Thoát

choice /C 123 /M "Lựa chọn của bạn"

if %errorlevel% equ 1 (
    echo.
    echo [THỰC HIỆN] Kiểm tra các hình ảnh .webp...
    echo.
    echo Hình ảnh cần có (cần đảm bảo các file này tồn tại trong thư mục %IMAGE_DIR%):
    echo.
    echo ao-polo-den.webp
    echo ao-polo-trang.webp
    echo ao-polo-xam.webp
    echo short-da-ca-xam.webp
    echo tshirt-training-do.webp
    echo tshirt-training-xam.webp
    echo tshirt-training-navy.webp
    echo tshirt-training-tim-den.webp
    echo tshirt-casual-den.webp
    echo tshirt-casual-trang.webp
    echo quan-the-thao-dai.webp
    echo ao-thun-the-thao-nam.webp
    echo ao-thun-the-thao-nu.webp
    echo quan-short-the-thao-nam.webp
    echo quan-legging-nu.webp
    echo ao-khoac-gio.webp
    echo ao-ba-lo-nam.webp
    echo ao-bra-nu.webp
    echo quan-jogger.webp
    echo bo-do-the-thao-nam.webp
    echo bo-do-the-thao-nu.webp
    echo ao-hoodie.webp
    echo ao-the-thao-dai-tay.webp
    echo quan-short-the-thao-nu.webp
    echo ao-tank-top-nu.webp
    echo ao-giu-nhiet.webp
    echo.
    
    echo Đang kiểm tra các file...
    echo.
    
    set "MISSING=0"
    
    for %%F in (ao-polo-den.webp ao-polo-trang.webp ao-polo-xam.webp short-da-ca-xam.webp tshirt-training-do.webp tshirt-training-xam.webp tshirt-training-navy.webp tshirt-training-tim-den.webp tshirt-casual-den.webp tshirt-casual-trang.webp quan-the-thao-dai.webp ao-thun-the-thao-nam.webp ao-thun-the-thao-nu.webp quan-short-the-thao-nam.webp quan-legging-nu.webp ao-khoac-gio.webp ao-ba-lo-nam.webp ao-bra-nu.webp quan-jogger.webp bo-do-the-thao-nam.webp bo-do-the-thao-nu.webp ao-hoodie.webp ao-the-thao-dai-tay.webp quan-short-the-thao-nu.webp ao-tank-top-nu.webp ao-giu-nhiet.webp) do (
        if not exist "%IMAGE_DIR%\%%F" (
            echo [THIẾU] File %%F không tồn tại!
            set /a "MISSING+=1"
        ) else (
            echo [OK] File %%F tồn tại
        )
    )
    
    echo.
    if %MISSING% GTR 0 (
        echo [CẢNH BÁO] Có %MISSING% file hình ảnh bị thiếu.
        echo Bạn cần đảm bảo tất cả file hình ảnh .webp tồn tại trước khi seed dữ liệu.
    ) else (
        echo [OK] Tất cả file hình ảnh đều tồn tại!
        echo Bạn có thể tiếp tục seed dữ liệu.
    )
) else if %errorlevel% equ 2 (
    echo.
    echo [THỰC HIỆN] Seed dữ liệu với hình ảnh .webp...
    echo.
    echo Bạn cần đăng nhập với tài khoản admin để thực hiện thao tác này.
    echo Sau khi tiếp tục, hãy mở trình duyệt và truy cập:
    echo     http://localhost:5000/api/seed/sportswear/force
    echo.
    pause
    cd /d "%BACKEND_DIR%\SunMovement.Web"
    dotnet run
) else (
    echo Đã hủy thao tác.
    exit /b 0
)

echo.
echo ✅ HOÀN THÀNH THAO TÁC!
echo.

pause
