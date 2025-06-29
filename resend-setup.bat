@echo off
echo.
echo ===============================================
echo    RESEND EMAIL SERVICE SETUP
echo ===============================================
echo.
echo Resend is easier than Gmail SMTP and free for 3000 emails/month
echo.
echo Step 1: Sign up at https://resend.com
echo Step 2: Verify your email
echo Step 3: Get your API key from dashboard
echo.
echo Step 4: Update .env.local:
echo.
echo # Add this line:
echo RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
echo EMAIL_SERVICE=resend
echo.
echo ===============================================
echo.
echo Benefits of Resend:
echo - No need for 2FA or app passwords
echo - Better deliverability
echo - Free tier: 3000 emails/month
echo - Easy setup in 2 minutes
echo.
echo ===============================================
echo.
pause
