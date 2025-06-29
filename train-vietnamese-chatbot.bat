@echo off
echo =====================================================
echo    TRAIN CHATBOT TIẾNG VIỆT NÂNG CAO
echo =====================================================
echo.

echo [BƯỚC 1] Dừng tất cả tiến trình Rasa...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im rasa.exe 2>nul
timeout /t 3 /nobreak >nul

echo [BƯỚC 2] Chuyển đến thư mục chatbot...
cd /d d:\DATN\DATN\sun-movement-chatbot

echo [BƯỚC 3] Kích hoạt môi trường...
call rasa_env_310\Scripts\activate

echo [BƯỚC 4] Xóa cache cũ (nếu có)...
if exist ".rasa\cache" (
    rmdir /s /q .rasa\cache
    echo ✓ Đã xóa cache cũ
)

echo [BƯỚC 5] Validate dữ liệu...
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

echo [BƯỚC 6] Train model tiếng Việt nâng cao...
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
    echo [THÀNH CÔNG] Train model hoàn tất!
    echo.
)

echo [BƯỚC 7] Backup model mới...
if not exist models\backup mkdir models\backup
copy /y models\*.tar.gz models\backup\
echo ✓ Đã backup model

echo.
echo =====================================================
echo    MODEL TIẾNG VIỆT ĐÃ SẴN SÀNG SỬ DỤNG
echo =====================================================
echo.
echo Bạn có thể khởi động chatbot bằng lệnh:
echo - Khởi động chatbot: start-fixed-rasa-chatbot.bat
echo - Khởi động toàn bộ hệ thống: start-full-system.bat
echo.

pause
