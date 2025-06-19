@echo off
echo ========================================
echo        500 ERROR FINAL DEBUG
echo ========================================
echo.

echo [INFO] Killing existing processes...
taskkill /f /im dotnet.exe 2>nul
timeout /t 5 /nobreak >nul

echo [INFO] Building backend project...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
dotnet build --no-restore >build.log 2>&1

if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Check build.log
    type build.log | findstr /i "error"
    pause
    exit /b 1
)

echo [INFO] Starting backend server...
start /b cmd /c "dotnet run --urls=http://localhost:5000;https://localhost:5001 >server.log 2>&1"

echo [INFO] Waiting for server to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo [INFO] Server startup logs:
type server.log | findstr /i "listening\|started\|error\|exception\|fail"

echo [INFO] Checking if server is running...
netstat -an | findstr ":5000"
netstat -an | findstr ":5001"

echo [INFO] Testing cart first on HTTP port 5000...
curl -X POST http://localhost:5000/api/ShoppingCart/items ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1, \"quantity\": 1}" ^
  -c cookies.txt ^
  --connect-timeout 10 ^
  --max-time 30 ^
  --write-out "Add to cart status: %%{http_code}\n"

echo.
echo [INFO] Testing checkout on HTTP port 5000...
curl -X POST http://localhost:5000/api/orders/checkout ^
  -H "Content-Type: application/json" ^
  -b cookies.txt ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Test City\",\"province\":\"Test Province\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"123456789\"},\"paymentMethod\":\"cash\"}" ^
  --connect-timeout 10 ^
  --max-time 30 ^
  --write-out "Checkout status: %%{http_code}\n" ^
  --output response.json

echo.
echo [INFO] Response:
type response.json
echo.

echo [INFO] Server logs with errors:
type server.log | findstr /i "error\|exception\|fail"

echo.
echo [INFO] Full server logs:
type server.log

echo.
echo ========================================
echo Check the output above for issues
echo Press any key to stop server...
pause >nul

taskkill /f /im dotnet.exe 2>nul
del cookies.txt response.json 2>nul
