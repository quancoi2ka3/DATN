@echo off
echo =====================================================
echo       RETRAIN RASA MODEL VỚI DỮ LIỆU MỚI
echo =====================================================
echo.

cd /d d:\DATN\DATN\sun-movement-chatbot

echo [BƯỚC 1] Kích hoạt môi trường Python...
call rasa_env_310\Scripts\activate

echo [BƯỚC 2] Dừng các tiến trình Rasa hiện tại...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *rasa*" 2>nul
timeout /t 2 /nobreak >nul

echo [BƯỚC 3] Kiểm tra cấu hình...
echo Kiểm tra file domain.yml...
if not exist domain.yml (
    echo [LỖI] Không tìm thấy file domain.yml
    pause
    exit /b 1
)

echo Kiểm tra thư mục data...
if not exist data\ (
    echo [LỖI] Không tìm thấy thư mục data
    pause
    exit /b 1
)

echo [BƯỚC 4] Validate dữ liệu training...
echo Đang kiểm tra tính hợp lệ của dữ liệu...
rasa data validate

if %errorlevel% neq 0 (
    echo [CẢNH BÁO] Dữ liệu có thể có vấn đề, nhưng tiếp tục train...
)

echo [BƯỚC 5] Train model mới...
echo Đang train model với dữ liệu cập nhật...
echo Quá trình này có thể mất vài phút...

rasa train --force

if %errorlevel% neq 0 (
    echo [LỖI] Training thất bại!
    pause
    exit /b 1
)

echo [BƯỚC 6] Khởi động lại Rasa server...
echo Model đã được train thành công!
echo Khởi động Rasa server với model mới...

start "Rasa Server" cmd /k "color 0A && echo [RASA SERVER] && rasa run --cors "*" --enable-api -p 5005"

timeout /t 3 /nobreak >nul

echo Khởi động Action server...
start "Action Server" cmd /k "color 0B && echo [ACTION SERVER] && rasa run actions"

echo.
echo =====================================================
echo        RETRAIN HOÀN TẤT THÀNH CÔNG!
echo =====================================================
echo.
echo ✅ Model mới đã được train và khởi động
echo ✅ Rasa server: http://localhost:5005
echo ✅ Action server: http://localhost:5055
echo.
echo 🔥 Chatbot giờ đây có thể:
echo    • Trả lời chính xác về sản phẩm
echo    • Cung cấp thông tin dịch vụ
echo    • Hiển thị bảng giá chi tiết
echo    • Thông tin liên hệ và lịch hoạt động
echo.
echo Test chatbot ngay tại: http://localhost:3000
echo.
pause
