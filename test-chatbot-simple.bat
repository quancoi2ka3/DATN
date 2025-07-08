@echo off
echo =====================================================
echo            TEST NHANH CHATBOT SUN MOVEMENT
echo =====================================================
echo.

:: Kiểm tra Rasa server có đang chạy không
netstat -an | findstr ":5005" | findstr "LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo [LỖI] Rasa server chưa khởi động
    echo [FIX] Hãy chạy start-chatbot-system.bat trước
    echo.
    exit /b 1
)

echo [✓] Rasa server đang chạy
echo.

echo [TEST 1] Chào hỏi cơ bản...
curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test\",\"message\":\"xin chào\"}"
echo.
echo.

echo [TEST 2] Hỏi về sản phẩm...  
curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test\",\"message\":\"tôi muốn mua sản phẩm\"}"
echo.
echo.

echo [TEST 3] Hỏi về thông tin công ty...
curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test\",\"message\":\"công ty bạn làm gì\"}"
echo.
echo.

echo [TEST 4] Tin nhắn không hiểu...
curl -s -X POST "http://localhost:5005/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test\",\"message\":\"abcxyz12345\"}"
echo.
echo.

echo =====================================================
echo                 HOÀN TẤT TEST
echo =====================================================
echo.
echo Nếu chatbot phản hồi với các tin nhắn phù hợp,
echo hệ thống đang hoạt động bình thường.
echo.
