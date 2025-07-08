@echo off
echo Switching to simple Next.js config (Turbopack compatible)...

cd /d "d:\DATN\DATN\sun-movement-frontend"

if exist next.config.js.backup (
    echo Backup already exists, skipping...
) else (
    echo Creating backup of current config...
    copy next.config.js next.config.js.backup
)

echo Switching to simple config...
copy next.config.simple.js next.config.js

echo.
echo Config switched! You can now run:
echo   npm run dev          (normal mode)
echo   npm run dev:turbo    (turbo mode)
echo.
echo To restore original config, run: restore-config.bat
echo.
pause
