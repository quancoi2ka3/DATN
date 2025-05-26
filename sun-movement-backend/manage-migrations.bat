@echo off
echo =============================================
echo   SunMovement SQL Server Migration Helper
echo =============================================

:menu
echo.
echo Please select an option:
echo 1. Create a new migration
echo 2. Apply all migrations to the database
echo 3. Generate SQL script for all migrations
echo 4. Remove the latest migration
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto create
if "%choice%"=="2" goto update
if "%choice%"=="3" goto script
if "%choice%"=="4" goto remove
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
goto menu

:create
echo.
set /p name="Enter migration name (no spaces): "
echo Creating migration '%name%'...
dotnet ef migrations add %name% --project SunMovement.Infrastructure --startup-project SunMovement.Web
echo.
echo Migration created successfully.
pause
goto menu

:update
echo.
echo Applying migrations to the database...
dotnet ef database update --project SunMovement.Infrastructure --startup-project SunMovement.Web
echo.
echo Database updated successfully.
pause
goto menu

:script
echo.
echo Generating SQL script for all migrations...
dotnet ef migrations script --project SunMovement.Infrastructure --startup-project SunMovement.Web --output migrate.sql
echo.
echo SQL script generated as 'migrate.sql'.
pause
goto menu

:remove
echo.
echo WARNING: This will remove the latest migration. Only do this if it hasn't been applied to the database.
echo.
set /p confirm="Are you sure you want to continue? (Y/N): "
if /i "%confirm%"=="Y" (
    echo Removing latest migration...
    dotnet ef migrations remove --project SunMovement.Infrastructure --startup-project SunMovement.Web
    echo Migration removed.
) else (
    echo Operation cancelled.
)
pause
goto menu

:end
echo.
echo Exiting migration helper...
exit
