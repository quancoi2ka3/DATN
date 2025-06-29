@echo off
echo 🚀 Testing Lazy Loading Performance...
echo.

REM Kiểm tra Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Building optimized version...
call npm run build

echo.
echo 📊 Analyzing bundle size...
call npx @next/bundle-analyzer

echo.
echo 🎯 Running lighthouse performance test...
if exist lighthouse-results.json del lighthouse-results.json

REM Chạy dev server trong background
echo Starting development server...
start /B npm run dev

REM Đợi server khởi động
echo Waiting for server to start...
timeout /t 10 /nobreak > nul

REM Chạy Lighthouse
npx lighthouse http://localhost:3000 --output=json --output=html --output-path=lighthouse-results --chrome-flags="--headless"

echo.
echo 📈 Performance Results:
echo ==================
if exist lighthouse-results.json (
    node -e "
    const fs = require('fs');
    const results = JSON.parse(fs.readFileSync('lighthouse-results.json', 'utf8'));
    const scores = results.lhr.categories;
    
    console.log('Performance Score:', Math.round(scores.performance.score * 100));
    console.log('First Contentful Paint:', results.lhr.audits['first-contentful-paint'].displayValue);
    console.log('Largest Contentful Paint:', results.lhr.audits['largest-contentful-paint'].displayValue);
    console.log('Cumulative Layout Shift:', results.lhr.audits['cumulative-layout-shift'].displayValue);
    console.log('Total Blocking Time:', results.lhr.audits['total-blocking-time'].displayValue);
    "
) else (
    echo ❌ Lighthouse results not found
)

echo.
echo 🎉 Lazy Loading Performance Test Complete!
echo Results saved to lighthouse-results.html
echo.
pause
