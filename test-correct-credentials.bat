@echo off
echo Testing login with correct credentials...
echo.

powershell -Command "try { $body = @{ email = 'nguyenmanhan17072003@gmail.com'; password = 'ManhQuan2003@' } | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'https://localhost:5001/api/auth/login' -Method POST -ContentType 'application/json' -Body $body -SkipCertificateCheck; $data = $response.Content | ConvertFrom-Json; Write-Host 'SUCCESS: Login successful!' -ForegroundColor Green; Write-Host 'User: ' + $data.user.firstName + ' ' + $data.user.lastName -ForegroundColor Cyan; Write-Host 'Email: ' + $data.user.email -ForegroundColor Cyan; Write-Host 'Token: ' + $data.token.Substring(0, 20) + '...' -ForegroundColor Yellow } catch { $errorResponse = $_.Exception.Response; if ($errorResponse) { $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream()); $errorBody = $reader.ReadToEnd(); Write-Host 'LOGIN FAILED:' -ForegroundColor Red; Write-Host 'Status: ' + $errorResponse.StatusCode -ForegroundColor Red; Write-Host 'Response: ' + $errorBody -ForegroundColor Yellow } else { Write-Host 'Network Error: ' + $_.Exception.Message -ForegroundColor Red } }"

echo.
echo Testing user status check...
echo.

powershell -Command "try { $body = @{ email = 'nguyenmanhan17072003@gmail.com' } | ConvertTo-Json; $response = Invoke-WebRequest -Uri 'https://localhost:5001/api/auth/check-user-status' -Method POST -ContentType 'application/json' -Body $body -SkipCertificateCheck; $data = $response.Content | ConvertFrom-Json; Write-Host 'USER STATUS:' -ForegroundColor Green; Write-Host 'User Exists: ' + $data.userExists -ForegroundColor Cyan; Write-Host 'Email Confirmed: ' + $data.emailConfirmed -ForegroundColor Cyan; Write-Host 'Is Active: ' + $data.isActive -ForegroundColor Cyan; Write-Host 'Roles: ' + ($data.roles -join ', ') -ForegroundColor Cyan; Write-Host 'Message: ' + $data.message -ForegroundColor Yellow } catch { Write-Host 'Error checking user status: ' + $_.Exception.Message -ForegroundColor Red }"

pause
