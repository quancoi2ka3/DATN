@echo off
echo =============================================
echo  SUN MOVEMENT - Enhanced UX Version
echo =============================================
echo.
echo Starting Sun Movement with new UX improvements...
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo [1/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed ✓
)

echo.
echo [2/4] Running development server...
echo.
echo New features included:
echo ✓ Enhanced animations with parallax effects
echo ✓ Real-time notifications and social proof
echo ✓ Interactive product cards with hover effects  
echo ✓ Floating action buttons
echo ✓ Professional micro-interactions
echo ✓ GPU-accelerated smooth transitions
echo.

echo Starting development server...
echo Open http://localhost:3000 to see the improvements!
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
