# Testing Order Confirm Received Logic
Write-Host "=== TESTING ORDER CONFIRM RECEIVED LOGIC ===" -ForegroundColor Green

$OrderId = "1"
$BackendUrl = "http://localhost:5000"
$FrontendUrl = "http://localhost:3000"

Write-Host ""
Write-Host "1. Testing confirm received API endpoint..." -ForegroundColor Yellow
Write-Host "POST $BackendUrl/api/orders/$OrderId/confirm-received"

try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$OrderId/confirm-received" -Method Post -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing get order details after confirmation..." -ForegroundColor Yellow
Write-Host "GET $BackendUrl/api/orders/$OrderId"

try {
    $response = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$OrderId" -Method Get -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    Write-Host "Order Status: $($response.order.status)" -ForegroundColor Cyan
    Write-Host "Payment Status: $($response.order.paymentStatus)" -ForegroundColor Cyan
    Write-Host "Is Paid: $($response.order.isPaid)" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing frontend proxy confirm received..." -ForegroundColor Yellow
Write-Host "POST $FrontendUrl/api/orders/$OrderId/confirm-received"

try {
    $response = Invoke-RestMethod -Uri "$FrontendUrl/api/orders/$OrderId/confirm-received" -Method Post -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TEST COMPLETED ===" -ForegroundColor Green
