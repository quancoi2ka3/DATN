@echo off
echo =========================================
echo   SAFE START BACKEND - SUN MOVEMENT
echo =========================================
echo.

echo [1] Killing existing dotnet processes...
taskkill /f /im dotnet.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Dotnet processes killed successfully
) else (
    echo ℹ️  No dotnet processes found running
)

timeout /t 2 /nobreak >nul

echo.
echo [2] Checking for processes using common ports...
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 is still in use, attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /f /pid %%a 2>nul
)

netstat -ano | findstr :5001 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5001 is still in use, attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001') do taskkill /f /pid %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo [3] Starting backend build and run...
cd "sun-movement-backend\SunMovement.Web"

echo Building project...
dotnet build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Check for compilation errors.
    pause
    exit /b 1
)

echo.
echo Starting server on https://localhost:5001...
dotnet run --urls=https://localhost:5001

pause
