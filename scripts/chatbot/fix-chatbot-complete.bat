@echo off
echo =======================================================
echo    KHẮC PHỤC VÀ KIỂM TRA LỖI CHATBOT SUN MOVEMENT
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "frontendDir=%rootDir%\sun-movement-frontend"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo [1/6] Kiểm tra kết nối hiện tại...
powershell -Command "try { $rasaResponse = Invoke-WebRequest -Uri 'http://localhost:5005/status' -Method 'GET' -TimeoutSec 3 -ErrorAction Stop; Write-Host 'Rasa server đang hoạt động' } catch { Write-Host 'Rasa server không hoạt động hoặc đang khởi động' }"
powershell -Command "try { $frontendResponse = Invoke-WebRequest -Uri 'http://localhost:3000' -Method 'GET' -TimeoutSec 3 -ErrorAction Stop; Write-Host 'Frontend đang hoạt động' } catch { Write-Host 'Frontend không hoạt động hoặc đang khởi động' }"

echo.
echo [2/6] Cài đặt các thư viện cần thiết...
cd /d "%chatbotDir%"
pip install requests colorama pyyaml

echo.
echo [3/6] Phân tích nguyên nhân lỗi...
python check_rasa_config.py > rasa_config_analysis.txt
echo Kết quả phân tích đã được lưu vào file rasa_config_analysis.txt
timeout /t 3 > nul

echo.
echo [4/6] Khắc phục và retrain model...
python fix_and_retrain_rasa.py
if %ERRORLEVEL% NEQ 0 (
    echo Lỗi khi khắc phục và retrain model
    goto END
)

echo.
echo [5/6] Đợi Rasa server khởi động...
echo Đang đợi 30 giây để Rasa server khởi động hoàn tất...
timeout /t 30 > nul

echo.
echo [6/6] Kiểm tra lại chatbot sau khi khắc phục...
python test_rasa_model.py > rasa_test_results.txt
echo Kết quả kiểm tra đã được lưu vào file rasa_test_results.txt

echo.
echo =======================================================
echo Quá trình khắc phục và kiểm tra đã hoàn tất!
echo.
echo Các file kết quả:
echo - rasa_config_analysis.txt: Phân tích cấu hình Rasa
echo - rasa_test_results.txt: Kết quả kiểm tra model sau khi sửa
echo =======================================================
echo.
echo Bạn có muốn khởi động lại frontend để áp dụng thay đổi? (Y/N)
choice /c YN /m "Khởi động lại frontend:"

if errorlevel 2 goto END
if errorlevel 1 goto RESTART_FRONTEND

:RESTART_FRONTEND
echo.
echo Đang khởi động lại frontend...

tasklist /fi "imagename eq node.exe" | findstr /i "node" > nul
if %errorlevel% equ 0 (
    echo Đang dừng các tiến trình Node.js...
    taskkill /f /im node.exe
    ping 127.0.0.1 -n 3 >nul
)

cd /d "%frontendDir%"
start cmd /k "cd /d %frontendDir% && npm run dev"
echo Frontend đang khởi động lại...

:END
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
