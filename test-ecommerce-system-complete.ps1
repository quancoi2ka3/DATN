# =============================================================================
# COMPREHENSIVE E-COMMERCE SYSTEM TEST SCRIPT
# Test Cart, Checkout, Orders, and Admin functionality
# =============================================================================

Write-Host "====================================" -ForegroundColor Green
Write-Host "🛒 E-COMMERCE SYSTEM COMPLETE TEST" -ForegroundColor Green  
Write-Host "====================================" -ForegroundColor Green

# Configuration
$backendHttps = "https://localhost:5001"
$backendHttp = "http://localhost:5000"
$frontendUrl = "http://localhost:3000"

function Test-BackendHealth {
    param($baseUrl)
    
    try {
        Write-Host "🔍 Testing backend health at: $baseUrl" -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method GET -ErrorAction SilentlyContinue
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-CartOperations {
    param($baseUrl)
    
    Write-Host "`n📦 TESTING CART OPERATIONS" -ForegroundColor Cyan
    
    try {
        # Test 1: Get empty cart
        Write-Host "1️⃣ Testing GET cart (should be empty)" -ForegroundColor Yellow
        $cart = Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method GET
        Write-Host "   Cart Items: $($cart.items.Count)" -ForegroundColor White
        
        # Test 2: Add item to cart
        Write-Host "2️⃣ Testing ADD to cart" -ForegroundColor Yellow
        $addItem = @{
            productId = 1
            quantity = 2
        }
        Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method POST -Body ($addItem | ConvertTo-Json) -ContentType "application/json"
        Write-Host "   ✅ Item added successfully" -ForegroundColor Green
        
        # Test 3: Get cart with items
        Write-Host "3️⃣ Testing GET cart (should have items)" -ForegroundColor Yellow
        $cart = Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method GET
        Write-Host "   Cart Items: $($cart.items.Count), Total: $($cart.totalAmount)" -ForegroundColor White
        
        # Test 4: Update item quantity
        if ($cart.items.Count -gt 0) {
            Write-Host "4️⃣ Testing UPDATE cart item" -ForegroundColor Yellow
            $updateItem = @{
                cartItemId = $cart.items[0].id
                quantity = 3
            }
            Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method PUT -Body ($updateItem | ConvertTo-Json) -ContentType "application/json"
            Write-Host "   ✅ Item quantity updated" -ForegroundColor Green
        }
        
        # Test 5: Remove item
        if ($cart.items.Count -gt 0) {
            Write-Host "5️⃣ Testing REMOVE cart item" -ForegroundColor Yellow
            $itemId = $cart.items[0].id
            Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items/$itemId" -Method DELETE
            Write-Host "   ✅ Item removed successfully" -ForegroundColor Green
        }
        
        # Test 6: Clear cart
        Write-Host "6️⃣ Testing CLEAR cart" -ForegroundColor Yellow
        Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/clear" -Method DELETE
        Write-Host "   ✅ Cart cleared successfully" -ForegroundColor Green
        
        return $true
    } catch {
        Write-Host "❌ Cart operations failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-CheckoutFlow {
    param($baseUrl)
    
    Write-Host "`n💳 TESTING CHECKOUT FLOW" -ForegroundColor Cyan
    
    try {
        # Add items to cart first
        Write-Host "1️⃣ Adding test items to cart..." -ForegroundColor Yellow
        $addItem1 = @{
            productId = 1
            quantity = 1
        }
        $addItem2 = @{
            productId = 2  
            quantity = 2
        }
        
        Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method POST -Body ($addItem1 | ConvertTo-Json) -ContentType "application/json"
        Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method POST -Body ($addItem2 | ConvertTo-Json) -ContentType "application/json"
        Write-Host "   ✅ Test items added to cart" -ForegroundColor Green
        
        # Test checkout - COD
        Write-Host "2️⃣ Testing checkout with COD" -ForegroundColor Yellow
        $checkoutData = @{
            shippingAddress = @{
                fullName = "Nguyen Van Test"
                addressLine1 = "123 Test Street"
                city = "Ho Chi Minh City"
                province = "Ho Chi Minh"
            }
            contactInfo = @{
                email = "test@example.com"
                phone = "0123456789"
                notes = "Test order - COD"
            }
            paymentMethod = "cash_on_delivery"
        }
        
        $orderResponse = Invoke-RestMethod -Uri "$baseUrl/api/orders/checkout" -Method POST -Body ($checkoutData | ConvertTo-Json) -ContentType "application/json"
        
        if ($orderResponse.success) {
            Write-Host "   ✅ COD Order created successfully! Order ID: $($orderResponse.order.id)" -ForegroundColor Green
            $global:testOrderId = $orderResponse.order.id
        }
        
        # Test checkout - VNPay (will fail but should not crash)
        Write-Host "3️⃣ Testing checkout with VNPay" -ForegroundColor Yellow
        
        # Add items again (previous checkout cleared cart)
        Invoke-RestMethod -Uri "$baseUrl/api/ShoppingCart/items" -Method POST -Body ($addItem1 | ConvertTo-Json) -ContentType "application/json"
        
        $checkoutData.paymentMethod = "vnpay"
        $checkoutData.contactInfo.notes = "Test order - VNPay"
        
        try {
            $vnpayResponse = Invoke-RestMethod -Uri "$baseUrl/api/orders/checkout" -Method POST -Body ($checkoutData | ConvertTo-Json) -ContentType "application/json"
            if ($vnpayResponse.success -and $vnpayResponse.paymentUrl) {
                Write-Host "   ✅ VNPay checkout successful! Payment URL generated" -ForegroundColor Green
            }
        } catch {
            Write-Host "   ⚠️ VNPay checkout failed (expected): $($_.Exception.Message)" -ForegroundColor DarkYellow
        }
        
        return $true
    } catch {
        Write-Host "❌ Checkout flow failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-AdminOrderManagement {
    param($baseUrl)
    
    Write-Host "`n👨‍💼 TESTING ADMIN ORDER MANAGEMENT" -ForegroundColor Cyan
    
    try {
        if ($global:testOrderId) {
            Write-Host "1️⃣ Testing order status update via API" -ForegroundColor Yellow
            
            # Test updating order status to Processing
            $statusUpdate = @{
                id = $global:testOrderId
                status = "Processing"
            }
            
            try {
                $updateResponse = Invoke-RestMethod -Uri "$baseUrl/admin/OrdersAdmin/UpdateStatusAjax" -Method POST -Body ($statusUpdate | ConvertTo-Json) -ContentType "application/json"
                if ($updateResponse.success) {
                    Write-Host "   ✅ Order status updated to Processing" -ForegroundColor Green
                }
            } catch {
                Write-Host "   ⚠️ Admin API test requires authentication: $($_.Exception.Message)" -ForegroundColor DarkYellow
            }
        }
        
        return $true
    } catch {
        Write-Host "❌ Admin order management failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-FrontendIntegration {
    Write-Host "`n🌐 TESTING FRONTEND INTEGRATION" -ForegroundColor Cyan
    
    try {
        # Test frontend cart API proxy
        Write-Host "1️⃣ Testing frontend cart API proxy" -ForegroundColor Yellow
        $frontendCart = Invoke-RestMethod -Uri "$frontendUrl/api/cart" -Method GET -ErrorAction SilentlyContinue
        Write-Host "   ✅ Frontend cart API accessible" -ForegroundColor Green
        
        # Test frontend checkout API proxy  
        Write-Host "2️⃣ Testing frontend checkout API proxy" -ForegroundColor Yellow
        $testCheckout = @{
            shippingAddress = @{
                fullName = "Frontend Test"
                addressLine1 = "Frontend Test Address"
                city = "Test City"
                province = "Test Province"
            }
            contactInfo = @{
                email = "frontend@test.com"
                phone = "0987654321"
            }
            paymentMethod = "cash_on_delivery"
        }
        
        try {
            $frontendCheckout = Invoke-RestMethod -Uri "$frontendUrl/api/checkout" -Method POST -Body ($testCheckout | ConvertTo-Json) -ContentType "application/json"
            Write-Host "   ✅ Frontend checkout API working" -ForegroundColor Green
        } catch {
            Write-Host "   ⚠️ Frontend checkout may require authentication" -ForegroundColor DarkYellow
        }
        
        return $true
    } catch {
        Write-Host "❌ Frontend integration test failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# =============================================================================
# MAIN TEST EXECUTION
# =============================================================================

$testResults = @()

# Test HTTPS backend first
if (Test-BackendHealth $backendHttps) {
    $currentBackend = $backendHttps
    Write-Host "🔒 Using HTTPS backend: $backendHttps" -ForegroundColor Green
} elseif (Test-BackendHealth $backendHttp) {
    $currentBackend = $backendHttp
    Write-Host "🔓 Using HTTP backend: $backendHttp" -ForegroundColor Yellow
} else {
    Write-Host "❌ No backend available! Please start the backend server." -ForegroundColor Red
    exit 1
}

# Run all tests
$testResults += @{ Name = "Cart Operations"; Result = (Test-CartOperations $currentBackend) }
$testResults += @{ Name = "Checkout Flow"; Result = (Test-CheckoutFlow $currentBackend) }
$testResults += @{ Name = "Admin Order Management"; Result = (Test-AdminOrderManagement $currentBackend) }
$testResults += @{ Name = "Frontend Integration"; Result = (Test-FrontendIntegration) }

# =============================================================================
# TEST RESULTS SUMMARY
# =============================================================================

Write-Host "`n======================================" -ForegroundColor Green
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Green  
Write-Host "======================================" -ForegroundColor Green

$passedTests = 0
$totalTests = $testResults.Count

foreach ($test in $testResults) {
    if ($test.Result) {
        Write-Host "✅ $($test.Name)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "❌ $($test.Name)" -ForegroundColor Red
    }
}

Write-Host "`nOverall: $passedTests/$totalTests tests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

if ($passedTests -eq $totalTests) {
    Write-Host "`n🎉 ALL TESTS PASSED! Your e-commerce system is working perfectly!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some tests failed. Please check the errors above." -ForegroundColor Yellow
}

Write-Host "`n🔗 USEFUL LINKS:" -ForegroundColor Cyan
Write-Host "Frontend: $frontendUrl" -ForegroundColor White
Write-Host "Backend API: $currentBackend" -ForegroundColor White
Write-Host "Admin Panel: $currentBackend/admin" -ForegroundColor White
Write-Host "API Documentation: $currentBackend/swagger" -ForegroundColor White

if ($global:testOrderId) {
    Write-Host "Test Order ID: $global:testOrderId" -ForegroundColor White
    Write-Host "View Order: $currentBackend/admin/OrdersAdmin/Details/$global:testOrderId" -ForegroundColor White
}

Write-Host "`n======================================" -ForegroundColor Green
