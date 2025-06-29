@echo off
chcp 65001 > nul
echo.
echo =====================================================
echo       QUICK START - ADMIN SYSTEM
echo =====================================================
echo.

set PROJECT_PATH=d:\DATN\DATN\sun-movement-backend

echo Starting admin system...
echo.

echo [1/3] Checking project...
if not exist "%PROJECT_PATH%\SunMovement.Web\SunMovement.Web.csproj" (
    echo ❌ Project not found at %PROJECT_PATH%
    goto :error
)
echo ✅ Project found

echo.
echo [2/3] Building project...
cd /d "%PROJECT_PATH%"
dotnet build --configuration Release --verbosity quiet
if %errorlevel% neq 0 (
    echo ❌ Build failed
    goto :error
)
echo ✅ Build successful

echo.
echo [3/3] Starting server...
echo.
echo =====================================================
echo   SERVER STARTING - Admin Interface Available
echo =====================================================
echo.
echo 🌐 Admin Interface: http://localhost:5000/Admin
echo 📊 Dashboard:       http://localhost:5000/Admin/Dashboard
echo 🏷️  Mã giảm giá:     http://localhost:5000/Admin/CouponsAdmin
echo 🏢 Nhà cung cấp:    http://localhost:5000/Admin/SuppliersAdmin
echo 📦 Quản lý kho:     http://localhost:5000/Admin/InventoryAdmin
echo.
echo ✅ Toastr notifications: ENABLED (with fallback)
echo ✅ Form validation: CLIENT + SERVER SIDE
echo ✅ Date validation: AUTO-ADJUSTMENT
echo ✅ Responsive design: MOBILE FRIENDLY
echo.
echo Press Ctrl+C to stop the server
echo =====================================================
echo.

dotnet run --urls="http://localhost:5000"

goto :end

:error
echo.
echo ❌ Failed to start admin system!
echo.
pause
exit /b 1

:end
echo.
echo Server stopped.
pause
