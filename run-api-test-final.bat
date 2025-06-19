@echo off
echo 🔧 Copying test file to wwwroot for API testing...

copy "d:\DATN\DATN\test-api-registration-final.html" "d:\DATN\DATN\sun-movement-backend\SunMovement.Web\wwwroot\test-api-registration-final.html"

echo ✅ File copied successfully!
echo 🌐 Opening test page in browser...

timeout /t 2 /nobreak >nul
start http://localhost:5000/test-api-registration-final.html

echo 📋 Test Instructions:
echo 1. Check if the page loads correctly
echo 2. Click "Test Weak Password" to test validation errors
echo 3. Verify that detailed Vietnamese error messages appear
echo 4. Check browser console for detailed API responses
echo.
echo 💡 Expected: Detailed password validation errors in Vietnamese
echo    Should show: "Mật khẩu phải có ít nhất 8 ký tự", etc.
echo.
pause
