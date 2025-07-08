@echo off
setlocal enabledelayedexpansion

echo =====================================================
echo      KHỞI ĐỘNG TỰ ĐỘNG CHATBOT SUN MOVEMENT
echo      (Không cần tương tác - Hoàn toàn tự động)
echo =====================================================
echo.

:: Biến môi trường
set CHATBOT_DIR=d:\DATN\DATN\sun-movement-chatbot
set RASA_PORT=5005
set ACTION_PORT=5055

echo [1/6] Dọn dẹp tiến trình cũ...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im rasa.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Kiểm tra môi trường...
cd /d "%CHATBOT_DIR%"
if not exist "%CD%" (
    echo [LỖI] Thư mục chatbot không tồn tại: %CHATBOT_DIR%
    exit /b 1
)

if not exist "rasa_env_310\Scripts\activate.bat" (
    echo [LỖI] Môi trường Python chưa được setup
    exit /b 1
)

echo [3/6] Kiểm tra model...
if not exist "models\*.tar.gz" (
    echo [AUTO-TRAIN] Tự động train model...
    call rasa_env_310\Scripts\activate
    rasa train --force --quiet
    if !errorlevel! neq 0 (
        echo [LỖI] Không thể train model
        exit /b 1
    )
)

echo [4/6] Khởi động Action Server...
start /MIN "Rasa-Actions" cmd /c "cd /d %CHATBOT_DIR% && call rasa_env_310\Scripts\activate && python -m rasa_sdk --actions actions --port %ACTION_PORT%"

echo [5/6] Khởi động Rasa Server...
timeout /t 3 /nobreak >nul
start /MIN "Rasa-Server" cmd /c "cd /d %CHATBOT_DIR% && call rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api --port %RASA_PORT%"

echo [6/6] Đợi hệ thống khởi động...
timeout /t 10 /nobreak >nul

:: Kiểm tra nhanh
netstat -an | findstr ":%RASA_PORT%" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Rasa Server: ACTIVE
) else (
    echo [!] Rasa Server: STARTING...
)

netstat -an | findstr ":%ACTION_PORT%" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [✓] Action Server: ACTIVE  
) else (
    echo [!] Action Server: STARTING...
)

echo.
echo =====================================================
echo           CHATBOT SYSTEM STARTED
echo =====================================================
echo.
echo 🤖 Chatbot: http://localhost:%RASA_PORT%
echo ⚡ Actions: http://localhost:%ACTION_PORT%
echo.
echo Commands:
echo   test-chatbot-simple.bat    :: Quick test
echo   stop-chatbot.bat           :: Stop system
echo   monitor-chatbot.bat        :: Monitor & control
echo.
