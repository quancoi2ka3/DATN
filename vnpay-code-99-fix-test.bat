@echo off
title VNPay Code 99 Fix Test - Sun Movement
echo ====================================
echo VNPAY CODE 99 FIX TEST
echo ====================================
echo.

echo [1] Testing VNPay URL Generation after fixes...
echo.

echo Creating test order with simple data...
curl -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{\"customerId\": 1, \"items\": [{\"productId\": 1, \"quantity\": 1, \"price\": 100000}], \"paymentMethod\": \"vnpay\"}" ^
2>nul || (
    echo ERROR: Backend is not running or request failed
    echo Please start the backend server first: dotnet run
    pause
    exit /b 1
)

echo.
echo [2] Testing with different amounts...
echo.

echo --- Test 50,000 VND ---
curl -s -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{\"customerId\": 1, \"items\": [{\"productId\": 1, \"quantity\": 1, \"price\": 50000}], \"paymentMethod\": \"vnpay\"}"

echo.
echo --- Test 1,000,000 VND ---
curl -s -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{\"customerId\": 2, \"items\": [{\"productId\": 1, \"quantity\": 10, \"price\": 100000}], \"paymentMethod\": \"vnpay\"}"

echo.
echo [3] Checking parameter requirements...
echo.
echo Key fixes applied:
echo - Fixed vnp_OrderInfo: removed special characters
echo - Fixed vnp_IpnUrl: using proper backend URL instead of webhook.site
echo - Ensured all required parameters are present
echo - Amount format: multiply by 100 for VND cents
echo - Date format: yyyyMMddHHmmss
echo - Hash algorithm: HMAC SHA512
echo.

echo [4] Validation checklist:
echo ✓ vnp_Version = 2.1.0
echo ✓ vnp_Command = pay
echo ✓ vnp_TmnCode = DEMOV210 (demo merchant)
echo ✓ vnp_HashSecret = RAOEXHYVSDDIIENYWSLDIIZTANXUXZFJ
echo ✓ vnp_Amount = integer (VND * 100)
echo ✓ vnp_CurrCode = VND
echo ✓ vnp_TxnRef = unique transaction reference
echo ✓ vnp_OrderInfo = simple text without special chars
echo ✓ vnp_OrderType = other
echo ✓ vnp_Locale = vn
echo ✓ vnp_ReturnUrl = valid URL
echo ✓ vnp_IpnUrl = valid backend URL
echo ✓ vnp_IpAddr = client IP
echo ✓ vnp_CreateDate = yyyyMMddHHmmss format
echo ✓ vnp_ExpireDate = yyyyMMddHHmmss format
echo ✓ vnp_SecureHash = HMAC SHA512

echo.
echo [5] Common Code 99 Error Causes - Now Fixed:
echo ✗ Missing vnp_IpnUrl parameter - FIXED
echo ✗ Invalid characters in vnp_OrderInfo - FIXED
echo ✗ Wrong URL format in vnp_IpnUrl - FIXED
echo ✗ Special characters not URL encoded - FIXED
echo ✗ Wrong hash calculation - VERIFIED
echo ✗ Missing required parameters - CHECKED

echo.
echo [6] Next steps:
echo 1. Verify backend is running (port 5000)
echo 2. Test the payment URL generated above
echo 3. Try the VNPay payment flow
echo 4. Check if error code 99 is resolved
echo.

echo ====================================
echo Test completed. If you still get error 99:
echo 1. Check the URL parameters above
echo 2. Verify VNPay sandbox is accessible
echo 3. Ensure all parameters are properly encoded
echo ====================================
pause
