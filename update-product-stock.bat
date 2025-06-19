@echo off
echo Updating product stock...
echo.

curl -X PUT "https://localhost:5001/api/products/1" ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":1,\"name\":\"Polo Black\",\"description\":\"High-quality athletic t-shirt\",\"price\":25.99,\"stockQuantity\":100,\"category\":0,\"subCategory\":\"Áo\",\"specifications\":\"\",\"isFeatured\":true,\"isActive\":true}" ^
  -k --silent --show-error

echo.
echo.
echo Product updated!
pause
