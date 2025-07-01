@echo off
echo =======================================================
echo               DEBUG ROUTE.TS TRONG FRONTEND
echo =======================================================
echo.
color 0A

set "rootDir=d:\DATN\DATN"
set "frontendDir=%rootDir%\sun-movement-frontend"

echo [1/2] Dừng các tiến trình Node.js hiện tại...
taskkill /f /im node.exe >nul 2>&1
ping 127.0.0.1 -n 3 >nul

echo.
echo [2/2] Khởi động lại frontend với chế độ debug...
echo - Theo dõi logs để xem luồng xử lý tin nhắn trong route.ts
echo - Chú ý các log bắt đầu bằng [DEBUG]
echo.

cd /d "%frontendDir%"
start cmd /k "echo Đang khởi động frontend... && npm run dev"

echo.
echo =======================================================
echo Frontend đang được khởi động lại với các log debug
echo Sau khi frontend khởi động xong (khoảng 15-20 giây)
echo hãy mở trình duyệt và kiểm tra chatbot
echo =======================================================
echo.
