#!/usr/bin/env pwsh

# Script để test Mixpanel events từ frontend và backend
param(
    [string]$FrontendUrl = "http://localhost:3000",
    [string]$BackendUrl = "http://localhost:5000"
)

Write-Host "🔍 Testing Mixpanel Events Integration" -ForegroundColor Green
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Yellow
Write-Host "Backend URL: $BackendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Check frontend .env.local configuration
Write-Host "1. Checking Frontend Configuration..." -ForegroundColor Cyan
$envPath = "d:\DATN\DATN\sun-movement-frontend\.env.local"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $token = ($envContent | Where-Object { $_ -like "NEXT_PUBLIC_MIXPANEL_TOKEN=*" }) -replace "NEXT_PUBLIC_MIXPANEL_TOKEN=", ""
    if ($token -and $token -ne "demo-token") {
        Write-Host "✅ Frontend Mixpanel token configured: $($token.Substring(0, 8))..." -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend Mixpanel token not configured or using demo token" -ForegroundColor Red
        return
    }
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    return
}

# Test 2: Check backend configuration
Write-Host "2. Checking Backend Configuration..." -ForegroundColor Cyan
$appsettingsPath = "d:\DATN\DATN\sun-movement-backend\SunMovement.Web\appsettings.json"
if (Test-Path $appsettingsPath) {
    $appsettings = Get-Content $appsettingsPath | ConvertFrom-Json
    if ($appsettings.Mixpanel.ProjectToken -and $appsettings.Mixpanel.ApiSecret) {
        Write-Host "✅ Backend Mixpanel configured" -ForegroundColor Green
        Write-Host "  Project Token: $($appsettings.Mixpanel.ProjectToken.Substring(0, 8))..." -ForegroundColor Yellow
        Write-Host "  API Secret: $($appsettings.Mixpanel.ApiSecret.Substring(0, 8))..." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Backend Mixpanel not configured properly" -ForegroundColor Red
        return
    }
} else {
    Write-Host "❌ appsettings.json file not found" -ForegroundColor Red
    return
}

# Test 3: Check if frontend is running
Write-Host "3. Checking Frontend Status..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri $FrontendUrl -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Frontend is running (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is not running at $FrontendUrl" -ForegroundColor Red
    Write-Host "Please start frontend with: cd sun-movement-frontend && npm run dev" -ForegroundColor Yellow
}

# Test 4: Check if backend is running  
Write-Host "4. Checking Backend Status..." -ForegroundColor Cyan
try {
    $backendResponse = Invoke-WebRequest -Uri "$BackendUrl/admin" -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Backend is running (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running at $BackendUrl" -ForegroundColor Red
    Write-Host "Please start backend with: cd sun-movement-backend/SunMovement.Web && dotnet run" -ForegroundColor Yellow
}

# Test 5: Instructions for manual testing
Write-Host ""
Write-Host "🧪 Manual Testing Steps:" -ForegroundColor Green
Write-Host "1. Open browser and go to frontend: $FrontendUrl" -ForegroundColor Yellow
Write-Host "2. Open Developer Tools (F12) and go to Console" -ForegroundColor Yellow
Write-Host "3. Perform these actions and check for Mixpanel events in console:" -ForegroundColor Yellow
Write-Host "   - Navigate to different pages (should see 'Page View' events)" -ForegroundColor White
Write-Host "   - Search for products (should see 'Search' events)" -ForegroundColor White
Write-Host "   - View product details (should see 'Product View' events)" -ForegroundColor White
Write-Host "   - Add products to cart (should see 'Add to Cart' events)" -ForegroundColor White
Write-Host "4. Check Mixpanel Live View: https://mixpanel.com/report/2784062/live" -ForegroundColor Yellow
Write-Host "5. Check admin dashboard: $BackendUrl/admin" -ForegroundColor Yellow
Write-Host ""

Write-Host "📊 Event Names Mapping:" -ForegroundColor Green
Write-Host "Frontend -> Backend:" -ForegroundColor Yellow
Write-Host "  'Page View'    -> Page views analytics" -ForegroundColor White
Write-Host "  'Search'       -> Search analytics" -ForegroundColor White  
Write-Host "  'Product View' -> Product analytics" -ForegroundColor White
Write-Host "  'Purchase'     -> Purchase analytics" -ForegroundColor White
Write-Host "  'Add to Cart'  -> Cart analytics" -ForegroundColor White
Write-Host ""

Write-Host "🐛 Debugging Tips:" -ForegroundColor Green
Write-Host "- If no events in console: Check frontend Mixpanel token" -ForegroundColor Yellow
Write-Host "- If events in console but not in admin: Check backend API Secret" -ForegroundColor Yellow
Write-Host "- If 0 values in admin: Event names might not match" -ForegroundColor Yellow
Write-Host "- Check browser Network tab for Mixpanel API calls" -ForegroundColor Yellow
Write-Host ""
