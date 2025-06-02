@echo off
echo ========================================================
echo SunMovement Database Connection Solutions
echo ========================================================
echo.

echo This script will help you fix SQL Server connection issues
echo by trying different database options in order of preference:
echo 1. SQL Server Express (original)
echo 2. LocalDB (easier setup)
echo 3. SQLite (simplest for development)
echo.

:menu
echo Choose an option:
echo 1. Test current SQL Server Express connection
echo 2. Switch to LocalDB
echo 3. Switch to SQLite (recommended for development)
echo 4. Install SQLite package and configure
echo 5. Run application with current settings
echo 6. Reset to original SQL Server Express
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto test_sqlserver
if "%choice%"=="2" goto use_localdb
if "%choice%"=="3" goto use_sqlite
if "%choice%"=="4" goto install_sqlite
if "%choice%"=="5" goto run_app
if "%choice%"=="6" goto reset_sqlserver
if "%choice%"=="7" goto end
echo Invalid choice. Please try again.
goto menu

:test_sqlserver
echo.
echo Testing SQL Server Express connection...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
dotnet ef dbcontext info
if %ERRORLEVEL% EQU 0 (
    echo [✓] SQL Server Express connection successful!
    echo Your current setup is working correctly.
) else (
    echo [✗] SQL Server Express connection failed.
    echo Consider switching to LocalDB or SQLite.
)
echo.
pause
goto menu

:use_localdb
echo.
echo Switching to LocalDB...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
copy /Y appsettings.LocalDB.json appsettings.json
echo [✓] Connection string updated to use LocalDB
echo Testing LocalDB connection...
dotnet ef dbcontext info
if %ERRORLEVEL% EQU 0 (
    echo [✓] LocalDB connection successful!
    echo Updating database...
    dotnet ef database update
    echo [✓] Database ready. You can now run the application.
) else (
    echo [✗] LocalDB connection failed.
    echo LocalDB might not be installed. Consider using SQLite instead.
)
echo.
pause
goto menu

:use_sqlite
echo.
echo Switching to SQLite...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
copy /Y appsettings.SQLite.json appsettings.json
echo [✓] Connection string updated to use SQLite
echo Note: You need to install SQLite package and update Program.cs
echo Run option 4 to install SQLite package automatically.
echo.
pause
goto menu

:install_sqlite
echo.
echo Installing SQLite package...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
echo [✓] SQLite package installed

echo.
echo Updating Program.cs to use SQLite...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"

echo Creating backup of Program.cs...
copy Program.cs Program.cs.backup

echo.
echo [!] Manual step required:
echo Please update the DbContext registration in Program.cs
echo.
echo FIND this line:
echo     builder.Services.AddDbContext^<ApplicationDbContext^>(options =^>
echo         options.UseSqlServer(connectionString));
echo.
echo REPLACE with:
echo     builder.Services.AddDbContext^<ApplicationDbContext^>(options =^>
echo         options.UseSqlite(connectionString));
echo.
echo After making this change, run option 5 to test the application.
echo.
pause
goto menu

:run_app
echo.
echo Building and running the application...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend"
dotnet build
if %ERRORLEVEL% EQU 0 (
    echo [✓] Build successful
    cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
    echo Starting application...
    echo Press Ctrl+C to stop the application when testing is complete.
    dotnet run
) else (
    echo [✗] Build failed. Check the error messages above.
)
echo.
pause
goto menu

:reset_sqlserver
echo.
echo Resetting to original SQL Server Express configuration...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"

echo Creating backup of current appsettings.json...
copy appsettings.json appsettings.current.json

echo Restoring original SQL Server connection string...
(
echo {
echo   "ConnectionStrings": {
echo     "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
echo   },
echo   "Logging": {
echo     "LogLevel": {
echo       "Default": "Information",
echo       "Microsoft.AspNetCore": "Warning"
echo     }
echo   },
echo   "AllowedHosts": "*",
echo   "Kestrel": {
echo     "Endpoints": {
echo       "Http": {
echo         "Url": "http://localhost:5000"
echo       },
echo       "Https": {
echo         "Url": "https://localhost:5001"
echo       }
echo     }
echo   },
echo   "HttpServer": {
echo     "Endpoints": {
echo       "Http": {
echo         "Host": "localhost",
echo         "Port": 5000,
echo         "Scheme": "http"
echo       },
echo       "Https": {
echo         "Host": "localhost",
echo         "Port": 5001,
echo         "Scheme": "https"
echo       }
echo     }
echo   },
echo   "Jwt": {
echo     "Key": "ThisIsMySecretKeyForSunMovementApp2025",
echo     "Issuer": "SunMovement.Web",
echo     "Audience": "SunMovement.Client",
echo     "DurationInMinutes": 60
echo   },
echo   "Email": {
echo     "Sender": "noreply@sunmovement.com",
echo     "SmtpServer": "smtp.example.com",
echo     "SmtpPort": 587,
echo     "Username": "your-username",
echo     "Password": "your-password"
echo   }
echo }
) > appsettings.json

echo [✓] SQL Server Express configuration restored
echo.
pause
goto menu

:end
echo.
echo Database configuration utility completed.
echo.
echo SUMMARY:
echo - Original config: SQL Server Express (localhost\SQLEXPRESS)
echo - Alternative 1: LocalDB ((localdb)\mssqllocaldb)
echo - Alternative 2: SQLite (simplest for development)
echo.
echo If you're still having issues, consider:
echo 1. Installing SQL Server Express from Microsoft
echo 2. Using SQLite for development (recommended)
echo 3. Checking Windows Services for SQL Server
echo.
pause
