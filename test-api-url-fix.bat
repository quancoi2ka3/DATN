@echo off
echo ========================================
echo   TESTING API URL FIX
echo ========================================
echo.

echo [INFO] Testing if backend API is accessible...
echo.

REM Test backend health
echo [1] Testing backend health check...
curl -k -s -w "HTTP Status: %%{http_code}\n" https://localhost:5001/api/health
echo.

REM Test login endpoint
echo [2] Testing login endpoint...
curl -k -X POST https://localhost:5001/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}" ^
     -w "HTTP Status: %%{http_code}\n"
echo.

REM Test user status endpoint  
echo [3] Testing check-user-status endpoint...
curl -k -X POST https://localhost:5001/api/auth/check-user-status ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"test@example.com\"}" ^
     -w "HTTP Status: %%{http_code}\n"
echo.

echo ========================================
echo   API URL FIX VERIFICATION
echo ========================================
echo.
echo If you see HTTP Status: 200 for all tests above,
echo then the backend API is working correctly.
echo.
echo The frontend should now be able to connect to:
echo - https://localhost:5001/api/auth/login
echo - https://localhost:5001/api/auth/check-user-status
echo - https://localhost:5001/api/auth/register
echo - https://localhost:5001/api/auth/verify-email
echo.
echo Please restart your frontend server and try logging in again.
echo.
pause
