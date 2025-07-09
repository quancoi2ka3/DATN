Write-Host "Testing Mixpanel Export API..."

# Use the correct API endpoint and authentication method
$exportUrl = "https://data.mixpanel.com/api/2.0/export"
$secret = "4039d1ada8948bde4f7cd4f546c42483"

# Create basic auth header (username = API Secret, password = blank)
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$secret`:"))
$headers = @{
    "Authorization" = "Basic $auth"
    "Accept" = "application/json"
}

# Test export API
$fromDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
$toDate = (Get-Date).ToString("yyyy-MM-dd")

# Export API uses different parameter format
$eventParam = '["page_view"]'
$encodedEventParam = [System.Uri]::EscapeDataString($eventParam)

$testUrl = "$exportUrl" + "?from_date=$fromDate&to_date=$toDate&event=$encodedEventParam"

Write-Host "Testing Export URL: $testUrl"
Write-Host "Date range: $fromDate to $toDate"
Write-Host "Event parameter: $eventParam"

try {
    # Mixpanel Export API returns JSONL (JSON Lines), not standard JSON
    $response = Invoke-WebRequest -Uri $testUrl -Headers $headers -Method Get -TimeoutSec 30
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ SUCCESS: Mixpanel Export API responded!" -ForegroundColor Green
        Write-Host "Status Code: $($response.StatusCode)"
        Write-Host "Content Type: $($response.Headers.'Content-Type')"
        
        $content = $response.Content
        if ($content) {
            # Count lines (each line is a JSON event)
            $lines = $content -split "`n" | Where-Object { $_.Trim() -ne "" }
            Write-Host "Found $($lines.Count) events"
            
            if ($lines.Count -gt 0) {
                Write-Host "Sample event (first line):"
                Write-Host $lines[0]
            } else {
                Write-Host "No events found in the specified date range"
            }
        }
    }
} catch {
    Write-Host "❌ ERROR: Failed to connect to Mixpanel Export API" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode"
    }
}

# Also test the Events API with the correct format
Write-Host "`nTesting Events API with correct format..."
$eventsUrl = "https://api.mixpanel.com/api/2.0/events"

$eventName = "page_view"
$encodedEvent = [System.Uri]::EscapeDataString($eventName)
$eventsTestUrl = "$eventsUrl" + "?from_date=$fromDate&to_date=$toDate&event=$encodedEvent&unit=day"

Write-Host "Testing Events URL: $eventsTestUrl"

try {
    $response = Invoke-RestMethod -Uri $eventsTestUrl -Headers $headers -Method Get -TimeoutSec 30
    Write-Host "✅ SUCCESS: Events API responded!" -ForegroundColor Green
    
    if ($response -and $response.data -and $response.data.values) {
        $values = $response.data.values
        Write-Host "Events data received:"
        $values | ConvertTo-Json -Depth 2
        
        # Calculate total events
        $total = 0
        $values.PSObject.Properties | ForEach-Object { $total += $_.Value }
        Write-Host "Total events: $total"
    } else {
        Write-Host "No events data found"
    }
} catch {
    Write-Host "❌ ERROR: Events API failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`nMixpanel API tests completed."
