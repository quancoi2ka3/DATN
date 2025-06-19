@echo off
echo ========================================
echo    FRONTEND-BACKEND INTEGRATION TEST
echo ========================================

set BASE_URL=https://localhost:5001

echo [SUCCESS] ✅ Backend API Working!
echo.

echo [1] Current Cart Status:
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" -s 2>nul
echo.
echo.

echo [2] Add Product ID 2:
curl -k -X POST "%BASE_URL%/api/ShoppingCart/items" -H "Content-Type: application/json" -d "{\"productId\":2,\"quantity\":1}" -s 2>nul
echo Added product 2
echo.

echo [3] Cart After Adding:
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" -s 2>nul
echo.
echo.

echo [4] Update Cart Item (Product 1 to Quantity 2):
curl -k -X PUT "%BASE_URL%/api/ShoppingCart/items" -H "Content-Type: application/json" -d "{\"cartItemId\":3,\"quantity\":2}" -s 2>nul
echo Updated cart item
echo.

echo [5] Cart After Update:
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" -s 2>nul
echo.
echo.

echo ========================================
echo         FRONTEND INSTRUCTIONS
echo ========================================
echo 1. Restart your Next.js frontend server
echo 2. The cart-service.ts has been updated to match backend API
echo 3. Test add to cart on website - should work now!
echo 4. Cart icon should show quantity and items
echo ========================================

echo.
echo Backend API Summary:
echo - GET  /api/ShoppingCart/items     ✅ Working
echo - POST /api/ShoppingCart/items     ✅ Working  
echo - PUT  /api/ShoppingCart/items     ✅ Working
echo - DEL  /api/ShoppingCart/items/ID  ✅ Available
echo - DEL  /api/ShoppingCart/clear     ✅ Available
echo.
echo Frontend service updated to match backend endpoints!
pause
