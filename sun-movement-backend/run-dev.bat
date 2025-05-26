@echo off
echo ===============================================
echo   Sun Movement Application - Developer Mode
echo ===============================================

echo Setting development environment...
set ASPNETCORE_ENVIRONMENT=Development
echo Environment set to: %ASPNETCORE_ENVIRONMENT%

echo.
echo Cleaning previous builds...
dotnet clean SunMovement.Web/SunMovement.Web.csproj

echo.
echo Restoring packages...
dotnet restore SunMovement.Web/SunMovement.Web.csproj

echo.
echo Building application...
dotnet build SunMovement.Web/SunMovement.Web.csproj

echo.
echo Starting application in Development mode...
cd SunMovement.Web
dotnet run --environment Development

echo.
echo If the application crashed, check the logs above for errors.
pause
