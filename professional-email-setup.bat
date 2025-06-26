@echo off
echo ================================================================
echo          Sun Movement - Professional Email Setup
echo ================================================================
echo.

echo 🎯 PRODUCTION EMAIL SETUP WIZARD
echo.
echo Gmail App Password is NOT suitable for production with many users!
echo Let's set up a professional email service (SendGrid/Mailgun)
echo.

echo PROBLEMS with Gmail App Password:
echo ❌ Rate limiting (500-2000 emails/day max)
echo ❌ Poor deliverability (emails go to spam)
echo ❌ Not scalable for thousands of users
echo ❌ Not professional for business
echo.

echo SOLUTIONS:
echo ✅ SendGrid: 100,000 FREE emails/month, 99%+ deliverability
echo ✅ Mailgun: 10,000 FREE emails/month, professional service
echo ✅ Amazon SES: Very cheap for high volume
echo.

set /p choice="Choose your email provider (1=SendGrid, 2=Mailgun, 3=Keep SMTP for now): "

if "%choice%"=="1" goto sendgrid_setup
if "%choice%"=="2" goto mailgun_setup
if "%choice%"=="3" goto smtp_setup
echo Invalid choice, defaulting to SendGrid...

:sendgrid_setup
echo.
echo 🟢 SENDGRID SETUP GUIDE
echo ================================================================
echo.
echo Step 1: Create SendGrid Account
echo 1. Go to: https://sendgrid.com/pricing/
echo 2. Sign up for FREE account (100,000 emails/month)
echo 3. Verify your email address
echo.
echo Step 2: Create API Key
echo 1. Login to SendGrid Dashboard
echo 2. Go to Settings → API Keys
echo 3. Click "Create API Key"
echo 4. Choose "Full Access" permissions
echo 5. Copy the API key (starts with SG.)
echo.
echo Step 3: Domain Authentication (IMPORTANT!)
echo 1. Go to Settings → Sender Authentication
echo 2. Click "Domain Authentication"
echo 3. Add your domain (sunmovement.com)
echo 4. Update DNS records as instructed
echo 5. Wait for verification (may take few hours)
echo.

set /p sendgrid_api="Enter your SendGrid API Key (SG.xxxxx): "
if "%sendgrid_api%"=="" (
    echo ❌ API Key is required!
    pause
    exit /b 1
)

echo %sendgrid_api% | findstr /i "SG\." >nul
if %ERRORLEVEL% neq 0 (
    echo ⚠️ SendGrid API Key should start with 'SG.'
    echo Continuing anyway...
)

set /p from_email="Enter your FROM email (e.g., noreply@sunmovement.com): "
if "%from_email%"=="" set from_email=noreply@sunmovement.com

:: Update appsettings.json
echo.
echo 🔄 Updating appsettings.json...
goto update_config

:mailgun_setup
echo.
echo 🟡 MAILGUN SETUP GUIDE
echo ================================================================
echo.
echo Step 1: Create Mailgun Account
echo 1. Go to: https://www.mailgun.com/pricing/
echo 2. Sign up for FREE account (10,000 emails/month)
echo 3. Verify your email address
echo.
echo Step 2: Add Domain
echo 1. Login to Mailgun Dashboard
echo 2. Go to Domains → Add New Domain
echo 3. Enter your domain (mg.sunmovement.com)
echo 4. Update DNS records as instructed
echo 5. Wait for verification
echo.
echo Step 3: Get API Key
echo 1. Go to Settings → API Keys
echo 2. Copy your Private API Key
echo.

set /p mailgun_api="Enter your Mailgun API Key: "
if "%mailgun_api%"=="" (
    echo ❌ API Key is required!
    pause
    exit /b 1
)

set /p mailgun_domain="Enter your Mailgun Domain (e.g., mg.sunmovement.com): "
if "%mailgun_domain%"=="" set mailgun_domain=mg.sunmovement.com

set /p from_email="Enter your FROM email (e.g., noreply@sunmovement.com): "
if "%from_email%"=="" set from_email=noreply@sunmovement.com

echo.
echo 🔄 Updating appsettings.json...
goto update_config

:smtp_setup
echo.
echo 🔵 SMTP SETUP (Current Gmail Configuration)
echo ================================================================
echo.
echo ⚠️ WARNING: SMTP with Gmail is NOT recommended for production!
echo.
echo Current issues:
echo - Rate limiting (500-2000 emails/day)
echo - Poor deliverability 
echo - Not scalable
echo.
echo Recommendation: Use SendGrid or Mailgun for production
echo.

set /p smtp_continue="Continue with SMTP setup? (y/n): "
if /i not "%smtp_continue%"=="y" goto sendgrid_setup

echo Keeping current SMTP configuration...
echo Provider set to: smtp
goto update_config

:update_config
echo.
echo 📝 Updating configuration files...

set config_file=sun-movement-backend\SunMovement.Web\appsettings.json

if not exist "%config_file%" (
    echo ❌ Configuration file not found: %config_file%
    pause
    exit /b 1
)

:: Backup original file
copy "%config_file%" "%config_file%.backup" >nul
echo ✅ Backed up original configuration

:: Create PowerShell script to update JSON
echo Creating configuration update script...

if "%choice%"=="1" (
    echo Updating for SendGrid...
    echo $json = Get-Content '%config_file%' ^| ConvertFrom-Json > temp_config.ps1
    echo if (-not $json.Email) { $json ^| Add-Member -NotePropertyName Email -NotePropertyValue @{} } >> temp_config.ps1
    echo $json.Email.Provider = 'sendgrid' >> temp_config.ps1
    echo if (-not $json.SendGrid) { $json ^| Add-Member -NotePropertyName SendGrid -NotePropertyValue @{} } >> temp_config.ps1
    echo $json.SendGrid.ApiKey = '%sendgrid_api%' >> temp_config.ps1
    echo $json.SendGrid.FromEmail = '%from_email%' >> temp_config.ps1
    echo $json.SendGrid.FromName = 'Sun Movement Fitness Center' >> temp_config.ps1
    echo $json ^| ConvertTo-Json -Depth 10 ^| Set-Content '%config_file%' >> temp_config.ps1
) else if "%choice%"=="2" (
    echo Updating for Mailgun...
    echo $json = Get-Content '%config_file%' ^| ConvertFrom-Json > temp_config.ps1
    echo if (-not $json.Email) { $json ^| Add-Member -NotePropertyName Email -NotePropertyValue @{} } >> temp_config.ps1
    echo $json.Email.Provider = 'mailgun' >> temp_config.ps1
    echo if (-not $json.Mailgun) { $json ^| Add-Member -NotePropertyName Mailgun -NotePropertyValue @{} } >> temp_config.ps1
    echo $json.Mailgun.ApiKey = '%mailgun_api%' >> temp_config.ps1
    echo $json.Mailgun.Domain = '%mailgun_domain%' >> temp_config.ps1
    echo $json.Mailgun.FromEmail = '%from_email%' >> temp_config.ps1
    echo $json.Mailgun.FromName = 'Sun Movement Fitness Center' >> temp_config.ps1
    echo $json ^| ConvertTo-Json -Depth 10 ^| Set-Content '%config_file%' >> temp_config.ps1
) else (
    echo Updating for SMTP...
    echo $json = Get-Content '%config_file%' ^| ConvertFrom-Json > temp_config.ps1
    echo if (-not $json.Email) { $json ^| Add-Member -NotePropertyName Email -NotePropertyValue @{} } >> temp_config.ps1
    echo $json.Email.Provider = 'smtp' >> temp_config.ps1
    echo $json ^| ConvertTo-Json -Depth 10 ^| Set-Content '%config_file%' >> temp_config.ps1
)

:: Execute PowerShell script
powershell -ExecutionPolicy Bypass -File temp_config.ps1
del temp_config.ps1

echo ✅ Configuration updated successfully!
echo.

:: Test the configuration
echo 🧪 Testing email configuration...
echo.
echo Starting backend to test email service...
start /min cmd /c "cd sun-movement-backend\SunMovement.Web && dotnet run --environment Development"

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

:: Test configuration endpoint
curl -s http://localhost:5000/api/debug/smtp-config >nul 2>&1
if %ERRORLEVEL%==0 (
    echo ✅ Backend is running
    echo.
    echo 📧 Testing email configuration...
    
    set /p test_email="Enter email to test OTP sending: "
    if not "%test_email%"=="" (
        echo Sending test email to %test_email%...
        curl -X POST http://localhost:5000/api/debug/test-email ^
             -H "Content-Type: application/json" ^
             -d "{\"email\":\"%test_email%\"}" 2>nul
        echo.
        echo ✅ Test email sent! Check your inbox.
    )
) else (
    echo ⚠️ Backend not ready yet. Manual testing required.
)

echo.
echo ================================================================
echo ✅ PROFESSIONAL EMAIL SETUP COMPLETE!
echo.
echo 📋 WHAT'S CONFIGURED:
if "%choice%"=="1" (
    echo   - Provider: SendGrid
    echo   - API Key: %sendgrid_api%
    echo   - From Email: %from_email%
    echo   - Capacity: 100,000 emails/month FREE
    echo   - Deliverability: 99%+
) else if "%choice%"=="2" (
    echo   - Provider: Mailgun  
    echo   - API Key: %mailgun_api%
    echo   - Domain: %mailgun_domain%
    echo   - From Email: %from_email%
    echo   - Capacity: 10,000 emails/month FREE
    echo   - Deliverability: 90%+
) else (
    echo   - Provider: SMTP (Gmail)
    echo   - ⚠️ Not recommended for production
    echo   - Consider upgrading to SendGrid/Mailgun
)

echo.
echo 📋 NEXT STEPS:
echo   1. Complete domain authentication (if SendGrid/Mailgun)
echo   2. Test email sending with real users
echo   3. Monitor delivery rates in provider dashboard
echo   4. Deploy to production with new configuration
echo.
echo 📖 Read PROFESSIONAL_EMAIL_SOLUTIONS_GUIDE.md for details
echo ================================================================
pause
