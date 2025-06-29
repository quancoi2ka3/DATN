@echo off
echo ========================================
echo COMPLETE RASA CHATBOT SETUP AND TEST
echo ========================================

cd /d "d:\DATN\DATN\sun-movement-chatbot"

echo.
echo [1/6] Kiem tra moi truong...
if not exist "rasa_env_310\Scripts\activate.bat" (
    echo [ERROR] Khong tim thay moi truong Rasa
    pause
    exit /b 1
)

echo.
echo [2/6] Kich hoat moi truong Rasa...
call rasa_env_310\Scripts\activate

echo.
echo [3/6] Dung cac tien trinh cu...
taskkill /f /im rasa.exe 2>nul
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
echo Cho 3 giay...
ping 127.0.0.1 -n 4 >nul

echo.
echo [4/6] Validate du lieu...
rasa data validate
if %errorlevel% neq 0 (
    echo [ERROR] Du lieu validate that bai!
    pause
    exit /b 1
)

echo.
echo [5/6] Train model moi (co the mat 2-3 phut)...
rasa train --force
if %errorlevel% neq 0 (
    echo [ERROR] Train model that bai!
    pause
    exit /b 1
)

echo.
echo [6/6] Khoi dong Rasa server...
echo Rasa server se chay o cua so moi...
start "Rasa Chatbot Server" cmd /k "cd /d d:\DATN\DATN\sun-movement-chatbot && rasa_env_310\Scripts\activate && rasa run --enable-api --cors \"*\" --debug --port 5005"

echo.
echo Cho 15 giay de server khoi dong hoan toan...
ping 127.0.0.1 -n 16 >nul

echo.
echo Testing connection...
curl -X GET "http://localhost:5005/" 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo [SUCCESS] RASA CHATBOT DA SAN SANG!
    echo ==========================================
    echo.
    echo Rasa API: http://localhost:5005
    echo Test message:
    curl -X POST "http://localhost:5005/webhooks/rest/webhook" -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"Xin chao\"}"
    echo.
    echo.
    echo Hay khoi dong frontend website va test chatbot!
    echo Frontend: npm run dev trong thu muc sun-movement-frontend
    echo.
) else (
    echo.
    echo [WARNING] Khong the ket noti den Rasa server
    echo Hay kiem tra logs trong terminal Rasa
)

echo.
echo Nhan Enter de dong...
pause >nul
