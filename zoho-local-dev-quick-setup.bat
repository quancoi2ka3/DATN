@echo off
title Zoho API Local Development Setup - QUICK START
color 0A

echo =======================================================
echo      ZOHO API - LOCAL DEVELOPMENT QUICK SETUP
echo =======================================================
echo.
echo ✅ NO DEPLOYMENT NEEDED - WORKS ON LOCALHOST!
echo.

echo Step 1: Get Zoho OAuth Token (2 minutes)
echo =========================================
echo.
echo 1. Open: https://api-console.zoho.com/
echo 2. Click "Generate Token" (simple method)
echo 3. Scope: ZohoMail.messages.ALL
echo 4. Complete OAuth in browser
echo 5. Copy the token
echo.
echo Example token: 1000.abc123def456.789xyz
echo.

pause

echo.
echo Step 2: Get Your Account ID
echo ===========================
echo.
echo Method 1 - From Zoho Mail:
echo 1. Login to Zoho Mail
echo 2. Settings ^> Account Settings
echo 3. Find Account ID
echo.
echo Method 2 - API Call (if you have token):
echo curl -H "Authorization: Zoho-oauthtoken YOUR_TOKEN" https://www.mail.zoho.com/api/accounts
echo.

pause

echo.
echo Step 3: Update Local Configuration
echo ==================================
echo.
echo Edit: d:\DATN\DATN\sun-movement-backend\SunMovement.Web\appsettings.Development.json
echo.
echo Update these values:
echo.
echo   "Email": {
echo     "Provider": "zoho"
echo   },
echo   "Zoho": {
echo     "ApiKey": "YOUR_TOKEN_HERE",
echo     "FromEmail": "your-email@domain.com",
echo     "AccountId": "YOUR_ACCOUNT_ID",
echo     "BaseUrl": "https://www.mail.zoho.com/api"
echo   }
echo.

pause

echo.
echo Step 4: Test Locally (No Deploy Needed!)
echo =======================================
echo.
echo 1. Run backend locally:
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
echo.
echo Starting local server...
start "Sun Movement Local" dotnet run --urls="http://localhost:5000"

echo.
echo 2. Wait 10 seconds for server startup...
timeout /t 10 /nobreak

echo.
echo 3. Opening test interface...
start "" "http://localhost:5000/api/debug/test-email"

echo.
echo =======================================================
echo               LOCAL TESTING READY!
echo =======================================================
echo.
echo ✅ Your Zoho API integration is running on localhost
echo ✅ No deployment required
echo ✅ No domain setup needed
echo ✅ Works immediately with token
echo.
echo Test Instructions:
echo 1. Browser opened to test interface
echo 2. Enter your email address
echo 3. Click "Send Test Email"
echo 4. Check console for success/error logs
echo 5. Check your email inbox
echo.
echo Success Indicators:
echo ✅ Console: "Email sent successfully via Zoho Mail"
echo ✅ Email appears in your inbox
echo ✅ No error messages
echo.
echo Common Issues:
echo ❌ 401 Error: Check your OAuth token
echo ❌ 403 Error: Check your Account ID
echo ❌ 400 Error: Check email format
echo.

echo Press any key to stop the local server...
pause > nul

echo.
echo Stopping local server...
taskkill /f /im "dotnet.exe" 2>nul

echo.
echo =======================================================
echo           LOCAL DEVELOPMENT COMPLETE!
echo =======================================================
echo.
echo If successful:
echo ✅ Your Zoho integration works perfectly on localhost
echo ✅ Ready to implement in your application
echo ✅ Can deploy later when ready
echo.
echo Next Steps:
echo 1. Integrate email sending in your app features
echo 2. Test all email types (OTP, welcome, etc.)
echo 3. Plan production deployment when needed
echo.

pause
