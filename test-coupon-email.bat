@echo off
echo ========================================
echo TESTING COUPON EMAIL NOTIFICATION
echo ========================================
echo.

echo 1. Starting backend...
echo    - Backend should be running on http://localhost:5000
echo    - Admin interface: http://localhost:5000/admin
echo.

echo 2. Test Steps:
echo    - Go to: http://localhost:5000/admin/couponsadmin/sendcouponnotification
echo    - Select a coupon from dropdown
echo    - Check "Gửi cho tất cả khách hàng" 
echo    - Click "Gửi thông báo"
echo    - Check backend logs for email sending details
echo.

echo 3. Expected Results:
echo    - Model validation should pass
echo    - Email configuration should be loaded
echo    - Emails should be sent to all customers
echo    - Success message should appear
echo.

echo 4. If emails fail to send:
echo    - Check Gmail App Password configuration
echo    - Verify 2FA is enabled on Gmail account
echo    - Check firewall/antivirus settings
echo    - Review backend logs for SMTP errors
echo.

pause 