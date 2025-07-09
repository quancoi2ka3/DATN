Write-Host "Testing Mixpanel API Connection..."

# Test API endpoint directly
$url = "https://api.mixpanel.com/api/2.0/events"
$token = "8e22b9a79446802234818ec75fbf40f0"
$secret = "4039d1ada8948bde4f7cd4f546c42483"

# Create authorization header
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$secret`:"))
$headers = @{
    "Authorization" = "Basic $auth"
    "Accept" = "application/json"
}

# Test with page_view event
$fromDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
$toDate = (Get-Date).ToString("yyyy-MM-dd")

$testUrl = "$url" + "?from_date=$fromDate&to_date=$toDate&event=page_view&unit=day"

Write-Host "Testing URL: $testUrl"
Write-Host "Date range: $fromDate to $toDate"

try {
    $response = Invoke-RestMethod -Uri $testUrl -Headers $headers -Method Get
    Write-Host "✅ SUCCESS: Mixpanel API responded!" -ForegroundColor Green
    Write-Host "Response data:"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ ERROR: Failed to connect to Mixpanel API" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode"
        
        try {
            $errorBody = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorBody)
            $errorText = $reader.ReadToEnd()
            Write-Host "Error Response: $errorText"
        } catch {
            Write-Host "Could not read error response body"
        }
    }
}

# Test with different event name variations
Write-Host "`nTesting different event names..."
$eventNames = @("page_view", "Page View", "pageview", "view_product", "search")

foreach ($eventName in $eventNames) {
    $encodedEvent = [System.Web.HttpUtility]::UrlEncode($eventName)
    $testUrlEvent = "$url" + "?from_date=$fromDate&to_date=$toDate&event=$encodedEvent&unit=day"
    
    Write-Host "Testing event: '$eventName' (encoded: '$encodedEvent')"
    
    try {
        $response = Invoke-RestMethod -Uri $testUrlEvent -Headers $headers -Method Get -TimeoutSec 10
        if ($response.data -and $response.data.values) {
            $totalEvents = ($response.data.values.PSObject.Properties | Measure-Object -Property Value -Sum).Sum
            Write-Host "  ✅ Found $totalEvents events for '$eventName'" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ No data found for '$eventName'" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Error testing '$eventName': $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nMixpanel API test completed."
