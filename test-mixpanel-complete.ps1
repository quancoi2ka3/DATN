#!/usr/bin/env pwsh

# Complete Mixpanel Integration Test Script
param(
    [switch]$SendTestEvents,
    [switch]$CheckBackend,
    [switch]$FullTest
)

Write-Host "🧪 Complete Mixpanel Integration Test" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Function to send test events
function Send-TestEvents {
    Write-Host "📤 Sending Test Events to Mixpanel..." -ForegroundColor Cyan
    
    $token = "6a87b4d11fab9c9b8ece4b3d31978893" # Your actual token
    $baseUrl = "https://api.mixpanel.com/track"
    
    $events = @(
        @{
            event = "Page View"
            properties = @{
                token = $token
                page_name = "Test Page"
                url = "http://localhost:3000/test"
                referrer = ""
                timestamp = Get-Date
                time = [int][double]::Parse((Get-Date -UFormat %s))
                distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            }
        },
        @{
            event = "Search"
            properties = @{
                token = $token
                search_term = "test search query"
                results_count = 5
                user_id = "test-user"
                timestamp = Get-Date
                time = [int][double]::Parse((Get-Date -UFormat %s))
                distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            }
        },
        @{
            event = "Product View"
            properties = @{
                token = $token
                product_id = 1
                product_name = "Test Product"
                product_price = 99.99
                category = "Electronics"
                user_id = "test-user"
                timestamp = Get-Date
                time = [int][double]::Parse((Get-Date -UFormat %s))
                distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            }
        }
    )
    
    foreach ($event in $events) {
        try {
            $json = $event | ConvertTo-Json -Compress
            $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json))
            $url = "$baseUrl" + "?data=" + $encoded
            
            $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
            
            if ($response.StatusCode -eq 200 -and $response.Content -eq "1") {
                Write-Host "✅ $($event.event) event sent successfully" -ForegroundColor Green
            } else {
                Write-Host "❌ $($event.event) event failed: $($response.Content)" -ForegroundColor Red
            }
            
            Start-Sleep -Milliseconds 500 # Small delay between events
        } catch {
            Write-Host "❌ Error sending $($event.event): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "✅ Test events sent. Wait 2-3 minutes for Mixpanel to process..." -ForegroundColor Yellow
}

# Function to check backend dashboard
function Check-BackendDashboard {
    Write-Host "🔍 Checking Backend Dashboard..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/admin" -UseBasicParsing
        Write-Host "✅ Backend dashboard accessible" -ForegroundColor Green
        
        # Check if the response contains tracking data
        if ($response.Content -match "Chưa có dữ liệu|Cần tích hợp Mixpanel") {
            Write-Host "⚠️  Dashboard shows 'No data' - Mixpanel data not yet available" -ForegroundColor Yellow
        } elseif ($response.Content -match "\d+ Lượt Xem|\d+ Lượt Tìm Kiếm") {
            Write-Host "✅ Dashboard shows tracking data!" -ForegroundColor Green
        } else {
            Write-Host "❓ Unable to determine dashboard data status" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ Cannot access backend dashboard: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to test Mixpanel API directly
function Test-MixpanelAPI {
    Write-Host "🌐 Testing Mixpanel API..." -ForegroundColor Cyan
    
    try {
        $apiSecret = "4039d1adebb3488bfaa693af7e7d5b50" # Your API secret
        $today = Get-Date -Format "yyyy-MM-dd"
        $yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
        
        $authValue = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$apiSecret" + ":"))
        $headers = @{
            'Authorization' = "Basic $authValue"
            'Accept' = 'application/json'
        }
        
        # Test events API
        $url = "https://api.mixpanel.com/api/2.0/events?from_date=$yesterday&to_date=$today&event=" + [Uri]::EscapeDataString("Page View")
        $response = Invoke-RestMethod -Uri $url -Headers $headers -TimeoutSec 30
        
        Write-Host "✅ Mixpanel API accessible" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
        
    } catch {
        Write-Host "❌ Mixpanel API test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution based on parameters
if ($SendTestEvents -or $FullTest) {
    Send-TestEvents
    Write-Host ""
}

if ($CheckBackend -or $FullTest) {
    Check-BackendDashboard
    Write-Host ""
}

if ($FullTest) {
    Test-MixpanelAPI
    Write-Host ""
}

# Default: Show instructions
if (-not $SendTestEvents -and -not $CheckBackend -and -not $FullTest) {
    Write-Host "📋 Usage Instructions:" -ForegroundColor Yellow
    Write-Host "  -SendTestEvents   Send test events to Mixpanel" -ForegroundColor White
    Write-Host "  -CheckBackend     Check backend dashboard status" -ForegroundColor White
    Write-Host "  -FullTest         Run complete test suite" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\test-mixpanel-complete.ps1 -SendTestEvents" -ForegroundColor White
    Write-Host "  .\test-mixpanel-complete.ps1 -CheckBackend" -ForegroundColor White
    Write-Host "  .\test-mixpanel-complete.ps1 -FullTest" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Quick Links:" -ForegroundColor Yellow
    Write-Host "  Frontend Debug: http://localhost:3000/debug-analytics" -ForegroundColor White
    Write-Host "  Backend Test:   http://localhost:5000/Admin/MixpanelTest" -ForegroundColor White
    Write-Host "  Admin Dashboard: http://localhost:5000/admin" -ForegroundColor White
    Write-Host "  Mixpanel Live:  https://mixpanel.com/report/2784062/live" -ForegroundColor White
}

Write-Host ""
Write-Host "🏁 Test completed!" -ForegroundColor Green
