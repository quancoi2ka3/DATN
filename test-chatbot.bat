@echo off
echo =====================================================
echo        TEST CHATBOT SUN MOVEMENT
echo =====================================================
echo.

set RASA_URL=http://localhost:5005

echo [1] Kiểm tra kết nối Rasa Server...
curl -s -o nul -w "Rasa Server Status: %%{http_code}\n" %RASA_URL%/
echo.

echo [2] Test tin nhắn chào hỏi...
echo Gửi: "xin chào"
curl -s -X POST "%RASA_URL%/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test-user\",\"message\":\"xin chào\"}"
echo.
echo.

echo [3] Test tìm kiếm sản phẩm...
echo Gửi: "Tôi muốn tìm sản phẩm"
curl -s -X POST "%RASA_URL%/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test-user\",\"message\":\"Tôi muốn tìm sản phẩm\"}"
echo.
echo.

echo [4] Test hỏi về thông tin...
echo Gửi: "Cho tôi biết thông tin về công ty"
curl -s -X POST "%RASA_URL%/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test-user\",\"message\":\"Cho tôi biết thông tin về công ty\"}"
echo.
echo.

echo [5] Test câu hỏi không hiểu...
echo Gửi: "abcxyz123"
curl -s -X POST "%RASA_URL%/webhooks/rest/webhook" ^
     -H "Content-Type: application/json" ^
     -d "{\"sender\":\"test-user\",\"message\":\"abcxyz123\"}"
echo.
echo.

echo =====================================================
echo         HOÀN TẤT TEST CHATBOT
echo =====================================================
echo.
echo Nếu chatbot phản hồi đúng với các tin nhắn trên,
echo hệ thống đang hoạt động bình thường.
echo.

pause
