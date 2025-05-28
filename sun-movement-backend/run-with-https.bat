@echo off
echo Setting up development certificate for HTTPS...

REM Check if the certificate exists
dotnet dev-certs https --check
if %ERRORLEVEL% NEQ 0 (
    echo Creating and trusting development certificate...
    dotnet dev-certs https --clean
    dotnet dev-certs https --trust
) else (
    echo Development certificate is already set up.
)

echo.
echo Starting the application with HTTPS support...
echo.
cd /d %~dp0
dotnet run --launch-profile https

pause
