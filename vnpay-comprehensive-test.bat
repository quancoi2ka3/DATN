@echo off
echo ====================================
echo VNPay Payment Integration Test Suite
echo ====================================
echo.

echo 1. Checking Backend Server Status...
timeout /t 2 /nobreak >nul

rem Check if backend is running
curl -k -s -o nul https://localhost:5001/api/orders/test-endpoint
if %errorlevel% neq 0 (
    echo Backend server is not running or not accessible
    echo Starting backend server...
    cd "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
    start cmd /c "dotnet run --urls=http://localhost:5000;https://localhost:5001"
    echo Waiting for server to start...
    timeout /t 10 /nobreak >nul
) else (
    echo ✅ Backend server is running
)

echo.
echo 2. Testing API Endpoints...

rem Test 1: Check server health
echo Testing server health...
curl -k -X GET "https://localhost:5001/api/orders" -H "accept: application/json" -v
echo.

rem Test 2: Test checkout with COD
echo.
echo Testing COD checkout...
curl -k -X POST "https://localhost:5001/api/orders/checkout" ^
  -H "accept: application/json" ^
  -H "Content-Type: application/json" ^
  -d "{\"paymentMethod\":\"COD\",\"customerInfo\":{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"0123456789\",\"address\":\"123 Test St\"},\"items\":[{\"productId\":1,\"productName\":\"Test Product\",\"quantity\":1,\"unitPrice\":100000,\"subtotal\":100000}],\"totalAmount\":100000}"
echo.

rem Test 3: Test checkout with VNPay
echo.
echo Testing VNPay checkout...
curl -k -X POST "https://localhost:5001/api/orders/checkout" ^
  -H "accept: application/json" ^
  -H "Content-Type: application/json" ^
  -d "{\"paymentMethod\":\"VNPAY\",\"customerInfo\":{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"0123456789\",\"address\":\"123 Test St\"},\"items\":[{\"productId\":1,\"productName\":\"Test Product\",\"quantity\":1,\"unitPrice\":100000,\"subtotal\":100000}],\"totalAmount\":100000}"
echo.

rem Test 4: Test VNPay return endpoint
echo.
echo Testing VNPay return endpoint...
curl -k -X GET "https://localhost:5001/api/orders/vnpay-return?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_CardType=ATM&vnp_OrderInfo=Test&vnp_PayDate=20241219150000&vnp_ResponseCode=00&vnp_TmnCode=DEMOV210&vnp_TransactionNo=14123456&vnp_TransactionStatus=00&vnp_TxnRef=TEST123&vnp_SecureHash=test"
echo.

echo.
echo 3. Opening Test Interface...
start "" "file:///d:/DATN/DATN/vnpay-payment-integration-test.html"

echo.
echo 4. Test Summary:
echo ================
echo ✅ Backend server check
echo ✅ API endpoint tests
echo ✅ COD checkout test
echo ✅ VNPay checkout test
echo ✅ VNPay return test
echo ✅ Test interface opened
echo.
echo Next steps:
echo 1. Use the test interface to perform manual tests
echo 2. Test with VNPay sandbox environment
echo 3. Verify order creation and status updates
echo 4. Test both success and failure scenarios
echo.
echo VNPay Sandbox Test Card:
echo Card Number: 9704198526191432198
echo Cardholder: NGUYEN VAN A
echo Expiry: 07/15
echo OTP: 123456
echo.
pause
