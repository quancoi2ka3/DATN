# Test admin dashboard và gửi events mới để kiểm tra logging
Write-Host "🚀 TESTING ADMIN DASHBOARD WITH NEW EVENTS" -ForegroundColor Green

# Đợi backend khởi động
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Gửi một số events mới qua backend proxy
Write-Host "📤 Sending test events through backend proxy..." -ForegroundColor Cyan

$backendUrl = "http://localhost:5000"

# Event 1: Page View
$pageViewEvent = @{
    event = "Page View"
    properties = @{
        distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        page = "/admin/dashboard"
        title = "Admin Dashboard Test"
        url = "http://localhost:5000/admin/dashboard"
        referrer = ""
        timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    }
} | ConvertTo-Json -Depth 10

try {
    $response1 = Invoke-RestMethod -Uri "$backendUrl/api/mixpanel-proxy/track" -Method POST -Body $pageViewEvent -ContentType "application/json"
    Write-Host "✅ Page View event sent successfully: $response1" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to send Page View event: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Event 2: Search
$searchEvent = @{
    event = "Search"
    properties = @{
        distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        query = "fitness equipment"
        results_count = 15
        timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    }
} | ConvertTo-Json -Depth 10

try {
    $response2 = Invoke-RestMethod -Uri "$backendUrl/api/mixpanel-proxy/track" -Method POST -Body $searchEvent -ContentType "application/json"
    Write-Host "✅ Search event sent successfully: $response2" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to send Search event: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Event 3: Product View
$productViewEvent = @{
    event = "Product View"
    properties = @{
        distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        product_id = 123
        product_name = "Treadmill Pro X"
        category = "Cardio Equipment"
        price = 15000000
        timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    }
} | ConvertTo-Json -Depth 10

try {
    $response3 = Invoke-RestMethod -Uri "$backendUrl/api/mixpanel-proxy/track" -Method POST -Body $productViewEvent -ContentType "application/json"
    Write-Host "✅ Product View event sent successfully: $response3" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to send Product View event: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "⏳ Waiting 5 seconds before testing admin dashboard..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test admin dashboard
Write-Host "🔍 Testing admin dashboard to trigger Mixpanel queries..." -ForegroundColor Cyan

try {
    # Test admin dashboard (this should be protected, but we can try)
    $adminResponse = Invoke-WebRequest -Uri "$backendUrl/Admin/AdminDashboard" -Method GET -UseBasicParsing
    Write-Host "✅ Admin dashboard responded with status: $($adminResponse.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
        Write-Host "🔐 Admin dashboard requires authentication (expected)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Admin dashboard error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test debug endpoint if available
try {
    $debugResponse = Invoke-RestMethod -Uri "$backendUrl/api/mixpanel-debug/test-export" -Method GET
    Write-Host "✅ Debug endpoint response: $debugResponse" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Debug endpoint not available or requires auth" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Check backend console/logs for detailed Mixpanel API calls" -ForegroundColor White
Write-Host "2. Login to admin dashboard manually and check the analytics data" -ForegroundColor White
Write-Host "3. Verify that new events appear in Mixpanel dashboard realtime" -ForegroundColor White
Write-Host "4. Check if backend can now retrieve the events we just sent" -ForegroundColor White

Write-Host ""
Write-Host "🔗 Backend should be running at: http://localhost:5000" -ForegroundColor Blue
Write-Host "🔗 Admin login URL: http://localhost:5000/Account/Login" -ForegroundColor Blue
