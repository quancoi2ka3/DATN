@echo off
echo =========================================
echo   POPUP ERROR FIX TEST - SUN MOVEMENT
echo =========================================
echo.

echo [1] Starting popup error fix test page...
start "" "registration-popup-error-fix-guide.html"

timeout /t 2 /nobreak >nul

echo [2] Starting popup error test interface...
start "" "test-popup-error-fix.html"

timeout /t 2 /nobreak >nul

echo [3] Killing existing processes before starting backend...
taskkill /f /im dotnet.exe 2>nul
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [4] Starting backend server for testing...
cd "sun-movement-backend\SunMovement.Web"
start "Sun Movement Backend" cmd /k "dotnet run --urls=https://localhost:5001"

timeout /t 3 /nobreak >nul

echo.
echo =========================================
echo   TEST SCENARIO INSTRUCTIONS
echo =========================================
echo.
echo 1. Use the test page to see how popup notifications should work
echo 2. Compare with actual registration form at: https://localhost:5001/Account/Register
echo 3. Apply the fixes shown in the guide to Register.cshtml
echo 4. Test again to verify popup notifications appear instead of console errors
echo.
echo [CURRENT ISSUE]: Errors only show in browser console
echo [EXPECTED]: Errors should show as popup notifications to users
echo [SOLUTION]: Enhanced error handling with fallback alert system
echo.
echo Press any key to open registration form for testing...
pause >nul

timeout /t 3 /nobreak >nul
echo.
echo Opening registration form...
start "" "https://localhost:5001/Account/Register"

echo.
echo =========================================
echo   TESTING CHECKLIST
echo =========================================
echo.
echo [ ] 1. Test empty form submission - should show popup immediately
echo [ ] 2. Test weak password - should show detailed popup requirements  
echo [ ] 3. Test invalid email - should show email validation popup
echo [ ] 4. Test server errors - should show server error popup
echo [ ] 5. Check console - errors should ALSO log to console for debugging
echo.
echo All errors should show POPUP NOTIFICATIONS, not just console logs!
echo.
pause
