@echo off
echo.
echo ===============================================
echo    SUN MOVEMENT - CONTACT FORM TEST
echo ===============================================
echo.
echo This script will start the frontend server for testing.
echo.
echo Steps to test contact form:
echo 1. Wait for server to start
echo 2. Open browser to: http://localhost:3000
echo 3. Navigate to any policy page or /lien-he
echo 4. Fill out and submit contact form
echo 5. Check console logs for email data
echo.
echo ===============================================
echo Starting Next.js Development Server...
echo ===============================================
echo.

cd /d "d:\DATN\DATN\sun-movement-frontend"
npm run dev
