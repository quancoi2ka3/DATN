@echo off
echo =======================================
echo   Testing SQL Server Connection
echo =======================================
echo.

REM Check if sqlcmd is available
where sqlcmd >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: sqlcmd utility not found.
    echo Please install SQL Server Command Line Tools.
    exit /b 1
)

REM Create a temporary SQL script to test connection
echo SELECT 'Connection successful!' AS Result, DB_NAME() AS [Database]; > test_connection.sql

REM Test the LocalDB connection as defined in appsettings.json
echo Testing connection to (localdb)\mssqllocaldb...
sqlcmd -S "(localdb)\mssqllocaldb" -d "SunMovementDB" -E -i test_connection.sql

REM Capture the error level from the sqlcmd command
set LOCALDB_RESULT=%ERRORLEVEL%

echo.
echo Testing connection to localhost\SQLEXPRESS...
sqlcmd -S "localhost\SQLEXPRESS" -d "SunMovementDB" -E -i test_connection.sql

REM Capture the error level from the sqlcmd command
set SQLEXPRESS_RESULT=%ERRORLEVEL%

echo.
echo Testing connection to localhost...
sqlcmd -S "localhost" -d "SunMovementDB" -E -i test_connection.sql

REM Clean up temp file
del test_connection.sql

echo.
echo =======================================
echo   Connection Test Results
echo =======================================

if %LOCALDB_RESULT% EQU 0 (
    echo LocalDB: Connection SUCCESSFUL
) else (
    echo LocalDB: Connection FAILED
)

if %SQLEXPRESS_RESULT% EQU 0 (
    echo SQLEXPRESS: Connection SUCCESSFUL
) else (
    echo SQLEXPRESS: Connection FAILED
)

pause
