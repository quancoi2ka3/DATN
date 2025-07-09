# Test admin dashboard analytics
Write-Host "🎯 Testing Admin Dashboard Analytics..." -ForegroundColor Green

# Try different ports
$ports = @(5001, 5000, 7195, 44330)
$baseUrl = $null

foreach ($port in $ports) {
    $testUrl = "http://localhost:$port"
    Write-Host "🔍 Trying port $port..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$testUrl" -Method GET -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Found backend on port $port" -ForegroundColor Green
            $baseUrl = $testUrl
            break
        }
    } catch {
        Write-Host "❌ Port $port not available" -ForegroundColor Red
    }
}

if (-not $baseUrl) {
    Write-Host "❌ Backend server not found on any port. Please start the backend." -ForegroundColor Red
    Write-Host "Try: cd sun-movement-backend\SunMovement.Web && dotnet run" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📊 Testing admin dashboard at: $baseUrl/Admin/AdminDashboard" -ForegroundColor Cyan

# Send a few events first
Write-Host "`n1️⃣ Sending fresh events..." -ForegroundColor Yellow

$headers = @{ 'Content-Type' = 'application/json' }

for ($i = 1; $i -le 3; $i++) {
    $eventData = @{
        EventName = "Page View"
        DistinctId = "test-user-$i"
        Properties = @{
            page_url = "http://localhost:3000/page-$i"
            page_title = "Test Page $i - $(Get-Date -Format 'HH:mm:ss')"
            timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            test_batch = "admin-test"
        }
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-WebRequest -Uri "$baseUrl/api/mixpanelproxy/track" -Method POST -Body $eventData -Headers $headers -TimeoutSec 10 | Out-Null
        Write-Host "✅ Sent Page View $i" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to send Page View $i`: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
}

# Send search events
for ($i = 1; $i -le 2; $i++) {
    $searchData = @{
        EventName = "Search"
        DistinctId = "test-user-search-$i"
        Properties = @{
            search_term = "admin test search $i"
            results_count = $i * 2
            timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            test_batch = "admin-test"
        }
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-WebRequest -Uri "$baseUrl/api/mixpanelproxy/track" -Method POST -Body $searchData -Headers $headers -TimeoutSec 10 | Out-Null
        Write-Host "✅ Sent Search $i" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to send Search $i`: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
}

Write-Host "`n2️⃣ Waiting for events to be processed..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`n3️⃣ Triggering admin dashboard load..." -ForegroundColor Yellow
try {
    # Access admin dashboard - this will trigger the analytics loading and logging
    $adminResponse = Invoke-WebRequest -Uri "$baseUrl/Admin/AdminDashboard" -Method GET -TimeoutSec 30
    
    if ($adminResponse.StatusCode -eq 200) {
        Write-Host "✅ Admin dashboard loaded successfully!" -ForegroundColor Green
        Write-Host "📝 Check the backend console/logs for detailed analytics processing" -ForegroundColor Cyan
        Write-Host "🔍 Look for emojis like 🔍, 📊, ✅, ⚠️ in the logs" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Admin dashboard returned status: $($adminResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error loading admin dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4️⃣ Testing Export API directly..." -ForegroundColor Yellow
try {
    $exportResponse = Invoke-WebRequest -Uri "$baseUrl/api/mixpaneldebug/test-recent-events" -Method GET -TimeoutSec 15
    if ($exportResponse.StatusCode -eq 200) {
        $exportData = $exportResponse.Content | ConvertFrom-Json
        Write-Host "📊 Export API Results:" -ForegroundColor Cyan
        Write-Host "   Page Views: $($exportData.Summary.TotalPageViews)" -ForegroundColor White
        Write-Host "   Searches: $($exportData.Summary.TotalSearches)" -ForegroundColor White
        Write-Host "   Has Data: $($exportData.Summary.HasData)" -ForegroundColor White
        Write-Host "   Message: $($exportData.Summary.Message)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error testing Export API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Summary:" -ForegroundColor Green
Write-Host "1. Events sent to Mixpanel via backend proxy" -ForegroundColor White
Write-Host "2. Admin dashboard triggered (check backend logs)" -ForegroundColor White
Write-Host "3. Export API tested" -ForegroundColor White

Write-Host "`n🔍 To verify:" -ForegroundColor Yellow
Write-Host "1. Check backend console for analytics processing logs" -ForegroundColor White
Write-Host "2. Open admin dashboard in browser: $baseUrl/Admin/AdminDashboard" -ForegroundColor White
Write-Host "3. Check Mixpanel Live View for realtime events" -ForegroundColor White
Write-Host "4. Wait 15-30 minutes for Export API data if still showing 0" -ForegroundColor White

Write-Host "`n⏰ Test completed at: $(Get-Date)" -ForegroundColor Gray
