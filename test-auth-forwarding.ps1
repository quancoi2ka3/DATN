#!/usr/bin/env powershell
# Test authentication forwarding between frontend proxy and backend

Write-Host "=== Testing Authentication Forwarding ===" -ForegroundColor Green

# Test order ID 40 that we know exists
$orderId = 40
$frontendUrl = "http://localhost:3000"
$backendUrl = "http://localhost:5000"

Write-Host "`n1. Testing direct backend call (should fail - no auth)" -ForegroundColor Yellow
try {
    $directResponse = Invoke-WebRequest -Uri "$backendUrl/api/orders/$orderId" -Method GET -ErrorAction SilentlyContinue
    Write-Host "Direct backend response: $($directResponse.StatusCode)" -ForegroundColor Red
} catch {
    Write-Host "Direct backend error (expected): $($_.Exception.Message)" -ForegroundColor Orange
}

Write-Host "`n2. Testing frontend proxy call" -ForegroundColor Yellow
try {
    $proxyResponse = Invoke-WebRequest -Uri "$frontendUrl/api/order?id=$orderId" -Method GET -ErrorAction SilentlyContinue
    Write-Host "Frontend proxy response: $($proxyResponse.StatusCode)" -ForegroundColor Green
    
    if ($proxyResponse.StatusCode -eq 200) {
        $responseData = $proxyResponse.Content | ConvertFrom-Json
        Write-Host "Success: $($responseData.success)" -ForegroundColor Green
        if ($responseData.order) {
            Write-Host "Order ID: $($responseData.order.orderId)" -ForegroundColor Green
            Write-Host "Status: $($responseData.order.status)" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Frontend proxy error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`n3. Testing with explicit auth cookie simulation" -ForegroundColor Yellow
# Test với cookie giả lập
$headers = @{
    'Cookie' = '.AspNetCore.Identity.Application=fake-cookie-value; auth-token=fake-jwt-token'
    'Authorization' = 'Bearer fake-jwt-token'
}

try {
    $authResponse = Invoke-WebRequest -Uri "$frontendUrl/api/order?id=$orderId" -Method GET -Headers $headers -ErrorAction SilentlyContinue
    Write-Host "With auth headers response: $($authResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "With auth headers error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
