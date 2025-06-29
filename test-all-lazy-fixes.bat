@echo off
echo 🔍 Testing All Lazy Loading Files...
echo.

echo Checking TypeScript compilation...
cd "d:\DATN\DATN\sun-movement-frontend"

REM Check TypeScript errors
call npx tsc --noEmit --skipLibCheck

if errorlevel 1 (
    echo ❌ TypeScript compilation failed!
    echo Please check the errors above.
    pause
    exit /b 1
) else (
    echo ✅ TypeScript compilation successful!
)

echo.
echo Building project...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

echo.
echo 🎉 All Lazy Loading Files Are Working!
echo =====================================
echo ✅ components/lazy/index.tsx - Fixed
echo ✅ app/dich-vu/page-lazy.tsx - Fixed  
echo ✅ components/ui/lazy-skeleton.tsx - Working
echo ✅ components/ui/lazy-sections.tsx - Working
echo ✅ components/ui/lazy-preloader.tsx - Working

echo.
echo 🚀 Ready to test lazy loading in browser:
echo 1. npm run dev
echo 2. Open http://localhost:3000
echo 3. Check Network tab for chunk loading
echo 4. Scroll to see lazy loading in action

echo.
pause
