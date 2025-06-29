@echo off
echo =============================================
echo  CLEAR CACHE & RESTART TEST
echo =============================================
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo [1/4] Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Next.js cache cleared
) else (
    echo - No Next.js cache found
)

echo.
echo [2/4] Clearing node_modules cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✓ Node modules cache cleared
) else (
    echo - No node modules cache found
)

echo.
echo [3/4] Rebuilding...
call npm run build

echo.
echo [4/4] Starting fresh server...
echo.
echo IMPORTANT: Please also clear your browser cache:
echo 1. Press F12 to open DevTools
echo 2. Right-click refresh button
echo 3. Select "Empty Cache and Hard Reload"
echo.
echo Starting server...
call npm start

pause
