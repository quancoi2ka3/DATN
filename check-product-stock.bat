@echo off
echo Checking product stock...
echo.

curl -X GET "https://localhost:5001/api/products/1" ^
  -H "Content-Type: application/json" ^
  -k --silent --show-error

echo.
echo.
echo Test completed!
pause
