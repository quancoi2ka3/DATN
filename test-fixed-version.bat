@echo off
echo =============================================
echo  FIXED VERSION - IMMEDIATE VISUAL CHANGES
echo =============================================
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Clearing cache và rebuild...
if exist ".next" rmdir /s /q ".next"

echo.
echo Building with fixes...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo WHAT YOU SHOULD SEE NOW:
    echo ✓ Scroll progress bar at top (RED)
    echo ✓ Product cards hover with smooth lift effect
    echo ✓ Card shimmer effect on hover
    echo ✓ Enhanced button gradients
    echo ✓ Smoother hero slide transitions  
    echo ✓ Real-time notifications (left side)
    echo ✓ Enhanced discount badge wiggle
    echo.
    echo Starting server...
    start "" npm start
    
    timeout /t 3 > nul
    echo Opening browser...
    start "" "http://localhost:3000"
    
    echo.
    echo IMPORTANT: Clear browser cache!
    echo 1. Press Ctrl+Shift+R (hard refresh)
    echo 2. Or F12 > Right-click refresh > Empty Cache and Hard Reload
    
) else (
    echo ❌ Build failed! Starting dev mode...
    call npm run dev
)

echo.
echo Press any key when done testing...
pause > nul
