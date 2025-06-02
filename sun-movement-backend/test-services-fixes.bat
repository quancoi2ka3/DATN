@echo off
echo Testing Sun Movement Services Management Fixes...
echo.

cd SunMovement.Web
dotnet build
if %errorlevel% neq 0 (
    echo Build failed. Please check the errors above.
    exit /b %errorlevel%
)

echo.
echo Starting the application...
echo.
echo To test, navigate to:
echo   - http://localhost:5000/admin/servicesadmin (Services List)
echo   - http://localhost:5000/admin/servicesadmin/details/1 (Service Details)
echo   - http://localhost:5000/admin/servicesadmin/edit/1 (Edit Service)
echo   - http://localhost:5000/admin/servicesadmin/delete/1 (Delete Service)
echo   - http://localhost:5000/admin/servicesadmin/schedules/1 (Service Schedules)
echo.
echo Press Ctrl+C to stop the server when done testing.
echo.

dotnet run --urls=http://localhost:5000
