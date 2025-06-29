@echo off
echo =====================================================
echo      KIỂM TRA TRẠNG THÁI HỆ THỐNG SUN MOVEMENT
echo =====================================================
echo.

color 0B

echo [PHẦN 1] Kiểm tra các tiến trình đang chạy
echo --------------------------------------------
echo.

echo Tiến trình Node.js (Frontend/Backend):
tasklist /fi "imagename eq node.exe" | findstr "node.exe"

echo.
echo Tiến trình Python/Rasa (Chatbot):
tasklist /fi "imagename eq python.exe" | findstr "python.exe"

echo.
echo [PHẦN 2] Kiểm tra các port đang sử dụng
echo --------------------------------------------
echo.

echo Port 3000 (Frontend):
netstat -ano | findstr ":3000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo [OK] Frontend đang chạy
) else (
    echo [KHÔNG CHẠY] Frontend không hoạt động
)

echo.
echo Port 5000 (Backend):
netstat -ano | findstr ":5000" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo [OK] Backend đang chạy
) else (
    echo [KHÔNG CHẠY] Backend không hoạt động
)

echo.
echo Port 5005 (Rasa Chatbot):
netstat -ano | findstr ":5005" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo [OK] Rasa Chatbot đang chạy
) else (
    echo [KHÔNG CHẠY] Rasa Chatbot không hoạt động
)

echo.
echo [PHẦN 3] Kiểm tra kết nối đến các dịch vụ
echo --------------------------------------------
echo.

echo Kiểm tra kết nối đến Frontend (NextJS)...
curl -s -o nul -w "Trạng thái Frontend: %%{http_code}\n" http://localhost:3000/ 2>nul
if %errorlevel% neq 0 echo [LỖI] Không thể kết nối đến Frontend

echo Kiểm tra kết nối đến Backend...
curl -s -o nul -w "Trạng thái Backend: %%{http_code}\n" http://localhost:5000/api/health 2>nul
if %errorlevel% neq 0 echo [LỖI] Không thể kết nối đến Backend

echo Kiểm tra kết nối đến Rasa Chatbot...
curl -s -o nul -w "Trạng thái Rasa: %%{http_code}\n" http://localhost:5005/ 2>nul
if %errorlevel% neq 0 echo [LỖI] Không thể kết nối đến Rasa Chatbot

echo.
echo =====================================================
echo            TỔNG KẾT TRẠNG THÁI HỆ THỐNG
echo =====================================================
echo.

:: Kiểm tra và hiển thị tổng kết
set /a services_running=0

netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [✓] Frontend đang hoạt động: http://localhost:3000
    set /a services_running+=1
) else (
    echo [✗] Frontend không hoạt động
)

netstat -ano | findstr ":5000" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [✓] Backend đang hoạt động: http://localhost:5000
    set /a services_running+=1
) else (
    echo [✗] Backend không hoạt động
)

netstat -ano | findstr ":5005" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo [✓] Rasa Chatbot đang hoạt động: http://localhost:5005
    set /a services_running+=1
) else (
    echo [✗] Rasa Chatbot không hoạt động
)

echo.
if %services_running% equ 3 (
    echo [HOÀN TẤT] Tất cả dịch vụ đang hoạt động bình thường.
    echo Bạn có thể truy cập website tại: http://localhost:3000
) else (
    echo [CẢNH BÁO] Một số dịch vụ không hoạt động (%services_running%/3).
    echo Bạn có thể khởi động lại hệ thống bằng script start-full-system.bat
)

echo.
echo ----------------------------------------------------
echo 1. Khởi động tất cả: start-full-system.bat
echo 2. Dừng tất cả: stop-all-services.bat
echo 3. Kiểm tra lại: check-system-status.bat
echo ----------------------------------------------------

pause
