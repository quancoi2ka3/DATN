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

echo [1/3] Kiểm tra các tiến trình Node.js...
tasklist /fi "imagename eq node.exe" | findstr /i "node" > nul
if %errorlevel% equ 0 (
    echo Đang dừng các tiến trình Node.js...
    taskkill /f /im node.exe
    ping 127.0.0.1 -n 3 >nul
)

echo.
echo [2/3] Khởi động lại frontend...
cd /d "%frontendDir%"
start cmd /k "cd /d %frontendDir% && npm run dev"
echo Đợi 15 giây để frontend khởi động...
ping 127.0.0.1 -n 16 >nul

echo.
echo [3/3] Kiểm tra rasa server...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5005/status' -Method 'GET' -TimeoutSec 5 -ErrorAction Stop; Write-Host 'Rasa server đang chạy' } catch { Write-Host 'Rasa server chưa chạy. Khởi động Rasa...' }"

if !ERRORLEVEL! neq 0 (
    echo Khởi động Rasa server...
    start "Rasa Server" cmd /c "%rootDir%\start-chatbot.bat"
    echo Đợi 15 giây để Rasa khởi động...
    ping 127.0.0.1 -n 16 >nul
)

echo.
echo =======================================================
echo Khởi động hoàn tất! Bạn có thể:
echo 1. Truy cập http://localhost:3000 để kiểm tra chatbot
echo 2. Chạy kiểm tra với lệnh test-chatbot-accuracy.bat
echo =======================================================
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
