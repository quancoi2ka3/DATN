@echo off
echo Getting all products...
echo.

curl -X GET "https://localhost:5001/api/products" ^
  -H "Content-Type: application/json" ^
  -k --silent --show-error

echo.
echo.
echo Test completed!
pause
