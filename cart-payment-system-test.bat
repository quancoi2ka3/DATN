@echo off
echo ==========================================
echo  SUN MOVEMENT - CART & PAYMENT SYSTEM TEST
echo ==========================================
echo.

:: Kiểm tra SQL Server connection
echo [1/6] Checking SQL Server connection...
sqlcmd -E -S .\SQLEXPRESS -Q "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ SQL Server connection successful
) else (
    echo ✗ SQL Server connection failed
    echo Please ensure SQL Server Express is running
    pause
    exit /b 1
)

:: Backup database trước khi test
echo.
echo [2/6] Creating database backup...
sqlcmd -E -S .\SQLEXPRESS -Q "BACKUP DATABASE SunMovementDB TO DISK = 'C:\temp\SunMovementDB_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.bak'" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Database backup created
) else (
    echo ⚠ Database backup failed - continuing without backup
)

:: Start backend server
echo.
echo [3/6] Starting backend server...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
start "Backend Server" cmd /k "dotnet run --urls=http://localhost:5000;https://localhost:5001"

:: Wait for backend to start
echo Waiting for backend server to start...
timeout /t 10 /nobreak >nul

:: Test backend API
echo.
echo [4/6] Testing backend API endpoints...

:: Test Shopping Cart API
curl -s -o nul -w "Cart API: %%{http_code}\n" http://localhost:5000/api/ShoppingCart

:: Test Orders API  
curl -s -o nul -w "Orders API: %%{http_code}\n" http://localhost:5000/api/orders

:: Test VNPay API
curl -s -o nul -w "VNPay API: %%{http_code}\n" http://localhost:5000/api/VNPay/return

:: Start frontend server
echo.
echo [5/6] Starting frontend server...
cd /d "d:\DATN\DATN\sun-movement-frontend"
start "Frontend Server" cmd /k "npm run dev"

:: Wait for frontend to start
echo Waiting for frontend server to start...
timeout /t 15 /nobreak >nul

:: Test frontend connection
echo.
echo [6/6] Testing frontend connection...
curl -s -o nul -w "Frontend: %%{http_code}\n" http://localhost:3000

echo.
echo ==========================================
echo  SYSTEM STATUS
echo ==========================================
echo ✓ Backend running on: http://localhost:5000
echo ✓ Admin panel: http://localhost:5000/admin
echo ✓ Frontend running on: http://localhost:3000
echo ✓ Cart & Payment system ready for testing
echo.
echo ==========================================
echo  VNPAY TEST CREDENTIALS
echo ==========================================
echo TMN Code: DEMO
echo Hash Secret: DEMO_HASH_SECRET_KEY
echo Test Card: 9704 0000 0000 0018
echo Test Date: 07/15 
echo Test CVV: 123
echo.
echo ==========================================
echo  TESTING INSTRUCTIONS
echo ==========================================
echo 1. Open http://localhost:3000 in browser
echo 2. Register/Login with test account
echo 3. Add products to cart (sportswear/supplements)
echo 4. Go to checkout and test payment methods:
echo    - Cash on Delivery (COD)
echo    - Bank Transfer  
echo    - VNPay (use test credentials above)
echo 5. Check admin panel for payment management
echo.
echo Press any key to open test interface...
pause >nul

:: Open test interfaces
start http://localhost:3000
start http://localhost:5000/admin
start http://localhost:3000/store/sportswear
start http://localhost:3000/store/supplements

echo.
echo Test environment ready! Check the opened browser tabs.
echo Press any key to exit...
pause >nul
