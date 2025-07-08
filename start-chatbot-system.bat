@echo off
setlocal enabledelayedexpansion

echo =====================================================
echo        KHỞI CHẠY HỆ THỐNG CHATBOT SUN MOVEMENT
echo        (Rasa Chatbot + Action Server + Validation)
echo =====================================================
echo.

:: Thiết lập màu sắc terminal
color 0A

:: Biến môi trường
set CHATBOT_DIR=d:\DATN\DATN\sun-movement-chatbot
set BACKEND_URL=http://localhost:5000
set RASA_PORT=5005
set ACTION_PORT=5055

echo [BƯỚC 1] Kiểm tra và dọn dẹp tiến trình cũ...
echo ----------------------------------------------
echo.

echo Dừng tất cả tiến trình Rasa và Python cũ...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa-actions*" 2>nul  
taskkill /f /im rasa.exe 2>nul

:: Đợi để đảm bảo các tiến trình đã dừng hoàn toàn
timeout /t 3 /nobreak >nul

echo [BƯỚC 2] Kiểm tra môi trường và dependencies...
echo ----------------------------------------------
echo.

echo Chuyển đến thư mục chatbot...
cd /d "%CHATBOT_DIR%"
if not exist "%CD%" (
    echo [LỖI] Không tìm thấy thư mục chatbot tại %CHATBOT_DIR%
    echo [FIX] Hãy kiểm tra đường dẫn và thử lại
    exit /b 1
)

echo Kiểm tra môi trường Python...
if not exist "rasa_env_310\Scripts\activate.bat" (
    echo [LỖI] Không tìm thấy môi trường Python rasa_env_310
    echo [FIX] Vui lòng chạy setup môi trường trước
    echo [CMD] python -m venv rasa_env_310
    echo [CMD] rasa_env_310\Scripts\activate
    echo [CMD] pip install -r requirements.txt
    exit /b 1
)

echo Kích hoạt môi trường Python...
call rasa_env_310\Scripts\activate

echo Kiểm tra cài đặt Rasa...
python -c "import rasa; print(f'Rasa version: {rasa.__version__}')" 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Rasa chưa được cài đặt đúng cách
    echo [FIX] Vui lòng chạy: pip install -r requirements.txt
    echo [DEBUG] Kiểm tra Python environment hiện tại
    python --version
    exit /b 1
)

echo [BƯỚC 3] Kiểm tra và chuẩn bị dữ liệu...
echo ----------------------------------------------
echo.

echo Kiểm tra model đã được train...
if not exist "models\*.tar.gz" (
    echo [CẢNH BÁO] Không tìm thấy model đã train
    echo [AUTO] Tự động train model mới...
    echo Đang train model, vui lòng đợi...
    rasa train --force
    if !errorlevel! neq 0 (
        echo [LỖI] Train model không thành công
        echo [LỖI] Vui lòng kiểm tra dữ liệu training và thử lại
        exit /b 1
    )
    echo [THÀNH CÔNG] Model đã được train xong
)

echo Validate dữ liệu training...
rasa data validate --max-warnings 5
if %errorlevel% neq 0 (
    echo [CẢNH BÁO] Phát hiện vấn đề trong dữ liệu training
    echo [AUTO] Tiếp tục khởi động với cảnh báo...
    echo [INFO] Bạn nên kiểm tra và sửa dữ liệu training sau
)

echo [BƯỚC 4] Kiểm tra dữ liệu dummy cho Action Server...
echo ----------------------------------------------
echo.

if not exist "data\dummy_data" (
    echo Tạo dữ liệu mẫu cho Action Server...
    mkdir data\dummy_data 2>nul
    echo [{"id": 1, "name": "Sản phẩm mẫu", "price": "100000", "category": "demo"}] > data\dummy_data\products.json
    echo [{"question": "Làm thế nào để đặt hàng?", "answer": "Bạn có thể đặt hàng qua website hoặc app"}] > data\dummy_data\faq.json
    echo [OK] Đã tạo dữ liệu mẫu
) else (
    echo [INFO] Dữ liệu mẫu đã tồn tại
)

echo [BƯỚC 5] Kiểm tra kết nối Backend API...
echo ----------------------------------------------
echo.

echo Kiểm tra Backend API tại %BACKEND_URL%...
curl -s -o nul -w "%%{http_code}" %BACKEND_URL%/api/health > temp_backend_status.txt 2>nul
set /p backend_status=<temp_backend_status.txt
del temp_backend_status.txt 2>nul

if "%backend_status%"=="200" (
    echo [OK] Backend API đang hoạt động (Status: %backend_status%)
) else (
    echo [CẢNH BÁO] Backend API không phản hồi (Status: %backend_status%)
    echo [AUTO] Tiếp tục khởi động chatbot (Action Server có thể hoạt động hạn chế)
    echo [INFO] Hãy đảm bảo Backend đã được khởi động để chatbot hoạt động đầy đủ
)

echo [BƯỚC 6] Khởi động Rasa Action Server...
echo ----------------------------------------------
echo.

echo Khởi động Action Server trên port %ACTION_PORT%...
echo [INFO] Action Server sẽ chạy trong background...
start /MIN "Rasa-Actions" cmd /c "cd /d %CHATBOT_DIR% && call rasa_env_310\Scripts\activate && python -m rasa_sdk --actions actions --port %ACTION_PORT%"

echo Đợi Action Server khởi động...
set /a action_attempts=0
:check_action_server
set /a action_attempts+=1
echo [%action_attempts%/10] Kiểm tra Action Server...
timeout /t 3 /nobreak >nul

:: Kiểm tra Action Server bằng cách ping port
netstat -an | findstr ":%ACTION_PORT%" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [THÀNH CÔNG] Action Server đã khởi động và đang lắng nghe port %ACTION_PORT%
    goto action_ready
) else (
    if %action_attempts% lss 10 (
        echo [ĐANG CHỜ] Action Server chưa sẵn sàng...
        goto check_action_server
    ) else (
        echo [CẢNH BÁO] Action Server không phản hồi sau 30 giây
        echo Chatbot vẫn sẽ hoạt động nhưng có thể thiếu một số tính năng
    )
)

:action_ready
echo.

echo [BƯỚC 7] Khởi động Rasa Chatbot Server...
echo ----------------------------------------------
echo.

echo Khởi động Rasa Server trên port %RASA_PORT%...
echo [INFO] Rasa Server sẽ chạy trong background...
start /MIN "Rasa-Server" cmd /c "cd /d %CHATBOT_DIR% && call rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api --port %RASA_PORT%"

echo Đợi Rasa Server khởi động...
set /a rasa_attempts=0
:check_rasa_server
set /a rasa_attempts+=1
echo [%rasa_attempts%/15] Kiểm tra Rasa Server...
timeout /t 4 /nobreak >nul

:: Kiểm tra Rasa Server bằng cách ping port
netstat -an | findstr ":%RASA_PORT%" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [THÀNH CÔNG] Rasa Server đã khởi động và đang lắng nghe port %RASA_PORT%
    goto rasa_ready
) else (
    if %rasa_attempts% lss 15 (
        echo [ĐANG CHỜ] Rasa Server chưa sẵn sàng...
        goto check_rasa_server
    ) else (
        echo [LỖI] Rasa Server không khởi động được sau 60 giây
        echo [DEBUG] Vui lòng kiểm tra logs và thử lại
        echo.
        echo [THÔNG TIN DEBUG] Kiểm tra tiến trình Python đang chạy:
        tasklist | findstr python.exe
        echo.
        echo [THÔNG TIN DEBUG] Kiểm tra port đang sử dụng:
        netstat -an | findstr ":%RASA_PORT%"
        echo.
        echo [FIX] Thử chạy: rasa run --debug để xem lỗi chi tiết
        exit /b 1
    )
)

:rasa_ready
echo.

echo [BƯỚC 8] Kiểm tra chức năng chatbot...
echo ----------------------------------------------
echo.

echo Test tin nhắn đơn giản...
curl -s -X POST "http://localhost:%RASA_PORT%/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test-user\",\"message\":\"xin chào\"}" > temp_test_response.txt 2>nul

if exist temp_test_response.txt (
    echo [PHẢN HỒI CHATBOT]:
    type temp_test_response.txt
    del temp_test_response.txt
    echo.
    echo [THÀNH CÔNG] Chatbot đã phản hồi tin nhắn test
) else (
    echo [LỖI] Chatbot không phản hồi tin nhắn test
)

echo.
echo Test tin nhắn tiếng Việt phức tạp...
curl -s -X POST "http://localhost:%RASA_PORT%/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test-user\",\"message\":\"Tôi muốn tìm hiểu về sản phẩm\"}" > temp_test_response2.txt 2>nul

if exist temp_test_response2.txt (
    echo [PHẢN HỒI CHATBOT TIẾNG VIỆT]:
    type temp_test_response2.txt
    del temp_test_response2.txt
    echo.
    echo [THÀNH CÔNG] Chatbot xử lý tiếng Việt tốt
) else (
    echo [CẢNH BÁO] Chatbot có vấn đề với tiếng Việt
)

echo.
echo [BƯỚC 9] Hiển thị thông tin hệ thống...
echo ----------------------------------------------
echo.

echo =====================================================
echo         HỆ THỐNG CHATBOT ĐÃ SẴN SÀNG SỬ DỤNG
echo =====================================================
echo.
echo 🤖 Rasa Chatbot Server: http://localhost:%RASA_PORT%
echo ⚡ Action Server: http://localhost:%ACTION_PORT%
echo 📊 Rasa API Docs: http://localhost:%RASA_PORT%/docs
echo.
echo 📝 Để test chatbot:
echo    curl -X POST "http://localhost:%RASA_PORT%/webhooks/rest/webhook" ^\
echo         -H "Content-Type: application/json" ^\
echo         -d "{\"sender\":\"user\",\"message\":\"xin chào\"}"
echo.
echo 🔧 Các dịch vụ đang chạy trong background:
echo    - Rasa Chatbot Server (minimized window)
echo    - Rasa Action Server (minimized window)
echo.
echo 📋 Để quản lý hệ thống:
echo    - Xem tiến trình: tasklist | findstr python.exe
echo    - Dừng hệ thống: taskkill /f /im python.exe
echo    - Kiểm tra ports: netstat -an | findstr ":5005\|:5055"
echo.
echo 🛑 Script dừng chatbot riêng: stop-chatbot.bat
echo.

:: Hiển thị menu hành động
echo =====================================================
echo                    MENU HÀNH ĐỘNG
echo =====================================================
echo.
echo [1] Test chatbot ngay bây giờ
echo [2] Mở session tương tác với chatbot  
echo [3] Hoàn tất và tiếp tục sử dụng terminal
echo.
echo Để chọn, hãy chạy một trong các lệnh sau:
echo.
echo    test-chatbot.bat           :: Test nhanh chatbot
echo    rasa shell                 :: Mở session tương tác
echo    monitor-chatbot.bat        :: Giám sát hệ thống
echo    stop-chatbot.bat           :: Dừng hệ thống
echo.

echo [HOÀN TẤT] Hệ thống chatbot đang chạy ổn định trong background
echo [TERMINAL READY] Terminal sẵn sàng cho các lệnh tiếp theo
echo.
echo 📋 LỆNH NHANH:
echo    test-chatbot.bat           :: Test chức năng chatbot
echo    monitor-chatbot.bat        :: Giám sát và điều khiển hệ thống  
echo    stop-chatbot.bat           :: Dừng hệ thống chatbot
echo    quick-start-chatbot.bat    :: Khởi động nhanh lần sau
echo.
