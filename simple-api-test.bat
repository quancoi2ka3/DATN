@echo off
chcp 65001 >nul
echo ========================================
echo    SIMPLE API ENDPOINT TESTS
echo ========================================

set BASE_URL=https://localhost:5001

echo.
echo [TEST 1] Backend Health Check
echo URL: %BASE_URL%/api/health
curl -k -X GET "%BASE_URL%/api/health" 2>nul
echo.
echo.

echo [TEST 2] Products List
echo URL: %BASE_URL%/api/products
curl -k -X GET "%BASE_URL%/api/products" 2>nul | more
echo.
echo ... (truncated)
echo.

echo [TEST 3] Cart GET (should return empty cart)
echo URL: %BASE_URL%/api/ShoppingCart/items
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" 2>nul
echo.
echo.

echo [TEST 4] Add to Cart
echo URL: %BASE_URL%/api/ShoppingCart/items
curl -k -X POST "%BASE_URL%/api/ShoppingCart/items" -H "Content-Type: application/json" -d "{\"productId\":1,\"quantity\":2}" 2>nul
echo.
echo.

echo [TEST 5] Cart GET after adding item
echo URL: %BASE_URL%/api/ShoppingCart/items
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" 2>nul
echo.
echo.

echo [TEST 6] Orders List
echo URL: %BASE_URL%/api/orders
curl -k -X GET "%BASE_URL%/api/orders" 2>nul
echo.
echo.

echo [TEST 7] VNPay Payment URL
echo URL: %BASE_URL%/api/vnpay/create-payment
curl -k -X POST "%BASE_URL%/api/vnpay/create-payment" -H "Content-Type: application/json" -d "{\"orderId\":\"TEST001\",\"amount\":100000,\"orderInfo\":\"Test Order\"}" 2>nul
echo.
echo.

echo [TEST 8] Checkout with Cash
echo URL: %BASE_URL%/api/orders/checkout
curl -k -X POST "%BASE_URL%/api/orders/checkout" -H "Content-Type: application/json" -d "{\"paymentMethod\":\"cash\",\"shippingAddress\":\"123 Test Street\",\"notes\":\"Test order\"}" 2>nul
echo.
echo.

echo ========================================
echo           TESTS COMPLETED
echo ========================================
pause
