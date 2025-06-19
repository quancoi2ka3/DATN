@echo off
echo =========================================
echo   KILL ALL PROJECT PROCESSES
echo =========================================
echo.

echo [1] Killing backend processes...
echo Stopping dotnet.exe processes...
taskkill /f /im dotnet.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Dotnet processes terminated
) else (
    echo ℹ️  No dotnet processes running
)

echo.
echo [2] Killing frontend processes...
echo Stopping Node.js processes...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js processes terminated
) else (
    echo ℹ️  No Node.js processes running
)

echo Stopping npm/yarn processes...
taskkill /f /im npm.exe 2>nul
taskkill /f /im yarn.exe 2>nul
taskkill /f /im nextjs.exe 2>nul

echo.
echo [3] Freeing up common development ports...

REM Function to kill process using specific port
echo Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 2^>nul') do (
    echo Killing process %%a using port 3000
    taskkill /f /pid %%a 2>nul
)

echo Checking port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 2^>nul') do (
    echo Killing process %%a using port 5000
    taskkill /f /pid %%a 2>nul
)

echo Checking port 5001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5001 2^>nul') do (
    echo Killing process %%a using port 5001
    taskkill /f /pid %%a 2>nul
)

echo Checking port 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 2^>nul') do (
    echo Killing process %%a using port 3001
    taskkill /f /pid %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo [4] Checking final status...
echo Current active connections on development ports:
netstat -ano | findstr ":3000 :3001 :5000 :5001" 2>nul
if %errorlevel% neq 0 (
    echo ✅ All development ports are now free!
) else (
    echo ⚠️  Some ports may still be in use
)

echo.
echo =========================================
echo   ALL PROCESSES CLEANED UP
echo =========================================
echo You can now safely start backend or frontend
echo.

pause
