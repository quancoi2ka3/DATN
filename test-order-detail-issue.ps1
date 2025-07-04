# Test Order Detail Issue After Confirm Received
Write-Host "=== TESTING ORDER DETAIL AFTER CONFIRM RECEIVED ===" -ForegroundColor Green

$BackendUrl = "http://localhost:5000"
$FrontendUrl = "http://localhost:3000"

# Test with different order IDs
$OrderIds = @("1", "2", "3")

Write-Host ""
Write-Host "1. Testing order existence in backend..." -ForegroundColor Yellow

foreach ($orderId in $OrderIds) {
    Write-Host "Testing Order ID: $orderId" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$orderId" -Method Get -ContentType "application/json"
        Write-Host "  ✓ Order $orderId exists" -ForegroundColor Green
        Write-Host "    Status: $($response.order.status)" -ForegroundColor White
        Write-Host "    Email: $($response.order.email)" -ForegroundColor White
        
        # Test confirm received if delivered
        if ($response.order.status -eq "delivered") {
            Write-Host "  → Testing confirm received..." -ForegroundColor Cyan
            
            try {
                $confirmResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$orderId/confirm-received" -Method Post -ContentType "application/json"
                Write-Host "  ✓ Confirm received successful" -ForegroundColor Green
                
                # Test order detail after confirm
                Start-Sleep -Seconds 1
                $afterConfirmResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$orderId" -Method Get -ContentType "application/json"
                Write-Host "  ✓ Order detail accessible after confirm" -ForegroundColor Green
                Write-Host "    New Status: $($afterConfirmResponse.order.status)" -ForegroundColor White
                
            } catch {
                Write-Host "  ✗ Confirm received failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "  ✗ Order $orderId not found (404)" -ForegroundColor Yellow
        } else {
            Write-Host "  ✗ Order $orderId error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

Write-Host ""
Write-Host "2. Testing frontend proxy..." -ForegroundColor Yellow

foreach ($orderId in $OrderIds) {
    Write-Host "Testing Frontend Proxy for Order ID: $orderId" -ForegroundColor Cyan
    
    try {
        $proxyResponse = Invoke-RestMethod -Uri "$FrontendUrl/api/order?id=$orderId" -Method Get -ContentType "application/json"
        Write-Host "  ✓ Frontend proxy works for Order $orderId" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Frontend proxy failed for Order $orderId: $($_.Exception.Message)" -ForegroundColor Red
        
        # Check if it's a specific error
        if ($_.Exception.Response) {
            try {
                $errorStream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorStream)
                $errorBody = $reader.ReadToEnd()
                Write-Host "    Error details: $errorBody" -ForegroundColor Red
            } catch {
                Write-Host "    Could not read error details" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "3. Testing specific reproduce scenario..." -ForegroundColor Yellow

# Find an order with delivered status
Write-Host "Looking for orders with 'delivered' status..." -ForegroundColor Cyan

foreach ($orderId in $OrderIds) {
    try {
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$orderId" -Method Get -ContentType "application/json"
        
        if ($response.order.status -eq "delivered") {
            Write-Host "Found delivered order: $orderId" -ForegroundColor Green
            
            # Step 1: Get order detail (should work)
            Write-Host "Step 1: Getting order detail before confirm..." -ForegroundColor Yellow
            $beforeResponse = Invoke-RestMethod -Uri "$FrontendUrl/api/order?id=$orderId" -Method Get -ContentType "application/json"
            Write-Host "✓ Order detail accessible before confirm" -ForegroundColor Green
            
            # Step 2: Confirm received
            Write-Host "Step 2: Confirming order received..." -ForegroundColor Yellow
            $confirmResponse = Invoke-RestMethod -Uri "$FrontendUrl/api/orders/$orderId/confirm-received" -Method Post -ContentType "application/json"
            Write-Host "✓ Order confirmed as received" -ForegroundColor Green
            
            # Step 3: Try to get order detail again (this might fail)
            Write-Host "Step 3: Getting order detail after confirm..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2  # Give some time for changes to propagate
            
            try {
                $afterResponse = Invoke-RestMethod -Uri "$FrontendUrl/api/order?id=$orderId" -Method Get -ContentType "application/json"
                Write-Host "✓ Order detail accessible after confirm" -ForegroundColor Green
                Write-Host "Status changed from $($beforeResponse.order.status) to $($afterResponse.order.status)" -ForegroundColor White
            } catch {
                Write-Host "✗ REPRODUCED THE ISSUE: Order detail not accessible after confirm" -ForegroundColor Red
                Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
                
                # Try direct backend call
                try {
                    $directResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$orderId" -Method Get -ContentType "application/json"
                    Write-Host "✓ Direct backend call still works" -ForegroundColor Green
                    Write-Host "Issue is in frontend proxy, not backend" -ForegroundColor Yellow
                } catch {
                    Write-Host "✗ Direct backend call also fails" -ForegroundColor Red
                    Write-Host "Issue is in backend after confirm received" -ForegroundColor Red
                }
            }
            
            break # Only test with first delivered order found
        }
    } catch {
        # Skip non-existent orders
    }
}

Write-Host ""
Write-Host "=== TEST COMPLETED ===" -ForegroundColor Green
