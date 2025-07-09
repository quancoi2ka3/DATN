# Debug Mixpanel Export API - Extended Range
$apiSecret = "4039d1ada8948bde4f7cd4f546c42483"

Write-Host "=== TESTING MIXPANEL EXPORT API - EXTENDED RANGE ===" -ForegroundColor Green

# Create base64 auth header
$authBytes = [System.Text.Encoding]::ASCII.GetBytes("$apiSecret" + ":")
$authString = [System.Convert]::ToBase64String($authBytes)

$headers = @{
    "Authorization" = "Basic $authString"
    "Content-Type" = "application/json"
}

# Test last 7 days to see if there's any data
for ($i = 0; $i -le 7; $i++) {
    $testDate = (Get-Date).AddDays(-$i).ToString("yyyy-MM-dd")
    Write-Host "`n=== Testing date: $testDate ===" -ForegroundColor Cyan
    
    $url = "https://data.mixpanel.com/api/2.0/export?from_date=$testDate&to_date=$testDate"
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method GET -TimeoutSec 30
        
        if ($response -and $response -ne "terminated early") {
            Write-Host "✅ Found data for $testDate" -ForegroundColor Green
            $lines = $response -split "`n" | Where-Object { $_.Trim() -ne "" }
            Write-Host "Number of events: $($lines.Count)" -ForegroundColor Yellow
            
            # Parse and show event types
            $eventTypes = @{}
            foreach ($line in $lines) {
                try {
                    $eventData = $line | ConvertFrom-Json
                    $eventName = $eventData.event
                    if ($eventTypes.ContainsKey($eventName)) {
                        $eventTypes[$eventName]++
                    } else {
                        $eventTypes[$eventName] = 1
                    }
                } catch {
                    Write-Host "Failed to parse line: $line" -ForegroundColor Red
                }
            }
            
            Write-Host "Event breakdown:" -ForegroundColor Yellow
            foreach ($eventType in $eventTypes.GetEnumerator()) {
                Write-Host "  $($eventType.Key): $($eventType.Value)" -ForegroundColor White
            }
        } else {
            Write-Host "❌ No data for $testDate (terminated early)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error for $testDate : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== TESTING PROJECT INFO ===" -ForegroundColor Green
$projectUrl = "https://mixpanel.com/api/2.0/engage"
try {
    $projectResponse = Invoke-RestMethod -Uri $projectUrl -Headers $headers -Method GET -TimeoutSec 30
    Write-Host "Project info response: $projectResponse" -ForegroundColor Yellow
} catch {
    Write-Host "Error getting project info: $($_.Exception.Message)" -ForegroundColor Red
}
