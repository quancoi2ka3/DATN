@echo off
echo =====================================================
echo      KHỞI ĐỘNG LẠI DỊCH VỤ CỤ THỂ SUN MOVEMENT
echo =====================================================
echo.

color 0E

:menu
cls
echo Chọn dịch vụ bạn muốn khởi động lại:
echo.
echo 1. Frontend (NextJS)
echo 2. Backend Server
echo 3. Rasa Chatbot 
echo 4. Tất cả dịch vụ
echo 5. Thoát
echo.
set /p choice=Lựa chọn của bạn [1-5]: 

if "%choice%"=="1" goto restart_frontend
if "%choice%"=="2" goto restart_backend
if "%choice%"=="3" goto restart_chatbot
if "%choice%"=="4" goto restart_all
if "%choice%"=="5" goto end

echo Lựa chọn không hợp lệ. Vui lòng thử lại.
timeout /t 2 > nul
goto menu

:restart_frontend
echo.
echo Đang dừng Frontend...
taskkill /f /im node.exe /fi "WINDOWTITLE eq *Frontend*" 2>nul
timeout /t 3 > nul

echo Đang khởi động lại Frontend...
start "Sun Movement Frontend" cmd /k "cd /d d:\DATN\DATN\sun-movement-frontend && npm run dev"

echo.
echo Frontend đã được khởi động lại!
echo URL: http://localhost:3000
echo.
pause
goto menu

:restart_backend
echo.
echo Đang dừng Backend...
taskkill /f /im node.exe /fi "WINDOWTITLE eq *Backend*" 2>nul
timeout /t 3 > nul

echo Đang khởi động lại Backend...
start "Sun Movement Backend" cmd /k "cd /d d:\DATN\DATN\sun-movement-backend && npm run dev"

echo.
echo Backend đã được khởi động lại!
echo URL: http://localhost:5000
echo.
pause
goto menu

:restart_chatbot
echo.
echo Đang dừng Rasa Chatbot...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im rasa.exe 2>nul
timeout /t 3 > nul

echo Đang khởi động lại Rasa Chatbot...
start "Rasa Chatbot Server" cmd /k "cd /d d:\DATN\DATN\sun-movement-chatbot && call rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api --debug -p 5005"

echo.
echo Rasa Chatbot đã được khởi động lại!
echo URL: http://localhost:5005
echo.
pause
goto menu

:restart_all
echo.
echo Đang khởi động lại tất cả các dịch vụ...
call d:\DATN\DATN\stop-all-services.bat
timeout /t 3 > nul
call d:\DATN\DATN\start-full-system.bat
goto menu

:end
echo.
echo Cảm ơn bạn đã sử dụng công cụ.
echo.
