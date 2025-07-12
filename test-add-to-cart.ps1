try {
    Write-Host "Testing add to cart API..."
    
    # First test if the API endpoint exists
    try {
        $testResponse = Invoke-WebRequest -Uri 'http://localhost:5000/api/interactions/cart' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{"userId": "test-user", "productId": 1}' -UseBasicParsing
        Write-Host "HTTP Status: $($testResponse.StatusCode)"
        Write-Host "Response Content: $($testResponse.Content)"
    } catch {
        Write-Host "HTTP Error: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody"
            Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
        }
    }
    
} catch {
    Write-Host "General Error: $($_.Exception.Message)"
}
