@echo off
echo =======================================================
echo    KHỞI ĐỘNG LẠI VÀ KIỂM TRA SỬA LỖI TRIỆT ĐỂ
echo =======================================================
echo.
color 0C
setlocal enabledelayedexpansion

set "rootDir=d:\DATN\DATN"
set "frontendDir=%rootDir%\sun-movement-frontend"
set "chatbotDir=%rootDir%\sun-movement-chatbot"

echo [1/3] Dừng tất cả tiến trình Node.js...
taskkill /f /im node.exe >nul 2>&1
ping 127.0.0.1 -n 3 >nul

echo.
echo [2/3] Khởi động lại frontend với các sửa đổi mới...
cd /d "%frontendDir%"
start cmd /k "echo Frontend khởi động với sửa đổi mới... && npm run dev"
echo Đợi 15 giây để frontend khởi động...
ping 127.0.0.1 -n 16 >nul

echo.
echo [3/3] Chạy script debug đơn giản...
cd /d "%chatbotDir%"

if exist "rasa_env_310\Scripts\activate" (
    echo Kích hoạt môi trường Python...
    call rasa_env_310\Scripts\activate
    echo Chạy script debug...
    python debug_simple.py
) else (
    echo Chạy script debug bằng Python hệ thống...
    python debug_simple.py
)

echo.
echo =======================================================
echo CÁC SỬA ĐỔI MỚI:
echo - Loại bỏ điều kiện độ dài tin nhắn (length ^< 10)
echo - Chỉ dùng từ khóa chính xác cho simple query
echo - Cải thiện logic kiểm tra từ khóa phức tạp
echo - Thêm debug log chi tiết trong getSmartResponse
echo - Đặt điều kiện thanh toán ở cuối với điều kiện chặt chẽ
echo =======================================================
echo.
echo Nhấn phím bất kỳ để thoát...
pause > nul
