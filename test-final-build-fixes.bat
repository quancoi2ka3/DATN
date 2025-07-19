@echo off
echo ========================================
echo TEST FINAL BUILD FIXES
echo ========================================
echo.

echo [1/5] Dang build backend...
cd sun-movement-backend\SunMovement.Web
dotnet build --verbosity normal

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED! Co loi xay ra.
    echo.
    echo Cac loi co the:
    echo 1. Loi IUnitOfWork.Users (da sua)
    echo 2. Loi object.Length (da sua)
    echo 3. Loi UserManager.ApplicationUser (da sua)
    echo 4. Loi CountAsync() - thiếu using Microsoft.EntityFrameworkCore (da sua)
    echo 5. Loi using statements
    echo.
    echo Hay kiem tra lai code va thu lai.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ BUILD SUCCESSFUL!
echo.

echo [2/5] Dang kiem tra migrations...
dotnet ef migrations list

echo.
echo [3/5] Dang kiem tra dependencies...
dotnet list package

echo.
echo [4/5] Dang chay backend...
echo Backend se chay tai: http://localhost:5000
echo Admin dashboard: http://localhost:5000/admin
echo.
echo Cac trang da sua:
echo - Settings: http://localhost:5000/admin/settingsadmin
echo - Analytics: http://localhost:5000/admin/analyticsadmin
echo - Inventory: http://localhost:5000/admin/inventoryadmin
echo - Orders: http://localhost:5000/admin/ordersadmin
echo.
echo Nhan Ctrl+C de dung server
echo.

dotnet run --urls "http://localhost:5000"

echo.
echo [5/5] Backend da dung.
pause 