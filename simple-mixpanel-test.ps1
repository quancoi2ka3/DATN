# Simple test script for Mixpanel integration
Write-Host "🧪 Testing Mixpanel Integration on port 5001..." -ForegroundColor Green

$baseUrl = "http://localhost:5001"

# Test 1: Check if backend is running
Write-Host "`n1️⃣ Testing backend availability..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/mixpaneldebug/test-recent-events" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running on port 5001" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "📊 Page Views: $($data.Summary.TotalPageViews)" -ForegroundColor Cyan
        Write-Host "🔍 Searches: $($data.Summary.TotalSearches)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Backend not available on port 5001: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try port 5000
    Write-Host "🔄 Trying port 5000..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/mixpaneldebug/test-recent-events" -Method GET -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is running on port 5000" -ForegroundColor Green
            $baseUrl = "http://localhost:5000"
            $data = $response.Content | ConvertFrom-Json
            Write-Host "📊 Page Views: $($data.Summary.TotalPageViews)" -ForegroundColor Cyan
            Write-Host "🔍 Searches: $($data.Summary.TotalSearches)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "❌ Backend not available on port 5000 either: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please start the backend server first" -ForegroundColor Yellow
        exit 1
    }
}

# Test 2: Send test events
Write-Host "`n2️⃣ Sending test events..." -ForegroundColor Yellow

$headers = @{
    'Content-Type' = 'application/json'
}

# Page View event
$pageViewBody = @{
    event = "Page View"
    properties = @{
        page_url = "http://localhost:3000/test-script"
        page_title = "Test Page - Script $(Get-Date -Format 'HH:mm:ss')"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        test_source = "script"
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/mixpanel/track" -Method POST -Body $pageViewBody -Headers $headers -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Page View event sent" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to send Page View: $($_.Exception.Message)" -ForegroundColor Red
}

# Search event
$searchBody = @{
    event = "Search"
    properties = @{
        search_term = "test script search"
        results_count = 3
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        test_source = "script"
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/mixpanel/track" -Method POST -Body $searchBody -Headers $headers -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Search event sent" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Failed to send Search: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Wait and check Export API again
Write-Host "`n3️⃣ Checking Export API again..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/mixpaneldebug/test-recent-events" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "📊 After sending events - Page Views: $($data.Summary.TotalPageViews)" -ForegroundColor Cyan
        Write-Host "🔍 After sending events - Searches: $($data.Summary.TotalSearches)" -ForegroundColor Cyan
        Write-Host "💡 $($data.Summary.Message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to check Export API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Test completed! Check backend logs for detailed analytics processing." -ForegroundColor Green
Write-Host "⏰ Time: $(Get-Date)" -ForegroundColor Gray
