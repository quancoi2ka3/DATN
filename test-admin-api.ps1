# Test API Admin mới để cập nhật trạng thái
Write-Host "=== Testing NEW Admin API for Order Status Update ===" -ForegroundColor Cyan

# Check current status
Write-Host "`n1. Current status of Order 37:" -ForegroundColor Yellow
try {
    $current = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/37" -Method Get
    Write-Host "  Status: $($current.order.status)" -ForegroundColor White
    Write-Host "  Payment Status: $($current.order.paymentStatus)" -ForegroundColor White
    Write-Host "  IsPaid: $($current.order.isPaid)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test Admin API
Write-Host "`n2. Testing Admin API endpoint..." -ForegroundColor Yellow
$adminApiUrl = "http://localhost:5000/api/admin/orders/37/update-status"
$requestBody = @{
    Status = "Delivered"  # Enum value
} | ConvertTo-Json

Write-Host "POST URL: $adminApiUrl" -ForegroundColor Cyan
Write-Host "Request Body: $requestBody" -ForegroundColor Cyan

try {
    $updateResponse = Invoke-RestMethod -Uri $adminApiUrl -Method POST -Body $requestBody -ContentType "application/json"
    Write-Host "Admin API Response:" -ForegroundColor Green
    Write-Host ($updateResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "Admin API Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with integer status
    Write-Host "`n2.1. Trying with integer status..." -ForegroundColor Yellow
    try {
        $requestBodyInt = @{
            Status = 5  # Delivered = 5 in enum
        } | ConvertTo-Json
        Write-Host "Request Body (int): $requestBodyInt" -ForegroundColor Cyan
        
        $updateResponse = Invoke-RestMethod -Uri $adminApiUrl -Method POST -Body $requestBodyInt -ContentType "application/json"
        Write-Host "Admin API Response (int):" -ForegroundColor Green
        Write-Host ($updateResponse | ConvertTo-Json -Depth 3) -ForegroundColor White
    } catch {
        Write-Host "Admin API Error (int): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Check updated status
Write-Host "`n3. Checking updated status:" -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/37" -Method Get
    Write-Host "Updated Order 37:" -ForegroundColor Green
    Write-Host "  Status: $($updated.order.status)" -ForegroundColor White
    Write-Host "  Payment Status: $($updated.order.paymentStatus)" -ForegroundColor White
    Write-Host "  IsPaid: $($updated.order.isPaid)" -ForegroundColor White
    
    # Check if synchronized
    if ($updated.order.status -eq "delivered" -and $updated.order.paymentStatus -eq "paid") {
        Write-Host "`nSUCCESS: Status and payment are now synchronized!" -ForegroundColor Green
    } elseif ($updated.order.status -ne $current.order.status) {
        Write-Host "`nPARTIAL SUCCESS: Status changed but payment not synchronized" -ForegroundColor Yellow
    } else {
        Write-Host "`nWARNING: No changes detected" -ForegroundColor Red
    }
} catch {
    Write-Host "Error checking updated status: $($_.Exception.Message)" -ForegroundColor Red
}
