@echo off
echo =====================================================
echo       KHỞI ĐỘNG NHANH CHATBOT SUN MOVEMENT
echo =====================================================
echo.

:: Chuyển đến thư mục chatbot
cd /d d:\DATN\DATN\sun-movement-chatbot

:: Dừng tiến trình cũ
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
timeout /t 2 /nobreak >nul

:: Kích hoạt môi trường
call rasa_env_310\Scripts\activate

echo [1/3] Khởi động Action Server (background)...
start /MIN "Rasa-Actions" cmd /c "cd /d d:\DATN\DATN\sun-movement-chatbot && call rasa_env_310\Scripts\activate && python -m rasa_sdk --actions actions --port 5055"

echo [2/3] Đợi Action Server khởi động...
timeout /t 5 /nobreak >nul

echo [3/3] Khởi động Rasa Chatbot (background)...
start /MIN "Rasa-Chatbot" cmd /c "cd /d d:\DATN\DATN\sun-movement-chatbot && call rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api --port 5005"

echo.
echo ✅ Chatbot đang khởi động trong background...
echo 🤖 Rasa Server: http://localhost:5005
echo ⚡ Action Server: http://localhost:5055
echo.
echo Đợi 10-15 giây để hệ thống khởi động hoàn tất...
echo Bạn có thể tiếp tục sử dụng terminal này.
echo.
echo Để test: .\test-chatbot.bat
echo Để dừng: .\stop-chatbot.bat
