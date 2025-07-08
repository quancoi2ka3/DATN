@echo off
echo =====================================================
echo        DỪNG HỆ THỐNG CHATBOT SUN MOVEMENT
echo =====================================================
echo.

echo [1] Dừng tất cả tiến trình Rasa...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im python.exe /fi "WINDOWTITLE eq *Rasa-Actions*" 2>nul
taskkill /f /im python.exe /fi "WINDOWTITLE eq *Rasa-Chatbot*" 2>nul
taskkill /f /im rasa.exe 2>nul

echo [2] Đợi các tiến trình dừng hoàn tất...
timeout /t 3 /nobreak >nul

echo [3] Kiểm tra ports đã được giải phóng...
echo Kiểm tra port 5005 (Rasa)...
netstat -ano | findstr ":5005" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo [CẢNH BÁO] Port 5005 vẫn đang được sử dụng
) else (
    echo [OK] Port 5005 đã được giải phóng
)

echo Kiểm tra port 5055 (Action Server)...
netstat -ano | findstr ":5055" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo [CẢNH BÁO] Port 5055 vẫn đang được sử dụng
) else (
    echo [OK] Port 5055 đã được giải phóng
)

echo.
echo ✅ Hệ thống chatbot đã được dừng
echo.

pause
