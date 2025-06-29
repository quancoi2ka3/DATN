@echo off
echo =============================================
echo  FINAL FIX - FORCED CSS APPROACH
echo =============================================
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Step 1: Clearing ALL cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✓ Next.js cache cleared
)
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 
    echo ✓ Node cache cleared
)

echo.
echo Step 2: Added FORCED CSS with !important to globals.css
echo ✓ Product cards will have enhanced hover effects
echo ✓ Buttons will have gradient backgrounds  
echo ✓ Scroll progress bar at top
echo ✓ Discount badges will wiggle
echo ✓ All effects use !important to override conflicts
echo.

echo Step 3: Building with forced styles...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! Starting server...
    echo.
    echo WHAT YOU WILL SEE:
    echo 🔴 RED scroll progress bar at top of page
    echo 🎯 Product cards lift up dramatically on hover
    echo 🌈 All buttons have red gradient backgrounds
    echo 🎪 Discount badges wiggle when you hover
    echo ✨ Shimmer effects on card hover
    echo.
    start "" npm start
    
    timeout /t 3 > nul
    start "" "http://localhost:3000"
    
    echo.
    echo CRITICAL: Clear browser cache completely!
    echo 1. Press Ctrl+Shift+Delete
    echo 2. Clear "Cached images and files"
    echo 3. Or use Incognito/Private mode
    echo.
    
) else (
    echo ❌ Build failed. Check errors above.
    pause
)

echo Press any key to exit...
pause > nul
