@echo off
echo ================================
echo   LOGIN ISSUE DEBUG & FIX TOOL
echo ================================
echo.

REM Set colors for better visibility
color 0A

echo [INFO] Starting login issue diagnosis...
echo.

REM Check if backend is running
echo [STEP 1] Checking if backend is running...
curl -s -o nul -w "%%{http_code}" https://localhost:5001/api/auth/password-requirements > temp_status.txt
set /p BACKEND_STATUS=<temp_status.txt
del temp_status.txt

if "%BACKEND_STATUS%"=="200" (
    echo [SUCCESS] Backend is running on https://localhost:5001
) else (
    echo [ERROR] Backend is not running or not accessible
    echo [ACTION] Please start backend first:
    echo          cd sun-movement-backend
    echo          dotnet run --urls "https://localhost:5001"
    echo.
    pause
    exit /b 1
)

echo.

REM Check if frontend is running
echo [STEP 2] Checking if frontend is running...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp_status.txt
set /p FRONTEND_STATUS=<temp_status.txt
del temp_status.txt

if "%FRONTEND_STATUS%"=="200" (
    echo [SUCCESS] Frontend is running on http://localhost:3000
) else (
    echo [WARNING] Frontend might not be running
    echo [ACTION] Please start frontend:
    echo          cd sun-movement-frontend
    echo          npm run dev
)

echo.

REM Open debug tool
echo [STEP 3] Opening login debug tool...
echo [INFO] Debug tool will help you:
echo        - Check user status in database
echo        - Test login credentials
echo        - Resend email verification if needed
echo        - Diagnose common issues
echo.

REM Open the comprehensive debug tool
start "" "login-debug-comprehensive.html"

echo [INFO] Debug tool opened in your browser
echo.

REM Show quick commands
echo ================================
echo   QUICK COMMANDS
echo ================================
echo.
echo To manually test login API:
echo curl -X POST https://localhost:5001/api/auth/login ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"email\":\"test@example.com\",\"password\":\"Test@123\"}" ^
echo      -k
echo.

echo To check user status:
echo curl -X POST https://localhost:5001/api/auth/check-user-status ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"email\":\"test@example.com\"}" ^
echo      -k
echo.

echo To resend verification:
echo curl -X POST https://localhost:5001/api/auth/resend-verification ^
echo      -H "Content-Type: application/json" ^
echo      -d "{\"email\":\"test@example.com\"}" ^
echo      -k
echo.

echo ================================
echo   COMMON ISSUES & SOLUTIONS
echo ================================
echo.
echo 1. User not found in database:
echo    - User never completed registration
echo    - Solution: Register again and complete email verification
echo.
echo 2. Email not verified:
echo    - User registered but didn't verify email
echo    - Solution: Use debug tool to resend verification email
echo.
echo 3. Password incorrect:
echo    - User forgot password or using wrong password
echo    - Solution: Reset password or try different password
echo.
echo 4. Backend/Frontend not running:
echo    - Services not started
echo    - Solution: Start both services using safe-start scripts
echo.

echo [INFO] Use the debug tool in your browser to diagnose the specific issue
echo [INFO] This script will remain open for reference
echo.
pause
