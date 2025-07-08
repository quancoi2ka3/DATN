@echo off
echo Starting Sun Movement Frontend with error handling...
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Cleaning build cache...
if exist .next rmdir /s /q .next
if exist tsconfig.tsbuildinfo del /f /q tsconfig.tsbuildinfo

echo.
echo Installing dependencies (if needed)...
npm install

echo.
echo Choose startup mode:
echo 1. Normal mode (default)
echo 2. Turbo mode (faster, limited features)
echo 3. Safe mode (no optimizations)
echo.

set /p choice="Enter your choice (1-3, default is 1): "

if "%choice%"=="2" (
    echo Starting with Turbo mode...
    npm run dev:turbo
) else if "%choice%"=="3" (
    echo Starting in safe mode...
    npm run dev:safe
) else (
    echo Starting in normal mode...
    npm run dev
)

echo.
pause
