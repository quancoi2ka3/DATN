@echo off
echo ========================================
echo TEST TAT CA CAC THAY DOI DA THUC HIEN
echo ========================================
echo.

echo [1/4] Kiem tra backend...
cd sun-movement-backend\SunMovement.Web
echo Dang chay backend...
start /B dotnet run --urls "http://localhost:5000"
timeout /t 10 /nobreak >nul

echo.
echo [2/4] Kiem tra frontend...
cd ..\..\sun-movement-frontend
echo Dang chay frontend...
start /B npm run dev
timeout /t 10 /nobreak >nul

echo.
echo [3/4] Mo trinh duyet de test...
echo Dang mo cac trang test...

echo.
echo ========================================
echo CAC TRANG CAN TEST:
echo ========================================
echo.
echo [BACKEND ADMIN - http://localhost:5000/admin]
echo - Dashboard: http://localhost:5000/admin
echo - Quan ly don hang: http://localhost:5000/admin/ordersadmin
echo - Nhap kho: http://localhost:5000/admin/inventoryadmin/stockin
echo - Phan tich du lieu: http://localhost:5000/admin/analyticsadmin
echo - Quan ly dich vu: http://localhost:5000/admin/servicesadmin
echo - Quan ly bai viet: http://localhost:5000/admin/articlesadmin
echo - Cai dat he thong: http://localhost:5000/admin/settingsadmin
echo.
echo [FRONTEND - http://localhost:3000]
echo - Trang chu: http://localhost:3000
echo - Cua hang: http://localhost:3000/store/supplements
echo - Gio hang: http://localhost:3000/cart
echo.
echo ========================================
echo CAC VAN DE DA DUOC SUA:
echo ========================================
echo.
echo [1] Nhap kho cho san pham da ton tai:
echo - Form se hien thi thong tin san pham khi chon
echo - Tu dong dien cac truong thong tin can thiet
echo.
echo [2] Quan ly don hang - thong tin khach hang:
echo - Hien thi dung ten khach hang thay vi "Guest"
echo - Phan biet khach hang da dang ky va chua dang ky
echo - Hien thi email va so dien thoai ro rang
echo.
echo [3] Giao dien phan tich du lieu Mixpanel:
echo - Tich hop du lieu thuc tu Mixpanel
echo - Hien thi thong bao khi chua co du lieu
echo - Fallback data khi Mixpanel khong kha dung
echo.
echo [4] Sidebar admin - khoi phuc cac muc quan ly:
echo - Quan ly dich vu (ServicesAdmin)
echo - Quan ly bai viet (ArticlesAdmin)
echo - Quan ly su kien (EventsAdmin)
echo - Cai dat he thong (SettingsAdmin)
echo - Nha cung cap (SuppliersAdmin)
echo.
echo ========================================
echo HUONG DAN TEST:
echo ========================================
echo.
echo 1. Test nhap kho:
echo    - Vao http://localhost:5000/admin/inventoryadmin/stockin
echo    - Chon san pham da ton tai trong dropdown
echo    - Kiem tra thong tin san pham hien thi
echo.
echo 2. Test quan ly don hang:
echo    - Vao http://localhost:5000/admin/ordersadmin
echo    - Kiem tra cot "Khach hang" hien thi dung
echo.
echo 3. Test phan tich du lieu:
echo    - Vao http://localhost:5000/admin/analyticsadmin
echo    - Kiem tra cac so lieu hien thi
echo.
echo 4. Test sidebar:
echo    - Vao http://localhost:5000/admin
echo    - Kiem tra cac muc quan ly moi
echo.
echo ========================================
echo LENH HUY:
echo ========================================
echo.
echo De dung cac service:
echo - Backend: Ctrl+C trong terminal backend
echo - Frontend: Ctrl+C trong terminal frontend
echo.
echo Hoac chay: taskkill /f /im dotnet.exe
echo Hoac chay: taskkill /f /im node.exe
echo.
pause 