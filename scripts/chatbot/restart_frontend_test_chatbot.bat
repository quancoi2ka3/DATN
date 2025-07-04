@echo off
echo =======================================================
echo    KHỞI ĐỘNG LẠI FRONTEND VÀ KIỂM TRA CHATBOT
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "frontendDir=%rootDir%\sun-movement-frontend"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo [1/3] Kiểm tra tiến trình frontend...
tasklist /fi "imagename eq node.exe" | findstr /i "node" > nul
if %errorlevel% equ 0 (
    echo Đang dừng các tiến trình Node.js...
    taskkill /f /im node.exe
    ping 127.0.0.1 -n 3 >nul
)

echo.
echo [2/3] Khởi động lại frontend...
cd /d "%frontendDir%"
start "Frontend Server" cmd /c "cd /d %frontendDir% && npm run dev"

echo Đợi 15 giây để frontend khởi động...
ping 127.0.0.1 -n 16 >nul

echo.
echo [3/3] Kiểm tra chatbot với các câu hỏi ngắn gọn...
cd /d "%chatbotDir%"

if exist "rasa_env_310\Scripts\activate" (
    echo Kích hoạt môi trường Python...
    call rasa_env_310\Scripts\activate
    
    echo Chạy script test...
    python simple_test_chatbot.py
    
) else (
    echo Chạy script bằng Python hệ thống...
    python simple_test_chatbot.py
)

echo.
echo =======================================================
echo Khởi động lại và kiểm tra hoàn tất.
echo Hãy kiểm tra kết quả trong file simple_test_results.txt
echo =======================================================
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
