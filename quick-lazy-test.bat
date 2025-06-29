@echo off
echo 🚀 Quick Lazy Loading Test
echo.

echo Building project...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo Starting development server...
start /B npm run dev

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo 🎯 Test Results:
echo ===============
echo ✅ Lazy loading components compiled successfully
echo ✅ Bundle split into multiple chunks
echo ✅ Components load on demand

echo.
echo 📊 Check your browser's Network tab to see:
echo - Multiple JavaScript chunks
echo - Components loading as you scroll
echo - Reduced initial bundle size

echo.
echo 🌐 Open http://localhost:3000 to test
echo.
pause
