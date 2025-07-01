@echo off
echo Starting Sun Movement Frontend with Enhanced Features...
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo Installing any missing dependencies...
call npm install

echo.
echo Starting development server...
echo.
echo === Enhanced Features Implemented ===
echo - Enhanced Cart Context with caching, optimistic updates, retry logic
echo - Performance monitoring and metrics
echo - Testing dashboard for manual testing
echo - Enhanced checkout service with validation and recovery
echo - Order tracking service with real-time updates
echo.
echo === Available Testing Tools ===
echo - Cart Performance Monitor (bottom-right corner)
echo - Testing Dashboard (top-left corner)
echo - Browser Console for detailed logs
echo.
echo === Testing Instructions ===
echo 1. Open browser and navigate to http://localhost:3000
echo 2. Open browser developer tools (F12)
echo 3. Use Testing Dashboard to run automated tests
echo 4. Monitor performance metrics in real-time
echo 5. Test cart operations, checkout flow, and order tracking
echo.
echo Starting server...
call npm run dev
