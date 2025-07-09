#!/usr/bin/env pwsh

# Script để test kết nối Mixpanel API trực tiếp
param(
    [string]$ProjectToken,
    [string]$ApiSecret
)

Write-Host "🔗 Testing Mixpanel API Connection" -ForegroundColor Green
Write-Host ""

# Read configuration if not provided
if (-not $ProjectToken -or -not $ApiSecret) {
    Write-Host "Reading configuration from appsettings.json..." -ForegroundColor Yellow
    $appsettingsPath = "d:\DATN\DATN\sun-movement-backend\SunMovement.Web\appsettings.json"
    if (Test-Path $appsettingsPath) {
        $appsettings = Get-Content $appsettingsPath | ConvertFrom-Json
        $ProjectToken = $appsettings.Mixpanel.ProjectToken
        $ApiSecret = $appsettings.Mixpanel.ApiSecret
    } else {
        Write-Host "❌ appsettings.json not found and no parameters provided" -ForegroundColor Red
        return
    }
}

if (-not $ProjectToken -or -not $ApiSecret) {
    Write-Host "❌ Missing ProjectToken or ApiSecret" -ForegroundColor Red
    Write-Host "Usage: .\test-mixpanel-api.ps1 -ProjectToken 'your_token' -ApiSecret 'your_secret'" -ForegroundColor Yellow
    return
}

Write-Host "Project Token: $($ProjectToken.Substring(0, 8))..." -ForegroundColor Yellow
Write-Host "API Secret: $($ApiSecret.Substring(0, 8))..." -ForegroundColor Yellow
Write-Host ""

# Test 1: Test Events API (recent events)
Write-Host "1. Testing Events API..." -ForegroundColor Cyan
try {
    $today = Get-Date -Format "yyyy-MM-dd"
    $yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
    
    # Create authorization header
    $authValue = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$ApiSecret" + ":"))
    $headers = @{
        'Authorization' = "Basic $authValue"
        'Accept' = 'application/json'
    }
    
    $url = "https://api.mixpanel.com/api/2.0/events?from_date=$yesterday&to_date=$today&event=[%22Page%20View%22]"
    Write-Host "URL: $url" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $url -Headers $headers -TimeoutSec 30
    Write-Host "✅ Events API working" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Events API failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 2: Test Export API (event data)
Write-Host "2. Testing Export API..." -ForegroundColor Cyan
try {
    $url = "https://api.mixpanel.com/api/2.0/export?from_date=$yesterday&to_date=$today&event=[%22Search%22]"
    Write-Host "URL: $url" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $url -Headers $headers -TimeoutSec 30
    Write-Host "✅ Export API working" -ForegroundColor Green
    
    # Count lines (each line is an event)
    $lines = $response -split "`n" | Where-Object { $_.Trim() -ne "" }
    Write-Host "Events found: $($lines.Count)" -ForegroundColor Gray
    
    if ($lines.Count -gt 0) {
        Write-Host "Sample event: $($lines[0])" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Export API failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Test basic connectivity
Write-Host "3. Testing Basic Connectivity..." -ForegroundColor Cyan
try {
    $url = "https://api.mixpanel.com"
    $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Can reach Mixpanel API (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot reach Mixpanel API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Generate test event
Write-Host "4. Generating Test Event..." -ForegroundColor Cyan
try {
    $testEvent = @{
        event = "Backend Test Event"
        properties = @{
            token = $ProjectToken
            time = [int][double]::Parse((Get-Date -UFormat %s))
            distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            test = $true
            source = "PowerShell Test Script"
        }
    } | ConvertTo-Json -Compress
    
    $encodedEvent = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($testEvent))
    $url = "https://api.mixpanel.com/track?data=$encodedEvent"
    
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -UseBasicParsing
    
    if ($response.StatusCode -eq 200 -and $response.Content -eq "1") {
        Write-Host "✅ Test event sent successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Test event failed: $($response.Content)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed to send test event: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Green
Write-Host "- Check Mixpanel Live View: https://mixpanel.com/report/$ProjectToken/live" -ForegroundColor Yellow
Write-Host "- Events should appear within a few minutes" -ForegroundColor Yellow
Write-Host "- If tests pass but no data in admin, check event name matching" -ForegroundColor Yellow
Write-Host ""
