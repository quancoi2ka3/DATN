@echo off
title VNPay Error 99 Debug - Sun Movement
echo ====================================
echo VNPAY ERROR 99 DEBUG TOOL
echo ====================================
echo.

echo [1] Testing VNPay URL Generation with Debug Info...
curl -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{ \"customerId\": 1, \"items\": [{ \"productId\": 1, \"quantity\": 1, \"price\": 100000 }], \"paymentMethod\": \"vnpay\" }" ^
2>nul | jq . 2>nul || (
    echo JSON parsing failed, showing raw response:
    curl -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
    -H "Content-Type: application/json" ^
    -d "{ \"customerId\": 1, \"items\": [{ \"productId\": 1, \"quantity\": 1, \"price\": 100000 }], \"paymentMethod\": \"vnpay\" }"
)

echo.
echo [2] Analyzing VNPay URL Parameters...
echo Creating analysis script...

echo @echo off > temp_vnpay_analysis.bat
echo echo VNPay URL Parameter Analysis: >> temp_vnpay_analysis.bat
echo echo URL: %%1 >> temp_vnpay_analysis.bat
echo echo. >> temp_vnpay_analysis.bat
echo echo Parameters: >> temp_vnpay_analysis.bat
echo for /f "tokens=1,2 delims==" %%%%a in ('echo %%1 ^| tr "&" "\n" ^| findstr "="') do echo - %%%%a = %%%%b >> temp_vnpay_analysis.bat
echo echo. >> temp_vnpay_analysis.bat

echo.
echo [3] Testing with Different Scenarios...
echo.
echo --- Scenario 1: Basic Order ---
curl -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{ \"customerId\": 1, \"items\": [{ \"productId\": 1, \"quantity\": 1, \"price\": 50000 }], \"paymentMethod\": \"vnpay\" }"

echo.
echo --- Scenario 2: Multiple Items ---
curl -X POST "http://localhost:5000/api/orders/debug-vnpay-url" ^
-H "Content-Type: application/json" ^
-d "{ \"customerId\": 2, \"items\": [{ \"productId\": 1, \"quantity\": 2, \"price\": 50000 }, { \"productId\": 2, \"quantity\": 1, \"price\": 30000 }], \"paymentMethod\": \"vnpay\" }"

echo.
echo [4] Checking VNPay Parameter Requirements...
echo.
echo Required VNPay Parameters:
echo - vnp_Version: Must be 2.1.0
echo - vnp_Command: Must be pay  
echo - vnp_TmnCode: Must be valid merchant code
echo - vnp_Amount: Must be integer, in VND cents
echo - vnp_CurrCode: Must be VND
echo - vnp_TxnRef: Must be unique, max 100 chars
echo - vnp_OrderInfo: Must be URL encoded, max 255 chars
echo - vnp_ReturnUrl: Must be valid URL
echo - vnp_IpnUrl: Must be valid URL (for sandbox, can use webhook.site)
echo - vnp_CreateDate: yyyyMMddHHmmss format
echo - vnp_IpAddr: Client IP address
echo - vnp_SecureHash: HMAC SHA512 hash

echo.
echo [5] Common Error 99 Causes:
echo - Invalid or missing parameters
echo - Wrong parameter format
echo - Invalid hash calculation
echo - Special characters in OrderInfo not properly encoded
echo - Amount not in correct format (must be integer cents)
echo - Invalid date format
echo - Missing required parameters

echo.
echo [6] Parameter Format Check...
powershell -Command "
$url = 'PLACEHOLDER_URL'
if ($url -ne 'PLACEHOLDER_URL') {
    $params = $url.Split('?')[1].Split('&')
    Write-Host 'Parameter Analysis:'
    foreach ($param in $params) {
        $kv = $param.Split('=')
        if ($kv.Length -eq 2) {
            $key = $kv[0]
            $value = [System.Web.HttpUtility]::UrlDecode($kv[1])
            Write-Host \"$key : $value\"
            
            # Validate specific parameters
            switch ($key) {
                'vnp_Amount' {
                    if ($value -match '^\d+$') {
                        Write-Host '  ✓ Amount format OK'
                    } else {
                        Write-Host '  ✗ Amount format ERROR - must be integer'
                    }
                }
                'vnp_CreateDate' {
                    if ($value -match '^\d{14}$') {
                        Write-Host '  ✓ Date format OK'
                    } else {
                        Write-Host '  ✗ Date format ERROR - must be yyyyMMddHHmmss'
                    }
                }
                'vnp_TxnRef' {
                    if ($value.Length -le 100) {
                        Write-Host '  ✓ TxnRef length OK'
                    } else {
                        Write-Host '  ✗ TxnRef too long - max 100 chars'
                    }
                }
                'vnp_OrderInfo' {
                    if ($value.Length -le 255) {
                        Write-Host '  ✓ OrderInfo length OK'
                    } else {
                        Write-Host '  ✗ OrderInfo too long - max 255 chars'
                    }
                }
            }
        }
    }
}
"

echo.
echo ====================================
echo Debug completed. Check above output for issues.
echo ====================================
pause
