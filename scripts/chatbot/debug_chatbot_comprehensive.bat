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

echo [1/4] Kiểm tra tiến trình frontend...
tasklist /fi "imagename eq node.exe" | findstr /i "node" > nul
if %errorlevel% equ 0 (
    echo Đang dừng các tiến trình Node.js...
    taskkill /f /im node.exe
    ping 127.0.0.1 -n 3 >nul
)

echo.
echo [2/4] Khởi động lại frontend...
cd /d "%frontendDir%"
start "Frontend Server" cmd /c "cd /d %frontendDir% && npm run dev"

echo Đợi 15 giây để frontend khởi động...
ping 127.0.0.1 -n 16 >nul

echo.
echo [3/4] Kiểm tra các câu hỏi đơn giản...
cd /d "%chatbotDir%"

if exist "rasa_env_310\Scripts\activate" (
    echo Kích hoạt môi trường Python...
    call rasa_env_310\Scripts\activate
    
    echo Chạy script test đơn giản...
    python simple_compare.py
) else (
    echo Chạy script bằng Python hệ thống...
    python simple_compare.py
)

echo.
echo [4/4] Phân tích chi tiết phản hồi từ Rasa và API proxy...

if exist "rasa_env_310\Scripts\activate" (
    echo Chạy script test chi tiết...
    python test_rasa_debug.py
) else (
    echo Chạy script bằng Python hệ thống...
    python test_rasa_debug.py
)

echo.
echo =======================================================
echo Kiểm tra hoàn tất. Hãy kiểm tra các file kết quả:
echo - simple_comparison_results.txt (kết quả so sánh đơn giản)
echo - test_parse_results.txt (kết quả phân loại intent)
echo - test_webhook_results.txt (kết quả phản hồi webhook)
echo - test_frontend_results.txt (kết quả phản hồi qua API proxy)
echo =======================================================
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
