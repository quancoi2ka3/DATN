@echo off
echo Running SQL script to reset services database...

REM Get connection string from appsettings.json
for /f "tokens=*" %%i in ('findstr /C:"DefaultConnection" appsettings.Development.json') do (
    set connstring=%%i
)

REM Extract connection string value
set connstring=%connstring:*:=%
set connstring=%connstring:"=%
set connstring=%connstring:,=%
set connstring=%connstring: =%

echo Using connection: %connstring%

REM Run SQL script using sqlcmd
sqlcmd -S "(localdb)\MSSQLLocalDB" -d "SunMovementDb" -i reset-services.sql

echo Services reset completed.
pause