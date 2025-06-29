@echo off
echo =============================================
echo  SUN MOVEMENT - VISUAL ENHANCEMENT TEST
echo =============================================
echo.
echo Testing New Visual Improvements:
echo.
echo ✓ Fixed image loading issues in hero slides
echo ✓ Removed duplicate floating buttons
echo ✓ Added scroll progress indicator
echo ✓ Enhanced card hover effects with shimmer
echo ✓ Ripple button effects
echo ✓ Smooth page transitions
echo ✓ Image loading placeholders
echo ✓ Wiggle animation for discount badges
echo ✓ Enhanced gradients and shadows
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Building the enhanced version...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful! Starting server...
    echo.
    echo What to test:
    echo 1. Page loads with smooth transition and progress bar
    echo 2. Hero slides now show images correctly
    echo 3. Product cards have enhanced hover effects
    echo 4. Buttons have ripple effects when clicked
    echo 5. No duplicate floating buttons
    echo 6. Discount badges wiggle on hover
    echo 7. Shimmer effects on cards
    echo.
    echo Opening in production mode for best performance...
    start "" npm start
    
    timeout /t 3 > nul
    echo.
    echo Opening browser...
    start "" "http://localhost:3000"
    
) else (
    echo.
    echo ❌ Build failed! Check errors above.
    echo Running in development mode instead...
    npm run dev
)

echo.
echo Press any key to exit...
pause > nul
