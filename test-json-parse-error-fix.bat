@echo off
echo ========================================
echo     TESTING JSON PARSE ERROR FIX
echo ========================================
echo.

echo [1/5] Starting backend server...
start /b cmd /c "cd /d d:\DATN\DATN\sun-movement-backend\SunMovement.Web && dotnet run > backend.log 2>&1"

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo [2/5] Testing backend API directly...
curl -X POST http://localhost:5000/api/ShoppingCart/items ^
  -H "Content-Type: application/json" ^
  -H "Cookie: ASP.NET_SessionId=test-session" ^
  -d "{\"productId\": 1, \"quantity\": 2}" ^
  -c cookies.txt

echo.
echo [3/5] Testing checkout directly...
curl -X POST http://localhost:5000/api/orders/checkout ^
  -H "Content-Type: application/json" ^
  -H "Cookie: ASP.NET_SessionId=test-session" ^
  -b cookies.txt ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Test City\",\"province\":\"Test Province\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"123456789\"},\"paymentMethod\":\"cash\"}"

echo.
echo [4/5] Starting frontend server...
start /b cmd /c "cd /d d:\DATN\DATN\sun-movement-frontend && npm run dev > frontend.log 2>&1"

echo Waiting for frontend to start...
timeout /t 15 /nobreak >nul

echo [5/5] Opening test page...
start http://localhost:3000

echo.
echo ========================================
echo Test completed! 
echo - Backend running on http://localhost:5000
echo - Frontend running on http://localhost:3000
echo - Please test the full flow in the browser
echo ========================================
echo.
echo Press any key to stop servers...
pause >nul

echo Stopping servers...
taskkill /f /im dotnet.exe 2>nul
taskkill /f /im node.exe 2>nul

del cookies.txt 2>nul
echo Cleanup completed.
