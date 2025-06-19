@echo off
echo Checking database schema for Orders and OrderItems...
echo.

rem Check if SQL Server is accessible
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo Database is not accessible. Please check connection.
    pause
    exit /b 1
)

echo Database connection successful!
echo.

echo 1. Checking Orders table structure:
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT TOP 0 * FROM Orders" -o temp_orders.txt
type temp_orders.txt

echo.
echo 2. Checking OrderItems table structure:
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT TOP 0 * FROM OrderItems" -o temp_orderitems.txt
type temp_orderitems.txt

echo.
echo 3. Checking foreign key constraints:
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT OBJECT_NAME(parent_object_id) ParentTable, OBJECT_NAME(referenced_object_id) ReferencedTable, name ConstraintName FROM sys.foreign_keys WHERE OBJECT_NAME(parent_object_id) = 'OrderItems'" -o temp_fk.txt
type temp_fk.txt

echo.
echo 4. Recent Orders (if any):
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT TOP 5 Id, TotalAmount, Status, PaymentMethod, CreatedAt FROM Orders ORDER BY CreatedAt DESC" -o temp_recent_orders.txt
type temp_recent_orders.txt

echo.
echo 5. Recent OrderItems (if any):
sqlcmd -S ".\SQLEXPRESS" -d "SunMovementDB" -E -Q "SELECT TOP 5 Id, OrderId, ProductId, ProductName, Quantity, UnitPrice FROM OrderItems ORDER BY Id DESC" -o temp_recent_items.txt
type temp_recent_items.txt

rem Clean up temp files
del temp_*.txt >nul 2>&1

echo.
echo Database schema check completed.
pause
