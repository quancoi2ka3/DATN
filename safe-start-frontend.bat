@echo off
echo =========================================
echo   SAFE START FRONTEND - SUN MOVEMENT  
echo =========================================
echo.

echo [1] Killing existing Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js processes killed successfully
) else (
    echo ℹ️  No Node.js processes found running
)

taskkill /f /im nextjs.exe 2>nul
taskkill /f /im npm.exe 2>nul
taskkill /f /im yarn.exe 2>nul

timeout /t 2 /nobreak >nul

echo.
echo [2] Checking for processes using frontend ports...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is still in use, attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a 2>nul
)

netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3001 is still in use, attempting to free it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo [3] Starting frontend development server...

REM Check if package.json exists in current directory
if exist "package.json" (
    echo Found package.json in current directory
    npm run dev
) else if exist "sun-movement-frontend\package.json" (
    echo Found frontend in sun-movement-frontend directory
    cd sun-movement-frontend
    npm run dev
) else if exist "frontend\package.json" (
    echo Found frontend in frontend directory  
    cd frontend
    npm run dev
) else (
    echo ❌ No frontend package.json found!
    echo Please navigate to the frontend directory manually.
    pause
    exit /b 1
)

pause
