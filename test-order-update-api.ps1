# Test API cập nhật trạng thái đơn hàng trực tiếp
Write-Host "=== Testing Order Status Update via API ===" -ForegroundColor Cyan

# Trước khi cập nhật
Write-Host "`n1. Checking current status..." -ForegroundColor Yellow
try {
    $current = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/37" -Method Get
    Write-Host "Current Order 37:" -ForegroundColor Green
    Write-Host "  Status: $($current.order.status)" -ForegroundColor White
    Write-Host "  Payment Status: $($current.order.paymentStatus)" -ForegroundColor White
    Write-Host "  IsPaid: $($current.order.isPaid)" -ForegroundColor White
} catch {
    Write-Host "Error checking current status: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Kiểm tra xem có API endpoint nào cho admin update không
Write-Host "`n2. Looking for admin update endpoints..." -ForegroundColor Yellow

# Test cập nhật trạng thái qua OrdersAdmin controller (sử dụng JSON)
Write-Host "`n3. Testing OrdersAdmin UpdateStatus..." -ForegroundColor Yellow
try {
    $updateUrl = "http://localhost:5000/Admin/OrdersAdmin/UpdateStatus"
    $body = @{
        id = 37
        status = "Delivered"  # Thử status khác để trigger logic mới
    }
    
    # Convert to JSON
    $jsonBody = $body | ConvertTo-Json
    Write-Host "Sending POST to: $updateUrl" -ForegroundColor Cyan
    Write-Host "Body: $jsonBody" -ForegroundColor Cyan
    
    $updateResponse = Invoke-RestMethod -Uri $updateUrl -Method POST -Body $jsonBody -ContentType "application/json"
    Write-Host "Update Response: $updateResponse" -ForegroundColor Green
    
} catch {
    Write-Host "OrdersAdmin UpdateStatus failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Thử với form data thay vì JSON
    Write-Host "`n3.1. Trying with form data..." -ForegroundColor Yellow
    try {
        $formData = "id=37&status=Delivered"
        $updateResponse = Invoke-RestMethod -Uri $updateUrl -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded"
        Write-Host "Form data update Response: $updateResponse" -ForegroundColor Green
    } catch {
        Write-Host "Form data also failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Chờ một chút rồi check lại
Write-Host "`n4. Waiting 2 seconds then checking updated status..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/37" -Method Get
    Write-Host "Updated Order 37:" -ForegroundColor Green
    Write-Host "  Status: $($updated.order.status)" -ForegroundColor White
    Write-Host "  Payment Status: $($updated.order.paymentStatus)" -ForegroundColor White
    Write-Host "  IsPaid: $($updated.order.isPaid)" -ForegroundColor White
    
    # So sánh
    if ($updated.order.status -ne $current.order.status -or $updated.order.paymentStatus -ne $current.order.paymentStatus) {
        Write-Host "`nSUCCESS: Status changed!" -ForegroundColor Green
        if ($updated.order.status -eq "delivered" -and $updated.order.paymentStatus -eq "paid") {
            Write-Host "PERFECT: Status and payment are now synchronized!" -ForegroundColor Green
        }
    } else {
        Write-Host "`nWARNING: No changes detected" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error checking updated status: $($_.Exception.Message)" -ForegroundColor Red
}
