@echo off
echo =======================================================
echo    KIỂM TRA HIỆU QUẢ CHATBOT SUN MOVEMENT
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo Kiểm tra Rasa server...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5005/status' -Method 'GET' -TimeoutSec 5 -ErrorAction Stop; Write-Host 'Rasa server đang chạy' } catch { Write-Host 'Rasa server chưa chạy. Khởi động Rasa...' }"

if !ERRORLEVEL! neq 0 (
    echo Khởi động Rasa server...
    start cmd /c "%rootDir%\start-chatbot.bat"
    echo Đợi 15 giây để Rasa khởi động...
    ping 127.0.0.1 -n 16 >nul
)

echo.
echo Kiểm tra Frontend server...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -Method 'GET' -TimeoutSec 5 -ErrorAction Stop; Write-Host 'Frontend server đang chạy' } catch { Write-Host 'Frontend server chưa chạy. Khởi động Frontend...' }"

if !ERRORLEVEL! neq 0 (
    echo Khởi động Frontend server...
    start cmd /c "cd /d %rootDir%\sun-movement-frontend && npm run dev"
    echo Đợi 15 giây để Frontend khởi động...
    ping 127.0.0.1 -n 16 >nul
)

echo.
echo Cài đặt các thư viện cần thiết...
if exist "%chatbotDir%\rasa_env_310\Scripts\activate" (
    call "%chatbotDir%\rasa_env_310\Scripts\activate"
    pip install pyyaml requests
) else (
    pip install pyyaml requests
)

echo.
echo Chạy kiểm tra chatbot...
cd /d "%chatbotDir%"
python test_chatbot_accuracy.py

echo.
echo =======================================================
echo    KIỂM TRA HOÀN TẤT
echo =======================================================
echo.
echo Kết quả kiểm tra được lưu trong thư mục logs
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
