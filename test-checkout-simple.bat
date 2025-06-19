@echo off
echo Testing checkout endpoint without cart...
echo.

curl -X POST "https://localhost:5001/api/orders/checkout" ^
  -H "Content-Type: application/json" ^
  -d "{\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Ho Chi Minh\",\"province\":\"Ho Chi Minh\",\"zipCode\":\"70000\"},\"contactInfo\":{\"email\":\"test@example.com\",\"phone\":\"0123456789\"},\"paymentMethod\":\"cash_on_delivery\"}" ^
  -k -v

echo.
echo.
echo Test completed!
pause
