@echo off
echo ========================================
echo    DATABASE SCHEMA CHECK
echo ========================================

set BASE_URL=https://localhost:5001

echo.
echo [1] Test simple endpoint first:
curl -k -X GET "%BASE_URL%/api/Debug/health" 2>nul
echo.

echo.
echo [2] Test database-dependent endpoint:
echo Testing cart with verbose error logging...
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" -v 2>error.log
echo.

echo Error log content:
type error.log 2>nul
echo.

echo.
echo [3] Test products (should work):
curl -k -X GET "%BASE_URL%/api/products" 2>nul | findstr "id"
echo.

echo.
echo [4] Test direct add to cart (may reveal database issues):
curl -k -X POST "%BASE_URL%/api/ShoppingCart/items" ^
    -H "Content-Type: application/json" ^
    -d "{\"productId\":1,\"quantity\":1}" ^
    -w "HTTP Status: %%{http_code}" 2>add_error.log
echo.

echo Add to cart error log:
type add_error.log 2>nul
echo.

echo ========================================
echo Check server console for detailed errors
echo ========================================
del error.log add_error.log 2>nul
pause
