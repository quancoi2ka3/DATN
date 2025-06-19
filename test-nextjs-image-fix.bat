@echo off
title Next.js Image Configuration Test
color 0A

echo.
echo ===========================================
echo  Next.js Image Configuration Test - Port 5001
echo ===========================================
echo.

echo [INFO] Testing Next.js development server startup...
echo [INFO] This will verify that the image configuration fix works
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo [STEP 1] Checking Next.js configuration...
if exist "next.config.js" (
    echo ✅ next.config.js found
    findstr /C:"localhost" next.config.js >nul && echo ✅ localhost configuration detected || echo ❌ localhost configuration missing
) else (
    echo ❌ next.config.js not found
    pause
    exit
)

echo.
echo [STEP 2] Checking environment variables...
if exist ".env.local" (
    echo ✅ .env.local found
    findstr /C:"5001" .env.local >nul && echo ✅ Port 5001 configured || echo ❌ Port 5001 not configured
) else (
    echo ❌ .env.local not found
)

echo.
echo [STEP 3] Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install
) else (
    echo ✅ Dependencies already installed
)

echo.
echo [STEP 4] Starting Next.js development server...
echo [INFO] The server will start on http://localhost:3000
echo [INFO] Check that images load without configuration errors
echo [INFO] Press Ctrl+C to stop the server when testing is complete
echo.

timeout /t 3 >nul

npm run dev

echo.
echo [TEST COMPLETE] 
echo Check the browser console for any remaining image configuration errors.
echo If no errors appear, the fix was successful!
echo.
pause
