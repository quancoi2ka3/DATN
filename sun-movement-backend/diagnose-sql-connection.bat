@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo SQL Server Connection Diagnostic Tool for SunMovement
echo ========================================================
echo.

echo Step 1: Checking SQL Server Services...
echo ----------------------------------------
sc query "MSSQL$SQLEXPRESS" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo SQL Server Express service found.
    sc query "MSSQL$SQLEXPRESS" | find "RUNNING" >nul
    if !ERRORLEVEL! EQU 0 (
        echo [✓] SQL Server Express is RUNNING
    ) else (
        echo [!] SQL Server Express is NOT RUNNING
        echo Attempting to start SQL Server Express...
        net start "MSSQL$SQLEXPRESS" 2>nul
        if !ERRORLEVEL! EQU 0 (
            echo [✓] SQL Server Express started successfully
        ) else (
            echo [✗] Failed to start SQL Server Express
        )
    )
) else (
    echo [!] SQL Server Express service not found
    echo Checking for default SQL Server instance...
    sc query "MSSQLSERVER" 2>nul
    if !ERRORLEVEL! EQU 0 (
        echo [✓] Default SQL Server instance found
    ) else (
        echo [✗] No SQL Server instance found
        echo.
        echo SOLUTION: Install SQL Server Express or SQL Server LocalDB
        echo Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
        goto :end
    )
)

echo.
echo Step 2: Testing SQL Server Connection...
echo ----------------------------------------
sqlcmd -S localhost\SQLEXPRESS -E -Q "SELECT @@VERSION" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Direct SQL Server connection successful
) else (
    echo [!] Direct SQL Server connection failed
    echo Trying alternative connection methods...
    
    sqlcmd -S . -E -Q "SELECT @@VERSION" 2>nul
    if !ERRORLEVEL! EQU 0 (
        echo [✓] Connection to default instance successful
        echo SOLUTION: Update connection string to use "Server=.;" instead of "localhost\SQLEXPRESS"
    ) else (
        sqlcmd -S (localdb)\mssqllocaldb -E -Q "SELECT @@VERSION" 2>nul
        if !ERRORLEVEL! EQU 0 (
            echo [✓] LocalDB connection successful
            echo SOLUTION: Update connection string to use "(localdb)\mssqllocaldb"
        ) else (
            echo [✗] All SQL Server connection attempts failed
        )
    )
)

echo.
echo Step 3: Testing Entity Framework Connection...
echo ----------------------------------------------
cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
echo Current directory: %CD%

echo Testing EF DbContext...
dotnet ef dbcontext info 2>temp_error.txt
if %ERRORLEVEL% EQU 0 (
    echo [✓] Entity Framework connection successful
) else (
    echo [✗] Entity Framework connection failed
    echo Error details:
    type temp_error.txt
    del temp_error.txt 2>nul
)

echo.
echo Step 4: Checking Database Existence...
echo -------------------------------------
dotnet ef migrations list 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Migrations found
    echo Running database update...
    dotnet ef database update
    if !ERRORLEVEL! EQU 0 (
        echo [✓] Database updated successfully
    ) else (
        echo [✗] Database update failed
    )
) else (
    echo [!] No migrations found or EF connection failed
)

echo.
echo Step 5: Testing Application Startup...
echo -------------------------------------
echo Building application...
cd /d "d:\SunMoveMent\DATN\sun-movement-backend"
dotnet build --verbosity quiet 2>build_error.txt
if %ERRORLEVEL% EQU 0 (
    echo [✓] Application built successfully
    del build_error.txt 2>nul
    
    echo Starting application for 10 seconds...
    cd /d "d:\SunMoveMent\DATN\sun-movement-backend\SunMovement.Web"
    start /B dotnet run --no-launch-profile > app_output.txt 2>&1
    
    echo Waiting for application to start...
    timeout /t 5 /nobreak >nul
    
    echo Testing endpoints...
    curl -k -s -o nul -w "Home Page: %%{http_code}\n" http://localhost:5000/ 2>nul || echo "Curl not available, skipping endpoint tests"
    
    echo Stopping application...
    taskkill /F /IM dotnet.exe >nul 2>&1
    
    echo Application output:
    type app_output.txt | findstr /i "error\|exception\|fail" && echo [!] Errors found in application output || echo [✓] No errors in application output
    del app_output.txt 2>nul
    
) else (
    echo [✗] Application build failed
    echo Build errors:
    type build_error.txt
    del build_error.txt 2>nul
)

echo.
echo ========================================================
echo DIAGNOSTIC SUMMARY
echo ========================================================

:end
echo.
echo Diagnostic completed. Check the results above.
echo.
echo COMMON SOLUTIONS:
echo 1. If SQL Server Express not running: Run "net start MSSQL$SQLEXPRESS"
echo 2. If connection string wrong: Update appsettings.json with correct server name
echo 3. If LocalDB works: Change connection string to "(localdb)\mssqllocaldb"
echo 4. If all fails: Consider using SQLite for development
echo.
pause
