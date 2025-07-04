@echo off
echo =======================================================
echo     SỬA CHỮA VÀ ÁP DỤNG THAY ĐỔI CHO CHATBOT
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "chatbotDir=%rootDir%\sun-movement-chatbot"
set "frontendDir=%rootDir%\sun-movement-frontend"

echo [1/4] Sao lưu file route.ts gốc...
copy "%frontendDir%\src\app\api\chatbot\route.ts" "%frontendDir%\src\app\api\chatbot\route.ts.bak" /Y
if %errorlevel% neq 0 (
    echo [LỖI] Không thể sao lưu file route.ts
    pause
    exit /b 1
) else (
    echo [OK] Đã sao lưu file route.ts thành route.ts.bak
)

echo.
echo [2/4] Áp dụng phiên bản sửa chữa...
copy "%frontendDir%\src\app\api\chatbot\fixed-route.ts" "%frontendDir%\src\app\api\chatbot\route.ts" /Y
if %errorlevel% neq 0 (
    echo [LỖI] Không thể áp dụng bản sửa chữa
    pause
    exit /b 1
) else (
    echo [OK] Đã áp dụng bản sửa chữa thành công
)

echo.
echo [3/4] Kiểm tra kết nối tới Rasa...
echo.
cd /d "%chatbotDir%"

echo Kiểm tra tiến trình Rasa...
tasklist /fi "imagename eq python.exe" | findstr /i "rasa" > nul
if %errorlevel% equ 0 (
    echo [OK] Tiến trình Rasa đang chạy
) else (
    echo [CẢNH BÁO] Không tìm thấy tiến trình Rasa đang chạy
    echo Có thể cần khởi động lại Rasa server
    
    choice /c YN /m "Bạn có muốn khởi động lại Rasa không? (Y/N)"
    if !errorlevel! equ 1 (
        echo.
        echo Khởi động lại Rasa server...
        echo.
        start "Rasa Server" cmd /k "cd /d %chatbotDir% && rasa_env_310\Scripts\activate && rasa run --enable-api --cors * --debug --port 5005"
        
        echo Đợi 10 giây để server khởi động...
        ping 127.0.0.1 -n 11 >nul
    )
)

echo.
echo [4/4] Kiểm tra kết nối và các câu hỏi mẫu...
echo.

if exist "advanced_webhook_test.py" (
    echo Chạy script kiểm tra chi tiết...
    
    if exist "rasa_env_310\Scripts\activate" (
        echo Kích hoạt môi trường Python...
        call rasa_env_310\Scripts\activate
        
        echo Chạy script test...
        python advanced_webhook_test.py
        
    ) else (
        echo [CẢNH BÁO] Không tìm thấy môi trường Python
        echo Chạy script bằng Python cài đặt trên hệ thống...
        python advanced_webhook_test.py
    )
) else (
    echo [CẢNH BÁO] Không tìm thấy script advanced_webhook_test.py
    echo Kiểm tra bằng cách sử dụng curl...
    
    echo.
    echo Kiểm tra kết nối trực tiếp tới Rasa (xin chào):
    curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" -H "Content-Type: application/json" -d "{\"sender\":\"test_user\",\"message\":\"xin chào\"}"
    echo.
    
    echo.
    echo Kiểm tra kết nối tới API proxy (xin chào):
    curl -s -X POST "http://localhost:3000/api/chatbot" -H "Content-Type: application/json" -d "{\"sender\":\"test_user\",\"message\":\"xin chào\"}"
    echo.
)

echo.
echo =======================================================
echo [KẾT LUẬN] Các thay đổi đã được áp dụng thành công.
echo Nếu vẫn gặp vấn đề, vui lòng thử:
echo 1. Làm mới trình duyệt (Ctrl+F5)
echo 2. Khởi động lại Frontend: npm run dev
echo 3. Chạy lại hệ thống đầy đủ: start-full-system.bat
echo =======================================================
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
