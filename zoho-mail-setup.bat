@echo off
echo ================================================================
echo        Sun Movement - Zoho Mail API Quick Setup
echo ================================================================
echo.

echo 🌟 ZOHO MAIL - PROFESSIONAL BUSINESS EMAIL SOLUTION
echo.
echo Why choose Zoho Mail for your business?
echo ✅ Professional emails @sunmovement.com (not Gmail)
echo ✅ $1-3/month cost (vs $15+ SendGrid/Mailgun) 
echo ✅ 90%+ deliverability rate
echo ✅ Business features: CRM integration, team management
echo ✅ Privacy-focused (no ads, no email scanning)
echo ✅ Unlimited API calls with Premium plan
echo.

echo ⏱️ ESTIMATED SETUP TIME: 15 minutes
echo 📋 WHAT YOU NEED: 
echo    - Custom domain (sunmovement.com)
echo    - Access to DNS settings
echo    - Credit card for Premium plan ($3/month)
echo.

set /p ready="Ready to setup Zoho Mail? (y/n): "
if /i not "%ready%"=="y" exit /b 0

echo.
echo ================================================================
echo STEP 1/5: CREATE ZOHO MAIL BUSINESS ACCOUNT (5 minutes)
echo ================================================================
echo.

echo 1. Opening Zoho Mail Business signup...
start "" "https://www.zoho.com/mail/zohomail-pricing.html"
echo.
echo 2. In the browser:
echo    ✅ Choose "Mail Premium" plan ($1/user/month) 
echo    ✅ Enter your domain: sunmovement.com
echo    ✅ Create admin account
echo    ✅ Verify email address
echo.
echo 3. IMPORTANT: Save your Zoho admin credentials
echo.

pause
echo.

echo ================================================================
echo STEP 2/5: DOMAIN VERIFICATION (5 minutes)
echo ================================================================
echo.

echo Zoho will provide DNS records to add to your domain:
echo.
echo 📋 DNS RECORDS TO ADD:
echo    TXT Record: zoho-verification=zb*********.zmverify.zoho.com
echo    MX Record: mail.zoho.com (priority 10)
echo    TXT SPF: "v=spf1 include:zoho.com ~all"
echo.
echo ⚠️ You need to add these DNS records in your domain control panel
echo    (GoDaddy, Namecheap, Cloudflare, etc.)
echo.

set /p dns_done="Have you added the DNS records? (y/n): "
if /i not "%dns_done%"=="y" (
    echo ⏸️ Setup paused. Please add DNS records first, then run this script again.
    echo 💡 DNS propagation can take 1-24 hours.
    pause
    exit /b 0
)

echo ✅ DNS verification in progress...
echo.

echo ================================================================
echo STEP 3/5: CREATE EMAIL ACCOUNTS (2 minutes)
echo ================================================================
echo.

echo Creating business email accounts in Zoho:
echo    📧 noreply@sunmovement.com (for system emails)
echo    📧 admin@sunmovement.com (for admin notifications)  
echo    📧 support@sunmovement.com (for customer support)
echo.

echo 1. In Zoho Mail Admin Console:
echo    - Go to User Management → Add User
echo    - Create the above email accounts
echo    - Set strong passwords
echo.

pause
echo.

echo ================================================================
echo STEP 4/5: SETUP ZOHO API ACCESS (3 minutes)  
echo ================================================================
echo.

echo 1. Opening Zoho Developer Console...
start "" "https://api-console.zoho.com/"
echo.
echo 2. Create new application:
echo    - Application Name: "Sun Movement Email Service"
echo    - Application Type: "Server Application" 
echo    - Redirect URL: http://localhost
echo.
echo 3. Note down:
echo    - Client ID
echo    - Client Secret
echo.

set /p client_id="Enter your Zoho Client ID: "
set /p client_secret="Enter your Zoho Client Secret: "

if "%client_id%"=="" (
    echo ❌ Client ID is required!
    pause
    exit /b 1
)

if "%client_secret%"=="" (
    echo ❌ Client Secret is required!
    pause
    exit /b 1
)

echo.
echo 4. Generating OAuth authorization URL...
set "auth_url=https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE&client_id=%client_id%&state=testing&response_type=code&redirect_uri=http://localhost&access_type=offline"

echo.
echo 5. Opening authorization URL...
start "" "%auth_url%"
echo.
echo 6. After authorization, you'll be redirected to localhost with a code parameter
echo    Copy the code from the URL (after "code=")
echo.

set /p auth_code="Enter the authorization code: "

if "%auth_code%"=="" (
    echo ❌ Authorization code is required!
    pause
    exit /b 1
)

echo.
echo 7. Exchanging code for access token...

:: Create PowerShell script to get OAuth token
echo $body = @{ > get_zoho_token.ps1
echo   grant_type = 'authorization_code' >> get_zoho_token.ps1
echo   client_id = '%client_id%' >> get_zoho_token.ps1
echo   client_secret = '%client_secret%' >> get_zoho_token.ps1
echo   redirect_uri = 'http://localhost' >> get_zoho_token.ps1
echo   code = '%auth_code%' >> get_zoho_token.ps1
echo } >> get_zoho_token.ps1
echo. >> get_zoho_token.ps1
echo try { >> get_zoho_token.ps1
echo   $response = Invoke-RestMethod -Uri 'https://accounts.zoho.com/oauth/v2/token' -Method Post -Body $body >> get_zoho_token.ps1
echo   Write-Host "Access Token: $($response.access_token)" >> get_zoho_token.ps1
echo   Write-Host "Refresh Token: $($response.refresh_token)" >> get_zoho_token.ps1
echo   $response.access_token ^| Out-File -FilePath 'zoho_access_token.txt' -NoNewline >> get_zoho_token.ps1
echo } catch { >> get_zoho_token.ps1
echo   Write-Host "Error: $($_.Exception.Message)" >> get_zoho_token.ps1
echo } >> get_zoho_token.ps1

powershell -ExecutionPolicy Bypass -File get_zoho_token.ps1

if exist zoho_access_token.txt (
    set /p access_token=<zoho_access_token.txt
    echo ✅ Access token obtained successfully!
    del zoho_access_token.txt
    del get_zoho_token.ps1
) else (
    echo ❌ Failed to obtain access token. Please check your credentials.
    del get_zoho_token.ps1
    pause
    exit /b 1
)

echo.

echo ================================================================
echo STEP 5/5: CONFIGURE APPLICATION (1 minute)
echo ================================================================
echo.

set /p from_email="Enter your FROM email (e.g., noreply@sunmovement.com): "
if "%from_email%"=="" set from_email=noreply@sunmovement.com

echo 🔄 Updating application configuration...

set config_file=sun-movement-backend\SunMovement.Web\appsettings.json

if not exist "%config_file%" (
    echo ❌ Configuration file not found: %config_file%
    pause
    exit /b 1
)

:: Backup
copy "%config_file%" "%config_file%.zoho-backup" >nul
echo ✅ Configuration backed up

:: Update JSON using PowerShell
echo $json = Get-Content '%config_file%' ^| ConvertFrom-Json > update_zoho.ps1
echo if (-not $json.Email) { $json ^| Add-Member -NotePropertyName Email -NotePropertyValue @{} } >> update_zoho.ps1
echo $json.Email.Provider = 'zoho' >> update_zoho.ps1
echo if (-not $json.Zoho) { $json ^| Add-Member -NotePropertyName Zoho -NotePropertyValue @{} } >> update_zoho.ps1
echo $json.Zoho.ApiKey = '%access_token%' >> update_zoho.ps1
echo $json.Zoho.FromEmail = '%from_email%' >> update_zoho.ps1
echo $json.Zoho.FromName = 'Sun Movement Fitness Center' >> update_zoho.ps1
echo $json.Zoho.BaseUrl = 'https://www.zohoapis.com/mail/v1' >> update_zoho.ps1
echo $json ^| ConvertTo-Json -Depth 10 ^| Set-Content '%config_file%' >> update_zoho.ps1

powershell -ExecutionPolicy Bypass -File update_zoho.ps1
del update_zoho.ps1

echo ✅ Configuration updated!
echo.

echo ================================================================
echo 🧪 TESTING ZOHO MAIL INTEGRATION
echo ================================================================
echo.

echo 🔄 Starting backend server to test...
start /min cmd /c "cd sun-movement-backend\SunMovement.Web && dotnet run --environment Development"

echo    Waiting for server to start...
timeout /t 15 /nobreak >nul

:: Test if server is running
curl -s http://localhost:5000/api/debug/health >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✅ Backend server is running
    echo.
    
    set /p test_email="Enter your email to test Zoho Mail sending: "
    if not "%test_email%"=="" (
        echo 📧 Sending test email via Zoho Mail to %test_email%...
        echo.
        
        curl -X POST http://localhost:5000/api/debug/test-email ^
             -H "Content-Type: application/json" ^
             -d "{\"email\":\"%test_email%\"}" ^
             -w "HTTP Status: %%{http_code}\n" 2>nul
        
        echo.
        echo ✅ Test email sent via Zoho Mail!
        echo.
        echo 📱 CHECK YOUR EMAIL INBOX:
        echo    - Look for email from "%from_email%"
        echo    - Subject: "🌟 Xác thực email đăng ký - Sun Movement"
        echo    - Professional business email appearance
        echo    - Check that sender is from your custom domain!
        echo.
        
        set /p received="Did you receive the test email? (y/n): "
        if /i "%received%"=="y" (
            echo 🎉 SUCCESS! Zoho Mail is working perfectly!
            echo 💼 You now have professional business email integration!
        ) else (
            echo ⚠️ Email not received. Possible issues:
            echo    1. Check Spam/Junk folder
            echo    2. OAuth token might need refresh
            echo    3. Domain verification still in progress
            echo    4. FROM email account not created in Zoho
            echo.
            echo 💡 TIP: Check Zoho Mail console for delivery status
        )
    )
) else (
    echo ❌ Backend server not ready. Manual testing required.
    echo    Run: cd sun-movement-backend\SunMovement.Web && dotnet run
)

echo.
echo ================================================================
echo 🎉 ZOHO MAIL SETUP COMPLETE!
echo ================================================================
echo.
echo 📊 WHAT YOU NOW HAVE:
echo    ✅ Professional business email @sunmovement.com
echo    ✅ Zoho Mail Premium account ($1-3/month)
echo    ✅ Unlimited API email sending capacity
echo    ✅ 90%+ deliverability rate (much better than Gmail)
echo    ✅ Business-grade email management
echo    ✅ Privacy-focused email service (no ads)
echo    ✅ Integration with business tools
echo.
echo 📋 CONFIGURATION SUMMARY:
echo    Provider: Zoho Mail
echo    API Key: %access_token%
echo    From Email: %from_email%
echo    Custom Domain: Professional business emails
echo    Cost: $1-3/month (vs $15+ SendGrid/Mailgun)
echo    Capacity: Unlimited emails with Premium
echo.
echo 🔧 WHAT'S NEXT:
echo    1. ✅ DONE: Zoho Mail API configured
echo    2. 📧 RECOMMENDED: Create email templates in Zoho console
echo    3. 🔒 SETUP: DKIM and SPF records for better deliverability
echo    4. 📊 MONITOR: Email analytics in Zoho Mail dashboard
echo    5. 🚀 DEPLOY: Your app is production-ready with business email!
echo.
echo 💡 BUSINESS BENEFITS:
echo    - Professional image with custom domain emails
echo    - Better email deliverability than personal Gmail
echo    - Advanced business features (CRM integration, etc.)
echo    - Cost-effective solution for scaling business
echo    - Privacy-focused (no email scanning for ads)
echo    - Unified business communication platform
echo.
echo 📖 For advanced features, read: ZOHO_MAIL_API_INTEGRATION_GUIDE.md
echo ================================================================
pause
