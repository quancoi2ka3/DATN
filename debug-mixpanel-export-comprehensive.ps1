# Debug Mixpanel Export API Comprehensive Test
# Updated with correct credentials

$projectToken = "8e22b9a79446802234818ec75fbf40f0"
$apiSecret = "4039d1ada8948bde4f7cd4f546c42483"

Write-Host "🔍 MIXPANEL EXPORT API COMPREHENSIVE DEBUG TEST" -ForegroundColor Green
Write-Host "Project Token: $projectToken" -ForegroundColor Yellow
Write-Host "API Secret: $($apiSecret.Substring(0,8))..." -ForegroundColor Yellow
Write-Host ""

# Create credentials for Basic Auth
$credentials = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($apiSecret):"))

function Test-MixpanelExport {
    param(
        [string]$eventName,
        [string]$fromDate,
        [string]$toDate,
        [string]$description
    )
    
    Write-Host "📊 Testing: $description" -ForegroundColor Cyan
    Write-Host "   Event: $eventName | Date: $fromDate to $toDate"
    
    $url = "https://data.mixpanel.com/api/2.0/export/?event=%5B%22$([System.Web.HttpUtility]::UrlEncode($eventName))%22%5D&from_date=$fromDate&to_date=$toDate"
    
    try {
        $headers = @{
            "Authorization" = "Basic $credentials"
            "Accept" = "text/plain"
        }
        
        Write-Host "   URL: $url" -ForegroundColor Gray
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method GET -TimeoutSec 30
        
        if ($response -eq "terminated early") {
            Write-Host "   ❌ Result: TERMINATED EARLY (no data)" -ForegroundColor Red
            return 0
        }
        
        # Count lines (each line is an event)
        $lines = ($response -split "`n" | Where-Object { $_.Trim() -ne "" }).Count
        Write-Host "   ✅ Result: $lines events found" -ForegroundColor Green
        
        if ($lines -le 3) {
            Write-Host "   📝 Sample data:" -ForegroundColor Gray
            ($response -split "`n" | Select-Object -First 3) | ForEach-Object {
                if ($_.Trim() -ne "") {
                    Write-Host "      $_" -ForegroundColor DarkGray
                }
            }
        }
        
        return $lines
    }
    catch {
        Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return -1
    }
    
    Write-Host ""
}

# Test with various date ranges and event names
Write-Host "=== TESTING DIFFERENT DATE RANGES ===" -ForegroundColor Yellow

$today = Get-Date -Format "yyyy-MM-dd"
$yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")
$twoDaysAgo = (Get-Date).AddDays(-2).ToString("yyyy-MM-dd")
$oneWeekAgo = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")

# Test common event names that might exist
$eventTests = @(
    @{ Event = "Page View"; Description = "Page View events (most common)" },
    @{ Event = "Search"; Description = "Search events" },
    @{ Event = "Product View"; Description = "Product View events" },
    @{ Event = "pageview"; Description = "Alternative pageview format" },
    @{ Event = "page_view"; Description = "Underscore pageview format" }
)

$dateTests = @(
    @{ From = $today; To = $today; Description = "Today only" },
    @{ From = $yesterday; To = $yesterday; Description = "Yesterday only" },
    @{ From = $twoDaysAgo; To = $twoDaysAgo; Description = "Two days ago" },
    @{ From = $oneWeekAgo; To = $today; Description = "Last week to today" }
)

$totalEvents = 0

foreach ($eventTest in $eventTests) {
    Write-Host ""
    Write-Host "--- TESTING EVENT: $($eventTest.Event) ---" -ForegroundColor Magenta
    
    foreach ($dateTest in $dateTests) {
        $events = Test-MixpanelExport -eventName $eventTest.Event -fromDate $dateTest.From -toDate $dateTest.To -description "$($eventTest.Description) - $($dateTest.Description)"
        if ($events -gt 0) {
            $totalEvents += $events
        }
    }
}

Write-Host ""
Write-Host "=== TESTING QUERY ALL EVENTS (NO FILTER) ===" -ForegroundColor Yellow

# Test querying all events without filter
try {
    $allEventsUrl = "https://data.mixpanel.com/api/2.0/export/?from_date=$yesterday&to_date=$today"
    Write-Host "📊 Querying ALL events from $yesterday to $today" -ForegroundColor Cyan
    Write-Host "   URL: $allEventsUrl" -ForegroundColor Gray
    
    $headers = @{
        "Authorization" = "Basic $credentials"
        "Accept" = "text/plain"
    }
    
    $allResponse = Invoke-RestMethod -Uri $allEventsUrl -Headers $headers -Method GET -TimeoutSec 30
    
    if ($allResponse -eq "terminated early") {
        Write-Host "   ❌ All events query: TERMINATED EARLY" -ForegroundColor Red
    } else {
        $allLines = ($allResponse -split "`n" | Where-Object { $_.Trim() -ne "" }).Count
        Write-Host "   ✅ All events query: $allLines total events found" -ForegroundColor Green
        $totalEvents += $allLines
        
        # Show sample of different event types
        Write-Host "   📝 Sample events by type:" -ForegroundColor Gray
        ($allResponse -split "`n" | Where-Object { $_.Trim() -ne "" } | Select-Object -First 10) | ForEach-Object {
            try {
                $eventData = $_ | ConvertFrom-Json
                $eventName = $eventData.event
                Write-Host "      Event: $eventName" -ForegroundColor DarkGray
            } catch {
                Write-Host "      Raw: $($_.Substring(0, [Math]::Min(80, $_.Length)))..." -ForegroundColor DarkGray
            }
        }
    }
} catch {
    Write-Host "   ❌ All events query ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== FINAL SUMMARY ===" -ForegroundColor Green
Write-Host "Total events found across all tests: $totalEvents" -ForegroundColor Yellow

if ($totalEvents -eq 0) {
    Write-Host ""
    Write-Host "⚠️  DIAGNOSIS: NO EVENTS FOUND" -ForegroundColor Red
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "1. Events are being sent to a different project" -ForegroundColor White
    Write-Host "2. Export API has delay (can be 30-60 minutes)" -ForegroundColor White
    Write-Host "3. Event names don't match exactly" -ForegroundColor White
    Write-Host "4. Timezone issues (events stored in different timezone)" -ForegroundColor White
    Write-Host "5. Project Token/API Secret mismatch" -ForegroundColor White
    
    Write-Host ""
    Write-Host "📋 RECOMMENDATIONS:" -ForegroundColor Cyan
    Write-Host "1. Check Mixpanel dashboard for exact event names" -ForegroundColor White
    Write-Host "2. Wait 1 hour and try again" -ForegroundColor White
    Write-Host "3. Verify project token matches the dashboard" -ForegroundColor White
    Write-Host "4. Test with broader date range (last 7 days)" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✅ SUCCESS: Events found! Export API is working." -ForegroundColor Green
    Write-Host "The issue might be in the C# code or query parameters." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔗 Test completed. Check Mixpanel dashboard at:" -ForegroundColor Cyan
Write-Host "   https://mixpanel.com/project/$projectToken/view/insights" -ForegroundColor Blue
