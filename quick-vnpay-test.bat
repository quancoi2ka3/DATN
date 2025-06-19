@echo off
title Quick VNPay Test
color 0B

echo ========================================
echo Quick VNPay Integration Test
echo ========================================
echo.

echo [1] Starting backend...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
start "Backend" cmd /k "dotnet run --urls=http://localhost:5001"

echo [2] Waiting for backend to start...
timeout /t 8 >nul

echo [3] Opening VNPay test page...
start "VNPay Test" "d:\DATN\DATN\vnpay-integration-test.html"

echo [4] Starting frontend...
cd /d "d:\DATN\DATN\sun-movement-frontend"
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Test Setup Complete!
echo ========================================
echo.
echo Instructions:
echo 1. Use the VNPay test page to create test payments
echo 2. Or go to http://localhost:3000/store to test full flow
echo 3. Use VNPay test card: 9704198526191432198
echo.
echo Press any key to exit...
pause >nul
