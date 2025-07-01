@echo off
echo ===============================================================
echo        SỬA LỖI VÀ RETRAIN CHATBOT TIẾNG VIỆT
echo ===============================================================
echo.

set CHATBOT_DIR=d:\DATN\DATN\sun-movement-chatbot
set RASA_ENV=%CHATBOT_DIR%\rasa_env_310

echo [BƯỚC 1] Kiểm tra thư mục chatbot...
if not exist "%CHATBOT_DIR%" (
    echo [LỖI] Không tìm thấy thư mục chatbot tại %CHATBOT_DIR%
    pause
    exit /b 1
) else (
    echo [OK] Thư mục chatbot tồn tại
)

echo [BƯỚC 2] Chuyển đến thư mục chatbot...
cd /d "%CHATBOT_DIR%"

echo [BƯỚC 3] Kích hoạt môi trường Rasa...
call "%RASA_ENV%\Scripts\activate.bat"

echo [BƯỚC 4] Sao lưu file cấu hình gốc...
if not exist "backups" mkdir backups
copy data\nlu.yml backups\nlu.yml.bak
echo [OK] Đã sao lưu file nlu.yml

echo [BƯỚC 5] Áp dụng các sửa đổi...
copy /Y "data\nlu_fixed.yml" data\nlu.yml
echo [OK] Đã áp dụng các sửa đổi cho file nlu.yml

echo [BƯỚC 6] Kiểm tra cú pháp của file domain.yml...
echo [OK] Bỏ qua bước cập nhật domain.yml

echo [BƯỚC 7] Xóa cache cũ...
if exist ".rasa\cache" (
    rmdir /s /q .rasa\cache
    echo [OK] Đã xóa cache cũ
)

echo [BƯỚC 8] Validate dữ liệu...
echo Kiểm tra xung đột và lỗi cấu hình...
rasa data validate
if %errorlevel% neq 0 (
    echo.
    echo [CẢNH BÁO] Phát hiện vấn đề trong dữ liệu!
    echo Bạn nên sửa các lỗi trước khi train.
    echo.
    choice /C YN /M "Bạn vẫn muốn tiếp tục train không"
    if !errorlevel! equ 2 (
        echo Đã hủy quá trình train.
        pause
        exit /b 1
    )
)

echo [BƯỚC 9] Train model mới...
echo Quá trình này có thể mất vài phút, vui lòng đợi...
rasa train --augmentation 0 --force

if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Train model không thành công!
    echo Vui lòng kiểm tra lỗi ở trên.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ TRAIN MODEL THÀNH CÔNG!
    echo Model mới đã được lưu trong thư mục models/
    echo.
)

echo [BƯỚC 10] Kiểm tra model...
echo.
echo Để kiểm tra model mới, bạn có thể:
echo 1. Chạy "rasa shell" để kiểm tra trực tiếp
echo 2. Chạy "rasa run" để khởi động server API
echo.

choice /C 12Q /M "Bạn muốn làm gì tiếp theo? (1=Shell, 2=Server, Q=Thoát)"
if %errorlevel% equ 1 (
    echo Khởi động Rasa Shell để kiểm tra...
    rasa shell
) else if %errorlevel% equ 2 (
    echo Khởi động Rasa Server API...
    rasa run --enable-api --cors "*"
) else (
    echo Thoát chương trình...
)

pause
