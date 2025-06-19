@echo off
echo Testing checkout backend API...
echo.

echo 1. First, adding item to cart for testing...
curl -X POST "https://localhost:5001/api/ShoppingCart/items" ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1, \"quantity\": 1}" ^
  -k --silent --show-error
echo.
echo.

echo 2. Testing checkout with sample data...
curl -X POST "https://localhost:5001/api/orders/checkout" ^
  -H "Content-Type: application/json" ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Ho Chi Minh\",\"province\":\"Ho Chi Minh\",\"zipCode\":\"70000\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"0123456789\"},\"paymentMethod\":\"cash_on_delivery\"}" ^
  -k --silent --show-error
echo.
echo.

echo Test completed!
pause
