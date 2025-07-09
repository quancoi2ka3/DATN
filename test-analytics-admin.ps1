# Test Analytics Admin Search Data
Write-Host "🔍 Testing Analytics Admin Search Data" -ForegroundColor Green

# Start backend if not running
Write-Host "📦 Starting backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\DATN\DATN\sun-movement-backend'; dotnet run --project SunMovement.Web"
Start-Sleep -Seconds 10

# Test search analytics page
Write-Host "🌐 Testing Search Analytics page..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/Admin/AnalyticsAdmin/SearchAnalytics" -Method GET
    Write-Host "✅ Search Analytics page loaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error loading Search Analytics page: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Mixpanel data retrieval
Write-Host "📊 Testing Mixpanel data retrieval..." -ForegroundColor Cyan
try {
    $mixpanelTest = Invoke-RestMethod -Uri "http://localhost:5000/api/mixpanel/test-search-data" -Method GET
    Write-Host "✅ Mixpanel search data test successful" -ForegroundColor Green
    Write-Host "📈 Data: $($mixpanelTest | ConvertTo-Json -Depth 2)" -ForegroundColor White
} catch {
    Write-Host "❌ Error testing Mixpanel data: $($_.Exception.Message)" -ForegroundColor Red
}

# Send test search event
Write-Host "🔍 Sending test search event..." -ForegroundColor Cyan
$searchEventData = @{
    event = "Search"
    properties = @{
        distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        search_term = "test-product-$(Get-Date -Format 'HHmmss')"
        results_count = 5
        user_agent = "Test/1.0"
        ip = "127.0.0.1"
        time = [int][double]::Parse((Get-Date -UFormat %s))
    }
}

try {
    $searchResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/mixpanel/track" -Method POST -Body ($searchEventData | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "✅ Test search event sent successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error sending test search event: $($_.Exception.Message)" -ForegroundColor Red
}

# Wait and check for the event
Write-Host "⏳ Waiting for event to be processed..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check recent events
Write-Host "📋 Checking recent events..." -ForegroundColor Cyan
try {
    $recentEvents = Invoke-RestMethod -Uri "http://localhost:5000/api/mixpanel/recent-events" -Method GET
    Write-Host "✅ Recent events retrieved successfully" -ForegroundColor Green
    Write-Host "📊 Recent events: $($recentEvents | ConvertTo-Json -Depth 2)" -ForegroundColor White
} catch {
    Write-Host "❌ Error retrieving recent events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 Analytics Admin test completed!" -ForegroundColor Magenta
Write-Host "🌐 Open browser to: http://localhost:5000/Admin/AnalyticsAdmin/SearchAnalytics" -ForegroundColor Yellow
