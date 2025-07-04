#!/usr/bin/env powershell
# Test creating order with authentication and then accessing it

Write-Host "=== Testing Order Creation and Access with Authentication ===" -ForegroundColor Green

$frontendUrl = "http://localhost:3000"
$backendUrl = "http://localhost:5000"

# Step 1: Tạo order mới với email đặc biệt để dễ identify
Write-Host "`n1. Creating new test order..." -ForegroundColor Yellow

$orderData = @{
    email = "auth-test@example.com"
    phoneNumber = "0123456789"
    shippingAddress = "123 Auth Test Street"
    paymentMethod = "cod"
    cartItems = @(
        @{
            productId = 1
            quantity = 1
            unitPrice = 100000
        }
    )
} | ConvertTo-Json -Depth 3

try {
    $createResponse = Invoke-RestMethod -Uri "$backendUrl/api/orders/checkout" -Method POST -Body $orderData -ContentType "application/json"
    Write-Host "Order created successfully!" -ForegroundColor Green
    Write-Host "Order ID: $($createResponse.orderId)" -ForegroundColor Green
    $newOrderId = $createResponse.orderId
    
    # Step 2: Test accessing the new order
    Write-Host "`n2. Testing access to new order..." -ForegroundColor Yellow
    
    # Via backend directly
    Write-Host "2a. Direct backend access:" -ForegroundColor Cyan
    $backendResponse = Invoke-RestMethod -Uri "$backendUrl/api/orders/$newOrderId" -Method GET
    Write-Host "Backend success: $($backendResponse.success)" -ForegroundColor Green
    
    # Via frontend proxy
    Write-Host "`n2b. Frontend proxy access:" -ForegroundColor Cyan
    $proxyResponse = Invoke-RestMethod -Uri "$frontendUrl/api/order?id=$newOrderId" -Method GET
    Write-Host "Frontend proxy success: $($proxyResponse.success)" -ForegroundColor Green
    
    # Step 3: Test with explicit userId set
    Write-Host "`n3. Now we need to create order with userId set..." -ForegroundColor Yellow
    Write-Host "This requires actual authentication. Please:"
    Write-Host "- Go to http://localhost:3000/auth/login" -ForegroundColor White
    Write-Host "- Login with any user" -ForegroundColor White
    Write-Host "- Create an order through the UI" -ForegroundColor White
    Write-Host "- Then test accessing that order" -ForegroundColor White
    
} catch {
    Write-Host "Error creating order: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
