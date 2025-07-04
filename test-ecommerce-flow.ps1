# Comprehensive E-commerce Order Flow Test
Write-Host "=== COMPREHENSIVE E-COMMERCE ORDER FLOW TEST ===" -ForegroundColor Green

$BackendUrl = "http://localhost:5000"
$FrontendUrl = "http://localhost:3000"

# Function to update order status
function Update-OrderStatus {
    param($OrderId, $Status)
    
    Write-Host "Updating order $OrderId to status: $Status" -ForegroundColor Yellow
    
    try {
        $body = @{
            id = $OrderId
            status = $Status
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/admin/orders/$OrderId/status" -Method Post -Body $body -ContentType "application/json"
        Write-Host "✓ Status updated successfully" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ Failed to update status: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to get order details
function Get-OrderDetails {
    param($OrderId)
    
    try {
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$OrderId" -Method Get -ContentType "application/json"
        return $response.order
    } catch {
        Write-Host "✗ Failed to get order details: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to confirm order received
function Confirm-OrderReceived {
    param($OrderId)
    
    Write-Host "Confirming order $OrderId as received..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$OrderId/confirm-received" -Method Post -ContentType "application/json"
        Write-Host "✓ Order confirmed as received" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "✗ Failed to confirm received: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test order ID (change this to an existing order)
$TestOrderId = "1"

Write-Host ""
Write-Host "Testing order flow for Order ID: $TestOrderId" -ForegroundColor Cyan

# Step 1: Get initial order details
Write-Host ""
Write-Host "Step 1: Getting initial order details..." -ForegroundColor Yellow
$initialOrder = Get-OrderDetails -OrderId $TestOrderId

if ($initialOrder) {
    Write-Host "Initial Status: $($initialOrder.status)" -ForegroundColor White
    Write-Host "Initial Payment Status: $($initialOrder.paymentStatus)" -ForegroundColor White
    Write-Host "Initial IsPaid: $($initialOrder.isPaid)" -ForegroundColor White
    
    # Get product stock before test
    Write-Host "Order Items:" -ForegroundColor White
    foreach ($item in $initialOrder.orderItems) {
        Write-Host "  - Product: $($item.productName), Quantity: $($item.quantity)" -ForegroundColor Gray
    }
} else {
    Write-Host "✗ Cannot get initial order details. Test aborted." -ForegroundColor Red
    exit 1
}

# Step 2: Update order to Delivered status
Write-Host ""
Write-Host "Step 2: Updating order to 'Delivered' status..." -ForegroundColor Yellow

if (Update-OrderStatus -OrderId $TestOrderId -Status "Delivered") {
    # Verify status update
    $updatedOrder = Get-OrderDetails -OrderId $TestOrderId
    if ($updatedOrder -and $updatedOrder.status -eq "delivered") {
        Write-Host "✓ Order successfully updated to Delivered" -ForegroundColor Green
    } else {
        Write-Host "✗ Order status update verification failed" -ForegroundColor Red
    }
}

# Step 3: Confirm order as received
Write-Host ""
Write-Host "Step 3: Customer confirms order as received..." -ForegroundColor Yellow

$confirmResult = Confirm-OrderReceived -OrderId $TestOrderId

if ($confirmResult) {
    Write-Host "✓ Confirmation successful" -ForegroundColor Green
    
    # Step 4: Verify final state
    Write-Host ""
    Write-Host "Step 4: Verifying final order state..." -ForegroundColor Yellow
    
    $finalOrder = Get-OrderDetails -OrderId $TestOrderId
    
    if ($finalOrder) {
        Write-Host "Final Status: $($finalOrder.status)" -ForegroundColor White
        Write-Host "Final Payment Status: $($finalOrder.paymentStatus)" -ForegroundColor White
        Write-Host "Final IsPaid: $($finalOrder.isPaid)" -ForegroundColor White
        
        # Verify expected changes
        $checks = @()
        
        if ($finalOrder.status -eq "completed") {
            $checks += "✓ Status changed to Completed"
        } else {
            $checks += "✗ Status should be Completed, but is: $($finalOrder.status)"
        }
        
        if ($finalOrder.paymentStatus -eq "paid") {
            $checks += "✓ Payment Status changed to Paid"
        } else {
            $checks += "✗ Payment Status should be Paid, but is: $($finalOrder.paymentStatus)"
        }
        
        if ($finalOrder.isPaid -eq $true) {
            $checks += "✓ IsPaid set to true"
        } else {
            $checks += "✗ IsPaid should be true, but is: $($finalOrder.isPaid)"
        }
        
        Write-Host ""
        Write-Host "Verification Results:" -ForegroundColor Cyan
        foreach ($check in $checks) {
            if ($check.StartsWith("✓")) {
                Write-Host $check -ForegroundColor Green
            } else {
                Write-Host $check -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "=== E-COMMERCE ORDER FLOW TEST COMPLETED ===" -ForegroundColor Green

# Test Vietnamese Status Display
Write-Host ""
Write-Host "=== TESTING VIETNAMESE STATUS DISPLAY ===" -ForegroundColor Green

$vietnameseMap = @{
    "pending" = "Chờ xử lý"
    "processing" = "Đang xử lý"
    "shipped" = "Đã giao vận"
    "delivered" = "Đã giao hàng"
    "completed" = "Hoàn thành"
    "cancelled" = "Đã hủy"
}

Write-Host "Vietnamese Status Mapping:" -ForegroundColor Yellow
foreach ($status in $vietnameseMap.Keys) {
    Write-Host "  $status → $($vietnameseMap[$status])" -ForegroundColor White
}

Write-Host ""
Write-Host "=== ALL TESTS COMPLETED ===" -ForegroundColor Green
