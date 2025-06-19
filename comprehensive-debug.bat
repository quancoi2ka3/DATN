@echo off
echo ====================================================
echo  COMPREHENSIVE BACKEND + FRONTEND DEBUG SCRIPT
echo ====================================================
echo.

echo [1] Killing all existing processes...
taskkill /F /IM dotnet.exe 2>nul
taskkill /F /IM node.exe 2>nul

echo [2] Navigating to backend directory...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"

echo [3] Building backend...
dotnet build

echo [4] Starting backend with verbose logging...
start "Backend Server" cmd /k "echo Starting .NET Backend on port 5000... && dotnet run --urls http://localhost:5000"

echo [5] Waiting for backend to fully initialize...
timeout /t 15 /nobreak

echo [6] Testing backend API directly...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/articles/published' -Method Get; Write-Host 'Backend API Test: SUCCESS - Found' $response.Count 'articles' -ForegroundColor Green } catch { Write-Host 'Backend API Test: FAILED -' $_.Exception.Message -ForegroundColor Red }"

echo [7] Starting frontend...
cd /d "d:\DATN\DATN\sun-movement-frontend"
start "Frontend Server" cmd /k "echo Starting Next.js Frontend... && npm run dev"

echo [8] Waiting for frontend to initialize...
timeout /t 10 /nobreak

echo [9] Opening test tools...
start "" "file:///d:/DATN/DATN/simple-api-test.html"
timeout /t 2 /nobreak
start "" "file:///d:/DATN/DATN/article-system-test.html"

echo [10] Opening frontend website...
timeout /t 3 /nobreak
start "" "http://localhost:3000"

echo.
echo ====================================================
echo  DEBUG SCRIPT COMPLETE!
echo ====================================================
echo.
echo Backend API: http://localhost:5000/api/articles/published
echo Frontend: http://localhost:3000
echo Simple Test: file:///d:/DATN/DATN/simple-api-test.html
echo Advanced Test: file:///d:/DATN/DATN/article-system-test.html
echo.
echo Press any key to run additional connectivity tests...
pause > nul

echo [11] Running comprehensive connectivity tests...
echo.
echo Testing port connectivity:
netstat -an | findstr "5000"
echo.
echo Testing API endpoints:
powershell -Command "$tests = @('published', 'featured'); foreach($test in $tests) { try { $response = Invoke-RestMethod -Uri \"http://localhost:5000/api/articles/$test\" -Method Get; Write-Host \"✅ /api/articles/$test - SUCCESS: Found $($response.Count) items\" -ForegroundColor Green } catch { Write-Host \"❌ /api/articles/$test - FAILED: $($_.Exception.Message)\" -ForegroundColor Red } }"

echo.
echo Testing CORS headers:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/articles/published' -Method Get; Write-Host 'CORS Headers:' -ForegroundColor Yellow; $response.Headers | Format-Table } catch { Write-Host 'Failed to get headers' -ForegroundColor Red }"

echo.
echo All tests completed! Check the browser windows for results.
pause
