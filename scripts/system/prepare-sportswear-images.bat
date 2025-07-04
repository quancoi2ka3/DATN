@echo off
echo ===============================================================
echo           CHUẨN BỊ THƯ MỤC HÌNH ẢNH CHO SPORTSWEAR
echo ===============================================================
echo.

set BACKEND_DIR=d:\DATN\DATN\sun-movement-backend
set IMAGE_DIR=%BACKEND_DIR%\SunMovement.Web\wwwroot\images\sportswear

echo [BƯỚC 1] Kiểm tra thư mục backend...
if not exist "%BACKEND_DIR%" (
    echo [LỖI] Không tìm thấy thư mục backend tại %BACKEND_DIR%
    pause
    exit /b 1
) else (
    echo [OK] Thư mục backend tồn tại
)

echo [BƯỚC 2] Kiểm tra và tạo thư mục hình ảnh...
if not exist "%IMAGE_DIR%" (
    echo [TẠO] Tạo thư mục hình ảnh tại %IMAGE_DIR%
    mkdir "%IMAGE_DIR%"
) else (
    echo [OK] Thư mục hình ảnh đã tồn tại tại %IMAGE_DIR%
)

echo [BƯỚC 3] Tạo các tệp hình ảnh mẫu...

REM Tạo danh sách các tệp hình ảnh cần tạo
set IMAGE_FILES=ao-polo-den.webp ao-polo-trang.webp ao-polo-xam.webp short-da-ca-xam.webp tshirt-training-do.webp tshirt-training-xam.webp tshirt-training-navy.webp tshirt-training-tim-den.webp tshirt-casual-den.webp tshirt-casual-trang.webp quan-the-thao-dai.webp ao-thun-the-thao-nam.webp ao-thun-the-thao-nu.webp quan-short-the-thao-nam.webp quan-legging-nu.webp ao-khoac-gio.webp ao-ba-lo-nam.webp ao-bra-nu.webp quan-jogger.webp bo-do-the-thao-nam.webp bo-do-the-thao-nu.webp ao-hoodie.webp ao-the-thao-dai-tay.webp quan-short-the-thao-nu.webp ao-tank-top-nu.webp ao-giu-nhiet.webp

REM Tạo file mẫu cho mỗi hình ảnh (1x1 pixel)
echo Creating dummy image files...
for %%f in (%IMAGE_FILES%) do (
    if not exist "%IMAGE_DIR%\%%f" (
        echo [TẠO] Tạo file hình ảnh mẫu: %%f
        echo %%f > "%IMAGE_DIR%\%%f"
    ) else (
        echo [OK] File hình ảnh %%f đã tồn tại
    )
)

echo.
echo [THÔNG BÁO] Các file hình ảnh mẫu đã được tạo.
echo Bạn cần thay thế các file này bằng hình ảnh thực tế.
echo.
echo Các đường dẫn hình ảnh được sử dụng trong dữ liệu seed là:
echo /images/products/tên-file-hình-ảnh.webp
echo.
echo ✅ HOÀN THÀNH!
echo.

pause
