@echo off
echo ========================================
echo    COMPLETE CART DATA TEST
echo ========================================

set BASE_URL=https://localhost:5001

echo [1] Clear existing cart:
curl -k -X DELETE "%BASE_URL%/api/ShoppingCart/clear" -s
echo Cart cleared
echo.

echo [2] Add Product ID 1 (should have full data):
curl -k -X POST "%BASE_URL%/api/ShoppingCart/items" -H "Content-Type: application/json" -d "{\"productId\":1,\"quantity\":1}" -s
echo Product added
echo.

echo [3] Get cart with full product data:
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" -s
echo.
echo.

echo [4] Add another product (Product ID 2):
curl -k -X POST "%BASE_URL%/api/ShoppingCart/items" -H "Content-Type: application/json" -d "{\"productId\":2,\"quantity\":1}" -s
echo Product 2 added
echo.

echo [5] Final cart state:
curl -k -X GET "%BASE_URL%/api/ShoppingCart/items" -s
echo.
echo.

echo ========================================
echo ANALYSIS: Check if you see:
echo - itemName: "Polo Black" or product name
echo - itemImageUrl: actual image URL
echo - unitPrice: actual price (not 0)
echo - product: {name, price, imageUrl} object
echo ========================================
pause
