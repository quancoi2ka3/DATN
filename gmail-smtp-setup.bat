@echo off
echo.
echo ===============================================
echo    GMAIL SMTP SETUP - QUICK GUIDE
echo ===============================================
echo.
echo Step 1: Bat 2-Factor Authentication
echo - Go to: https://myaccount.google.com/security
echo - Turn on 2-Step Verification
echo.
echo Step 2: Generate App Password
echo - Go to: https://myaccount.google.com/apppasswords
echo - Select "Mail" and generate 16-character password
echo.
echo Step 3: Update .env.local file:
echo.
echo # Uncomment and update these lines:
echo SMTP_HOST=smtp.gmail.com
echo SMTP_PORT=587
echo SMTP_USER=your-gmail@gmail.com
echo SMTP_PASSWORD=your-16-char-app-password
echo SMTP_FROM=your-gmail@gmail.com
echo EMAIL_SERVICE=smtp
echo.
echo ===============================================
echo.
echo After setup, restart your dev server:
echo npm run dev
echo.
echo ===============================================
echo.
pause
