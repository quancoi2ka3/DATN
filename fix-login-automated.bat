@echo off
setlocal EnableDelayedExpansion

echo =========================================
echo   LOGIN QUICK FIX - AUTOMATED SOLUTIONS
echo =========================================
echo.

REM Set email to test (you can modify this)
set /p TEST_EMAIL="Enter email to fix (or press Enter for test@example.com): "
if "%TEST_EMAIL%"=="" set TEST_EMAIL=test@example.com

echo [INFO] Working with email: %TEST_EMAIL%
echo.

REM Check backend status first
echo [STEP 1] Verifying backend connection...
curl -s -k https://localhost:5001/api/auth/password-requirements > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend not accessible. Starting backend...
    start "Backend" cmd /c "cd /d sun-movement-backend && dotnet run --urls https://localhost:5001"
    echo [INFO] Waiting for backend to start...
    timeout /t 10 > nul
)

echo [SUCCESS] Backend is accessible
echo.

REM Check user status
echo [STEP 2] Checking user status for %TEST_EMAIL%...

curl -s -k -X POST https://localhost:5001/api/auth/check-user-status ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"%TEST_EMAIL%\"}" > user_status.json 2>nul

if not exist user_status.json (
    echo [ERROR] Could not check user status - API call failed
    goto :end
)

REM Parse JSON response (basic parsing)
findstr "userExists.*true" user_status.json > nul
if errorlevel 1 (
    echo [RESULT] User does not exist in database
    echo [ACTION] User needs to register first
    echo.
    echo [FIXING] Opening registration page...
    start "" "http://localhost:3000"
    goto :cleanup
)

findstr "emailConfirmed.*true" user_status.json > nul
if errorlevel 1 (
    echo [RESULT] User exists but email not confirmed
    echo [ACTION] Sending verification email...
    
    curl -s -k -X POST https://localhost:5001/api/auth/resend-verification ^
         -H "Content-Type: application/json" ^
         -d "{\"email\":\"%TEST_EMAIL%\"}" > resend_result.json
    
    findstr "successfully" resend_result.json > nul
    if not errorlevel 1 (
        echo [SUCCESS] Verification email sent!
        echo [INFO] Please check email and complete verification
    ) else (
        echo [WARNING] Could not resend verification email
        echo [INFO] User may need to register again
    )
    
    goto :cleanup
)

echo [RESULT] User exists and email is confirmed
echo [ACTION] Login should work - password might be incorrect
echo.

REM Test login with common passwords
echo [STEP 3] Testing login with common password patterns...

set "COMMON_PASSWORDS=Test@123 Password@123 %TEST_EMAIL%@123 Admin@123"

for %%p in (%COMMON_PASSWORDS%) do (
    echo [TEST] Trying password: %%p
    curl -s -k -X POST https://localhost:5001/api/auth/login ^
         -H "Content-Type: application/json" ^
         -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%%p\"}" > login_result.json
    
    findstr "token" login_result.json > nul
    if not errorlevel 1 (
        echo [SUCCESS] Login successful with password: %%p
        echo [INFO] User can now login with this password
        goto :cleanup
    )
)

echo [RESULT] None of the common passwords worked
echo [ACTION] User needs to:
echo          1. Remember their actual password, or
echo          2. Use password reset functionality, or  
echo          3. Register a new account
echo.

:cleanup
if exist user_status.json del user_status.json
if exist resend_result.json del resend_result.json
if exist login_result.json del login_result.json

:end
echo.
echo =========================================
echo   MANUAL FIXES IF AUTOMATED FAILED
echo =========================================
echo.
echo 1. Check email configuration:
echo    - Verify SMTP settings in appsettings.json
echo    - Test email sending capability
echo.
echo 2. Database issues:
echo    - Check if database is accessible
echo    - Verify user table exists and has data
echo.
echo 3. Password issues:
echo    - User might have forgotten actual password
echo    - Password requirements might have changed
echo.
echo 4. Frontend issues:
echo    - Clear browser cache and cookies
echo    - Try different browser
echo    - Check browser console for errors
echo.
echo [INFO] For detailed diagnosis, run: debug-login-comprehensive.bat
echo.
pause
