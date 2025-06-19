@echo off
title VNPay Payment Integration Test
color 0A

echo ========================================
echo VNPay Payment Integration Test
echo ========================================
echo.

echo [1] Restarting backend server...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"

rem Kill any existing dotnet processes
taskkill /F /IM dotnet.exe 2>nul

echo [2] Starting backend server on port 5001...
start "Backend Server" /D "d:\DATN\DATN\sun-movement-backend\SunMovement.Web" cmd /k "dotnet run --urls=https://localhost:5001"

echo Waiting for backend to start...
timeout /t 5 >nul

echo [3] Testing backend health...
curl -k https://localhost:5001/health 2>nul
if %errorlevel% neq 0 (
    echo Backend health check failed, trying HTTP...
    curl http://localhost:5001/health 2>nul
)

echo [4] Starting frontend server...
cd /d "d:\DATN\DATN\sun-movement-frontend"
start "Frontend Server" /D "d:\DATN\DATN\sun-movement-frontend" cmd /k "npm run dev"

echo Waiting for frontend to start...
timeout /t 10 >nul

echo [5] Testing VNPay endpoints...
echo Testing checkout endpoint...
curl -k -X POST "https://localhost:5001/api/orders/checkout" -H "Content-Type: application/json" -d "{\"paymentMethod\":\"vnpay\",\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"HCM\",\"province\":\"HCM\"},\"contactInfo\":{\"email\":\"test@test.com\",\"phone\":\"0123456789\"}}" 2>nul

echo.
echo [6] Opening test pages...
start http://localhost:3000/store
start http://localhost:3000/checkout

echo.
echo ========================================
echo VNPay Integration Test Setup Complete!
echo ========================================
echo.
echo Test Steps:
echo 1. Add items to cart at: http://localhost:3000/store
echo 2. Go to checkout at: http://localhost:3000/checkout  
echo 3. Fill in shipping info and select "VNPay" payment
echo 4. Click "Đặt hàng" - should redirect to VNPay sandbox
echo 5. Complete payment on VNPay sandbox
echo 6. Verify redirect back to success page
echo.
echo VNPay Sandbox Test Cards:
echo - Card Number: 9704198526191432198
echo - Name: NGUYEN VAN A  
echo - Issue Date: 07/15
echo - OTP: 123456
echo.
echo Press any key to exit...
pause >nul
