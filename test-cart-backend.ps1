try {
    Write-Host "Testing backend cart API directly..."
    
    # Test add to cart
    $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/ShoppingCart/items' -Method POST -Headers @{'Content-Type'='application/json'} -Body '{"productId": 1, "quantity": 1}' -UseBasicParsing
    Write-Host "Add to Cart Response Status: $($response.StatusCode)"
    Write-Host "Add to Cart Response Content: $($response.Content)"
    
    Write-Host "`nTesting get cart..."
    # Test get cart
    $getResponse = Invoke-WebRequest -Uri 'http://localhost:5000/api/ShoppingCart/items' -Method GET -UseBasicParsing
    Write-Host "Get Cart Response Status: $($getResponse.StatusCode)"
    Write-Host "Get Cart Response Content: $($getResponse.Content)"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
