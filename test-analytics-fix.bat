@echo off
echo ========================================
echo TEST ANALYTICS CONTROLLER FIX
echo ========================================
echo.

echo [1/3] Dang build backend...
cd sun-movement-backend\SunMovement.Web
dotnet build --verbosity normal

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED! Co loi xay ra.
    echo.
    echo Cac loi co the:
    echo 1. Loi Length property tren object
    echo 2. Loi cast type
    echo 3. Loi using statements
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ BUILD SUCCESSFUL!
echo.

echo [2/3] Dang chay backend...
echo Backend se chay tai: http://localhost:5000
echo Admin dashboard: http://localhost:5000/admin
echo Analytics: http://localhost:5000/admin/analyticsadmin
echo.
echo Nhan Ctrl+C de dung server
echo.

dotnet run --urls "http://localhost:5000"

echo.
echo [3/3] Backend da dung.
pause 