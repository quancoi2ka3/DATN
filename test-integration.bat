@echo off
REM Test Mixpanel integration script for Windows

echo 🧪 Testing Mixpanel Integration...

REM Check if frontend is running
echo 📱 Checking frontend...
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on port 3000
) else (
    echo ❌ Frontend is not running on port 3000
)

REM Check if backend is running
echo 🔧 Checking backend...
curl -s http://localhost:5000 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on port 5000
) else (
    echo ❌ Backend is not running on port 5000
)

REM Test admin dashboard
echo 🎯 Testing admin dashboard...
curl -s -o nul -w "%%{http_code}" http://localhost:5000/admin > temp_response.txt
set /p response_code=<temp_response.txt
del temp_response.txt
if "%response_code%"=="200" (
    echo ✅ Admin dashboard accessible
) else (
    echo ❌ Admin dashboard not accessible ^(code: %response_code%^)
)

REM Test Mixpanel API directly
echo 🌐 Testing Mixpanel API...
curl -s -X POST "https://api.mixpanel.com/track" -H "Content-Type: application/json" -d "{\"event\": \"Test Connection\", \"properties\": {\"token\": \"6a87b4d11fab9c9b8ece4b3d31978893\", \"test\": true, \"source\": \"batch_test\", \"time\": %time:~0,2%%time:~3,2%%time:~6,2%}}"

if %errorlevel% equ 0 (
    echo ✅ Mixpanel API reachable
) else (
    echo ❌ Mixpanel API not reachable
)

echo 🏁 Test completed!
pause
