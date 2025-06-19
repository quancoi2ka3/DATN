@echo off
echo Testing complete checkout flow...
echo.

echo 1. Adding item to cart...
curl -X POST "https://localhost:5001/api/ShoppingCart/items" ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1, \"quantity\": 1}" ^
  -k --silent --show-error
echo.
echo.

echo 2. Getting cart to verify...
curl -X GET "https://localhost:5001/api/ShoppingCart/items" ^
  -k --silent --show-error
echo.
echo.

echo 3. Processing checkout...
curl -X POST "https://localhost:5001/api/orders/checkout" ^
  -H "Content-Type: application/json" ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Ho Chi Minh\",\"province\":\"Ho Chi Minh\",\"zipCode\":\"70000\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"0123456789\"},\"paymentMethod\":\"cash_on_delivery\"}" ^
  -k --silent --show-error
echo.
echo.

echo Complete checkout flow test finished!
pause
