@echo off
echo =======================================================
echo    KIỂM TRA CHATBOT SAU KHI SỬA ROUTE.TS
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "frontendDir=%rootDir%\sun-movement-frontend"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo [1/4] Kiểm tra kết nối...
powershell -Command "try { $frontendResponse = Invoke-WebRequest -Uri 'http://localhost:3000' -Method 'GET' -TimeoutSec 3 -ErrorAction Stop; Write-Host 'Frontend hoạt động' } catch { Write-Host 'Frontend không hoạt động' }"
powershell -Command "try { $rasaResponse = Invoke-WebRequest -Uri 'http://localhost:5005/status' -Method 'GET' -TimeoutSec 3 -ErrorAction Stop; Write-Host 'Rasa server hoạt động' } catch { Write-Host 'Rasa server không hoạt động' }"

echo.
echo [2/4] Cài đặt các thư viện cần thiết cho test...
cd /d "%chatbotDir%"
pip install requests colorama

echo.
echo [3/4] Kiểm tra khắc phục lỗi...
cd /d "%chatbotDir%"
python verify_fix.py

echo.
echo [4/4] Kiểm tra xem phân tích chi tiết hơn...
cd /d "%chatbotDir%"
echo Bạn có muốn chạy kiểm tra đầy đủ độ chính xác với tất cả intent? (Y/N)
choice /c YN /m "Chạy test_chatbot_accuracy.py:"

if errorlevel 2 goto END
if errorlevel 1 goto RUN_FULL_TEST

:RUN_FULL_TEST
echo.
echo Đang chạy kiểm tra đầy đủ...
python test_chatbot_accuracy.py

:END
echo.
echo =======================================================
echo Nếu lỗi vẫn còn, vui lòng kiểm tra lại:
echo 1. Đảm bảo frontend đã khởi động lại
echo 2. Kiểm tra log của frontend để phát hiện lỗi
echo 3. Sửa lại logic trong route.ts nếu cần
echo =======================================================
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
