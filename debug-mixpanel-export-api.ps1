# Debug Mixpanel Export API
$apiSecret = "4039d1ada8948bde4f7cd4f546c42483"
$projectToken = "8e22b9a79446802234818ec75fbf40f0"
$today = Get-Date -Format "yyyy-MM-dd"
$yesterday = (Get-Date).AddDays(-1).ToString("yyyy-MM-dd")

Write-Host "=== TESTING MIXPANEL EXPORT API ===" -ForegroundColor Green
Write-Host "API Secret: $($apiSecret.Substring(0,8))..." -ForegroundColor Yellow
Write-Host "Project Token: $($projectToken.Substring(0,8))..." -ForegroundColor Yellow
Write-Host "Today: $today" -ForegroundColor Yellow
Write-Host "Yesterday: $yesterday" -ForegroundColor Yellow

# Create base64 auth header
$authBytes = [System.Text.Encoding]::ASCII.GetBytes("$apiSecret" + ":")
$authString = [System.Convert]::ToBase64String($authBytes)

$headers = @{
    "Authorization" = "Basic $authString"
    "Content-Type" = "application/json"
}

Write-Host "`n=== TEST 1: Check all events for today ===" -ForegroundColor Cyan
$url1 = "https://data.mixpanel.com/api/2.0/export?from_date=$today&to_date=$today"
try {
    $response1 = Invoke-RestMethod -Uri $url1 -Headers $headers -Method GET
    Write-Host "Raw response for all events today:" -ForegroundColor Green
    Write-Host $response1
    
    if ($response1) {
        $lines = $response1 -split "`n" | Where-Object { $_.Trim() -ne "" }
        Write-Host "Number of event lines: $($lines.Count)" -ForegroundColor Green
        
        foreach ($line in $lines | Select-Object -First 3) {
            $eventData = $line | ConvertFrom-Json
            Write-Host "Event: $($eventData.event), Time: $($eventData.properties.time)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "Error testing all events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST 2: Check 'Page View' events for today ===" -ForegroundColor Cyan
$pageViewEvents = '["Page View"]'
$encodedPageView = [System.Web.HttpUtility]::UrlEncode($pageViewEvents)
$url2 = "https://data.mixpanel.com/api/2.0/export?from_date=$today&to_date=$today&event=$encodedPageView"
try {
    $response2 = Invoke-RestMethod -Uri $url2 -Headers $headers -Method GET
    Write-Host "Raw response for Page View events:" -ForegroundColor Green
    Write-Host $response2
    
    if ($response2) {
        $lines = $response2 -split "`n" | Where-Object { $_.Trim() -ne "" }
        Write-Host "Number of Page View events: $($lines.Count)" -ForegroundColor Green
    }
} catch {
    Write-Host "Error testing Page View events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST 3: Check 'Search' events for today ===" -ForegroundColor Cyan
$searchEvents = '["Search"]'
$encodedSearch = [System.Web.HttpUtility]::UrlEncode($searchEvents)
$url3 = "https://data.mixpanel.com/api/2.0/export?from_date=$today&to_date=$today&event=$encodedSearch"
try {
    $response3 = Invoke-RestMethod -Uri $url3 -Headers $headers -Method GET
    Write-Host "Raw response for Search events:" -ForegroundColor Green
    Write-Host $response3
    
    if ($response3) {
        $lines = $response3 -split "`n" | Where-Object { $_.Trim() -ne "" }
        Write-Host "Number of Search events: $($lines.Count)" -ForegroundColor Green
    }
} catch {
    Write-Host "Error testing Search events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST 4: Check events for yesterday ===" -ForegroundColor Cyan
$url4 = "https://data.mixpanel.com/api/2.0/export?from_date=$yesterday&to_date=$yesterday"
try {
    $response4 = Invoke-RestMethod -Uri $url4 -Headers $headers -Method GET
    Write-Host "Raw response for all events yesterday:" -ForegroundColor Green
    Write-Host $response4
    
    if ($response4) {
        $lines = $response4 -split "`n" | Where-Object { $_.Trim() -ne "" }
        Write-Host "Number of event lines yesterday: $($lines.Count)" -ForegroundColor Green
    }
} catch {
    Write-Host "Error testing yesterday events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== CONCLUSION ===" -ForegroundColor Green
Write-Host "If you see events above, Export API is working. If not, check:" -ForegroundColor Yellow
Write-Host "1. Events might be stored with different timezone" -ForegroundColor White
Write-Host "2. Event names might be different than expected" -ForegroundColor White
Write-Host "3. There might be a delay in Export API (up to 2 hours)" -ForegroundColor White
