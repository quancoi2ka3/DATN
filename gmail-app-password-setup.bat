@echo off
setlocal enabledelayedexpansion

echo ================================================================
echo     Sun Movement - Gmail App Password Setup Helper
echo ================================================================
echo.

set "config_file=sun-movement-backend\SunMovement.Web\appsettings.Development.json"

if not exist "%config_file%" (
    echo ❌ File %config_file% không tồn tại!
    echo    Tạo file appsettings.Development.json trước khi chạy script này
    pause
    exit /b 1
)

echo ✅ Tìm thấy file cấu hình: %config_file%
echo.

:: Kiểm tra cấu hình email hiện tại
echo 📋 Cấu hình Email hiện tại:
echo ================================================
findstr /n /i "email\|smtp" "%config_file%" 2>nul
echo ================================================
echo.

:: Kiểm tra placeholders
findstr /i "YOUR_GMAIL_APP_PASSWORD_HERE\|your-email\|your-password" "%config_file%" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ⚠️  Phát hiện giá trị placeholder cần thay thế!
    echo.
    
    echo 📋 HƯỚNG DẪN TẠO GMAIL APP PASSWORD:
    echo ================================================
    echo 1. Đăng nhập Gmail của bạn
    echo 2. Truy cập: https://myaccount.google.com/security
    echo 3. Tìm "2-Step Verification" và bật nếu chưa có
    echo 4. Truy cập: https://myaccount.google.com/apppasswords
    echo 5. Chọn "Mail" và "Windows Computer" (hoặc "Other")
    echo 6. Google sẽ tạo App Password 16 ký tự
    echo 7. Copy App Password đó (dạng: abcd efgh ijkl mnop)
    echo ================================================
    echo.
    
    :: Prompt user for email and app password
    set /p gmail_email="Nhập Gmail email của bạn: "
    set /p gmail_app_password="Nhập Gmail App Password (16 ký tự): "
    
    if "!gmail_email!"=="" (
        echo ❌ Email không được để trống!
        pause
        exit /b 1
    )
    
    if "!gmail_app_password!"=="" (
        echo ❌ App Password không được để trống!
        pause
        exit /b 1
    )
    
    :: Validate email format (basic)
    echo !gmail_email! | findstr /i "@gmail.com" >nul
    if %ERRORLEVEL% neq 0 (
        echo ⚠️  Email không phải Gmail (@gmail.com). Tiếp tục? (y/n)
        set /p continue=
        if /i not "!continue!"=="y" exit /b 1
    )
    
    :: Validate app password length (should be 16 characters)
    for /f %%A in ('echo !gmail_app_password!^| powershell -command "$input.Length"') do set app_pass_length=%%A
    if not !app_pass_length!==16 (
        echo ⚠️  App Password thường có 16 ký tự. Bạn nhập !app_pass_length! ký tự. Tiếp tục? (y/n)
        set /p continue=
        if /i not "!continue!"=="y" exit /b 1
    )
    
    echo.
    echo 🔄 Cập nhật cấu hình email...
    
    :: Backup original file
    copy "%config_file%" "%config_file%.backup" >nul
    echo ✅ Đã backup file gốc thành %config_file%.backup
    
    :: Create temporary PowerShell script to update JSON
    echo $json = Get-Content '%config_file%' ^| ConvertFrom-Json > temp_update.ps1
    echo $json.Email.Sender = '!gmail_email!' >> temp_update.ps1
    echo $json.Email.Username = '!gmail_email!' >> temp_update.ps1
    echo $json.Email.Password = '!gmail_app_password!' >> temp_update.ps1
    echo $json.Email.ContactNotifications = '!gmail_email!' >> temp_update.ps1
    echo $json ^| ConvertTo-Json -Depth 10 ^| Set-Content '%config_file%' >> temp_update.ps1
    
    :: Execute PowerShell script
    powershell -ExecutionPolicy Bypass -File temp_update.ps1
    del temp_update.ps1
    
    echo ✅ Cấu hình đã được cập nhật!
) else (
    echo ✅ Cấu hình email đã được thiết lập (không có placeholder)
)

echo.
echo 📋 Cấu hình Email sau khi cập nhật:
echo ================================================
findstr /n /i "email\|smtp" "%config_file%" 2>nul | findstr /v "Password"
echo     "Password": "[HIDDEN FOR SECURITY]"
echo ================================================
echo.

:: Test SMTP configuration
echo 🧪 Bạn có muốn test SMTP ngay bây giờ không? (y/n)
set /p test_smtp=
if /i "!test_smtp!"=="y" (
    echo.
    echo 🔄 Khởi động backend để test...
    start /min cmd /c "cd sun-movement-backend\SunMovement.Web && dotnet run --environment Development"
    
    echo    Đợi 15 giây để backend khởi động...
    timeout /t 15 /nobreak >nul
    
    :: Test SMTP endpoint
    echo 🧪 Test SMTP configuration endpoint...
    curl -s http://localhost:5000/api/debug/smtp-config >nul 2>&1
    if %ERRORLEVEL%==0 (
        echo ✅ SMTP endpoint phản hồi
        echo    Mở browser để test gửi email thực tế...
        start "" "email-otp-test.html"
    ) else (
        echo ⚠️  Backend chưa sẵn sàng hoặc endpoint không khả dụng
        echo    Chạy thủ công: cd sun-movement-backend\SunMovement.Web && dotnet run
    )
)

echo.
echo ================================================================
echo ✅ Gmail App Password Setup hoàn tất!
echo.
echo 📋 NEXT STEPS:
echo    1. Chạy backend: cd sun-movement-backend\SunMovement.Web && dotnet run
echo    2. Mở email-otp-test.html để test gửi OTP thực tế
echo    3. Hoặc chạy: email-otp-comprehensive-test.bat
echo.
echo 💡 Nếu vẫn không nhận được email:
echo    - Kiểm tra Spam/Junk folder
echo    - Kiểm tra App Password đã đúng chưa
echo    - Xem logs backend để debug lỗi SMTP
echo ================================================================
pause
