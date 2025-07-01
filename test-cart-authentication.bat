@echo off
echo ===================================
echo Kiem tra xac thuc gio hang va thanh toan
echo ===================================

echo Dang khoi dong he thong...
echo.

cd /d "D:\DATN\DATN\sun-movement-frontend"

echo Kiem tra loi xac thuc gio hang...
echo.

echo 1. Dang khoi dong frontend...
start cmd /c "cd /d D:\DATN\DATN\sun-movement-frontend && npm run dev"

echo 2. Doi frontend khoi dong (10 giay)...
timeout /t 10 /nobreak

echo 3. Mo trinh duyet de kiem tra...
start http://localhost:3000

echo.
echo ===================================
echo HUONG DAN KIEM TRA:
echo ===================================
echo 1. Dang nhap vao he thong
echo 2. Mo DevTools (F12) va chon tab Network
echo 3. Them san pham vao gio hang
echo 4. Kiem tra request den /api/cart co Cookie va credentials
echo 5. Xac nhan response co userId khop voi ID nguoi dung
echo.
echo Xem them chi tiet tai: CART_AUTHENTICATION_TEST_GUIDE.md
echo ===================================

pause
