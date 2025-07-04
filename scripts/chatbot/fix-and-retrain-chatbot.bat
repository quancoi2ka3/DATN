@echo off
echo ========================================================
echo    KIỂM TRA VÀ RETRAIN CHATBOT TIẾNG VIỆT
echo ========================================================
echo.

set CHATBOT_DIR=d:\DATN\DATN\sun-movement-chatbot
set RASA_ENV=%CHATBOT_DIR%\rasa_env_310

echo [KIỂM TRA 1] Kiểm tra thư mục chatbot...
if not exist "%CHATBOT_DIR%" (
    echo [LỖI] Không tìm thấy thư mục chatbot tại %CHATBOT_DIR%
    pause
    exit /b 1
) else (
    echo [OK] Thư mục chatbot tồn tại
)

echo [KIỂM TRA 2] Kiểm tra môi trường Rasa...
if not exist "%RASA_ENV%\Scripts\activate.bat" (
    echo [LỖI] Không tìm thấy môi trường Rasa tại %RASA_ENV%
    pause
    exit /b 1
) else (
    echo [OK] Môi trường Rasa tồn tại
)

echo [BƯỚC 1] Chuyển đến thư mục chatbot...
cd /d "%CHATBOT_DIR%"

echo [BƯỚC 2] Kích hoạt môi trường Rasa...
call "%RASA_ENV%\Scripts\activate.bat"

echo [BƯỚC 3] Xóa cache cũ (nếu có)...
if exist ".rasa\cache" (
    rmdir /s /q .rasa\cache
    echo ✓ Đã xóa cache cũ
)

echo [BƯỚC 4] Kiểm tra và validate dữ liệu...
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

echo [BƯỚC 5] Train model chatbot...
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

echo [BƯỚC 6] Kiểm tra model...
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
