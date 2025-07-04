# Debugging Order ID 40 Issue
Write-Host "=== DEBUGGING ORDER ID 40 ISSUE ===" -ForegroundColor Green

$BackendUrl = "http://localhost:5000"
$OrderId = "40"

Write-Host ""
Write-Host "1. Checking if Order ID 40 exists in backend..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$OrderId" -Method Get -ContentType "application/json"
    Write-Host "✓ Order $OrderId found in backend" -ForegroundColor Green
    Write-Host "Status: $($response.order.status)" -ForegroundColor White
    Write-Host "Email: $($response.order.email)" -ForegroundColor White
    Write-Host "User ID: $($response.order.userId)" -ForegroundColor White
} catch {
    Write-Host "✗ Order $OrderId NOT found in backend" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error body" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "2. Listing recent orders to see what's available..." -ForegroundColor Yellow

# Try to get list of orders
try {
    $ordersResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders" -Method Get -ContentType "application/json"
    Write-Host "Available orders:" -ForegroundColor Green
    
    if ($ordersResponse.orders) {
        foreach ($order in $ordersResponse.orders | Select-Object -First 10) {
            Write-Host "  Order ID: $($order.orderId), Status: $($order.status), Email: $($order.email)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "Could not retrieve orders list" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Checking order creation flow..." -ForegroundColor Yellow

# Check if there's a mismatch between order creation and retrieval
Write-Host "Possible issues to check:" -ForegroundColor Cyan
Write-Host "  - Order was created but not committed to database" -ForegroundColor White
Write-Host "  - Order ID mismatch (string vs int conversion)" -ForegroundColor White
Write-Host "  - Database transaction rollback" -ForegroundColor White
Write-Host "  - User authentication/authorization issue" -ForegroundColor White

Write-Host ""
Write-Host "4. Testing with different order IDs..." -ForegroundColor Yellow

$testIds = @("1", "2", "3", "39", "40", "41")

foreach ($testId in $testIds) {
    try {
        $testResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$testId" -Method Get -ContentType "application/json"
        Write-Host "  ✓ Order $testId exists" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Order $testId not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== DEBUGGING COMPLETED ===" -ForegroundColor Green
