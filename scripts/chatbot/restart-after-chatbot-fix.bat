@echo off
echo =======================================================
echo    KHỞI ĐỘNG LẠI FRONTEND SAU KHI SỬA CHATBOT
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "frontendDir=%rootDir%\sun-movement-frontend"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo [1/4] Đảm bảo các thay đổi đã được lưu...
echo * Nếu bạn vừa chỉnh sửa route.ts, hãy đảm bảo đã lưu file.
echo.
timeout /t 3 > nul

echo [2/4] Dừng frontend hiện tại...
tasklist /fi "imagename eq node.exe" | findstr /i "node" > nul
if %errorlevel% equ 0 (
    echo Đang dừng các tiến trình Node.js...
    taskkill /f /im node.exe
    ping 127.0.0.1 -n 3 >nul
)

echo.
echo [3/4] Khởi động lại frontend...
cd /d "%frontendDir%"
start cmd /k "cd /d %frontendDir% && npm run dev"
echo Đợi 15 giây để frontend khởi động...
ping 127.0.0.1 -n 16 >nul

echo.
echo [4/4] Kiểm tra Rasa server...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5005/status' -Method 'GET' -TimeoutSec 5 -ErrorAction Stop; Write-Host 'Rasa server đang chạy' } catch { Write-Host 'Rasa server chưa chạy. Khởi động Rasa...' }"

if !ERRORLEVEL! neq 0 (
    echo Rasa server không hoạt động. Đang khởi động...
    start "Rasa Server" cmd /c "cd /d %chatbotDir% && rasa run --enable-api --cors "*""
    echo Đợi 15 giây để Rasa khởi động...
    ping 127.0.0.1 -n 16 >nul
)

echo.
echo =======================================================
echo Frontend đã được khởi động lại!
echo.
echo Bạn nên chạy kiểm tra độ chính xác của chatbot:
echo 1. Truy cập http://localhost:3000 để thử chatbot trực tiếp
echo 2. Chạy test-chatbot-accuracy.bat để kiểm tra tự động
echo =======================================================
echo.
echo Bạn có muốn chạy kiểm tra độ chính xác của chatbot ngay bây giờ không? (Y/N)
choice /c YN /m "Chạy kiểm tra độ chính xác:"

if errorlevel 2 goto END
if errorlevel 1 goto RUN_TEST

:RUN_TEST
echo.
echo Đang chạy test độ chính xác của chatbot...
cd /d "%chatbotDir%"
python test_chatbot_accuracy.py
goto END

:END
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
