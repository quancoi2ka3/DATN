# Test đầy đủ logic cập nhật trạng thái đơn hàng theo chuẩn TMĐT
Write-Host "=== COMPREHENSIVE ORDER STATUS SYNC TEST ===" -ForegroundColor Cyan

$orderId = 37
$baseUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:3000"

function Test-OrderStatus {
    param([string]$TestName, [int]$StatusEnum, [string]$ExpectedOrderStatus, [string]$ExpectedPaymentStatus)
    
    Write-Host "`n=== $TestName ===" -ForegroundColor Yellow
    
    # Update via Admin API
    $adminUrl = "$baseUrl/api/admin/orders/$orderId/update-status"
    $body = @{ Status = $StatusEnum } | ConvertTo-Json
    
    try {
        Write-Host "Updating to status enum $StatusEnum..." -ForegroundColor Cyan
        $updateResponse = Invoke-RestMethod -Uri $adminUrl -Method POST -Body $body -ContentType "application/json"
        Write-Host "✓ Admin API Success" -ForegroundColor Green
        
        Start-Sleep -Seconds 1
        
        # Check Backend API
        $backendCheck = Invoke-RestMethod -Uri "$baseUrl/api/orders/$orderId" -Method Get
        $backendStatus = $backendCheck.order.status
        $backendPayment = $backendCheck.order.paymentStatus
        
        Write-Host "Backend API:" -ForegroundColor White
        Write-Host "  Order Status: $backendStatus" -ForegroundColor White
        Write-Host "  Payment Status: $backendPayment" -ForegroundColor White
        
        # Check Frontend API Proxy
        $frontendCheck = Invoke-RestMethod -Uri "$frontendUrl/api/order?id=$orderId" -Method Get
        $frontendStatus = $frontendCheck.order.status
        $frontendPayment = $frontendCheck.order.paymentStatus
        
        Write-Host "Frontend API Proxy:" -ForegroundColor White
        Write-Host "  Order Status: $frontendStatus" -ForegroundColor White
        Write-Host "  Payment Status: $frontendPayment" -ForegroundColor White
        
        # Validation
        $orderStatusMatch = ($backendStatus -eq $ExpectedOrderStatus -and $frontendStatus -eq $ExpectedOrderStatus)
        $paymentStatusMatch = ($backendPayment -eq $ExpectedPaymentStatus -and $frontendPayment -eq $ExpectedPaymentStatus)
        $syncMatch = ($backendStatus -eq $frontendStatus -and $backendPayment -eq $frontendPayment)
        
        if ($orderStatusMatch -and $paymentStatusMatch -and $syncMatch) {
            Write-Host "✓ PASS: All statuses correct and synchronized" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ FAIL: Status mismatch or sync issue" -ForegroundColor Red
            if (!$orderStatusMatch) { Write-Host "  Order status issue" -ForegroundColor Red }
            if (!$paymentStatusMatch) { Write-Host "  Payment status issue" -ForegroundColor Red }
            if (!$syncMatch) { Write-Host "  Frontend/Backend sync issue" -ForegroundColor Red }
            return $false
        }
        
    } catch {
        Write-Host "✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test cases theo chuẩn TMĐT
$testResults = @()

# Test 1: Pending - chờ xử lý (payment status không thay đổi)
$testResults += Test-OrderStatus "Pending Status" 0 "pending" "paid"  # Giữ nguyên payment hiện tại

# Test 2: Processing - đang xử lý (phải đã thanh toán)
$testResults += Test-OrderStatus "Processing Status" 1 "processing" "paid"

# Test 3: Shipped - đã giao vận (phải đã thanh toán)
$testResults += Test-OrderStatus "Shipped Status" 2 "shipped" "paid"

# Test 4: Delivered - đã giao hàng (phải đã thanh toán)  
$testResults += Test-OrderStatus "Delivered Status" 3 "delivered" "paid"

# Test 5: Completed - hoàn thành (phải đã thanh toán)
$testResults += Test-OrderStatus "Completed Status" 4 "completed" "paid"

# Test 6: Cancelled - đã hủy (nếu đã thanh toán thì chuyển thành refunded)
$testResults += Test-OrderStatus "Cancelled Status" 6 "cancelled" "refunded"

# Summary
Write-Host "`n=== TEST SUMMARY ===" -ForegroundColor Cyan
$passCount = ($testResults | Where-Object { $_ -eq $true }).Count
$totalCount = $testResults.Count

Write-Host "Passed: $passCount/$totalCount tests" -ForegroundColor $(if ($passCount -eq $totalCount) { "Green" } else { "Yellow" })

if ($passCount -eq $totalCount) {
    Write-Host "🎉 ALL TESTS PASSED! Order status sync logic is working correctly!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Please check the logic." -ForegroundColor Yellow
}

# Final status check
Write-Host "`n=== FINAL STATUS CHECK ===" -ForegroundColor Cyan
try {
    $final = Invoke-RestMethod -Uri "$baseUrl/api/orders/$orderId" -Method Get
    Write-Host "Final Order $orderId status:" -ForegroundColor White
    Write-Host "  Order Status: $($final.order.status)" -ForegroundColor White  
    Write-Host "  Payment Status: $($final.order.paymentStatus)" -ForegroundColor White
    Write-Host "  IsPaid: $($final.order.isPaid)" -ForegroundColor White
} catch {
    Write-Host "Error getting final status: $($_.Exception.Message)" -ForegroundColor Red
}
