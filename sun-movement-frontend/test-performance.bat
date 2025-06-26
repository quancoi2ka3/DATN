@echo off
echo 🔍 Kiểm tra Performance Sun Movement Frontend...

echo 📊 Đang chạy Lighthouse audit...
echo Đảm bảo server đang chạy trên http://localhost:3000

:: Kiểm tra nếu có Lighthouse CLI
where lighthouse >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Lighthouse CLI chưa được cài đặt
    echo 📥 Cài đặt: npm install -g lighthouse
    echo 🔗 Hoặc kiểm tra thủ công tại: https://developers.google.com/speed/pagespeed/insights/
    pause
    exit /b 1
)

echo ⚡ Chạy audit Performance...
lighthouse http://localhost:3000 --output=html --output-path=lighthouse-report.html --chrome-flags="--headless"

echo ✅ Báo cáo đã được tạo: lighthouse-report.html
echo 📈 Mở file để xem kết quả chi tiết

:: Mở báo cáo trong browser
start lighthouse-report.html

echo 🎯 Các chỉ số quan trọng cần chú ý:
echo - First Contentful Paint (FCP): < 1.8s
echo - Largest Contentful Paint (LCP): < 2.5s  
echo - Cumulative Layout Shift (CLS): < 0.1
echo - First Input Delay (FID): < 100ms

pause
