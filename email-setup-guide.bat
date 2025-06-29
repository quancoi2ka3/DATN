@echo off
echo.
echo ===============================================
echo    SUN MOVEMENT - EMAIL SETUP GUIDE
echo ===============================================
echo.
echo This guide will help you set up email service for contact forms.
echo Choose one of the following options:
echo.
echo ===============================================
echo 1. GMAIL SMTP (Recommended for Development)
echo ===============================================
echo.
echo Step 1: Enable 2-Factor Authentication on your Gmail account
echo Step 2: Generate App Password:
echo   - Go to Google Account settings
echo   - Security ^> 2-Step Verification ^> App passwords
echo   - Select "Mail" and generate password
echo.
echo Step 3: Update .env.local with:
echo   SMTP_HOST=smtp.gmail.com
echo   SMTP_PORT=587
echo   SMTP_USER=your-email@gmail.com
echo   SMTP_PASSWORD=your-16-character-app-password
echo   SMTP_FROM=your-email@gmail.com
echo   EMAIL_SERVICE=smtp
echo.
echo ===============================================
echo 2. SENDGRID (Recommended for Production)
echo ===============================================
echo.
echo Step 1: Sign up at https://sendgrid.com
echo Step 2: Create API key with Mail Send permissions
echo Step 3: Verify your sender domain/email
echo.
echo Step 4: Update .env.local with:
echo   SENDGRID_API_KEY=your-sendgrid-api-key
echo   SENDGRID_FROM=contact@sunmovement.vn
echo   EMAIL_SERVICE=sendgrid
echo.
echo ===============================================
echo 3. RESEND (Alternative for Production)
echo ===============================================
echo.
echo Step 1: Sign up at https://resend.com
echo Step 2: Add and verify your domain
echo Step 3: Create API key
echo.
echo Step 4: Update .env.local with:
echo   RESEND_API_KEY=your-resend-api-key
echo   RESEND_FROM=contact@sunmovement.vn
echo   EMAIL_SERVICE=resend
echo.
echo ===============================================
echo 4. CURRENT DEVELOPMENT MODE
echo ===============================================
echo.
echo Currently set to development mode (EMAIL_SERVICE=development)
echo - Contact forms will work
echo - Emails will be logged to console instead of sent
echo - Good for testing form functionality
echo.
echo ===============================================
echo TESTING YOUR SETUP
echo ===============================================
echo.
echo 1. Start the development server: npm run dev
echo 2. Go to http://localhost:3000/lien-he
echo 3. Fill out and submit the contact form
echo 4. Check console logs for email data
echo.
echo For production, make sure to:
echo - Set up one of the email services above
echo - Update EMAIL_SERVICE in your .env file
echo - Test with a real email before deploying
echo.
echo ===============================================
echo.
pause
