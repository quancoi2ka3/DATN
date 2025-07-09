# Test sending event directly to Mixpanel and verify
$projectToken = "8e22b9a79446802234818ec75fbf40f0"
$apiSecret = "4039d1ada8948bde4f7cd4f546c42483"

Write-Host "=== TESTING MIXPANEL DIRECT EVENT SENDING ===" -ForegroundColor Green
Write-Host "Project Token: $($projectToken.Substring(0,8))..." -ForegroundColor Yellow

# 1. Send a test event directly to Mixpanel
$testEvent = @{
    event = "Test Event from Script"
    properties = @{
        token = $projectToken
        distinct_id = "test-user-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        time = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
        test_property = "debug-value"
        source = "powershell-debug"
    }
} | ConvertTo-Json -Depth 10

$encodedEvent = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($testEvent))

Write-Host "`n=== Step 1: Sending test event to Mixpanel ===" -ForegroundColor Cyan
$trackUrl = "https://api.mixpanel.com/track?data=$([System.Web.HttpUtility]::UrlEncode($encodedEvent))"

try {
    $trackResponse = Invoke-RestMethod -Uri $trackUrl -Method POST -TimeoutSec 30
    Write-Host "✅ Event sent successfully: $trackResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Error sending event: $($_.Exception.Message)" -ForegroundColor Red
}

# Wait a bit
Write-Host "`n⏳ Waiting 10 seconds before checking..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 2. Check if the event appears in Export API (may take some time)
Write-Host "`n=== Step 2: Checking if event appears in Export API ===" -ForegroundColor Cyan

$authBytes = [System.Text.Encoding]::ASCII.GetBytes("$apiSecret" + ":")
$authString = [System.Convert]::ToBase64String($authBytes)
$headers = @{
    "Authorization" = "Basic $authString"
}

$today = Get-Date -Format "yyyy-MM-dd"
$exportUrl = "https://data.mixpanel.com/api/2.0/export?from_date=$today&to_date=$today"

try {
    $exportResponse = Invoke-RestMethod -Uri $exportUrl -Headers $headers -Method GET -TimeoutSec 30
    
    if ($exportResponse -and $exportResponse -ne "terminated early") {
        Write-Host "✅ Found data in Export API:" -ForegroundColor Green
        Write-Host $exportResponse -ForegroundColor White
        
        $lines = $exportResponse -split "`n" | Where-Object { $_.Trim() -ne "" }
        Write-Host "Number of events in Export API: $($lines.Count)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Export API still returns 'terminated early' - may need more time" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error checking Export API: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Try Events API instead (might be more immediate)
Write-Host "`n=== Step 3: Trying Events API for today's counts ===" -ForegroundColor Cyan
$eventsUrl = "https://data.mixpanel.com/api/2.0/events?event=%5B%22Test%20Event%20from%20Script%22%5D&type=general&unit=day&from_date=-1&to_date=0"

try {
    $eventsResponse = Invoke-RestMethod -Uri $eventsUrl -Headers $headers -Method GET -TimeoutSec 30
    Write-Host "✅ Events API response:" -ForegroundColor Green
    Write-Host ($eventsResponse | ConvertTo-Json -Depth 10) -ForegroundColor White
} catch {
    Write-Host "❌ Error with Events API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== CONCLUSION ===" -ForegroundColor Green
Write-Host "If the event was sent successfully but doesn't appear in Export API immediately," -ForegroundColor Yellow
Write-Host "it may take up to 2 hours for events to be available in Export API." -ForegroundColor Yellow
Write-Host "Check Mixpanel dashboard at https://mixpanel.com to see if events appear in real-time." -ForegroundColor Yellow
