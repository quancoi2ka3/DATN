@echo off
echo ========================================
echo    DEBUGGING 500 ERROR IN CHECKOUT
echo ========================================
echo.

echo [1/4] Killing any existing backend processes...
taskkill /f /im dotnet.exe 2>nul
timeout /t 3 /nobreak >nul

echo [2/4] Starting backend with detailed logging...
cd /d d:\DATN\DATN\sun-movement-backend\SunMovement.Web

echo [INFO] Backend directory: %cd%
echo [INFO] Starting dotnet run...

start /b cmd /c "dotnet run --urls=\"http://localhost:5000;https://localhost:5001\" > backend-debug.log 2>&1"

echo [3/4] Waiting for backend to fully start...
timeout /t 15 /nobreak >nul

echo [4/4] Testing checkout endpoint directly...
curl -X POST https://localhost:5001/api/orders/checkout ^
  -H "Content-Type: application/json" ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Test City\",\"province\":\"Test Province\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"123456789\"},\"paymentMethod\":\"cash\"}" ^
  -k ^
  --write-out "HTTP Status: %%{http_code}\n" ^
  --output response-debug.json ^
  --show-error ^
  --fail-with-body

echo.
echo [INFO] Response saved to response-debug.json
echo [INFO] Backend logs:
echo ----------------------------------------
type backend-debug.log | findstr /i "error\|exception\|fail"
echo ----------------------------------------

echo.
echo [INFO] Full response:
type response-debug.json
echo.

echo ========================================
echo Check the logs above for specific errors
echo Press any key to continue...
pause >nul
