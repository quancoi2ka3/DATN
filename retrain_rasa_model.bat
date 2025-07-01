@echo off
echo =======================================================
echo    TRAIN LẠI MODEL RASA CHATBOT SUN MOVEMENT
echo =======================================================
echo.
color 0A
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo [1/5] Kiểm tra môi trường Rasa...
cd /d "%chatbotDir%"

:: Kiểm tra Rasa đã được cài đặt chưa
rasa --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Không tìm thấy Rasa. Hãy cài đặt Rasa trước!
    echo pip install rasa
    goto END
)
echo Đã tìm thấy Rasa, tiếp tục...

echo.
echo [2/5] Tạo bản sao lưu model hiện tại...
if not exist "%chatbotDir%\models_backup" mkdir "%chatbotDir%\models_backup"

:: Di chuyển các model cũ vào thư mục backup
if exist "%chatbotDir%\models\*.tar.gz" (
    move /Y "%chatbotDir%\models\*.tar.gz" "%chatbotDir%\models_backup\" > nul
    echo Đã sao lưu các model cũ vào thư mục models_backup
) else (
    echo Không tìm thấy model cũ để sao lưu
)

echo.
echo [3/5] Chỉnh sửa file domain.yml để đảm bảo phản hồi chính xác...
:: Tạo bản sao lưu domain.yml
if exist "%chatbotDir%\domain.yml" copy /Y "%chatbotDir%\domain.yml" "%chatbotDir%\domain.yml.bak" > nul

echo Đã sao lưu domain.yml thành domain.yml.bak
echo Bạn có muốn mở file domain.yml để chỉnh sửa thủ công không? (Y/N)
choice /c YN /m "Mở file để chỉnh sửa:"

if errorlevel 2 goto SKIP_EDIT_DOMAIN
if errorlevel 1 (
    start notepad "%chatbotDir%\domain.yml"
    echo Vui lòng kiểm tra và chỉnh sửa các phản hồi trong domain.yml.
    echo Đặc biệt chú ý đến các phần liên quan đến payment và fallback.
    echo.
    echo Sau khi chỉnh sửa xong, hãy lưu lại và đóng Notepad.
    echo.
    pause
)

:SKIP_EDIT_DOMAIN
echo.
echo [4/5] Train model mới...
echo Đang train model mới. Quá trình này có thể mất vài phút...

cd /d "%chatbotDir%"
echo Xóa cache trước khi train...
if exist "%chatbotDir%\.rasa" rd /s /q "%chatbotDir%\.rasa"

:: Train model mới với tùy chọn --force
rasa train --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Lỗi khi train model! Kiểm tra lại file cấu hình và thử lại.
    goto END
)

echo.
echo [5/5] Khởi động lại Rasa server với model mới...
echo Đang dừng Rasa server hiện tại (nếu có)...

:: Dừng các tiến trình Rasa hiện tại
tasklist /fi "imagename eq rasa.exe" | find /i "rasa.exe" > nul
if %errorlevel% equ 0 (
    taskkill /f /im rasa.exe > nul 2>&1
    echo Đã dừng Rasa server
) else (
    echo Không tìm thấy Rasa server đang chạy
)

:: Khởi động lại Rasa server với model mới
echo Đang khởi động Rasa server với model mới...
start cmd /k "cd /d %chatbotDir% && rasa run --enable-api --cors "*""

echo.
echo =======================================================
echo Train model hoàn tất!
echo.
echo Rasa server đã được khởi động lại với model mới.
echo Đợi khoảng 30 giây để Rasa server khởi động hoàn tất.
echo =======================================================
echo.
echo Bạn muốn kiểm tra model mới ngay bây giờ không? (Y/N)
choice /c YN /m "Kiểm tra model mới:"

if errorlevel 2 goto END
if errorlevel 1 (
    echo.
    echo Đợi 10 giây để Rasa server khởi động...
    timeout /t 10 > nul
    
    echo Đang kiểm tra model mới...
    cd /d "%chatbotDir%"
    
    :: Nếu file test_rasa_model.py tồn tại, sử dụng nó để test
    if exist "%chatbotDir%\test_rasa_model.py" (
        python test_rasa_model.py
    ) else (
        :: Nếu không, tạo một lệnh curl đơn giản để test
        echo Kiểm tra bằng lệnh curl:
        curl -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"test\", \"message\":\"xin chào\"}"
        echo.
        echo Kiểm tra intent:
        curl -X POST http://localhost:5005/model/parse -H "Content-Type: application/json" -d "{\"text\":\"xin chào\"}"
        echo.
    )
)

:END
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
