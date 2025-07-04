@echo off
echo ========================================
echo   SUN MOVEMENT - QUICK SYSTEM TEST
echo ========================================
echo.

echo Checking system status...
echo.

REM Check if frontend is running
echo [1/5] Checking Frontend Service...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on http://localhost:3000
) else (
    echo ❌ Frontend is not running. Please run start-enhanced-frontend.bat first
    echo.
    echo To start frontend:
    echo   ./start-enhanced-frontend.bat
    echo.
    pause
    exit /b 1
)

REM Check if backend is running  
echo [2/5] Checking Backend Service...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on http://localhost:5000
) else (
    echo ❌ Backend is not running. Please start backend service first
)

REM Check database connectivity
echo [3/5] Checking Database Connection...
REM This would require a specific endpoint, skipping for now
echo ⚠️ Database check skipped (implement health endpoint)

REM Check VNPay connectivity  
echo [4/5] Checking VNPay Integration...
echo ⚠️ VNPay check requires test transaction (manual test needed)

REM Check email service
echo [5/5] Checking Email Service...
echo ⚠️ Email service check requires SMTP test (manual test needed)

echo.
echo ========================================
echo      QUICK TESTING INSTRUCTIONS
echo ========================================
echo.
echo 1. OPEN BROWSER:
echo    Navigate to: http://localhost:3000
echo.
echo 2. ENABLE DEVELOPER TOOLS:
echo    Press F12 to open DevTools
echo    Go to Console tab to see logs
echo.
echo 3. LOCATE TESTING TOOLS:
echo    - Testing Dashboard (top-left corner)
echo    - Performance Monitor (bottom-right corner)
echo.
echo 4. RUN AUTOMATED TESTS:
echo    Click "Run All Tests" in Testing Dashboard
echo.
echo 5. MANUAL TESTING CHECKLIST:
echo    □ Add products to cart
echo    □ Update quantities  
echo    □ Remove items from cart
echo    □ Clear entire cart
echo    □ Proceed to checkout
echo    □ Fill checkout form
echo    □ Test VNPay payment (use test card: 9704198526191432198)
echo    □ Track order status
echo    □ Check email notifications
echo.
echo 6. PERFORMANCE MONITORING:
echo    Watch metrics in Performance Monitor:
echo    - Cache Hit Rate should be ^> 70%%
echo    - Average Response Time ^< 500ms
echo    - Retry Count should be minimal
echo.
echo 7. ERROR TESTING:
echo    - Disable network (DevTools ^> Network ^> Offline)
echo    - Test retry mechanisms
echo    - Verify error handling
echo    - Check rollback functionality
echo.
echo ========================================
echo        EXPECTED PERFORMANCE METRICS
echo ========================================
echo.
echo ✅ Cart Operations:        ^< 500ms
echo ✅ Checkout Process:       ^< 2 seconds  
echo ✅ Page Load Time:         ^< 3 seconds
echo ✅ Cache Hit Rate:         ^> 70%%
echo ✅ API Success Rate:       ^> 95%%
echo ✅ Mobile Responsive:      All breakpoints
echo.
echo ========================================
echo           TROUBLESHOOTING
echo ========================================
echo.
echo If tests fail:
echo 1. Check all services are running
echo 2. Clear browser cache (Ctrl+Shift+R)
echo 3. Check console for error messages
echo 4. Verify test data is available
echo 5. Restart services if needed
echo.
echo For VNPay testing:
echo - Test Card: 9704198526191432198
echo - OTP Code: 123456
echo - Expiry: 07/15
echo - Name: NGUYEN VAN A
echo.
echo ========================================

echo.
set /p choice="Press Enter to open browser, or Ctrl+C to exit: "

REM Open browser to the application
start http://localhost:3000

echo.
echo Browser opened. Happy testing! 🚀
echo.
echo Keep this window open to monitor system status.
echo Press Ctrl+C to exit when done testing.
echo.
pause
