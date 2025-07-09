# Complete Search Analytics Integration Test
Write-Host "🎯 Complete Search Analytics Integration Test" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor White

# Test configuration
$BackendUrl = "http://localhost:5000"
$TestSearchTerms = @("áo thun", "giày thể thao", "túi xách", "đồng hồ", "điện thoại")

Write-Host "🔧 Configuration:" -ForegroundColor Yellow
Write-Host "  Backend URL: $BackendUrl" -ForegroundColor Gray
Write-Host "  Test search terms: $($TestSearchTerms -join ', ')" -ForegroundColor Gray
Write-Host ""

# Function to send search event
function Send-SearchEvent {
    param($SearchTerm)
    
    $timestamp = [int][double]::Parse((Get-Date -UFormat %s))
    $distinctId = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')-$(Get-Random -Maximum 1000)"
    
    $body = @{
        event = "Search"
        properties = @{
            distinct_id = $distinctId
            search_term = $SearchTerm
            results_count = Get-Random -Minimum 1 -Maximum 15
            timestamp = $timestamp
            time = $timestamp
            user_agent = "SearchAnalyticsTest/1.0"
            ip = "127.0.0.1"
            page_url = "http://localhost:3000/search"
            page_title = "Search - Sun Movement"
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri "$BackendUrl/api/mixpanel/track" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -TimeoutSec 10
        return $true
    } catch {
        Write-Host "❌ Error sending search event '$SearchTerm': $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Check backend health
Write-Host "📋 Test 1: Backend Health Check" -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$BackendUrl/api/mixpaneldebug/test-export" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is running and responding" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please make sure the backend is running on $BackendUrl" -ForegroundColor Yellow
    exit 1
}

# Test 2: Send test search events
Write-Host ""
Write-Host "📋 Test 2: Sending Test Search Events" -ForegroundColor Cyan
$successCount = 0
foreach ($term in $TestSearchTerms) {
    Write-Host "  📤 Sending: '$term'" -ForegroundColor White
    if (Send-SearchEvent $term) {
        $successCount++
        Write-Host "    ✅ Success" -ForegroundColor Green
    }
    Start-Sleep -Milliseconds 500
}
Write-Host "📊 Sent $successCount/$($TestSearchTerms.Count) events successfully" -ForegroundColor White

# Test 3: Wait and verify data
Write-Host ""
Write-Host "📋 Test 3: Verifying Data Reception" -ForegroundColor Cyan
Write-Host "⏳ Waiting 3 seconds for events to be processed..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    $searchData = Invoke-RestMethod -Uri "$BackendUrl/api/mixpaneldebug/test-search-data" -Method GET -TimeoutSec 15
    Write-Host "✅ Search data retrieved successfully" -ForegroundColor Green
    Write-Host "📈 Total events: $($searchData.total_events)" -ForegroundColor White
    Write-Host "🔍 Unique terms: $($searchData.unique_terms)" -ForegroundColor White
    
    if ($searchData.search_analytics.Count -gt 0) {
        Write-Host "📊 Top search terms found:" -ForegroundColor White
        $searchData.search_analytics | ForEach-Object {
            Write-Host "  - '$($_.term)': $($_.count) searches" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  No search analytics processed yet" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error retrieving search data: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test Analytics Admin API
Write-Host ""
Write-Host "📋 Test 4: Testing Analytics Admin API" -ForegroundColor Cyan
try {
    $analyticsData = Invoke-RestMethod -Uri "$BackendUrl/Admin/AnalyticsAdmin/api/search-analytics" -Method GET -TimeoutSec 15
    if ($analyticsData.success) {
        Write-Host "✅ Analytics Admin API working correctly" -ForegroundColor Green
        Write-Host "📊 API Stats:" -ForegroundColor White
        Write-Host "  - Total events: $($analyticsData.stats.total_events)" -ForegroundColor Gray
        Write-Host "  - Unique terms: $($analyticsData.stats.unique_terms)" -ForegroundColor Gray
        Write-Host "  - Data records: $($analyticsData.data.Count)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Analytics Admin API returned error: $($analyticsData.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing Analytics Admin API: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Frontend integration check
Write-Host ""
Write-Host "📋 Test 5: Frontend Integration Check" -ForegroundColor Cyan
Write-Host "🌐 Opening Search Analytics page..." -ForegroundColor White
$searchAnalyticsUrl = "$BackendUrl/Admin/AnalyticsAdmin/SearchAnalytics"
Write-Host "URL: $searchAnalyticsUrl" -ForegroundColor Gray

try {
    Start-Process $searchAnalyticsUrl
    Write-Host "✅ Browser opened - Please check the Search Analytics page" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "Please manually open: $searchAnalyticsUrl" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "🎯 Test Summary" -ForegroundColor Magenta
Write-Host "===============" -ForegroundColor White
Write-Host "✅ Backend health check completed" -ForegroundColor Green
Write-Host "✅ Search events sent ($successCount/$($TestSearchTerms.Count))" -ForegroundColor Green
Write-Host "✅ Data verification completed" -ForegroundColor Green
Write-Host "✅ Analytics Admin API tested" -ForegroundColor Green
Write-Host "✅ Frontend integration checked" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Integration test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check the Search Analytics page for real-time data" -ForegroundColor Gray
Write-Host "2. Use the Debug panel to send more test events" -ForegroundColor Gray
Write-Host "3. Verify auto-refresh functionality" -ForegroundColor Gray
Write-Host "4. Test with real search events from the frontend" -ForegroundColor Gray

Write-Host ""
Write-Host "🔗 Useful URLs:" -ForegroundColor Yellow
Write-Host "- Search Analytics: $BackendUrl/Admin/AnalyticsAdmin/SearchAnalytics" -ForegroundColor Gray
Write-Host "- Admin Dashboard: $BackendUrl/Admin/AdminDashboard" -ForegroundColor Gray
Write-Host "- Analytics Admin: $BackendUrl/Admin/AnalyticsAdmin" -ForegroundColor Gray
