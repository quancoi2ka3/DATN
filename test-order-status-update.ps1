# Test script để cập nhật trạng thái đơn hàng từ admin
# Sử dụng OrdersAdminController.UpdateStatus

Write-Host "Testing Order Status Update via Admin Controller..."

# Test cập nhật order ID 37 thành trạng thái Completed
$orderUpdateUrl = "http://localhost:5000/Admin/Orders/UpdateStatus"
$updateBody = @{
    id = 37
    status = "Completed"
}

Write-Host "Updating Order 37 to Completed status..."

try {
    # Convert body to form data
    $formData = "id=37&status=Completed"
    
    $response = Invoke-WebRequest -Uri $orderUpdateUrl -Method POST -Body $formData -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "Update Response Status: $($response.StatusCode)"
    Write-Host "Update Response Content: $($response.Content)"
    
    # Wait a moment then check the order status
    Start-Sleep -Seconds 2
    
    Write-Host "`nChecking order 37 status after update..."
    $orderCheck = Invoke-RestMethod -Uri "http://localhost:5000/api/orders/37" -Method Get
    
    Write-Host "Order Status: $($orderCheck.order.status)"
    Write-Host "Payment Status: $($orderCheck.order.paymentStatus)"
    Write-Host "IsPaid: $($orderCheck.order.isPaid)"
    
    if ($orderCheck.order.status -eq "completed" -and $orderCheck.order.paymentStatus -eq "paid") {
        Write-Host "SUCCESS: Status and payment are now synchronized!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Status or payment still not synchronized" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
