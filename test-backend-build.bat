@echo off
echo ========================================
echo TEST BUILD BACKEND
echo ========================================
echo.

echo [1/3] Dang build backend...
cd sun-movement-backend\SunMovement.Web
dotnet build --verbosity normal

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED! Co loi xay ra.
    echo.
    echo Cac buoc kiem tra:
    echo 1. Kiem tra tat ca using statements
    echo 2. Kiem tra interface IUnitOfWork
    echo 3. Kiem tra cac repository methods
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