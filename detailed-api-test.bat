@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ======================================
echo  DETAILED CART & CHECKOUT TEST
echo ======================================
echo.

set BASE_URL=https://localhost:5001
set TEST_EMAIL=testuser789@gmail.com
set TEST_PASSWORD=Test123456!

echo [1] Testing Backend Health...
curl -k -s -X GET "%BASE_URL%/api/health" -w "Status: %%{http_code}" -o temp_health.txt
echo.
if exist temp_health.txt (
    echo Response:
    type temp_health.txt
    echo.
)

echo [2] Testing User Registration...
curl -k -s -X POST "%BASE_URL%/api/auth/register" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\",\"confirmPassword\":\"%TEST_PASSWORD%\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phoneNumber\":\"0123456789\",\"address\":\"123 Test Street\"}" ^
    -w "Status: %%{http_code}" -o temp_register.txt
echo.
echo Registration Response:
type temp_register.txt
echo.

echo [3] Testing Anonymous Cart (no login required)...
echo Adding product to cart without authentication:
curl -k -s -X POST "%BASE_URL%/api/ShoppingCart/items" ^
    -H "Content-Type: application/json" ^
    -d "{\"productId\":1,\"quantity\":2}" ^
    -w "Status: %%{http_code}" -o temp_cart_anon.txt
echo.
echo Anonymous Cart Response:
type temp_cart_anon.txt
echo.

echo [4] Getting Products List...
curl -k -s -X GET "%BASE_URL%/api/products" ^
    -w "Status: %%{http_code}" -o temp_products.txt
echo.
echo Products Response (first 500 chars):
type temp_products.txt | more
echo.

echo [5] Testing Cart GET without auth...
curl -k -s -X GET "%BASE_URL%/api/ShoppingCart/items" ^
    -w "Status: %%{http_code}" -o temp_cart_get.txt
echo.
echo Cart GET Response:
type temp_cart_get.txt
echo.

echo [6] Testing Order Creation without auth...
curl -k -s -X POST "%BASE_URL%/api/orders" ^
    -H "Content-Type: application/json" ^
    -d "{\"items\":[{\"productId\":1,\"quantity\":2,\"price\":50000}],\"totalAmount\":100000,\"shippingAddress\":\"Test Address\",\"paymentMethod\":\"cash\"}" ^
    -w "Status: %%{http_code}" -o temp_order_create.txt
echo.
echo Order Creation Response:
type temp_order_create.txt
echo.

echo [7] Testing VNPay Payment URL Generation...
curl -k -s -X POST "%BASE_URL%/api/vnpay/create-payment" ^
    -H "Content-Type: application/json" ^
    -d "{\"orderId\":\"TEST001\",\"amount\":100000,\"orderInfo\":\"Test Order\"}" ^
    -w "Status: %%{http_code}" -o temp_vnpay.txt
echo.
echo VNPay Response:
type temp_vnpay.txt
echo.

echo [8] Testing Available API Endpoints...
echo Testing GET /api/orders:
curl -k -s -X GET "%BASE_URL%/api/orders" -w "Status: %%{http_code}" -o temp_orders_get.txt
type temp_orders_get.txt
echo.

echo Testing GET /api/orders/checkout:
curl -k -s -X GET "%BASE_URL%/api/orders/checkout" -w "Status: %%{http_code}" -o temp_checkout_get.txt
type temp_checkout_get.txt
echo.

echo ======================================
echo           ANALYSIS
echo ======================================
echo [INFO] Test completed. Check responses above for:
echo   - HTTP status codes (200 = OK, 401 = Unauthorized, etc.)
echo   - JSON response format
echo   - Error messages
echo   - Authentication requirements
echo ======================================

echo.
echo Cleaning up...
del temp_*.txt 2>nul
pause
