@echo off
echo =======================================
echo   SunMovement Database Connection Test
echo =======================================
echo.

set conn_string=Server=localhost\SQLEXPRESS;Database=SunMovementDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True

echo Testing SQL Server connection with:
echo %conn_string%
echo.

echo Step 1: Checking if SQL Server is running...
sc query MSSQL$SQLEXPRESS > nul
if ERRORLEVEL 1 (
    echo ERROR: SQL Server Express service is not running.
    echo.
    echo Please ensure SQL Server Express is installed and running:
    echo 1. Press Win+R, type "services.msc" and press Enter
    echo 2. Find "SQL Server (SQLEXPRESS)" and ensure it's running
    echo 3. If it's not running, right-click and select "Start"
    echo.
    pause
    goto end
) else (
    echo SQL Server Express service is running.
)

echo.
echo Step 2: Testing database connection...
echo.

echo SELECT 'Connection successful' AS Status; > temp_test.sql
sqlcmd -S localhost\SQLEXPRESS -E -i temp_test.sql

if ERRORLEVEL 1 (
    echo.
    echo ERROR: Could not connect to SQL Server.
    echo.
    echo Possible issues:
    echo 1. SQL Server authentication mode might not allow Windows Authentication
    echo 2. The specified instance name "SQLEXPRESS" might be incorrect
    echo 3. SQL Server might be configured to use a non-default port
    echo.
    echo Solutions:
    echo 1. Verify your SQL Server instance name (run: "sqlcmd -L")
    echo 2. Check if SQL Server is configured for Windows Authentication
    echo 3. Try updating your connection string in appsettings.json
    echo.
) else (
    echo.
    echo Connection to SQL Server was successful!
    echo.
    
    echo Step 3: Checking if database exists...
    echo.
    
    echo IF DB_ID('SunMovementDB') IS NULL > check_db.sql
    echo     PRINT 'Database does not exist' >> check_db.sql
    echo ELSE >> check_db.sql
    echo     PRINT 'Database exists' >> check_db.sql
    
    sqlcmd -S localhost\SQLEXPRESS -E -i check_db.sql
    
    echo.
    echo Step 4: Testing Entity Framework...
    echo.
    cd /d d:\SunMoveMent\DATN\sun-movement-backend
    dotnet ef dbcontext info --project SunMovement.Infrastructure --startup-project SunMovement.Web
)

del temp_test.sql >nul 2>&1
del check_db.sql >nul 2>&1

echo.
echo ===========================================
echo   Test Complete - Results Summary Above
echo ===========================================
echo.
echo If you encountered any errors, please check:
echo 1. migration-troubleshooting.md for solutions
echo 2. Your connection string in appsettings.json
echo.
pause

:end
