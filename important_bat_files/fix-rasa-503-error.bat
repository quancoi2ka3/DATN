@echo off
echo =====================================================
echo     KHẮC PHỤC LỖI RASA CHATBOT 503 SERVICE ERROR
echo =====================================================
echo.

color 0E
setlocal enabledelayedexpansion

echo [PHẦN 1] Kiểm tra trạng thái hiện tại...
echo.

:: Kiểm tra xem Rasa có đang chạy không
echo Kiểm tra tiến trình Rasa...
tasklist /fi "imagename eq python.exe" /v | findstr /i "rasa" > nul
if %errorlevel% equ 0 (
    echo [THÔNG TIN] Tìm thấy tiến trình Rasa đang chạy.
) else (
    echo [THÔNG TIN] Không tìm thấy tiến trình Rasa đang chạy.
)

:: Kiểm tra port Rasa
echo.
echo Kiểm tra port Rasa (5005)...
netstat -ano | findstr ":5005" | findstr "LISTENING" > nul
if %errorlevel% equ 0 (
    echo [THÔNG TIN] Port 5005 đang được sử dụng.
    netstat -ano | findstr ":5005" | findstr "LISTENING"
) else (
    echo [THÔNG TIN] Port 5005 không được sử dụng.
)

echo.
echo [PHẦN 2] Khởi động lại Rasa chatbot...
echo.

:: Dừng tất cả tiến trình Python liên quan đến Rasa
echo Dừng các tiến trình Rasa hiện tại...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
taskkill /f /im rasa.exe 2>nul
taskkill /f /im python.exe /fi "COMMANDLINE eq *rasa*" 2>nul
echo Đợi 5 giây để đảm bảo tiến trình đã dừng...
timeout /t 5 /nobreak > nul

:: Kiểm tra cài đặt
echo Kiểm tra cài đặt Rasa...
cd /d "d:\DATN\DATN\sun-movement-chatbot" || (
    echo [LỖI] Không tìm thấy thư mục chatbot.
    goto error
)

if not exist "rasa_env_310\Scripts\activate.bat" (
    echo [LỖI] Không tìm thấy môi trường Rasa.
    goto error
)

if not exist "models\*.tar.gz" (
    echo [CẢNH BÁO] Không tìm thấy file model Rasa. Chatbot có thể không hoạt động.
) else (
    echo [OK] Tìm thấy model Rasa.
    dir models\*.tar.gz /b
)

:: Tiến hành khởi động lại với kiểm tra kỹ lưỡng
echo.
echo Kích hoạt môi trường Rasa...
call rasa_env_310\Scripts\activate
echo.

echo Xóa cache và files tạm (nếu có)...
del /q /s .rasa\*.db 2>nul
del /q /s .rasa\cache\* 2>nul
rmdir /q /s .rasa\cache 2>nul
mkdir .rasa\cache 2>nul
echo.

echo Khởi động Rasa với chế độ verbose để kiểm tra lỗi...
start "Rasa Debug Mode" cmd /k "cd /d d:\DATN\DATN\sun-movement-chatbot && call rasa_env_310\Scripts\activate && rasa run --cors "*" --enable-api --verbose --debug -p 5005"
echo.

echo [PHẦN 3] Kiểm tra kết nối...
echo.

:: Chờ và kiểm tra kết nối liên tục
echo Đợi Rasa khởi động và kiểm tra kết nối...
timeout /t 5 /nobreak > nul

set /a max_attempts=20
set /a attempts=0
set success=false

:check_loop
set /a attempts+=1
echo Lần kiểm tra %attempts%/%max_attempts%: Thử kết nối đến Rasa...
curl -s -o rasa_response.txt -w "Mã phản hồi: %%{http_code}" http://localhost:5005/ 2>nul
if %errorlevel% equ 0 (
    echo [THÀNH CÔNG] Kết nối thành công đến Rasa server!
    set success=true
    goto display_result
) else (
    echo [ĐANG CHỜ] Chưa thể kết nối đến Rasa (%attempts%/%max_attempts%)
    if %attempts% lss %max_attempts% (
        timeout /t 3 /nobreak > nul
        goto check_loop
    )
)

:display_result
if "%success%"=="true" (
    echo.
    echo [KIỂM TRA API] Thử gửi tin nhắn test...
    echo.
    curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"xin chào\"}"
    echo.
    echo.
    echo =====================================================
    echo     [THÀNH CÔNG] RASA CHATBOT ĐÃ KHỞI ĐỘNG OK
    echo =====================================================
    echo.
    echo Rasa API: http://localhost:5005
    echo.
    echo Hãy kiểm tra lại website frontend để xem chatbot đã hoạt động chưa.
    echo.
) else (
    echo.
    echo =====================================================
    echo     [CẢNH BÁO] VẪN CÓ VẤN ĐỀ VỚI RASA CHATBOT
    echo =====================================================
    echo.
    echo Hãy thử các giải pháp sau:
    echo.
    echo 1. Kiểm tra logs trong cửa sổ terminal Rasa để tìm lỗi cụ thể
    echo 2. Kiểm tra model chatbot: d:\DATN\DATN\sun-movement-chatbot\models
    echo 3. Train lại model: d:\DATN\DATN\stop-and-train-rasa.bat
    echo 4. Kiểm tra kết nối frontend-backend: Endpoint /api/chatbot
    echo 5. Kiểm tra proxy trong NextJS API route
    echo.
)

goto end

:error
echo.
echo =====================================================
echo     [LỖI] KHÔNG THỂ KHẮC PHỤC LỖI RASA CHATBOT
echo =====================================================

:end
echo.
echo Nhấn phím bất kỳ để kết thúc...
pause > nul
