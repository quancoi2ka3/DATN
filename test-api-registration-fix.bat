@echo off
echo ================================================================
echo                  🧪 TEST API REGISTRATION FIX
echo ================================================================
echo.
echo 🎯 Mục đích: Kiểm tra API /api/auth/register trả về lỗi chi tiết
echo 📍 Đây là bước quan trọng để xác nhận fix hoạt động!
echo.

echo 🔍 Kiểm tra tiến trình backend...
tasklist /FI "IMAGENAME eq dotnet.exe" 2>nul | find /I "dotnet.exe" >nul
if "%ERRORLEVEL%"=="0" (
    echo ✅ Backend đang chạy
) else (
    echo ❌ Backend chưa chạy!
    echo 🚀 Đang khởi động backend...
    cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
    start "Backend Server" cmd /c "dotnet run"
    echo ⏳ Chờ backend khởi động...
    timeout /t 10 /nobreak >nul
)

echo.
echo 🌐 Mở test page...
start "" "d:\DATN\DATN\test-api-registration-fix.html"

echo.
echo ================================================================
echo                         📋 HƯỚNG DẪN TEST
echo ================================================================
echo.
echo 1. 🔍 Kiểm tra Console (F12) để xem chi tiết request/response
echo 2. 🧪 Chạy các test cases:
echo    - Test 1: Mật khẩu yếu (thiếu yêu cầu)
echo    - Test 2: Mật khẩu quá ngắn 
echo    - Test 3: Email không hợp lệ
echo.
echo 3. ✅ Kết quả mong đợi:
echo    - Status: 400 Bad Request
echo    - Response chứa "errors" array với lỗi chi tiết tiếng Việt
echo    - Ví dụ: "Mật khẩu phải chứa ít nhất một chữ hoa..."
echo.
echo 4. 🎯 Nếu nhận được lỗi chi tiết → Fix thành công!
echo    🎯 Nếu nhận được lỗi chung chung → Cần điều tra thêm
echo.
echo ================================================================
echo                      🚨 TROUBLESHOOTING
echo ================================================================
echo.
echo 📍 Nếu gặp lỗi "Failed to fetch" hoặc CORS:
echo    → Kiểm tra backend có chạy trên port 5000 không
echo    → Kiểm tra file launchSettings.json có expose port không
echo.
echo 📍 Nếu backend không khởi động:
echo    → Chạy thủ công: cd sun-movement-backend\SunMovement.Web && dotnet run
echo.
echo 📍 Nếu test thành công, tiếp tục test trên website thực tế:
echo    → Mở http://localhost:5000/Account/Register
echo    → Nhập mật khẩu yếu và xem popup notification
echo.
echo ⌨️ Nhấn phím bất kỳ để tiếp tục...
pause >nul
