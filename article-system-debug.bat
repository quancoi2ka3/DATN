@echo off
echo ============================================
echo  SUN MOVEMENT - ARTICLE SYSTEM DEBUG TOOL
echo ============================================
echo.

echo [1] Starting Backend Server...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
start "Backend Server" cmd /k "echo Starting .NET Backend... && dotnet run"

echo [2] Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo [3] Starting Frontend Server...
cd /d "d:\DATN\DATN\sun-movement-frontend"
start "Frontend Server" cmd /k "echo Starting Next.js Frontend... && npm run dev"

echo [4] Waiting for frontend to initialize...
timeout /t 8 /nobreak > nul

echo [5] Opening Test Tools...
start "" "file:///d:/DATN/DATN/article-system-test.html"

echo [6] Opening Frontend Website...
timeout /t 3 /nobreak > nul
start "" "http://localhost:3000"

echo.
echo ============================================
echo  ARTICLE SYSTEM TEST COMPLETE!
echo ============================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo API Test: file:///d:/DATN/DATN/article-system-test.html
echo.
echo Press any key to check API connectivity...
pause > nul

echo [7] Testing API Connection...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/articles/published' -Method Get; Write-Host 'SUCCESS: Found' $response.Count 'published articles' -ForegroundColor Green } catch { Write-Host 'ERROR: Failed to connect to API' -ForegroundColor Red; Write-Host $_.Exception.Message -ForegroundColor Yellow }"

echo.
echo Testing complete! Check the opened browser windows.
pause
