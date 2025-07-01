@echo off
echo =======================================================
echo          TROUBLESHOOTING RASA CHATBOT SYSTEM
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "chatbotDir=%rootDir%\sun-movement-chatbot"
set "frontendDir=%rootDir%\sun-movement-frontend"

REM Kiểm tra các tiến trình đang chạy
echo [PHẦN 1] Kiểm tra trạng thái hệ thống hiện tại...
echo -------------------------------------------------------
echo.

echo Kiểm tra các port:
echo.

REM Kiểm tra port Rasa (5005)
echo Port 5005 (Rasa Server):
netstat -ano | findstr ":5005" | findstr "LISTENING"
set rasa_running=%errorlevel%
if %rasa_running% equ 0 (
    echo [OK] Rasa Server đang chạy
) else (
    echo [KHÔNG CHẠY] Rasa Server không hoạt động
)
echo.

REM Kiểm tra port Action Server (5055)
echo Port 5055 (Action Server):
netstat -ano | findstr ":5055" | findstr "LISTENING"
set action_running=%errorlevel%
if %action_running% equ 0 (
    echo [OK] Action Server đang chạy
) else (
    echo [KHÔNG CHẠY] Action Server không hoạt động
)
echo.

REM Kiểm tra port Backend (5000)
echo Port 5000 (Backend):
netstat -ano | findstr ":5000" | findstr "LISTENING"
set backend_running=%errorlevel%
if %backend_running% equ 0 (
    echo [OK] Backend đang chạy
) else (
    echo [KHÔNG CHẠY] Backend không hoạt động
)
echo.

REM Kiểm tra port Frontend (3000)
echo Port 3000 (Frontend):
netstat -ano | findstr ":3000" | findstr "LISTENING"
set frontend_running=%errorlevel%
if %frontend_running% equ 0 (
    echo [OK] Frontend đang chạy
) else (
    echo [KHÔNG CHẠY] Frontend không hoạt động
)
echo.

REM Kiểm tra kết nối trực tiếp đến Rasa
echo [PHẦN 2] Kiểm tra kết nối API...
echo -------------------------------------------------------
echo.

REM Kiểm tra status endpoint
echo Kiểm tra Rasa Status Endpoint:
curl -s -o rasa_status.txt -w "Status: %%{http_code}" "http://localhost:5005/status" 2>nul
set rasa_status=%errorlevel%
if %rasa_status% equ 0 (
    echo [OK] Rasa Status API đang hoạt động
    type rasa_status.txt
) else (
    echo [LỖI] Không thể kết nối đến Rasa Status API
)
echo.
if exist rasa_status.txt del rasa_status.txt

REM Kiểm tra webhook endpoint
echo Kiểm tra Rasa Webhook (test gửi "xin chào"):
echo.
curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"xin chào\"}"
echo.
echo.

REM Kiểm tra kết nối thông qua API proxy
echo Kiểm tra API proxy của frontend:
echo.
curl -s -X POST "http://localhost:3000/api/chatbot" -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"xin chào\"}"
echo.
echo.

REM Kiểm tra model Rasa
echo [PHẦN 3] Kiểm tra model Rasa...
echo -------------------------------------------------------
echo.

cd /d "%chatbotDir%"

REM Xác nhận thư mục model
if exist models (
    echo [✓] Thư mục models tồn tại
    dir /b models
) else (
    echo [✗] Thư mục models không tồn tại
)
echo.

REM Kiểm tra dữ liệu NLU
echo Kiểm tra dữ liệu NLU:
if exist data\nlu.yml (
    echo [✓] File nlu.yml tồn tại
    
    REM Kiểm tra intent cụ thể trong nlu.yml
    findstr "intent: product_info" data\nlu.yml >nul
    if !errorlevel! equ 0 (
        echo [✓] Intent product_info tồn tại trong nlu.yml
    ) else (
        echo [✗] Intent product_info không tìm thấy trong nlu.yml
    )
    
    findstr "intent: service_info" data\nlu.yml >nul
    if !errorlevel! equ 0 (
        echo [✓] Intent service_info tồn tại trong nlu.yml
    ) else (
        echo [✗] Intent service_info không tìm thấy trong nlu.yml
    )
) else (
    echo [✗] File nlu.yml không tồn tại
)
echo.

REM Kiểm tra cấu hình endpoint
echo Kiểm tra cấu hình endpoint:
if exist endpoints.yml (
    echo [✓] File endpoints.yml tồn tại
    findstr "action_endpoint" endpoints.yml
) else (
    echo [✗] File endpoints.yml không tồn tại
)
echo.

REM [PHẦN 4] KHẮC PHỤC VẤN ĐỀ
echo [PHẦN 4] Xử lý và khắc phục vấn đề...
echo -------------------------------------------------------
echo.

echo Lựa chọn của bạn:
echo 1. Dừng và khởi động lại Rasa Server
echo 2. Dừng và khởi động lại Action Server
echo 3. Dừng và khởi động lại toàn bộ hệ thống
echo 4. Train lại model Rasa
echo 5. Test chatbot với script Python
echo 6. Kiểm tra logs
echo 7. Thoát
echo.

set /p choice=Chọn một lựa chọn (1-7): 

if "%choice%"=="1" (
    echo.
    echo Dừng Rasa Server...
    taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa run*" 2>nul
    taskkill /f /im rasa.exe /fi "WINDOWTITLE eq *rasa run*" 2>nul
    ping 127.0.0.1 -n 3 >nul
    
    echo Khởi động lại Rasa Server...
    cd /d "%chatbotDir%"
    start "Rasa Server" cmd /k "cd /d %chatbotDir% && rasa_env_310\Scripts\activate && rasa run --enable-api --cors * --debug --port 5005"
    
    echo Đợi 10 giây để server khởi động...
    ping 127.0.0.1 -n 11 >nul
    
    echo Kiểm tra kết nối...
    curl -s -w "Status: %%{http_code}" "http://localhost:5005/status"
    echo.
    echo.
    echo Hoàn tất. Hãy thử lại chatbot trên frontend.
    
) else if "%choice%"=="2" (
    echo.
    echo Dừng Action Server...
    taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa run actions*" 2>nul
    ping 127.0.0.1 -n 3 >nul
    
    echo Khởi động lại Action Server...
    cd /d "%chatbotDir%"
    start "Rasa Action Server" cmd /k "cd /d %chatbotDir% && rasa_env_310\Scripts\activate && rasa run actions --port 5055"
    
    echo Đợi 5 giây để server khởi động...
    ping 127.0.0.1 -n 6 >nul
    
    echo Kiểm tra action endpoint...
    curl -s -w "Status: %%{http_code}" "http://localhost:5055/"
    echo.
    echo.
    echo Hoàn tất. Hãy thử lại chatbot trên frontend.
    
) else if "%choice%"=="3" (
    echo.
    echo Dừng tất cả tiến trình...
    
    taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
    taskkill /f /im rasa.exe 2>nul
    ping 127.0.0.1 -n 3 >nul
    
    echo Khởi động lại toàn bộ hệ thống...
    cd /d "%rootDir%"
    start "Restart Full System" cmd /k "cd /d %rootDir% && start-full-system.bat"
    
    echo Đã bắt đầu khởi động lại hệ thống. Vui lòng theo dõi cửa sổ mới.
    
) else if "%choice%"=="4" (
    echo.
    echo Chuẩn bị train lại model Rasa...
    
    echo Đảm bảo không có tiến trình Rasa đang chạy...
    taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
    taskkill /f /im rasa.exe 2>nul
    ping 127.0.0.1 -n 3 >nul
    
    echo Train model mới...
    cd /d "%chatbotDir%"
    start "Train Rasa Model" cmd /k "cd /d %chatbotDir% && rasa_env_310\Scripts\activate && rasa train --force"
    
    echo Đã bắt đầu quá trình train model. Vui lòng theo dõi cửa sổ mới.
    
) else if "%choice%"=="5" (
    echo.
    echo Chạy script test Python...
    cd /d "%chatbotDir%"
    
    if exist "rasa_env_310\Scripts\activate" (
        echo Kích hoạt môi trường Python...
        call rasa_env_310\Scripts\activate
        
        echo Chạy script test...
        python test_rasa_connection.py
        
    ) else (
        echo [LỖI] Không tìm thấy môi trường Python
        echo Chạy script bằng Python cài đặt trên hệ thống...
        python test_rasa_connection.py
    )
    
) else if "%choice%"=="6" (
    echo.
    echo Kiểm tra logs...
    
    if exist "%chatbotDir%\rasa.log" (
        echo [RASA LOGS]
        type "%chatbotDir%\rasa.log" | findstr /i "error warning"
        echo.
        echo Hiển thị 10 dòng cuối của log:
        echo.
        powershell -command "Get-Content -Path '%chatbotDir%\rasa.log' -Tail 10"
    ) else (
        echo Không tìm thấy file rasa.log
    )
    
    if exist "%chatbotDir%\actions.log" (
        echo.
        echo [ACTION SERVER LOGS]
        type "%chatbotDir%\actions.log" | findstr /i "error warning"
        echo.
        echo Hiển thị 10 dòng cuối của log:
        echo.
        powershell -command "Get-Content -Path '%chatbotDir%\actions.log' -Tail 10"
    ) else (
        echo Không tìm thấy file actions.log
    )
    
) else if "%choice%"=="7" (
    echo Đang thoát...
    goto :end
) else (
    echo Lựa chọn không hợp lệ!
)

:end
echo.
echo =======================================================
echo Nhấn phím bất kỳ để thoát...
pause > nul
