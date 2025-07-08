@echo off
echo =====================================================
echo       GIÁM SÁT HỆ THỐNG CHATBOT SUN MOVEMENT
echo =====================================================
echo.

:monitor_loop
cls
echo =====================================================
echo       TRẠNG THÁI HỆ THỐNG CHATBOT - %date% %time%
echo =====================================================
echo.

echo [1] KIỂM TRA TIẾN TRÌNH...
echo.
echo Các tiến trình Python đang chạy:
tasklist | findstr python.exe | findstr -v "findstr"
if %errorlevel% neq 0 echo [INFO] Không có tiến trình Python nào đang chạy
echo.

echo [2] KIỂM TRA PORTS...
echo.
echo Port 5005 (Rasa Server):
netstat -an | findstr ":5005" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [ACTIVE] ✅ Rasa Server đang hoạt động
) else (
    echo [OFFLINE] ❌ Rasa Server không hoạt động
)

echo Port 5055 (Action Server):
netstat -an | findstr ":5055" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [ACTIVE] ✅ Action Server đang hoạt động
) else (
    echo [OFFLINE] ❌ Action Server không hoạt động
)

echo Port 5000 (Backend API):
netstat -an | findstr ":5000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [ACTIVE] ✅ Backend API đang hoạt động
) else (
    echo [OFFLINE] ❌ Backend API không hoạt động
)
echo.

echo [3] TEST NHANH CHATBOT...
echo.
curl -s -m 5 -o nul -w "Rasa Health Check: %%{http_code}\n" http://localhost:5005/ 2>nul
echo.

echo [4] THÔNG TIN HỆ THỐNG...
echo.
echo Memory Usage:
tasklist | findstr python.exe | findstr -v "findstr" >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=1,5" %%a in ('tasklist ^| findstr python.exe ^| findstr -v findstr') do (
        echo - %%a: %%b KB
    )
) else (
    echo [INFO] Không có tiến trình Python nào
)
echo.

echo =====================================================
echo [ĐIỀU KHIỂN]
echo 1. Refresh (R)    2. Start (S)    3. Stop (T)    4. Test (E)    5. Exit (Q)
echo =====================================================
echo.

choice /C RSTEQ /N /M "Chọn hành động (R/S/T/E/Q): "

if errorlevel 5 goto exit_monitor
if errorlevel 4 goto test_chatbot
if errorlevel 3 goto stop_system
if errorlevel 2 goto start_system
if errorlevel 1 goto monitor_loop

:start_system
echo.
echo [KHỞI ĐỘNG] Đang khởi động hệ thống chatbot...
call quick-start-chatbot.bat
timeout /t 3 /nobreak >nul
goto monitor_loop

:stop_system
echo.
echo [DỪNG] Đang dừng hệ thống chatbot...
call stop-chatbot.bat
timeout /t 3 /nobreak >nul
goto monitor_loop

:test_chatbot
echo.
echo [TEST] Đang test chatbot...
call test-chatbot.bat
echo.
echo Nhấn phím bất kỳ để quay lại màn hình giám sát...
pause >nul
goto monitor_loop

:exit_monitor
echo.
echo Thoát chế độ giám sát...
echo.
