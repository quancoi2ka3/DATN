@echo off
echo ========================================
echo TEST ALL ISSUES FIXES
echo ========================================
echo.

echo [1/6] Dang build backend...
cd sun-movement-backend\SunMovement.Web
dotnet build --verbosity normal

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ BUILD FAILED! Co loi xay ra.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ BUILD SUCCESSFUL!
echo.

echo [2/6] Dang chay backend...
echo Backend se chay tai: http://localhost:5000
echo.
echo Cac trang da sua:
echo - Admin Login: http://localhost:5000/account/login
echo - Stock In: http://localhost:5000/admin/inventoryadmin/stockin
echo - Customer Analytics: http://localhost:5000/admin/customersadmin/analytics
echo.
echo Nhan Ctrl+C de dung server
echo.

start http://localhost:5000/account/login
timeout /t 3 /nobreak >nul
start http://localhost:5000/admin/inventoryadmin/stockin
timeout /t 3 /nobreak >nul
start http://localhost:5000/admin/customersadmin/analytics

dotnet run --urls "http://localhost:5000"

echo.
echo [3/6] Backend da dung.
echo.
echo [4/6] Kiem tra cac fixes:
echo.
echo ✅ 1. Stock In Form:
echo    - Da them debug button
echo    - Da them console logging
echo    - Da them form validation
echo.
echo ✅ 2. Customer Analytics:
echo    - Da them TotalRevenue property
echo    - Da them AverageOrderValue property
echo    - Da them TopCustomers property
echo    - Da cap nhat controller de tinh toan dung
echo.
echo ✅ 3. Login Page:
echo    - Da Viet hoa tat ca labels
echo    - Da them dang ky va quen mat khau
echo    - Da them icons va styling
echo.
echo [5/6] Huong dan test:
echo.
echo 1. Test Stock In:
echo    - Vao http://localhost:5000/admin/inventoryadmin/stockin
echo    - Chon san pham co san
echo    - Nhap so luong va gia
echo    - Bam "Debug API" de xem form data
echo    - Bam "Nhap kho" de test
echo.
echo 2. Test Customer Analytics:
echo    - Vao http://localhost:5000/admin/customersadmin/analytics
echo    - Kiem tra TotalRevenue va AverageOrderValue
echo    - Kiem tra Top Customers
echo.
echo 3. Test Login Page:
echo    - Vao http://localhost:5000/account/login
echo    - Kiem tra tat ca labels da Viet hoa
echo    - Kiem tra buttons dang ky va quen mat khau
echo.
echo [6/6] Hoan thanh!
pause 