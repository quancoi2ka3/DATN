@echo off
echo Seeding test data - Adding stock to products...
echo.

echo Updating product 1 with stock...
curl -X PUT "https://localhost:5001/api/products/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":1,\"name\":\"Polo Black\",\"description\":\"High-quality athletic t-shirt with the Sun Movement logo\",\"price\":25.99,\"discountPrice\":null,\"stockQuantity\":100,\"imageUrl\":\"/images/products/polo-black.jpg\",\"category\":0,\"subCategory\":\"Áo\",\"specifications\":\"\",\"isFeatured\":true,\"isActive\":true}" ^
  -k --silent --show-error

echo.
echo.

echo Verifying product stock...
curl -X GET "https://localhost:5001/api/products/1" ^
  -k --silent --show-error

echo.
echo.
echo Test data seeding completed!
pause
