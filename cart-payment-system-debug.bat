@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo  CART & PAYMENT SYSTEM - COMPREHENSIVE TEST
echo ==========================================
echo.

set BACKEND_URL=https://localhost:5001
set API_URL=%BACKEND_URL%/api

echo Testing backend server at: %BACKEND_URL%
echo.

:: Test 1: Backend Health Check
echo [1/10] Backend Health Check...
curl -k -s -o nul -w "Backend Health: %%{http_code}\n" %BACKEND_URL%
if %errorlevel% neq 0 (
    echo ✗ Backend server not accessible
    pause
    exit /b 1
)

:: Test 2: API Endpoints Basic Connectivity
echo.
echo [2/10] Testing API Endpoints...
echo Testing Shopping Cart API...
curl -k -s -o temp_response.txt -w "ShoppingCart API: %%{http_code}\n" %API_URL%/ShoppingCart
type temp_response.txt
echo.

echo Testing Orders API...
curl -k -s -o temp_response.txt -w "Orders API: %%{http_code}\n" %API_URL%/orders
type temp_response.txt
echo.

echo Testing VNPay API...
curl -k -s -o temp_response.txt -w "VNPay API: %%{http_code}\n" %API_URL%/VNPay/return
type temp_response.txt
echo.

:: Test 3: Database Connection Test
echo [3/10] Testing Database Connection...
echo Testing via Products API...
curl -k -s -o temp_response.txt -w "Products API: %%{http_code}\n" %API_URL%/products
if exist temp_response.txt (
    findstr /C:"[" temp_response.txt >nul
    if !errorlevel! equ 0 (
        echo ✓ Database connection working - Products data found
    ) else (
        echo ⚠ Database connection issue or no products data
    )
) else (
    echo ✗ No response from Products API
)
echo.

:: Test 4: Authentication System Test
echo [4/10] Testing Authentication System...
echo Testing login endpoint...
curl -k -s -X POST -H "Content-Type: application/json" ^
-d "{\"email\":\"test@test.com\",\"password\":\"Test123!\"}" ^
-o temp_response.txt -w "Login API: %%{http_code}\n" %API_URL%/auth/login
type temp_response.txt
echo.

:: Test 5: Cart API Structure Test
echo [5/10] Testing Cart API Structure...
echo Attempting to get cart (should require auth)...
curl -k -s -X GET %API_URL%/ShoppingCart ^
-o temp_response.txt -w "Get Cart: %%{http_code}\n"
type temp_response.txt
echo.

:: Test 6: VNPay Configuration Test
echo [6/10] Testing VNPay Configuration...
echo Checking VNPay service registration...
curl -k -s -X GET %API_URL%/VNPay/return?test=1 ^
-o temp_response.txt -w "VNPay Config: %%{http_code}\n"
type temp_response.txt
echo.

:: Test 7: Orders Checkout Endpoint Test  
echo [7/10] Testing Orders Checkout Endpoint...
echo Testing checkout endpoint structure...
curl -k -s -X POST -H "Content-Type: application/json" ^
-d "{\"shippingAddress\":{\"fullName\":\"Test\",\"addressLine1\":\"Test\",\"city\":\"Test\",\"province\":\"Test\"},\"contactInfo\":{\"email\":\"test@test.com\",\"phone\":\"123456789\"},\"paymentMethod\":\"cod\"}" ^
-o temp_response.txt -w "Checkout API: %%{http_code}\n" %API_URL%/orders/checkout
type temp_response.txt
echo.

:: Test 8: Admin Panel Accessibility
echo [8/10] Testing Admin Panel...
echo Testing admin area access...
curl -k -s -o temp_response.txt -w "Admin Panel: %%{http_code}\n" %BACKEND_URL%/admin
findstr /C:"admin" temp_response.txt >nul
if !errorlevel! equ 0 (
    echo ✓ Admin panel accessible
) else (
    echo ⚠ Admin panel may have access restrictions
)
echo.

echo Testing Payments Admin...
curl -k -s -o temp_response.txt -w "Payments Admin: %%{http_code}\n" %BACKEND_URL%/admin/PaymentsAdmin
type temp_response.txt
echo.

:: Test 9: Entity Framework Models Test
echo [9/10] Testing Data Models...
echo Testing if Order model has PaymentMethod field...
findstr /C:"PaymentMethod" "d:\DATN\DATN\sun-movement-backend\SunMovement.Core\Models\Order.cs" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✓ Order model has PaymentMethod field
) else (
    echo ✗ Order model missing PaymentMethod field
)

echo Testing if VNPayService exists...
if exist "d:\DATN\DATN\sun-movement-backend\SunMovement.Infrastructure\Services\VNPayService.cs" (
    echo ✓ VNPayService implementation found
) else (
    echo ✗ VNPayService implementation missing
)

echo Testing if CheckoutModels exist...
if exist "d:\DATN\DATN\sun-movement-backend\SunMovement.Web\Areas\Api\Models\CheckoutModels.cs" (
    echo ✓ CheckoutModels found
) else (
    echo ✗ CheckoutModels missing
)
echo.

:: Test 10: Configuration Test
echo [10/10] Testing Configuration...
echo Checking VNPay configuration in appsettings.json...
findstr /C:"VNPay" "d:\DATN\DATN\sun-movement-backend\SunMovement.Web\appsettings.json" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✓ VNPay configuration found in appsettings.json
) else (
    echo ✗ VNPay configuration missing
)

echo Checking service registrations in Program.cs...
findstr /C:"VNPayService" "d:\DATN\DATN\sun-movement-backend\SunMovement.Web\Program.cs" >nul 2>&1
if !errorlevel! equ 0 (
    echo ✓ VNPayService registered in DI container
) else (
    echo ✗ VNPayService not registered in DI container
)
echo.

:: Cleanup
if exist temp_response.txt del temp_response.txt

echo ==========================================
echo  TEST SUMMARY
echo ==========================================
echo.
echo ✓ Tests completed. Review results above for any issues.
echo.
echo ==========================================
echo  NEXT STEPS FOR MANUAL TESTING
echo ==========================================
echo.
echo 1. Start frontend server (npm run dev)
echo 2. Open browser to https://localhost:5001
echo 3. Test user registration/login
echo 4. Test adding products to cart
echo 5. Test checkout with different payment methods
echo 6. Test VNPay payment flow
echo 7. Test admin panel payment management
echo.
echo Opening test URLs...
start https://localhost:5001
start https://localhost:5001/admin
start https://localhost:5001/swagger
echo.
echo Press any key to continue...
pause >nul
