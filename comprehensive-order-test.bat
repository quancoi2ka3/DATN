@echo off
echo Testing Order Creation with Detailed Error Logging
echo.

echo 1. Testing simple order creation...
curl -k -X POST "https://localhost:5001/api/orders/simple-test" -H "Content-Type: application/json" -w "\nHTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo 2. Testing debug checkout...
curl -k -X POST "https://localhost:5001/api/orders/debug-checkout" -H "Content-Type: application/json" -d "{\"paymentMethod\":\"cod\",\"shippingAddress\":{\"fullName\":\"Debug User\",\"addressLine1\":\"123 Debug St\",\"city\":\"Debug City\",\"province\":\"Debug Province\"},\"contactInfo\":{\"email\":\"debug@test.com\",\"phone\":\"0987654321\",\"notes\":\"Debug test\"}}" -w "\nHTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo 3. Testing VNPay checkout...
curl -k -X POST "https://localhost:5001/api/orders/debug-checkout" -H "Content-Type: application/json" -d "{\"paymentMethod\":\"vnpay\",\"shippingAddress\":{\"fullName\":\"VNPay User\",\"addressLine1\":\"123 VNPay St\",\"city\":\"VNPay City\",\"province\":\"VNPay Province\"},\"contactInfo\":{\"email\":\"vnpay@test.com\",\"phone\":\"0987654321\",\"notes\":\"VNPay test\"}}" -w "\nHTTP Status: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo 4. Checking recent orders in database...
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT TOP 3 Id, Email, TotalAmount, Status, PaymentMethod, CreatedAt FROM Orders ORDER BY CreatedAt DESC"

echo.
echo 5. Checking recent order items...
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT TOP 5 Id, OrderId, ProductName, Quantity, UnitPrice FROM OrderItems ORDER BY Id DESC"

echo.
pause
