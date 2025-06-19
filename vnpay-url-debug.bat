@echo off
echo ==========================================
echo VNPay URL Debug and Validation
echo ==========================================
echo.

echo Testing VNPay URL generation...
echo.

curl -k -X POST "https://localhost:5001/api/orders/debug-vnpay-url" ^
  -H "Content-Type: application/json" ^
  -d "{\"paymentMethod\":\"vnpay\",\"shippingAddress\":{\"fullName\":\"Test User\",\"addressLine1\":\"123 Test St\",\"city\":\"Ho Chi Minh City\",\"province\":\"Ho Chi Minh\"},\"contactInfo\":{\"email\":\"test@vnpay.com\",\"phone\":\"0987654321\",\"notes\":\"VNPay debug test\"}}" ^
  -o vnpay_debug_response.json

echo.
echo VNPay Debug Response:
echo ==========================================
type vnpay_debug_response.json

echo.
echo.
echo Parsing VNPay URL parameters:
echo ==========================================

rem Extract payment URL and analyze
powershell -Command "$json = Get-Content 'vnpay_debug_response.json' | ConvertFrom-Json; if ($json.success) { Write-Host 'SUCCESS: VNPay URL Generated'; Write-Host ''; Write-Host 'Payment URL:'; Write-Host $json.paymentUrl; Write-Host ''; Write-Host 'VNPay Configuration:'; $json.vnpayConfig | Format-List; Write-Host 'URL Parameters:'; $json.urlParameters | Format-List; Write-Host 'Test Order Info:'; $json.testOrder | Format-List; } else { Write-Host 'ERROR:' $json.error; }"

echo.
echo.
echo VNPay Parameter Validation:
echo ==========================================
echo 1. Checking required parameters...
powershell -Command "$json = Get-Content 'vnpay_debug_response.json' | ConvertFrom-Json; if ($json.success) { $params = $json.urlParameters; $required = @('vnp_Version', 'vnp_Command', 'vnp_TmnCode', 'vnp_Amount', 'vnp_CurrCode', 'vnp_TxnRef', 'vnp_OrderInfo', 'vnp_ReturnUrl', 'vnp_IpnUrl', 'vnp_CreateDate', 'vnp_SecureHash'); foreach ($param in $required) { if ($params.$param) { Write-Host \"✓ $param = $($params.$param)\"; } else { Write-Host \"✗ MISSING: $param\"; } } }"

echo.
echo 2. Checking parameter formats...
powershell -Command "$json = Get-Content 'vnpay_debug_response.json' | ConvertFrom-Json; if ($json.success) { $params = $json.urlParameters; Write-Host \"Amount format: $($params.vnp_Amount) (should be in cents)\"; Write-Host \"Date format: $($params.vnp_CreateDate) (should be yyyyMMddHHmmss)\"; Write-Host \"Version: $($params.vnp_Version) (should be 2.1.0)\"; Write-Host \"TmnCode: $($params.vnp_TmnCode) (should be DEMOV210 for sandbox)\"; }"

rem Clean up
del vnpay_debug_response.json >nul 2>&1

echo.
echo ==========================================
echo VNPay URL Debug Completed
echo ==========================================
pause
