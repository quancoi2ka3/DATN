@echo off
echo Testing Email Configuration...
echo.

echo 1. Testing Email Configuration Endpoint...
curl -X GET "http://localhost:5000/admin/couponsadmin/testemailconfig" -H "Accept: application/json"

echo.
echo 2. Testing SMTP Connection...
echo Please check the backend logs for detailed email configuration information.

echo.
echo 3. Manual Test Steps:
echo - Go to: http://localhost:5000/admin/couponsadmin/sendcouponnotification
echo - Click "Test Email Config" button
echo - Check browser console for configuration details
echo - Try sending a test email

echo.
echo 4. Expected Configuration:
echo - Provider: smtp
echo - SMTP Server: smtp.gmail.com
echo - Sender: nguyenmanhquan17072003@gmail.com
echo - Has Password: true
echo - Enable SSL: true

pause 