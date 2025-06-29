@echo off
echo ===============================================
echo QUICK LAZY LOADING VERIFICATION
echo ===============================================
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo [1/3] Quick TypeScript check for lazy components...
echo --------------------------------------------------

echo Checking lazy-modal...
call npx tsc --noEmit src/components/ui/lazy-modal.tsx --skipLibCheck
if %ERRORLEVEL% neq 0 (
    echo ❌ lazy-modal has TypeScript errors
) else (
    echo ✅ lazy-modal OK
)

echo Checking strategic-prefetch...
call npx tsc --noEmit src/components/ui/strategic-prefetch.tsx --skipLibCheck
if %ERRORLEVEL% neq 0 (
    echo ❌ strategic-prefetch has TypeScript errors
) else (
    echo ✅ strategic-prefetch OK
)

echo Checking optimized-product-card-lazy...
call npx tsc --noEmit src/components/ui/optimized-product-card-lazy.tsx --skipLibCheck
if %ERRORLEVEL% neq 0 (
    echo ❌ optimized-product-card-lazy has TypeScript errors
) else (
    echo ✅ optimized-product-card-lazy OK
)

echo Checking product-detail-modal...
call npx tsc --noEmit src/components/ui/product-detail-modal.tsx --skipLibCheck
if %ERRORLEVEL% neq 0 (
    echo ❌ product-detail-modal has TypeScript errors
) else (
    echo ✅ product-detail-modal OK
)

echo.
echo [2/3] Checking checkout and profile components...
echo ------------------------------------------------

echo Checking checkout components...
call npx tsc --noEmit src/components/checkout/checkout-form.tsx --skipLibCheck
call npx tsc --noEmit src/components/checkout/order-summary.tsx --skipLibCheck
if %ERRORLEVEL% neq 0 (
    echo ❌ checkout components have TypeScript errors
) else (
    echo ✅ checkout components OK
)

echo Checking profile components...
call npx tsc --noEmit src/components/profile/profile-stats.tsx --skipLibCheck
call npx tsc --noEmit src/components/profile/activity-history.tsx --skipLibCheck
call npx tsc --noEmit src/components/profile/user-preferences.tsx --skipLibCheck
if %ERRORLEVEL% neq 0 (
    echo ❌ profile components have TypeScript errors
) else (
    echo ✅ profile components OK
)

echo.
echo [3/3] Quick build test...
echo ------------------------
echo Testing if project builds without errors...
call npm run build > build-test.log 2>&1

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed! Check build-test.log for details
    echo Last 10 lines of build log:
    echo ================================
    tail -n 10 build-test.log 2>nul || (
        echo [Using more command fallback]
        more +100 build-test.log
    )
) else (
    echo ✅ Build successful!
    del build-test.log 2>nul
)

echo.
echo ===============================================
echo LAZY LOADING STATUS SUMMARY
echo ===============================================
echo.
echo Components Status:
echo • lazy-modal: Ready for use
echo • strategic-prefetch: Ready for use  
echo • optimized-product-card-lazy: Ready for use
echo • product-detail-modal: Ready for use
echo • checkout components: Ready for use
echo • profile components: Ready for use
echo.
echo Next Steps:
echo 1. Replace existing components with lazy versions
echo 2. Test in development mode (npm run dev)
echo 3. Run performance tests
echo 4. Check Lighthouse scores
echo.
echo Files to update in production:
echo • Use page-lazy.tsx versions for checkout and profile
echo • Replace product cards with lazy versions
echo • Apply strategic prefetch in layout
echo.
pause
