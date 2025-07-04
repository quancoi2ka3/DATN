# Test với đúng OrderStatus enum values
Write-Host "=== CORRECTED ORDER STATUS SYNC TEST ===" -ForegroundColor Cyan

$orderId = 37
$baseUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:3000"

# Correct OrderStatus enum values
$statusEnum = @{
    "Pending" = 0
    "AwaitingPayment" = 1  
    "Paid" = 2
    "Processing" = 3
    "AwaitingFulfillment" = 4
    "Shipped" = 5
    "PartiallyShipped" = 6
    "Delivered" = 7
    "Completed" = 8
    "Cancelled" = 9
}

function Update-And-Check {
    param([string]$StatusName, [int]$StatusValue, [string]$ExpectedPayment)
    
    Write-Host "`n=== Testing $StatusName (enum $StatusValue) ===" -ForegroundColor Yellow
    
    try {
        # Update via Admin API
        $adminUrl = "$baseUrl/api/admin/orders/$orderId/update-status"
        $body = @{ Status = $StatusValue } | ConvertTo-Json
        
        $updateResponse = Invoke-RestMethod -Uri $adminUrl -Method POST -Body $body -ContentType "application/json"
        Write-Host "✓ Update Success" -ForegroundColor Green
        
        Start-Sleep -Seconds 1
        
        # Check Backend
        $backend = Invoke-RestMethod -Uri "$baseUrl/api/orders/$orderId" -Method Get
        Write-Host "Backend: Order=$($backend.order.status), Payment=$($backend.order.paymentStatus)" -ForegroundColor White
        
        # Check Frontend  
        $frontend = Invoke-RestMethod -Uri "$frontendUrl/api/order?id=$orderId" -Method Get
        Write-Host "Frontend: Order=$($frontend.order.status), Payment=$($frontend.order.paymentStatus)" -ForegroundColor White
        
        # Validate payment status logic
        $paymentCorrect = $backend.order.paymentStatus -eq $ExpectedPayment
        $synchronized = ($backend.order.status -eq $frontend.order.status -and $backend.order.paymentStatus -eq $frontend.order.paymentStatus)
        
        if ($paymentCorrect -and $synchronized) {
            Write-Host "✓ PASS: Correct payment logic and synchronized" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ FAIL: Payment logic or sync issue" -ForegroundColor Red
            return $false
        }
        
    } catch {
        Write-Host "✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test key status transitions according to ecommerce standards
Write-Host "Testing key order status transitions for ecommerce logic..." -ForegroundColor Cyan

$results = @()

# 1. Processing (should require payment)
$results += Update-And-Check "Processing" $statusEnum["Processing"] "paid"

# 2. Shipped (should require payment) 
$results += Update-And-Check "Shipped" $statusEnum["Shipped"] "paid"

# 3. Delivered (should require payment)
$results += Update-And-Check "Delivered" $statusEnum["Delivered"] "paid"

# 4. Completed (should require payment)
$results += Update-And-Check "Completed" $statusEnum["Completed"] "paid"

# 5. Cancelled (should refund if previously paid)
$results += Update-And-Check "Cancelled" $statusEnum["Cancelled"] "refunded"

# 6. Back to Pending (should keep current payment status)
$results += Update-And-Check "Pending" $statusEnum["Pending"] "refunded"  # Should keep previous status

# Summary
Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
$passed = ($results | Where-Object { $_ -eq $true }).Count
$total = $results.Count

Write-Host "Passed: $passed/$total tests" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })

if ($passed -eq $total) {
    Write-Host "🎉 SUCCESS: Order status synchronization logic working correctly!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Some tests failed. Review the logic." -ForegroundColor Yellow
}

# Final check
Write-Host "`n=== FINAL STATUS ===" -ForegroundColor Cyan
try {
    $final = Invoke-RestMethod -Uri "$baseUrl/api/orders/$orderId" -Method Get
    Write-Host "Order $orderId Final Status:" -ForegroundColor White
    Write-Host "  Order Status: $($final.order.status)" -ForegroundColor White
    Write-Host "  Payment Status: $($final.order.paymentStatus)" -ForegroundColor White
    Write-Host "  IsPaid: $($final.order.isPaid)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
