@echo off
echo Testing cart and checkout step by step...
echo.

echo 1. Adding item to cart...
curl -X POST "https://localhost:5001/api/ShoppingCart/items" ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1, \"quantity\": 1}" ^
  -k -v --cookie-jar cookies.txt --cookie cookies.txt
echo.
echo.

echo 2. Getting cart to verify (using same session)...
curl -X GET "https://localhost:5001/api/ShoppingCart/items" ^
  -k -v --cookie cookies.txt
echo.
echo.

echo 3. Processing checkout with same session...
curl -X POST "https://localhost:5001/api/orders/checkout" ^
  -H "Content-Type: application/json" ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Ho Chi Minh\",\"province\":\"Ho Chi Minh\",\"zipCode\":\"70000\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"0123456789\"},\"paymentMethod\":\"cash_on_delivery\"}" ^
  -k -v --cookie cookies.txt
echo.
echo.

echo Test completed!
pause
