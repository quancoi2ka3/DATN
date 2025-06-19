@echo off
echo =========================================
echo   TEST DETAILED PASSWORD ERROR POPUP
echo =========================================
echo.

echo [1] Killing existing processes...
taskkill /f /im dotnet.exe 2>nul
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2] Opening detailed error test page...
start "" "test-detailed-password-error-popup.html"

timeout /t 3 /nobreak >nul

echo [3] Starting backend for real testing...
cd "sun-movement-backend\SunMovement.Web"
start "Sun Movement Backend" cmd /k "dotnet run --urls=https://localhost:5001"

timeout /t 5 /nobreak >nul

echo.
echo =========================================
echo   TEST INSTRUCTIONS
echo =========================================
echo.
echo WHAT TO TEST:
echo.
echo 1. Use the test page to see how detailed popups should work
echo 2. Go to real registration: https://localhost:5001/Account/Register
echo 3. Try these password tests:
echo    - "123" → Should show "Mật khẩu phải có ít nhất 8 ký tự"
echo    - "password" → Should show "Thiếu chữ hoa và ký tự đặc biệt"
echo    - "Password" → Should show "Thiếu ký tự đặc biệt"
echo    - "password123" → Should show "Thiếu chữ hoa và ký tự đặc biệt"
echo.
echo EXPECTED RESULT:
echo - Popup should show DETAILED error messages
echo - NOT just "Lỗi kết nối (400). Vui lòng thử lại."
echo - Each error should be specific to what's missing
echo.

timeout /t 3 /nobreak >nul
echo Opening registration form...
start "" "https://localhost:5001/Account/Register"

echo.
echo =========================================
echo   COMPARISON TEST
echo =========================================
echo.
echo BEFORE FIX: "Lỗi kết nối (400). Vui lòng thử lại."
echo AFTER FIX:  "Mật khẩu không đáp ứng yêu cầu bảo mật"
echo             "• Mật khẩu phải có ít nhất 8 ký tự"
echo             "• Mật khẩu phải chứa ít nhất một chữ hoa"
echo             "• Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
echo.
echo Press any key when you're ready to test...
pause >nul

echo.
echo TEST CHECKLIST:
echo [ ] 1. Short password shows length requirement
echo [ ] 2. No uppercase shows uppercase requirement  
echo [ ] 3. No special chars shows special char requirement
echo [ ] 4. Multiple errors show all requirements
echo [ ] 5. Popup appears immediately (not just console)
echo [ ] 6. Error details are in Vietnamese
echo [ ] 7. Fallback alert works if popup fails
echo.
pause
