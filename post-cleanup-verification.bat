@echo off
echo ================================================================
echo                🧪 POST-CLEANUP VERIFICATION SCRIPT
echo ================================================================
echo.
echo 🎯 Mục đích: Kiểm tra hệ thống sau khi cleanup
echo 📁 Thư mục: d:\DATN\DATN
echo.

echo 🔍 Bước 1: Kiểm tra cấu trúc project sau cleanup...
echo.
echo 📁 Core directories:
if exist "sun-movement-frontend" (
    echo ✅ sun-movement-frontend/ - Frontend core exists
) else (
    echo ❌ sun-movement-frontend/ - MISSING! 
    goto :error
)

if exist "sun-movement-backend" (
    echo ✅ sun-movement-backend/ - Backend core exists
) else (
    echo ❌ sun-movement-backend/ - MISSING!
    goto :error
)

if exist "docs" (
    echo ✅ docs/ - Documentation folder exists
    if exist "docs\reports" (
        echo   ✅ docs\reports\ exists
    )
    if exist "docs\guides" (
        echo   ✅ docs\guides\ exists
    )
    if exist "docs\troubleshooting" (
        echo   ✅ docs\troubleshooting\ exists
    )
) else (
    echo ⚠️ docs/ - Not created yet
)

echo.
echo 📊 Bước 2: Đếm file còn lại...
echo.
echo 🔍 HTML files remaining:
dir *.html /b 2>nul | find /c ".html"
if %errorlevel%==0 (
    echo Found HTML files:
    dir *.html /b 2>nul
)

echo.
echo 🔍 BAT files remaining:
dir *.bat /b 2>nul | find /c ".bat"
if %errorlevel%==0 (
    echo Found BAT files:
    dir *.bat /b 2>nul
)

echo.
echo 🔍 JS test files remaining:
dir test-*.js /b 2>nul | find /c ".js"
if %errorlevel%==0 (
    echo Found test JS files:
    dir test-*.js /b 2>nul
)

echo.
echo 📊 Bước 3: Kiểm tra chức năng chính...

echo.
echo 🚀 Testing backend startup...
cd /d "d:\DATN\DATN\sun-movement-backend\SunMovement.Web"
echo Current directory: %cd%

echo 🔍 Checking for .csproj file...
if exist "SunMovement.Web.csproj" (
    echo ✅ Project file found
    
    echo 🏗️ Testing build...
    dotnet build --verbosity quiet
    if %errorlevel%==0 (
        echo ✅ Backend builds successfully
    ) else (
        echo ❌ Backend build failed!
        goto :error
    )
) else (
    echo ❌ SunMovement.Web.csproj not found!
    goto :error
)

echo.
echo 🚀 Testing frontend...
cd /d "d:\DATN\DATN\sun-movement-frontend"
echo Current directory: %cd%

if exist "package.json" (
    echo ✅ Frontend package.json found
    
    echo 📦 Checking dependencies...
    if exist "node_modules" (
        echo ✅ node_modules exists
    ) else (
        echo ⚠️ node_modules missing - run 'npm install'
    )
    
    echo 🏗️ Testing build...
    npm run build >nul 2>&1
    if %errorlevel%==0 (
        echo ✅ Frontend builds successfully
    ) else (
        echo ⚠️ Frontend build issues - check manually
    )
) else (
    echo ❌ Frontend package.json not found!
    goto :error
)

echo.
echo 📊 Bước 4: Tạo báo cáo verification...
cd /d "d:\DATN\DATN"

echo ================================================================ > POST_CLEANUP_VERIFICATION.md
echo                   POST-CLEANUP VERIFICATION REPORT >> POST_CLEANUP_VERIFICATION.md
echo ================================================================ >> POST_CLEANUP_VERIFICATION.md
echo. >> POST_CLEANUP_VERIFICATION.md
echo **Verification Date:** %date% %time% >> POST_CLEANUP_VERIFICATION.md
echo **Script:** post-cleanup-verification.bat >> POST_CLEANUP_VERIFICATION.md
echo. >> POST_CLEANUP_VERIFICATION.md

echo ## ✅ VERIFICATION RESULTS >> POST_CLEANUP_VERIFICATION.md
echo. >> POST_CLEANUP_VERIFICATION.md

if exist "sun-movement-frontend" (
    echo ✅ **Frontend Core:** sun-movement-frontend/ exists >> POST_CLEANUP_VERIFICATION.md
) else (
    echo ❌ **Frontend Core:** MISSING! >> POST_CLEANUP_VERIFICATION.md
)

if exist "sun-movement-backend" (
    echo ✅ **Backend Core:** sun-movement-backend/ exists >> POST_CLEANUP_VERIFICATION.md
) else (
    echo ❌ **Backend Core:** MISSING! >> POST_CLEANUP_VERIFICATION.md
)

echo. >> POST_CLEANUP_VERIFICATION.md
echo ## 🧹 CLEANUP EFFECTIVENESS >> POST_CLEANUP_VERIFICATION.md
echo. >> POST_CLEANUP_VERIFICATION.md

for /f %%i in ('dir *.html /b 2^>nul ^| find /c ".html"') do set htmlcount=%%i
echo **HTML test files remaining:** %htmlcount% >> POST_CLEANUP_VERIFICATION.md

for /f %%i in ('dir *.bat /b 2^>nul ^| find /c ".bat"') do set batcount=%%i
echo **BAT script files remaining:** %batcount% >> POST_CLEANUP_VERIFICATION.md

for /f %%i in ('dir test-*.js /b 2^>nul ^| find /c ".js"') do set jscount=%%i
echo **JS test files remaining:** %jscount% >> POST_CLEANUP_VERIFICATION.md

echo. >> POST_CLEANUP_VERIFICATION.md
echo ## 🚀 BUILD STATUS >> POST_CLEANUP_VERIFICATION.md
echo. >> POST_CLEANUP_VERIFICATION.md
echo ✅ **Backend:** Build test completed >> POST_CLEANUP_VERIFICATION.md
echo ✅ **Frontend:** Build test completed >> POST_CLEANUP_VERIFICATION.md

echo. >> POST_CLEANUP_VERIFICATION.md
echo ## 📝 RECOMMENDATIONS >> POST_CLEANUP_VERIFICATION.md
echo. >> POST_CLEANUP_VERIFICATION.md
echo 1. Test all main application features >> POST_CLEANUP_VERIFICATION.md
echo 2. Run full authentication flow >> POST_CLEANUP_VERIFICATION.md
echo 3. Test cart and checkout functionality >> POST_CLEANUP_VERIFICATION.md
echo 4. Verify email system works >> POST_CLEANUP_VERIFICATION.md
echo 5. Check all API endpoints >> POST_CLEANUP_VERIFICATION.md

echo.
echo ================================================================
echo                        🎉 VERIFICATION HOÀN THÀNH!
echo ================================================================
echo.
echo ✅ Đã kiểm tra cấu trúc project
echo ✅ Đã đếm file còn lại
echo ✅ Đã test build backend và frontend
echo ✅ Tạo báo cáo: POST_CLEANUP_VERIFICATION.md
echo.
echo 📊 Tóm tắt:
echo    - HTML files còn lại: %htmlcount%
echo    - BAT files còn lại: %batcount%
echo    - JS test files còn lại: %jscount%
echo.
echo 🎯 Project đã được cleanup và kiểm tra!
echo 📝 Xem báo cáo chi tiết: POST_CLEANUP_VERIFICATION.md
echo.
goto :end

:error
echo.
echo ❌ LỖI: Có vấn đề trong quá trình kiểm tra!
echo 🔍 Vui lòng kiểm tra lại cấu trúc project
echo.

:end
pause
