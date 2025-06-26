@echo off
echo ================================================================
echo            🔍 FRONTEND STRUCTURE ANALYSIS & OPTIMIZATION
echo ================================================================
echo.
echo 🎯 Mục đích: Phân tích và tối ưu cấu trúc frontend
echo 📁 Thư mục: d:\DATN\DATN\sun-movement-frontend
echo.

echo 🔍 Bước 1: Kiểm tra cấu trúc frontend...
cd /d "d:\DATN\DATN\sun-movement-frontend"

echo.
echo 📊 Phân tích src/ directory:
if exist "src" (
    echo ✅ src/ directory exists
    dir src /b /ad
    echo.
    
    echo 📁 Components analysis:
    if exist "src\components" (
        echo ✅ src\components\ exists
        dir src\components /b /s | find /c ".tsx" > nul
        if %errorlevel%==0 (
            echo 📊 TypeScript React components found
        )
        dir src\components /b /s | find /c ".jsx" > nul
        if %errorlevel%==0 (
            echo 📊 JavaScript React components found
        )
    ) else (
        echo ❌ src\components\ missing
    )
    
    echo.
    echo 📁 Pages/App analysis:
    if exist "src\app" (
        echo ✅ src\app\ exists (Next.js App Router)
        dir src\app /b /ad
    ) else if exist "src\pages" (
        echo ✅ src\pages\ exists (Next.js Pages Router)
        dir src\pages /b /ad
    ) else (
        echo ❌ No pages/app directory found
    )
    
    echo.
    echo 📁 Services analysis:
    if exist "src\services" (
        echo ✅ src\services\ exists
        dir src\services /b
    ) else (
        echo ⚠️ src\services\ missing - consider creating for API calls
    )
    
    echo.
    echo 📁 Utils/Lib analysis:
    if exist "src\lib" (
        echo ✅ src\lib\ exists
        dir src\lib /b
    ) else if exist "src\utils" (
        echo ✅ src\utils\ exists
        dir src\utils /b
    ) else (
        echo ⚠️ No utils/lib directory found
    )
    
) else (
    echo ❌ src/ directory not found!
)

echo.
echo 📊 Bước 2: Kiểm tra dependencies...
if exist "package.json" (
    echo ✅ package.json exists
    echo.
    echo 📦 Main dependencies:
    type package.json | findstr "next\|react\|typescript"
    echo.
    echo 🎨 UI dependencies:
    type package.json | findstr "tailwind\|radix\|lucide"
) else (
    echo ❌ package.json not found!
)

echo.
echo 📊 Bước 3: Kiểm tra configuration files...
if exist "next.config.js" (
    echo ✅ next.config.js exists
) else (
    echo ⚠️ next.config.js missing
)

if exist "tailwind.config.ts" (
    echo ✅ tailwind.config.ts exists
) else if exist "tailwind.config.js" (
    echo ✅ tailwind.config.js exists
) else (
    echo ⚠️ tailwind config missing
)

if exist "tsconfig.json" (
    echo ✅ tsconfig.json exists
) else (
    echo ⚠️ tsconfig.json missing
)

if exist ".env.local" (
    echo ✅ .env.local exists
) else (
    echo ⚠️ .env.local missing - needed for API URLs
)

echo.
echo 📊 Bước 4: Kiểm tra public assets...
if exist "public" (
    echo ✅ public/ directory exists
    dir public /b
) else (
    echo ⚠️ public/ directory missing
)

echo.
echo 📊 Bước 5: Tìm kiếm file thừa trong frontend...
echo 🔍 Searching for test files in frontend:
dir /b /s "test-*.*" 2>nul
if %errorlevel%==0 (
    echo ⚠️ Test files found in frontend - consider removing
) else (
    echo ✅ No test files found
)

echo.
echo 🔍 Searching for backup files:
dir /b /s "*.bak" 2>nul
dir /b /s "*.old" 2>nul
dir /b /s "*~" 2>nul
if %errorlevel%==0 (
    echo ⚠️ Backup files found - consider cleaning
) else (
    echo ✅ No backup files found
)

echo.
echo 📊 Bước 6: Tạo báo cáo cấu trúc frontend...
echo ================================================================ > FRONTEND_STRUCTURE_REPORT.md
echo                    FRONTEND STRUCTURE ANALYSIS >> FRONTEND_STRUCTURE_REPORT.md
echo ================================================================ >> FRONTEND_STRUCTURE_REPORT.md
echo. >> FRONTEND_STRUCTURE_REPORT.md
echo **Analysis Date:** %date% %time% >> FRONTEND_STRUCTURE_REPORT.md
echo **Frontend Path:** d:\DATN\DATN\sun-movement-frontend >> FRONTEND_STRUCTURE_REPORT.md
echo. >> FRONTEND_STRUCTURE_REPORT.md

echo ## 📁 DIRECTORY STRUCTURE >> FRONTEND_STRUCTURE_REPORT.md
echo. >> FRONTEND_STRUCTURE_REPORT.md
if exist "src" (
    echo ✅ **src/** - Source code directory >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **src/** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

if exist "src\components" (
    echo ✅ **src/components/** - React components >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **src/components/** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

if exist "src\app" (
    echo ✅ **src/app/** - Next.js App Router >> FRONTEND_STRUCTURE_REPORT.md
) else if exist "src\pages" (
    echo ✅ **src/pages/** - Next.js Pages Router >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **src/app or src/pages** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

if exist "public" (
    echo ✅ **public/** - Static assets >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **public/** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

echo. >> FRONTEND_STRUCTURE_REPORT.md
echo ## 🔧 CONFIGURATION FILES >> FRONTEND_STRUCTURE_REPORT.md
echo. >> FRONTEND_STRUCTURE_REPORT.md

if exist "package.json" (
    echo ✅ **package.json** - Dependencies configuration >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **package.json** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

if exist "next.config.js" (
    echo ✅ **next.config.js** - Next.js configuration >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **next.config.js** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

if exist "tailwind.config.ts" (
    echo ✅ **tailwind.config.ts** - Tailwind CSS configuration >> FRONTEND_STRUCTURE_REPORT.md
) else if exist "tailwind.config.js" (
    echo ✅ **tailwind.config.js** - Tailwind CSS configuration >> FRONTEND_STRUCTURE_REPORT.md
) else (
    echo ❌ **tailwind.config** - Missing! >> FRONTEND_STRUCTURE_REPORT.md
)

echo. >> FRONTEND_STRUCTURE_REPORT.md
echo ## 📊 RECOMMENDATIONS >> FRONTEND_STRUCTURE_REPORT.md
echo. >> FRONTEND_STRUCTURE_REPORT.md
echo - Review component organization >> FRONTEND_STRUCTURE_REPORT.md
echo - Remove any unused dependencies >> FRONTEND_STRUCTURE_REPORT.md
echo - Ensure proper TypeScript configuration >> FRONTEND_STRUCTURE_REPORT.md
echo - Optimize build process >> FRONTEND_STRUCTURE_REPORT.md

echo.
echo ================================================================
echo                    🎉 PHÂN TÍCH HOÀN THÀNH!
echo ================================================================
echo.
echo ✅ Đã phân tích cấu trúc frontend
echo ✅ Đã kiểm tra dependencies
echo ✅ Đã kiểm tra configuration files
echo ✅ Đã tìm kiếm file thừa
echo ✅ Tạo báo cáo: FRONTEND_STRUCTURE_REPORT.md
echo.
echo 📝 Xem báo cáo chi tiết trong: sun-movement-frontend\FRONTEND_STRUCTURE_REPORT.md
echo.
echo 🔄 Chạy lệnh sau để về thư mục gốc:
echo    cd /d "d:\DATN\DATN"
echo.
pause

cd /d "d:\DATN\DATN"
