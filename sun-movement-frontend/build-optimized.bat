@echo off
echo 🚀 Bắt đầu build tối ưu hóa Sun Movement Frontend...

echo 📦 Cài đặt dependencies...
npm install

echo 🧹 Dọn dẹp build cũ...
npm run clean 2>nul || echo "Không có build cũ để dọn dẹp"

echo 🔍 Kiểm tra linting...
npm run lint

echo 🏗️ Build production với tối ưu hóa...
set NODE_ENV=production
npm run build

echo ✅ Build hoàn tất!
echo 🌐 Để chạy production server: npm start
echo 🔧 Để chạy development: npm run dev

pause
