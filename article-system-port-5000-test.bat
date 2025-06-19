@echo off
echo ============================================
echo  ARTICLE SYSTEM - PORT 5000 CONNECTIVITY TEST
echo ============================================
echo.

echo [1] Checking backend server status...
echo Backend should be running on http://localhost:5000
echo.

echo [2] Starting Backend Server (HTTP on port 5000)...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
start "Backend Server" cmd /k "echo Starting .NET Backend on HTTP port 5000... && dotnet run"

echo [3] Waiting for backend to initialize...
timeout /t 15 /nobreak > nul

echo [4] Testing API connectivity on port 5000...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/articles/published' -Method Get; Write-Host 'SUCCESS: API working - Found' $response.Count 'published articles' -ForegroundColor Green } catch { Write-Host 'ERROR: API test failed -' $_.Exception.Message -ForegroundColor Red }"

echo.
echo [5] Starting Frontend Server...
cd /d "d:\DATN\DATN\sun-movement-frontend"
start "Frontend Server" cmd /k "echo Starting Next.js Frontend... && npm run dev"

echo [6] Waiting for frontend to initialize...
timeout /t 10 /nobreak > nul

echo [7] Opening test pages...
start "" "http://localhost:3000"
timeout /t 2 /nobreak > nul
start "" "file:///d:/DATN/DATN/article-system-test.html"

echo.
echo ============================================
echo  SYSTEM STATUS CHECK COMPLETE
echo ============================================
echo.
echo Backend API: http://localhost:5000/api/articles/published
echo Frontend: http://localhost:3000
echo Test Tool: file:///d:/DATN/DATN/article-system-test.html
echo.
echo Check the opened browser windows to verify:
echo 1. Frontend loads without fetch errors
echo 2. Article sections show content
echo 3. API test tool shows successful responses
echo.
pause
