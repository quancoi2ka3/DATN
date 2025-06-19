@echo off
title VNPay Quick Test - Sun Movement
echo ====================================
echo VNPAY QUICK TEST AFTER FIX
echo ====================================
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd /d d:\DATN\DATN\sun-movement-backend\SunMovement.Web && dotnet run"

echo Waiting for server to start...
timeout /t 10

echo.
echo Testing VNPay URL generation...
curl -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{\"customerId\": 1, \"items\": [{\"productId\": 1, \"quantity\": 1, \"price\": 100000}], \"paymentMethod\": \"vnpay\"}"

echo.
echo ====================================
echo If you see a VNPay URL above, the fix is working!
echo Copy the URL and test it in browser.
echo ====================================
pause
