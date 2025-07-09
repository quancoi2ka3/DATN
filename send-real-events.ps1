#!/usr/bin/env pwsh

# Script to send real events to Mixpanel and check admin dashboard
Write-Host "🚀 Sending Real Events to Mixpanel..." -ForegroundColor Green

$token = "6a87b4d11fab9c9b8ece4b3d31978893"

# Function to send event
function Send-MixpanelEvent($eventName, $properties) {
    try {
        $eventData = @{
            event = $eventName
            properties = $properties + @{
                token = $token
                time = [int][double]::Parse((Get-Date -UFormat %s))
                distinct_id = "admin-test-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            }
        }
        
        $json = $eventData | ConvertTo-Json -Compress
        $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))
        $url = "https://api.mixpanel.com/track?data=$encoded"
        
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
        
        if ($response.StatusCode -eq 200 -and $response.Content -eq "1") {
            Write-Host "✅ $eventName sent successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $eventName failed: $($response.Content)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error sending $eventName`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Send multiple events for today
Write-Host "📤 Sending Page View events..." -ForegroundColor Cyan
for ($i = 1; $i -le 5; $i++) {
    $success = Send-MixpanelEvent "Page View" @{
        page_name = "Admin Dashboard $i"
        url = "/admin"
        referrer = "https://google.com"
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    Start-Sleep -Milliseconds 200
}

Write-Host "🔍 Sending Search events..." -ForegroundColor Cyan
for ($i = 1; $i -le 3; $i++) {
    $success = Send-MixpanelEvent "Search" @{
        search_term = "test query $i"
        results_count = $(Get-Random -Minimum 1 -Maximum 10)
        user_id = "test-user-$i"
    }
    Start-Sleep -Milliseconds 200
}

Write-Host "👁️ Sending Product View events..." -ForegroundColor Cyan
for ($i = 1; $i -le 2; $i++) {
    $success = Send-MixpanelEvent "Product View" @{
        product_id = $i
        product_name = "Test Product $i"
        product_price = $(Get-Random -Minimum 10 -Maximum 100)
        category = "Electronics"
        user_id = "test-user"
    }
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "✅ Events sent! Waiting 30 seconds for Mixpanel to process..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check admin dashboard
Write-Host "🔍 Checking admin dashboard..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/admin" -UseBasicParsing
    Write-Host "✅ Admin dashboard accessible" -ForegroundColor Green
    
    # Look for specific patterns in the HTML
    if ($response.Content -match "Chưa có dữ liệu") {
        Write-Host "⚠️ Dashboard still shows 'No data available'" -ForegroundColor Yellow
    }
    
    if ($response.Content -match "156.*42") {
        Write-Host "⚠️ Dashboard shows hardcoded values (156, 42)" -ForegroundColor Yellow
    }
    
    # Look for any numbers that might be real data
    if ($response.Content -match ">\s*(\d+)\s*<" -and $matches[1] -notin @("156", "42", "0")) {
        Write-Host "✅ Dashboard might be showing real data: $($matches[1])" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Cannot access admin dashboard: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:5000/admin/mixpaneldebug to see raw Mixpanel data" -ForegroundColor White
Write-Host "2. Open http://localhost:5000/admin to check if dashboard shows real data" -ForegroundColor White
Write-Host "3. Check Mixpanel Live View: https://eu.mixpanel.com/project/3781876/view/4278692/app/events" -ForegroundColor White
Write-Host ""
Write-Host "🏁 Test completed!" -ForegroundColor Green
