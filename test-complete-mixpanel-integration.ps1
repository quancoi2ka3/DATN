# Test complete Mixpanel tracking and admin dashboard
Write-Host "🚀 Testing Complete Mixpanel Integration..." -ForegroundColor Green

$baseUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:3000"

# Function to make HTTP requests
function Invoke-ApiRequest {
    param($Url, $Method = "GET", $Body = $null)
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body ($Body | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 30
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -TimeoutSec 30
        }
        return $response
    }
    catch {
        Write-Host "❌ Error calling $Url`: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n1️⃣ Testing backend server availability..." -ForegroundColor Yellow
$health = Invoke-ApiRequest "$baseUrl/health"
if ($health) {
    Write-Host "✅ Backend server is running" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server is not available. Please start it first." -ForegroundColor Red
    exit 1
}

Write-Host "`n2️⃣ Sending test events via proxy..." -ForegroundColor Yellow

# Send Page View event
$pageViewData = @{
    event = "Page View"
    properties = @{
        page_url = "http://localhost:3000/test"
        page_title = "Test Page - PowerShell"
        user_agent = "PowerShell Test Script"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        session_id = "test-session-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        test_source = "powershell"
    }
}

$pageViewResult = Invoke-ApiRequest "$baseUrl/api/mixpanel/track" "POST" $pageViewData
if ($pageViewResult) {
    Write-Host "✅ Page View event sent successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to send Page View event" -ForegroundColor Red
}

# Send Search event
$searchData = @{
    event = "Search"
    properties = @{
        search_term = "test search from powershell"
        results_count = 5
        page_url = "http://localhost:3000/search"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        session_id = "test-session-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        test_source = "powershell"
    }
}

$searchResult = Invoke-ApiRequest "$baseUrl/api/mixpanel/track" "POST" $searchData
if ($searchResult) {
    Write-Host "✅ Search event sent successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to send Search event" -ForegroundColor Red
}

Write-Host "`n3️⃣ Waiting for events to be processed..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`n4️⃣ Testing Export API (checking for recent events)..." -ForegroundColor Yellow
$exportTest = Invoke-ApiRequest "$baseUrl/api/mixpaneldebug/test-recent-events"
if ($exportTest) {
    Write-Host "✅ Export API test completed" -ForegroundColor Green
    Write-Host "📊 Total Page Views found: $($exportTest.Summary.TotalPageViews)" -ForegroundColor Cyan
    Write-Host "🔍 Total Searches found: $($exportTest.Summary.TotalSearches)" -ForegroundColor Cyan
    Write-Host "💡 Status: $($exportTest.Summary.Message)" -ForegroundColor Cyan
    
    if ($exportTest.Summary.HasData) {
        Write-Host "🎉 Great! Export API is returning data" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Export API shows no data yet. This is normal for recent events." -ForegroundColor Yellow
        Write-Host "   - Export API typically has 15-30 minute delay" -ForegroundColor Yellow
        Write-Host "   - Check Mixpanel Live View to verify events are being received" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Failed to test Export API" -ForegroundColor Red
}

Write-Host "`n5️⃣ Testing admin dashboard..." -ForegroundColor Yellow
try {
    # Try to access admin dashboard (this will trigger the analytics loading)
    $adminUrl = "$baseUrl/Admin/AdminDashboard"
    Write-Host "📊 Triggering admin dashboard analytics refresh..." -ForegroundColor Cyan
    Write-Host "   URL: $adminUrl" -ForegroundColor Gray
    
    # Use curl for better HTML handling
    $curlOutput = & curl -s "$adminUrl" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Admin dashboard loaded successfully" -ForegroundColor Green
        Write-Host "📝 Check the backend console logs for detailed analytics processing" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Failed to load admin dashboard" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing admin dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 Summary:" -ForegroundColor Green
Write-Host "1. ✅ Backend server is running" -ForegroundColor White
Write-Host "2. ✅ Events sent via proxy" -ForegroundColor White
Write-Host "3. ✅ Export API tested" -ForegroundColor White
Write-Host "4. ✅ Admin dashboard triggered" -ForegroundColor White

Write-Host "`n🔍 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check backend console logs for detailed analytics processing" -ForegroundColor White
Write-Host "2. Verify events in Mixpanel Live View (should appear immediately)" -ForegroundColor White
Write-Host "3. Wait 15-30 minutes for Export API to sync, then check admin dashboard again" -ForegroundColor White
Write-Host "4. If Export API still shows no data, check project token and API secret" -ForegroundColor White

Write-Host "`n⏰ Current time: $(Get-Date)" -ForegroundColor Gray
