@echo off
echo ================================================================
echo              ARTICLE MANAGEMENT SYSTEM TEST
echo ================================================================
echo.

echo [INFO] Checking Article Management System status...
echo.

REM Check if backend is running
echo [1/5] Checking backend server...
curl -s -o nul -w "Backend Status: %%{http_code}\n" https://localhost:7199/api/articles
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Backend might not be running. Starting backend...
    start /B cmd /C "cd /d d:\DATN\DATN\sun-movement-backend\SunMovement.Web && dotnet run"
    echo [INFO] Waiting for backend to start...
    timeout /t 10 /nobreak >nul
)

echo.
echo [2/5] Testing Articles API endpoints...
echo.

REM Test API endpoints
echo Testing GET /api/articles...
curl -s -X GET https://localhost:7199/api/articles | find "title" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Articles API is working
) else (
    echo ❌ Articles API failed
)

echo Testing GET /api/articles/published...
curl -s -X GET https://localhost:7199/api/articles/published | find "title" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Published Articles API is working
) else (
    echo ❌ Published Articles API failed
)

echo Testing GET /api/articles/featured...
curl -s -X GET https://localhost:7199/api/articles/featured | find "title" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Featured Articles API is working
) else (
    echo ❌ Featured Articles API failed
)

echo.
echo [3/5] Testing search functionality...
curl -s -X GET "https://localhost:7199/api/articles/search?q=yoga" | find "title" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Search API is working
) else (
    echo ❌ Search API failed
)

echo.
echo [4/5] Testing admin interface...
curl -s -o nul -w "Admin Status: %%{http_code}\n" https://localhost:7199/admin/articlesadmin
if %ERRORLEVEL% EQU 0 (
    echo ✅ Admin interface is accessible
) else (
    echo ❌ Admin interface failed
)

echo.
echo [5/5] Opening test interface...
start "" "d:\DATN\DATN\test-article-api.html"

echo.
echo ================================================================
echo                     TEST COMPLETED
echo ================================================================
echo.
echo What to do next:
echo 1. Check the test interface that just opened
echo 2. Test all API endpoints manually
echo 3. Access admin interface at: https://localhost:7199/admin/articlesadmin
echo 4. Verify CRUD operations work properly
echo.
echo Press any key to exit...
pause >nul
