@echo off
echo =============================================
echo  SUN MOVEMENT - Performance Testing
echo =============================================
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Testing enhanced UX performance...
echo.

echo [1/3] Building optimized version...
npm run build

echo.
echo [2/3] Starting production server...
start "" npm start

echo.
echo [3/3] Performance testing recommendations:
echo.
echo Manual Testing:
echo ✓ Open http://localhost:3000
echo ✓ Test scroll animations
echo ✓ Check hover effects on products
echo ✓ Verify real-time notifications
echo ✓ Test mobile responsiveness
echo ✓ Check page load speed
echo.
echo Automated Testing:
echo ✓ Run Chrome DevTools Lighthouse
echo ✓ Check Core Web Vitals
echo ✓ Test different device sizes
echo ✓ Verify animation performance
echo.

echo Performance Targets:
echo ✓ First Contentful Paint: ^<1.5s
echo ✓ Largest Contentful Paint: ^<2.5s  
echo ✓ Cumulative Layout Shift: ^<0.1
echo ✓ First Input Delay: ^<100ms
echo.

echo Press any key to continue...
pause > nul
