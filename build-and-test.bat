@echo off
echo.
echo ===============================================
echo    SUN MOVEMENT - BUILD STATUS CHECK
echo ===============================================
echo.
echo Checking build and type errors...
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"

echo [1/3] Type checking...
npx tsc --noEmit --project . && (
    echo ✅ TypeScript check passed
) || (
    echo ❌ TypeScript errors found
    exit /b 1
)

echo.
echo [2/3] Building project...
npm run build && (
    echo ✅ Build successful
) || (
    echo ❌ Build failed
    exit /b 1
)

echo.
echo [3/3] Starting development server...
echo Press Ctrl+C to stop the server
npm run dev
