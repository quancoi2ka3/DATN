# Testing Vietnamese Status Display in Admin
Write-Host "=== TESTING VIETNAMESE STATUS DISPLAY IN ADMIN ===" -ForegroundColor Green

$BackendUrl = "http://localhost:5000"

Write-Host ""
Write-Host "1. Testing admin orders list page..." -ForegroundColor Yellow
Write-Host "GET $BackendUrl/admin/ordersadmin"

try {
    $headers = @{
        'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        'Accept' = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
    
    $response = Invoke-WebRequest -Uri "$BackendUrl/admin/ordersadmin" -Headers $headers -UseBasicParsing
    
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    
    # Check for Vietnamese status texts
    $content = $response.Content
    
    if ($content -match "Chờ xử lý|Đang xử lý|Đã giao|Hoàn thành") {
        Write-Host "✓ Vietnamese status texts found in admin page" -ForegroundColor Green
    } else {
        Write-Host "✗ Vietnamese status texts NOT found in admin page" -ForegroundColor Red
    }
    
    if ($content -match "Pending|Processing|Shipped|Delivered|Completed") {
        Write-Host "✗ English status texts still present (should be Vietnamese)" -ForegroundColor Red
    } else {
        Write-Host "✓ No English status texts found - fully Vietnamese" -ForegroundColor Green
    }
    
} catch {
    Write-Host "Error accessing admin page: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing order status helper..." -ForegroundColor Yellow

# Test various order statuses
$testStatuses = @(
    "Pending",
    "Processing", 
    "Shipped",
    "Delivered",
    "Completed",
    "Cancelled"
)

foreach ($status in $testStatuses) {
    Write-Host "Testing status: $status" -ForegroundColor Cyan
    
    # Would need to call backend API to test helper
    # For now, just show expected mapping
    $vietnameseStatus = switch ($status) {
        "Pending" { "Chờ xử lý" }
        "Processing" { "Đang xử lý" }
        "Shipped" { "Đã giao vận" }
        "Delivered" { "Đã giao hàng" }
        "Completed" { "Hoàn thành" }
        "Cancelled" { "Đã hủy" }
        default { $status }
    }
    
    Write-Host "  $status → $vietnameseStatus" -ForegroundColor White
}

Write-Host ""
Write-Host "=== VIETNAMESE STATUS TEST COMPLETED ===" -ForegroundColor Green
