@echo off
echo ======================================================
echo           KHỞI ĐỘNG RASA SHELL ĐỂ KIỂM TRA
echo ======================================================
echo.

set CHATBOT_DIR=d:\DATN\DATN\sun-movement-chatbot
set RASA_ENV=%CHATBOT_DIR%\rasa_env_310

echo [LƯU Ý] Đảm bảo bạn đã chạy Action Server trong một terminal khác!
echo.

echo [BƯỚC 1] Chuyển đến thư mục chatbot...
cd /d "%CHATBOT_DIR%"

echo [BƯỚC 2] Kích hoạt môi trường Rasa...
call "%RASA_ENV%\Scripts\activate.bat"

echo [BƯỚC 3] Khởi động Rasa Shell...
rasa shell

echo.
pause
