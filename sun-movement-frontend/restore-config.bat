@echo off
echo Restoring original Next.js config...

cd /d "d:\DATN\DATN\sun-movement-frontend"

if exist next.config.js.backup (
    echo Restoring from backup...
    copy next.config.js.backup next.config.js
    echo Config restored!
) else (
    echo No backup found. Cannot restore.
)

echo.
pause
