# Test Search Analytics Integration for Windows
Write-Host "🔍 Testing Search Analytics Integration" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor White

# Function to send test search event
function Send-SearchEvent {
    param($SearchTerm)
    
    $timestamp = [int][double]::Parse((Get-Date -UFormat %s))
    $distinctId = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    
    Write-Host "📊 Sending search event: '$SearchTerm'" -ForegroundColor Cyan
    
    $body = @{
        event = "Search"
        properties = @{
            distinct_id = $distinctId
            search_term = $SearchTerm
            results_count = Get-Random -Minimum 1 -Maximum 10
            timestamp = $timestamp
            time = $timestamp
            user_agent = "Test/1.0"
            ip = "127.0.0.1"
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/mixpanel/track" `
            -Method POST `
            -Body $body `
            -ContentType "application/json"
        Write-Host "✅ Event sent successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error sending event: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "🚀 Sending test search events..." -ForegroundColor Yellow

# Send several test search events
Send-SearchEvent "áo thun"
Start-Sleep -Seconds 1
Send-SearchEvent "giày thể thao"
Start-Sleep -Seconds 1
Send-SearchEvent "túi xách"
Start-Sleep -Seconds 1
Send-SearchEvent "đồng hồ"
Start-Sleep -Seconds 1
Send-SearchEvent "áo thun" # Duplicate to test counting

Write-Host ""
Write-Host "⏳ Waiting for events to be processed..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📊 Testing search analytics API..." -ForegroundColor Cyan
try {
    $searchData = Invoke-RestMethod -Uri "http://localhost:5000/api/mixpaneldebug/test-search-data" -Method GET
    Write-Host "✅ Search analytics data retrieved successfully" -ForegroundColor Green
    Write-Host "📈 Total events: $($searchData.total_events)" -ForegroundColor White
    Write-Host "🔍 Unique terms: $($searchData.unique_terms)" -ForegroundColor White
    
    if ($searchData.search_analytics.Count -gt 0) {
        Write-Host "📊 Top search terms:" -ForegroundColor White
        $searchData.search_analytics | ForEach-Object {
            Write-Host "  - '$($_.term)': $($_.count) searches" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Error retrieving search analytics: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Testing Search Analytics page..." -ForegroundColor Cyan
Write-Host "Open browser to: http://localhost:5000/Admin/AnalyticsAdmin/SearchAnalytics" -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Test completed!" -ForegroundColor Green
Write-Host "Check the Search Analytics page to see if data is displayed correctly." -ForegroundColor White
