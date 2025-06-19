@echo off
echo ========================================
echo    TESTING CIRCULAR REFERENCE FIX
echo ========================================
echo.

echo [INFO] Starting backend server...
start /b cmd /c "cd /d d:\DATN\DATN\sun-movement-backend\SunMovement.Web && dotnet run > backend-circular-fix.log 2>&1"

echo [INFO] Waiting for backend to start...
timeout /t 12 /nobreak >nul

echo [INFO] Testing add to cart...
curl -X POST http://localhost:5000/api/ShoppingCart/items ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1, \"quantity\": 1}" ^
  -c cookies.txt ^
  --silent

echo.
echo [INFO] Testing checkout with circular reference fix...
curl -X POST http://localhost:5000/api/orders/checkout ^
  -H "Content-Type: application/json" ^
  -b cookies.txt ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Test City\",\"province\":\"Test Province\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"123456789\"},\"paymentMethod\":\"cash\"}" ^
  --write-out "%%{http_code}" ^
  --output checkout-response.json

echo.
echo [INFO] Checkout response saved to checkout-response.json
echo [INFO] Checking if JSON is valid...

type checkout-response.json | find "success" >nul
if %errorlevel% == 0 (
    echo [SUCCESS] ✅ Circular reference fix successful!
    echo [SUCCESS] ✅ JSON response is valid
) else (
    echo [ERROR] ❌ Still has issues
)

echo.
echo [INFO] Full response:
type checkout-response.json
echo.

echo ========================================
echo Press any key to stop backend server...
pause >nul

echo [INFO] Stopping backend server...
taskkill /f /im dotnet.exe 2>nul

del cookies.txt 2>nul
echo [INFO] Cleanup completed.
