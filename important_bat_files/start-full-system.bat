@echo off
echo =====================================================
echo      KHỞI ĐỘNG ĐẦY ĐỦ HỆ THỐNG SUN MOVEMENT
echo      (Backend + Frontend + Chatbot + Action Server)
echo =====================================================
echo.

:: Thiết lập màu sắc
color 0A

echo [BƯỚC 1] Dừng tất cả các tiến trình liên quan...
echo ----------------------------------------------
echo.

echo Dừng các tiến trình Node.js (Frontend/Backend)...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] Đã dừng các tiến trình Node.js
) else (
    echo [INFO] Không tìm thấy tiến trình Node.js đang chạy
)

echo Dừng các tiến trình Python (Rasa Chatbot và Action Server)...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa-actions*" 2>nul
taskkill /f /im rasa.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] Đã dừng các tiến trình Python/Rasa
) else (
    echo [INFO] Không tìm thấy tiến trình Python/Rasa đang chạy
)

echo Dừng các tiến trình Java/MySQL (nếu có)...
taskkill /f /im java.exe 2>nul
taskkill /f /im mysqld.exe 2>nul

echo Đợi 3 giây để đảm bảo tất cả tiến trình đã dừng...
timeout /t 3 /nobreak >nul

echo.
echo [BƯỚC 2] Kiểm tra port đang sử dụng...
echo ----------------------------------------------
echo.

:: Kiểm tra các port quan trọng
echo Kiểm tra port 3000 (Frontend)...
netstat -ano | findstr ":3000" | findstr "LISTENING"
echo.

echo Kiểm tra port 5000 (Backend)...
netstat -ano | findstr ":5000" | findstr "LISTENING"  
echo.

echo Kiểm tra port 5005 (Rasa Chatbot)...
netstat -ano | findstr ":5005" | findstr "LISTENING"
echo.

:: Hỏi người dùng nếu muốn tiếp tục khi port đang được sử dụng
netstat -ano | findstr ":3000\|:5000\|:5005" | findstr "LISTENING" > nul
if %errorlevel% equ 0 (
    echo [CẢNH BÁO] Một số port cần thiết đang bị chiếm dụng!
    echo Bạn có thể gặp lỗi khi khởi động hệ thống.
    choice /C YN /M "Bạn có muốn tiếp tục không"
    if !errorlevel! equ 2 (
        echo Đã hủy khởi động hệ thống.
        exit /b 1
    )
)

echo.
echo [BƯỚC 3] Khởi động Rasa Chatbot...
echo ----------------------------------------------
echo.

echo Khởi động Rasa Chatbot trong cửa sổ mới...
start "Rasa Chatbot Server" cmd /k "cd /d d:\DATN\DATN\sun-movement-chatbot && call rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api --debug -p 5005"

echo Đợi Rasa khởi động và kiểm tra kết nối...
echo [    ] Đang khởi động Rasa...
timeout /t 5 /nobreak >nul

:: Kiểm tra kết nối liên tục (tối đa 30 giây)
set /a attempts=0
:check_rasa
set /a attempts+=1
echo [%attempts%/12] Kiểm tra kết nối đến Rasa server...
curl -s -o nul -w "%%{http_code}" http://localhost:5005/ > temp_status.txt 2>nul
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="200" (
    echo [THÀNH CÔNG] Rasa Chatbot đã khởi động và phản hồi với mã %status%
    goto rasa_ready
) else (
    if %attempts% lss 12 (
        echo [ĐANG CHỜ] Rasa Chatbot chưa khởi động hoàn tất... (phản hồi: %status%)
        timeout /t 3 /nobreak >nul
        goto check_rasa
    ) else (
        echo [CẢNH BÁO] Không thể xác nhận Rasa đã khởi động sau 30 giây
        echo Tiếp tục khởi động các dịch vụ khác, nhưng chatbot có thể không hoạt động
    )
)

:rasa_ready
echo [====] Rasa đã sẵn sàng!
echo.

echo.
echo [BƯỚC 4] Khởi động Action Server...
echo ----------------------------------------------
echo.

echo Chuẩn bị dữ liệu mẫu cho Action Server...
if not exist "d:\DATN\DATN\sun-movement-chatbot\data\dummy_data" (
    call d:\DATN\DATN\create-dummy-data.bat >nul
    echo [OK] Đã tạo dữ liệu mẫu cho Action Server
) else (
    echo [INFO] Dữ liệu mẫu đã tồn tại
)

echo Khởi động Action Server trong cửa sổ mới...
start "Rasa Action Server" cmd /k "title rasa-actions && color 0B && cd /d d:\DATN\DATN\sun-movement-chatbot && call rasa_env_310\Scripts\activate && python -m rasa_sdk --actions actions"

echo Đợi 5 giây để Action Server khởi động...
echo [    ] Đang khởi động Action Server...
timeout /t 2 /nobreak >nul
echo [==  ] Đang khởi động Action Server...
timeout /t 2 /nobreak >nul
echo [====] Action Server đã sẵn sàng!
echo.

echo.
echo [BƯỚC 5] Khởi động Backend Server...
echo ----------------------------------------------
echo.

echo Khởi động Backend Server trong cửa sổ mới...
start "Sun Movement Backend" cmd /k "cd /d d:\DATN\DATN\sun-movement-backend && npm run dev"

echo Đợi 10 giây để Backend khởi động...
echo [    ] Đang khởi động Backend...
timeout /t 3 /nobreak >nul
echo [=   ] Đang khởi động Backend...
timeout /t 2 /nobreak >nul
echo [==  ] Đang khởi động Backend...
timeout /t 2 /nobreak >nul
echo [=== ] Đang khởi động Backend...
timeout /t 2 /nobreak >nul
echo [====] Backend đã sẵn sàng!
echo.

echo.
echo [BƯỚC 6] Khởi động Frontend NextJS...
echo ----------------------------------------------
echo.

echo Khởi động Frontend NextJS trong cửa sổ mới...
start "Sun Movement Frontend" cmd /k "cd /d d:\DATN\DATN\sun-movement-frontend && npm run dev"

echo Đợi 15 giây để Frontend khởi động...
echo [    ] Đang khởi động Frontend...
timeout /t 4 /nobreak >nul
echo [=   ] Đang khởi động Frontend...
timeout /t 3 /nobreak >nul
echo [==  ] Đang khởi động Frontend...
timeout /t 4 /nobreak >nul
echo [=== ] Đang khởi động Frontend...
timeout /t 3 /nobreak >nul
echo [====] Frontend đã sẵn sàng!
echo.

echo.
echo [BƯỚC 7] Kiểm tra hệ thống...
echo ----------------------------------------------
echo.

:: Kiểm tra kết nối đến các dịch vụ
echo Kiểm tra kết nối đến Frontend (NextJS)...
curl -s -o nul -w "Kết nối Frontend: %%{http_code}\n" http://localhost:3000/ 2>nul
set frontend_status=%errorlevel%
if %frontend_status% neq 0 echo [LỖI] Không thể kết nối đến Frontend

echo Kiểm tra kết nối đến Backend...
curl -s -o nul -w "Kết nối Backend: %%{http_code}\n" http://localhost:5000/api/health 2>nul
set backend_status=%errorlevel%
if %backend_status% neq 0 echo [LỖI] Không thể kết nối đến Backend

echo Kiểm tra kết nối đến Rasa Chatbot...
curl -s -o nul -w "Kết nối Rasa: %%{http_code}\n" http://localhost:5005/ 2>nul
set rasa_status=%errorlevel%

if %rasa_status% neq 0 (
    echo [LỖI] Không thể kết nối đến Rasa Chatbot - Có thể dẫn đến lỗi 503
    echo.
    echo Thử gửi tin nhắn trực tiếp đến Rasa để kiểm tra...
    curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"xin chào\"}" 2>nul
    
    echo.
    echo [CẢNH BÐO] Nếu chatbot không hoạt động, hãy chạy:
    echo d:\DATN\DATN\fix-rasa-503-error.bat
    echo.
) else (
    echo [ĐÃ XÁC NHẬN] Rasa Chatbot đang hoạt động
    
    echo.
    echo Thử gửi tin nhắn trực tiếp đến Rasa API...
    curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"xin chào\"}"
    echo.
    
    echo.
    echo Thử gửi tin nhắn thông qua proxy API...
    curl -s -X POST "http://localhost:3000/api/chatbot" -H "Content-Type: application/json" -d "{\"message\":\"xin chào\",\"senderId\":\"test-user\"}"
    echo.
)

echo.
echo =====================================================
echo          HỆ THỐNG ĐÃ KHỞI ĐỘNG HOÀN TẤT
echo =====================================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo Chatbot: http://localhost:5005
echo.
echo Để dừng toàn bộ hệ thống, chạy: stop-all-services.bat
echo.

pause
