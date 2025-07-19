@echo off
echo ========================================
echo TEST BUILD FIX - MONTHLYREGISTRATIONDATA
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
    echo 1. Loi MonthlyRegistrationData duplicate (da sua)
    echo 2. Loi namespace conflict
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
echo.
echo Nhan Ctrl+C de dung server
echo.

dotnet run --urls "http://localhost:5000"

echo.
echo [3/3] Backend da dung.
pause 