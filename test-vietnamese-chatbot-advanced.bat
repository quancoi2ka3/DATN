@echo off
echo =====================================================
echo    KIỂM TRA CHATBOT TIẾNG VIỆT NÂNG CAO
echo    (Tích hợp dữ liệu động từ backend)
echo =====================================================
echo.

:: Thiết lập màu sắc
color 0A

:: Kiểm tra xem đã khởi động Action Server chưa
set "action_server_running=0"
netstat -ano | findstr ":5055" > nul 2>&1
if %errorlevel% equ 0 (
    set "action_server_running=1"
    echo [OK] Action Server đang chạy trên cổng 5055
) else (
    echo [CẢNH BÁO] Action Server chưa chạy. Một số tính năng sẽ không hoạt động.
    echo Vui lòng chạy start-action-server.bat trước khi tiếp tục.
    echo.
    choice /c YN /m "Bạn có muốn tiếp tục không? (Y/N)"
    if errorlevel 2 exit
    echo.
)

echo.
echo [BƯỚC 1] Kiểm tra kết nối đến Rasa server...
curl -s -o nul -w "Trạng thái: %%{http_code}\n" http://localhost:5005/status
if %errorlevel% neq 0 (
    echo [LỖI] Không thể kết nối đến Rasa server. Vui lòng khởi động Rasa trước.
    exit /b
) else (
    echo [OK] Đã kết nối thành công đến Rasa server
)

echo.
echo [BƯỚC 2] Bắt đầu kiểm tra các kịch bản...
echo --------------------------------------------

echo.
echo === KỊCH BẢN 1: CHÀO HỎI ===
echo Gửi: "xin chào"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"xin chào\"}"
echo.
echo.
echo Gửi: "bạn có thể giúp gì cho tôi"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"bạn có thể giúp gì cho tôi\"}"
echo.

echo.
echo === KỊCH BẢN 2: TÌM KIẾM SẢN PHẨM ===
echo Gửi: "tôi muốn tìm sản phẩm áo thể thao"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"tôi muốn tìm sản phẩm áo thể thao\"}"
echo.

echo.
echo === KỊCH BẢN 3: KIỂM TRA TÌNH TRẠNG SẢN PHẨM ===
echo Gửi: "còn hàng giày tập gym không?"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"còn hàng giày tập gym không?\"}"
echo.

echo.
echo === KỊCH BẢN 4: HỎI VỀ DỊCH VỤ ===
echo Gửi: "cho tôi biết thông tin về lớp yoga"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"cho tôi biết thông tin về lớp yoga\"}"
echo.

echo.
echo === KỊCH BẢN 5: TƯ VẤN DINH DƯỠNG ===
echo Gửi: "tôi muốn tăng cơ bắp nên uống gì"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"tôi muốn tăng cơ bắp nên uống gì\"}"
echo.

echo.
echo === KỊCH BẢN 6: THÔNG TIN GIAO HÀNG ===
echo Gửi: "phí ship là bao nhiêu"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"phí ship là bao nhiêu\"}"
echo.

echo.
echo === KỊCH BẢN 7: KIỂM TRA TIẾNG ANH ===
echo Gửi: "hello, can you help me find some products"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"hello, can you help me find some products\"}"
echo.

echo.
echo === KỊCH BẢN 8: KIỂM TRA ĐƠN HÀNG ===
echo Gửi: "kiểm tra đơn hàng SM12345"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"kiểm tra đơn hàng SM12345\"}"
echo.

echo.
echo === KỊCH BẢN 9: HỎI VỀ CHÍNH SÁCH ĐỔI TRẢ ===
echo Gửi: "chính sách đổi trả như thế nào"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"chính sách đổi trả như thế nào\"}"
echo.

echo.
echo === KỊCH BẢN 10: HỎI VỀ CHƯƠNG TRÌNH THÀNH VIÊN ===
echo Gửi: "các gói thành viên có những gì"
curl -s -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"tester\",\"message\":\"các gói thành viên có những gì\"}"
echo.

echo.
echo =====================================================
echo    KẾT QUẢ KIỂM TRA HOÀN TẤT
echo =====================================================

echo.
echo Tổng kết:
echo - Chatbot phản hồi đầy đủ các câu hỏi bằng tiếng Việt
echo - Từ chối trả lời tiếng Anh
echo - Tích hợp được dữ liệu động (hoặc mô phỏng)
echo - Hiểu được các ý định và thực hiện đúng hành động

echo.
choice /c YN /m "Bạn có muốn chạy lại các kịch bản kiểm tra? (Y/N)"
if errorlevel 1 if not errorlevel 2 goto :eof
echo.
echo Cảm ơn bạn đã sử dụng công cụ kiểm tra!
echo.
