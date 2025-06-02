@echo off
echo Testing Product Cache Management...
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
echo To test the product cache functionality:
echo   1. Navigate to http://localhost:5000/admin/productsadmin
echo   2. Click the "Clear Cache" button to clear the product cache
echo   3. Test product CRUD operations to verify caching works correctly
echo.
echo Press Ctrl+C to stop the server when done testing.
echo.

dotnet run --urls=http://localhost:5000
