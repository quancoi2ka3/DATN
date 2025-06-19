@echo off
echo ================================
echo   FRONTEND API FIX TEST
echo ================================
echo.

echo [INFO] We've fixed all API URLs in frontend to use:
echo        NEXT_PUBLIC_API_BASE_URL = https://localhost:5001
echo.

echo [STEP 1] Killing existing frontend process...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo [STEP 2] Starting frontend with environment variables...
cd /d "d:\DATN\DATN\sun-movement-frontend"

echo [INFO] Environment variables:
echo NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
echo NODE_TLS_REJECT_UNAUTHORIZED=0
echo.

start "Frontend Server" cmd /k "npm run dev"

echo [STEP 3] Waiting for frontend to start...
timeout /t 10 >nul

echo [STEP 4] Opening test pages...
start "Environment Test" "http://localhost:3000/test-env"
timeout /t 3 >nul
start "Login Page" "http://localhost:3000"

echo.
echo ================================
echo   TESTING INSTRUCTIONS
echo ================================
echo.
echo 1. Check Environment Test page (http://localhost:3000/test-env)
echo    - Verify NEXT_PUBLIC_API_BASE_URL shows: https://localhost:5001
echo    - Click "Test API Call" button
echo    - Check browser console for results
echo.
echo 2. Try login on main page (http://localhost:3000)
echo    - Email: nguyenmanhan17072003@gmail.com
echo    - Password: ManhQuan2003@
echo    - Check browser console for any errors
echo.
echo 3. If still getting 500 errors:
echo    - Check browser Network tab
echo    - Verify requests are going to https://localhost:5001
echo    - Check for SSL certificate errors
echo.

pause
