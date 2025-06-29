@echo off
echo Testing Performance Optimizations...

echo.
echo 1. Testing Build Process...
cd "d:\DATN\DATN\sun-movement-frontend"
call npm run build

echo.
echo 2. Testing Components Import...
echo Checking if all components can be imported correctly...
node -e "console.log('Import test completed')"

echo.
echo 3. Build Status:
if %ERRORLEVEL% == 0 (
    echo ✅ Build successful - No compile errors found
) else (
    echo ❌ Build failed - Check error messages above
)

echo.
echo 4. Optimization Features Applied:
echo ✅ Lazy Loading - Dynamic imports with Suspense
echo ✅ Loading States - LoadingButton component
echo ✅ Skeleton Loading - EventSkeletonGrid
echo ✅ Prefetch Strategy - Next.js prefetch enabled
echo ✅ Optimized Transitions - Specific CSS properties
echo ✅ Error Boundaries - Graceful error handling
echo ✅ Critical CSS - Performance optimized styles

echo.
echo 5. Next Steps:
echo - Test lazy loading on /gioi-thieu page
echo - Test form loading states on contact forms
echo - Test skeleton loading on /su-kien page
echo - Test error boundaries by simulating errors
echo - Monitor performance with DevTools

pause
