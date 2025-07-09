Write-Host "Creating test events for admin dashboard..."

$backendUrl = "http://localhost:5000"
$headers = @{
    "Content-Type" = "application/json"
}

# Function to send tracking event
function Send-TrackingEvent {
    param(
        [string]$EventName,
        [hashtable]$Properties
    )
    
    $requestData = @{
        eventName = $EventName
        distinctId = "admin-test-user-$(Get-Date -UFormat %s)"
        properties = $Properties
    } | ConvertTo-Json -Depth 3
    
    try {
        Write-Host "Sending $EventName event..."
        $response = Invoke-RestMethod -Uri "$backendUrl/api/MixpanelProxy/track" -Method POST -Headers $headers -Body $requestData
        Write-Host "✅ $EventName tracked: $($response.message)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to track $EventName`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Create multiple Page View events
Write-Host "`n📄 Creating Page View events..."
for ($i = 1; $i -le 5; $i++) {
    $properties = @{
        page_url = "http://localhost:3000/test-page-$i"
        page_title = "Test Page $i"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        source = "admin_dashboard_test"
        user_agent = "AdminDashboardTest/1.0"
    }
    Send-TrackingEvent -EventName "Page View" -Properties $properties
    Start-Sleep -Milliseconds 500
}

# Create multiple Search events  
Write-Host "`n🔍 Creating Search events..."
$searchTerms = @("áo thể thao", "giày chạy bộ", "quần shorts", "phụ kiện gym", "bộ tập yoga")
foreach ($term in $searchTerms) {
    $properties = @{
        search_term = $term
        results_count = Get-Random -Minimum 5 -Maximum 50
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        source = "admin_dashboard_test"
    }
    Send-TrackingEvent -EventName "Search" -Properties $properties
    Start-Sleep -Milliseconds 500
}

# Create some Product View events
Write-Host "`n👕 Creating Product View events..."
for ($i = 1; $i -le 3; $i++) {
    $properties = @{
        product_id = "admin-test-product-$i"
        product_name = "Sản phẩm Test $i"
        product_price = (Get-Random -Minimum 100000 -Maximum 1000000)
        category = "Áo thể thao"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        source = "admin_dashboard_test"
    }
    Send-TrackingEvent -EventName "Product View" -Properties $properties
    Start-Sleep -Milliseconds 500
}

Write-Host "`n✅ Test events created successfully!" -ForegroundColor Green
Write-Host "📊 You can now check the admin dashboard at: http://localhost:5000/Admin/AdminDashboard" -ForegroundColor Cyan
Write-Host "⏰ Note: Mixpanel data may take 1-2 minutes to sync and appear in dashboard" -ForegroundColor Yellow
