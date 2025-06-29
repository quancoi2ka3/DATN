@echo off
echo.
echo ===============================================
echo    GMAIL SMTP CONFIGURED SUCCESSFULLY!
echo ===============================================
echo.
echo Email Configuration:
echo - SMTP Host: smtp.gmail.com
echo - Port: 587
echo - From: nguyenmanhquan17072003@gmail.com
echo - To: nguyenmanhquan17072003@gmail.com
echo - Service: smtp (ACTIVE)
echo.
echo ===============================================
echo          TESTING INSTRUCTIONS
echo ===============================================
echo.
echo 1. Make sure your dev server is STOPPED
echo 2. Start fresh server with new config:
echo    npm run dev
echo.
echo 3. Open browser: http://localhost:3000/lien-he
echo.
echo 4. Fill out contact form and submit
echo.
echo 5. Check your Gmail inbox: nguyenmanhquan17072003@gmail.com
echo    - Look in Inbox
echo    - Check Spam folder if not in inbox
echo    - Email subject will be: [LIÊN HỆ] ... or [PHẢN HỒI] ...
echo.
echo ===============================================
echo           EXPECTED EMAIL CONTENT
echo ===============================================
echo.
echo Subject: [LIÊN HỆ] Your Subject - Your Name
echo From: nguyenmanhquan17072003@gmail.com
echo To: nguyenmanhquan17072003@gmail.com
echo.
echo Content: Beautiful HTML email with:
echo - Contact form data
echo - Sender information
echo - Sun Movement branding
echo - Time stamp
echo.
echo ===============================================
echo.
echo Ready to test! Start your server now:
echo npm run dev
echo.
pause
