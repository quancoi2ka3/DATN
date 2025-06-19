@echo off
echo ========================================
echo    SIMPLE SERVER RESTART & TEST
echo ========================================
echo.

echo [1] Stopping all dotnet processes...
taskkill /f /im dotnet.exe 2>nul

echo [2] Starting backend server...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
start cmd /k "dotnet run --urls=http://localhost:5000"

echo [3] Server starting in new window...
echo [4] Wait for server to show "Now listening on: http://localhost:5000"
echo [5] Then test in browser: http://localhost:5000/api/orders/checkout
echo [6] Or test frontend: http://localhost:3000

echo.
echo ========================================
echo Server is starting in separate window
echo Check that window for startup messages
echo ========================================
pause
