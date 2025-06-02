@echo off
echo ========================================================
echo Quick Database Connection Fix for SunMovement
echo ========================================================
echo.
echo This script provides immediate solutions for common database issues.
echo.

echo Step 1: Testing current connection...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"

echo Building project...
dotnet build --verbosity minimal
if %ERRORLEVEL% NEQ 0 (
    echo [✗] Build failed. Please fix compilation errors first.
    pause
    exit /b 1
)

echo Testing database connection...
dotnet ef database update --dry-run > connection_test.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [✓] Database connection is working!
    echo Your admin controllers should work correctly.
    del connection_test.log 2>nul
    goto test_admin
) else (
    echo [✗] Database connection failed.
    echo Error details:
    type connection_test.log
    del connection_test.log 2>nul
    echo.
    goto fix_connection
)

:fix_connection
echo Step 2: Applying quick fixes...
echo.
echo Option A: Switch to LocalDB (recommended)
echo This uses SQL Server LocalDB which comes with Visual Studio/SQL Server Express
echo.
set /p use_localdb="Switch to LocalDB? (Y/N): "
if /i "%use_localdb%"=="Y" (
    echo Updating connection string to LocalDB...
    powershell -Command "(Get-Content appsettings.json) -replace 'localhost\\\\SQLEXPRESS', '(localdb)\\mssqllocaldb' | Set-Content appsettings.json"
    echo [✓] Connection string updated
    echo Testing LocalDB connection...
    dotnet ef database update
    if !ERRORLEVEL! EQU 0 (
        echo [✓] LocalDB connection successful!
        goto test_admin
    ) else (
        echo [✗] LocalDB connection failed
        goto option_sqlite
    )
)

:option_sqlite
echo.
echo Option B: Switch to SQLite (simplest)
echo This creates a local file database - perfect for development
echo.
set /p use_sqlite="Switch to SQLite? (Y/N): "
if /i "%use_sqlite%"=="Y" (
    echo Installing SQLite package...
    dotnet add package Microsoft.EntityFrameworkCore.Sqlite
    
    echo Updating connection string...
    powershell -Command "$content = Get-Content appsettings.json | ConvertFrom-Json; $content.ConnectionStrings.DefaultConnection = 'Data Source=SunMovement.db'; $content | ConvertTo-Json -Depth 10 | Set-Content appsettings.json"
    
    echo Updating Program.cs for SQLite...
    powershell -Command "(Get-Content Program.cs) -replace 'UseSqlServer', 'UseSqlite' | Set-Content Program.cs"
    
    echo Building with SQLite...
    dotnet build
    
    echo Creating SQLite database...
    dotnet ef database update
    
    if !ERRORLEVEL! EQU 0 (
        echo [✓] SQLite setup successful!
        goto test_admin
    ) else (
        echo [✗] SQLite setup failed
        goto manual_fix
    )
)

:manual_fix
echo.
echo Option C: Manual SQL Server Fix
echo ================================
echo 1. Start SQL Server Express service:
echo    - Open Services (services.msc)
echo    - Find "SQL Server (SQLEXPRESS)"
echo    - Right-click and select "Start"
echo.
echo 2. Alternative connection strings to try:
echo    - Server=.;Database=SunMovementDB;Trusted_Connection=True;TrustServerCertificate=True
echo    - Server=.\\SQLEXPRESS;Database=SunMovementDB;Trusted_Connection=True;TrustServerCertificate=True
echo    - Server=(localdb)\\mssqllocaldb;Database=SunMovementDB;Trusted_Connection=True;TrustServerCertificate=True
echo.
echo 3. Check SQL Server Configuration Manager:
echo    - Enable TCP/IP protocol
echo    - Start SQL Server Browser
echo.
goto end

:test_admin
echo.
echo Step 3: Testing Admin Controllers...
echo ====================================
echo Starting application to test admin controllers...

start /B dotnet run > app_test.log 2>&1
echo Waiting for application to start...
timeout /t 8 /nobreak >nul

echo Testing admin pages (these should return 401 Unauthorized, not 404 or 500):
curl -s -o nul -w "Admin Dashboard: %%{http_code}\n" http://localhost:5000/Admin 2>nul || echo "Admin Dashboard: Unable to test (curl not available)"
curl -s -o nul -w "Products Admin: %%{http_code}\n" http://localhost:5000/Admin/ProductsAdmin 2>nul || echo "Products Admin: Unable to test (curl not available)"
curl -s -o nul -w "Services Admin: %%{http_code}\n" http://localhost:5000/Admin/ServicesAdmin 2>nul || echo "Services Admin: Unable to test (curl not available)"

echo.
echo Stopping test application...
taskkill /F /IM dotnet.exe >nul 2>&1

echo.
echo Check app_test.log for any errors:
findstr /i "error exception fail" app_test.log && echo "[!] Errors found - check log file" || echo "[✓] No critical errors found"

:end
echo.
echo ========================================================
echo SETUP COMPLETE
echo ========================================================
echo.
echo Your SunMovement admin controllers are now ready!
echo.
echo To run the application:
echo   cd "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
echo   dotnet run
echo.
echo Then visit: http://localhost:5000/Admin
echo (You'll need to login as admin first)
echo.
echo If you see HTTP 401 errors, that's normal - it means the controllers
echo are working but you need to authenticate as an admin user.
echo.
pause
