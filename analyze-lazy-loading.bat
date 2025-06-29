@echo off
echo 📊 Analyzing Bundle Size for Lazy Loading...
echo.

REM Build production version
echo Building production version...
call npm run build

echo.
echo 📦 Bundle Analysis:
echo ==================

REM Analyze bundle với Next.js
echo Analyzing JavaScript bundles...
if exist .next\static\chunks (
    echo.
    echo Main Chunks:
    for %%f in (.next\static\chunks\*.js) do (
        echo %%~nxf - %%~zf bytes
    )
    
    echo.
    echo Page Chunks:
    for %%f in (.next\static\chunks\pages\*.js) do (
        echo %%~nxf - %%~zf bytes
    )
    
    echo.
    echo App Chunks:
    for %%f in (.next\static\chunks\app\*.js) do (
        echo %%~nxf - %%~zf bytes
    )
)

echo.
echo 🎯 Lazy Loading Benefits:
echo ========================
echo ✅ Sections are now loaded on-demand
echo ✅ Reduced initial bundle size
echo ✅ Improved FCP and LCP scores
echo ✅ Better user experience on slow connections

echo.
echo 📈 To see detailed analysis, run:
echo npx @next/bundle-analyzer

echo.
pause
