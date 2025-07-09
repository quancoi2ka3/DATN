# Test gửi events thực tế qua backend proxy với format đúng
$backendUrl = "http://localhost:5000"
$endpoint = "$backendUrl/api/MixpanelProxy/track"

Write-Host "🧪 Testing real Mixpanel events via backend proxy..." -ForegroundColor Yellow
Write-Host "📡 Backend URL: $backendUrl" -ForegroundColor Cyan

# Test 1: Page View event
$pageViewEvent = @{
    eventName = "Page View"
    distinctId = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    properties = @{
        page_name = "Home Page"
        page_url = "http://localhost:3000/"
        page_title = "Sun Movement - Trang chủ"
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0"
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        session_id = "session-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        referrer = "direct"
        user_id = "test-user-$(Get-Random -Maximum 1000)"
    }
} | ConvertTo-Json -Depth 5

Write-Host "🔄 Sending Page View event..." -ForegroundColor Blue
try {
    $response1 = Invoke-RestMethod -Uri $endpoint -Method POST -Body $pageViewEvent -ContentType "application/json"
    Write-Host "✅ Page View event sent successfully!" -ForegroundColor Green
    Write-Host "Response: $($response1 | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to send Page View event: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Test 2: Search event
$searchEvent = @{
    eventName = "Search"
    distinctId = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    properties = @{
        search_term = "áo khoác mùa đông"
        results_count = 15
        page_url = "http://localhost:3000/search"
        page_title = "Tìm kiếm - Sun Movement"
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0"
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        session_id = "session-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        referrer = "http://localhost:3000/"
        user_id = "test-user-$(Get-Random -Maximum 1000)"
    }
} | ConvertTo-Json -Depth 5

Write-Host "🔄 Sending Search event..." -ForegroundColor Blue
try {
    $response2 = Invoke-RestMethod -Uri $endpoint -Method POST -Body $searchEvent -ContentType "application/json"
    Write-Host "✅ Search event sent successfully!" -ForegroundColor Green
    Write-Host "Response: $($response2 | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to send Search event: $($_.Exception.Message)" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Test 3: Product View event
$productViewEvent = @{
    eventName = "Product View"
    distinctId = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    properties = @{
        product_id = "123"
        product_name = "Áo khoác mùa đông cao cấp"
        product_price = 599000
        category = "Thời trang"
        page_url = "http://localhost:3000/product/123"
        page_title = "Áo khoác mùa đông cao cấp - Sun Movement"
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0"
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        session_id = "session-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        referrer = "http://localhost:3000/search"
        user_id = "test-user-$(Get-Random -Maximum 1000)"
    }
} | ConvertTo-Json -Depth 5

Write-Host "🔄 Sending Product View event..." -ForegroundColor Blue
try {
    $response3 = Invoke-RestMethod -Uri $endpoint -Method POST -Body $productViewEvent -ContentType "application/json"
    Write-Host "✅ Product View event sent successfully!" -ForegroundColor Green
    Write-Host "Response: $($response3 | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to send Product View event: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 All test events sent! Check Mixpanel dashboard in 1-2 minutes for data sync." -ForegroundColor Yellow
Write-Host "📊 Mixpanel URL: https://eu.mixpanel.com/project/3781876/view/4278692/app/events" -ForegroundColor Cyan
Write-Host "🖥️ Admin dashboard: http://localhost:5000/admin" -ForegroundColor Cyan

# Test backend debug endpoint after sending events
Write-Host ""
Write-Host "🔍 Testing backend analytics after event sending..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    $debugResponse = Invoke-RestMethod -Uri "$backendUrl/api/MixpanelDebug/test-today" -Method GET
    Write-Host "Backend analytics response:" -ForegroundColor Gray
    Write-Host ($debugResponse | ConvertTo-Json -Depth 3) -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to get analytics from backend: $($_.Exception.Message)" -ForegroundColor Red
}
