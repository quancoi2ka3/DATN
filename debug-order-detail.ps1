# Debug Order Detail API
Write-Host "=== DEBUGGING ORDER DETAIL API ===" -ForegroundColor Green

$BackendUrl = "http://localhost:5000"
$OrderId = "1"  # Change this to test different order IDs

Write-Host ""
Write-Host "1. Testing direct backend API..." -ForegroundColor Yellow
Write-Host "GET $BackendUrl/api/orders/$OrderId"

try {
    $directResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$OrderId" -Method Get -ContentType "application/json"
    Write-Host "✓ Direct backend call successful:" -ForegroundColor Green
    $directResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Direct backend call failed:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error body" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "2. Testing frontend proxy API..." -ForegroundColor Yellow
$FrontendUrl = "http://localhost:3000"
Write-Host "GET $FrontendUrl/api/order?id=$OrderId"

try {
    $proxyResponse = Invoke-RestMethod -Uri "$FrontendUrl/api/order?id=$OrderId" -Method Get -ContentType "application/json"
    Write-Host "✓ Frontend proxy call successful:" -ForegroundColor Green
    $proxyResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Frontend proxy call failed:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing with different order IDs..." -ForegroundColor Yellow

$testOrderIds = @("1", "2", "3", "4", "5")

foreach ($testId in $testOrderIds) {
    Write-Host "Testing Order ID: $testId" -ForegroundColor Cyan
    
    try {
        $testResponse = Invoke-RestMethod -Uri "$BackendUrl/api/orders/$testId" -Method Get -ContentType "application/json"
        Write-Host "  ✓ Order $testId found" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "  ✗ Order $testId not found (404)" -ForegroundColor Yellow
        } else {
            Write-Host "  ✗ Order $testId error: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "4. Testing order creation and then detail retrieval..." -ForegroundColor Yellow

# This would require creating a test order first
Write-Host "Note: Manual test required - create an order through frontend then test detail retrieval" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== DEBUG COMPLETED ===" -ForegroundColor Green
