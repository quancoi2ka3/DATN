@echo off
echo ======================================
echo  SUN MOVEMENT CART & CHECKOUT SYSTEM
echo       COMPREHENSIVE TEST SUITE
echo ======================================
echo.

REM Set variables
set BASE_URL=https://localhost:5001
set TEST_EMAIL=testuser@gmail.com
set TEST_PASSWORD=Test123456!
set TOKEN_FILE=temp_token.txt

echo [INFO] Testing backend server health...
curl -k -s -X GET "%BASE_URL%/api/health" > temp_health.json
if %errorlevel% neq 0 (
    echo [ERROR] Backend server is not responding!
    goto :cleanup
)
echo [OK] Backend server is running

echo.
echo [INFO] Step 1: Testing User Registration...
curl -k -s -X POST "%BASE_URL%/api/auth/register" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\",\"confirmPassword\":\"%TEST_PASSWORD%\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phoneNumber\":\"0123456789\",\"address\":\"123 Test Street\"}" ^
    > temp_register.json

echo Registration response:
type temp_register.json
echo.

echo [INFO] Step 2: Testing User Login...
curl -k -s -X POST "%BASE_URL%/api/auth/login" ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\"}" ^
    > temp_login.json

echo Login response:
type temp_login.json
echo.

REM Extract token from login response
for /f "tokens=2 delims=:" %%a in ('findstr "token" temp_login.json') do (
    set TOKEN=%%a
    set TOKEN=!TOKEN:"=!
    set TOKEN=!TOKEN:,=!
    set TOKEN=!TOKEN: =!
)

if "%TOKEN%"=="" (
    echo [WARNING] No token found - user may need email verification
    echo [INFO] Continuing with anonymous cart tests...
    set AUTH_HEADER=
) else (
    echo [OK] Token extracted: %TOKEN%
    set AUTH_HEADER=Authorization: Bearer %TOKEN%
)

echo.
echo [INFO] Step 3: Testing Product List...
curl -k -s -X GET "%BASE_URL%/api/products" > temp_products.json
echo Products response (first few lines):
type temp_products.json | more /E /P
echo.

echo [INFO] Step 4: Testing Cart Operations...

echo [INFO] 4.1: Get current cart (empty)
curl -k -s -X GET "%BASE_URL%/api/ShoppingCart/items" ^
    -H "%AUTH_HEADER%" > temp_cart_empty.json
echo Empty cart response:
type temp_cart_empty.json
echo.

echo [INFO] 4.2: Add item to cart (Product ID: 1)
curl -k -s -X POST "%BASE_URL%/api/ShoppingCart/items" ^
    -H "Content-Type: application/json" ^
    -H "%AUTH_HEADER%" ^
    -d "{\"productId\":1,\"quantity\":2}" ^
    > temp_add_cart.json
echo Add to cart response:
type temp_add_cart.json
echo.

echo [INFO] 4.3: Get cart after adding item
curl -k -s -X GET "%BASE_URL%/api/ShoppingCart/items" ^
    -H "%AUTH_HEADER%" > temp_cart_with_items.json
echo Cart with items response:
type temp_cart_with_items.json
echo.

echo [INFO] 4.4: Update cart item quantity
curl -k -s -X PUT "%BASE_URL%/api/ShoppingCart/items" ^
    -H "Content-Type: application/json" ^
    -H "%AUTH_HEADER%" ^
    -d "{\"productId\":1,\"quantity\":3}" ^
    > temp_update_cart.json
echo Update cart response:
type temp_update_cart.json
echo.

echo [INFO] Step 5: Testing Checkout Process...

echo [INFO] 5.1: Checkout with Cash on Delivery
curl -k -s -X POST "%BASE_URL%/api/orders/checkout" ^
    -H "Content-Type: application/json" ^
    -H "%AUTH_HEADER%" ^
    -d "{\"paymentMethod\":\"cash\",\"shippingAddress\":\"123 Test Street, Test City\",\"notes\":\"Test order\"}" ^
    > temp_checkout_cash.json
echo Cash checkout response:
type temp_checkout_cash.json
echo.

echo [INFO] 5.2: Add item back to cart for VNPay test
curl -k -s -X POST "%BASE_URL%/api/ShoppingCart/items" ^
    -H "Content-Type: application/json" ^
    -H "%AUTH_HEADER%" ^
    -d "{\"productId\":1,\"quantity\":1}" ^
    > temp_add_cart2.json

echo [INFO] 5.3: Checkout with VNPay
curl -k -s -X POST "%BASE_URL%/api/orders/checkout" ^
    -H "Content-Type: application/json" ^
    -H "%AUTH_HEADER%" ^
    -d "{\"paymentMethod\":\"vnpay\",\"shippingAddress\":\"123 Test Street, Test City\",\"notes\":\"VNPay test order\"}" ^
    > temp_checkout_vnpay.json
echo VNPay checkout response:
type temp_checkout_vnpay.json
echo.

echo [INFO] Step 6: Testing Admin Order Management...
curl -k -s -X GET "%BASE_URL%/api/orders" ^
    -H "%AUTH_HEADER%" > temp_orders.json
echo Orders list response:
type temp_orders.json
echo.

echo [INFO] Step 7: Testing VNPay Integration...

echo [INFO] 7.1: Test VNPay payment URL generation
curl -k -s -X POST "%BASE_URL%/api/vnpay/create-payment" ^
    -H "Content-Type: application/json" ^
    -H "%AUTH_HEADER%" ^
    -d "{\"orderId\":\"TEST001\",\"amount\":100000,\"orderInfo\":\"Test payment\"}" ^
    > temp_vnpay_payment.json
echo VNPay payment URL response:
type temp_vnpay_payment.json
echo.

echo [INFO] 7.2: Test VNPay callback (simulation)
curl -k -s -X GET "%BASE_URL%/api/vnpay/callback?vnp_ResponseCode=00&vnp_TxnRef=TEST001&vnp_TransactionNo=123456&vnp_Amount=10000000" ^
    > temp_vnpay_callback.json
echo VNPay callback response:
type temp_vnpay_callback.json
echo.

echo.
echo [INFO] Step 8: Cart Cleanup Test...
curl -k -s -X DELETE "%BASE_URL%/api/ShoppingCart/clear" ^
    -H "%AUTH_HEADER%" > temp_clear_cart.json
echo Clear cart response:
type temp_clear_cart.json
echo.

echo [INFO] Final cart status:
curl -k -s -X GET "%BASE_URL%/api/ShoppingCart/items" ^
    -H "%AUTH_HEADER%" > temp_cart_final.json
type temp_cart_final.json
echo.

echo ======================================
echo          TEST SUMMARY
echo ======================================
echo [INFO] All cart and checkout tests completed!
echo [INFO] Check the temp_*.json files for detailed responses
echo [INFO] Key areas tested:
echo   - User registration and login
echo   - Product listing
echo   - Cart operations (add, update, clear)
echo   - Checkout with cash and VNPay
echo   - Order management
echo   - VNPay integration
echo ======================================

:cleanup
echo.
echo [INFO] Cleaning up temporary files...
del /Q temp_*.json 2>nul
echo [INFO] Test completed!
pause
