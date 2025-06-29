@echo off
echo =====================================================
echo    KHỞI ĐỘNG ACTION SERVER CHO CHATBOT TIẾNG VIỆT
echo =====================================================
echo.

echo [BƯỚC 1] Dừng tất cả tiến trình Rasa Action Server...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa-actions*" 2>nul
timeout /t 2 /nobreak >nul

echo [BƯỚC 2] Chuyển đến thư mục chatbot...
cd /d d:\DATN\DATN\sun-movement-chatbot

echo [BƯỚC 3] Kích hoạt môi trường...
call rasa_env_310\Scripts\activate

echo [BƯỚC 4] Khởi động Action Server...
echo Đang khởi động Rasa Action Server trên cổng 5055...
start "rasa-actions" cmd /k "title rasa-actions && color 0B && python -m rasa_sdk --actions actions"

echo [THÀNH CÔNG] Action Server đã được khởi động!
echo Bạn có thể truy cập Action Server tại: http://localhost:5055
echo.
echo Lưu ý: Giữ cửa sổ Action Server mở khi sử dụng chatbot.
echo -----------------------------------------------------
echo.
