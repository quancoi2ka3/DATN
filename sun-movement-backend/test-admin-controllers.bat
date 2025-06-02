@echo off
echo Testing SQL Server Connection for SunMovement Application
echo ========================================================
echo.

echo 1. Testing database connection...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
dotnet ef dbcontext info

echo.
echo 2. Checking migration status...
dotnet ef migrations list

echo.
echo 3. Updating database...
dotnet ef database update

echo.
echo 4. Building application...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend"
dotnet build --verbosity minimal

echo.
echo 5. Testing application startup (5 seconds)...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
start /B dotnet run --no-launch-profile > nul 2>&1
timeout /t 5 /nobreak > nul

echo.
echo 6. Testing admin URLs...
curl -k -s -o nul -w "Admin Dashboard: %%{http_code}\n" https://localhost:5001/Admin
curl -k -s -o nul -w "Admin Products: %%{http_code}\n" https://localhost:5001/Admin/ProductsAdmin
curl -k -s -o nul -w "Admin Services: %%{http_code}\n" https://localhost:5001/Admin/ServicesAdmin
curl -k -s -o nul -w "Admin Events: %%{http_code}\n" https://localhost:5001/Admin/EventsAdmin
curl -k -s -o nul -w "Admin FAQs: %%{http_code}\n" https://localhost:5001/Admin/FAQsAdmin
curl -k -s -o nul -w "Admin Orders: %%{http_code}\n" https://localhost:5001/Admin/OrdersAdmin

echo.
echo 7. Stopping application...
taskkill /F /IM dotnet.exe > nul 2>&1

echo.
echo Database connection test completed!
echo If you see HTTP status codes above, the controllers are accessible.
echo 401 = Unauthorized (normal, need login)
echo 404 = Not Found (controller issue)
echo 500 = Server Error (database/code issue)
pause
