@echo off
echo Checking Rasa Server Status...
echo.

echo Testing Rasa Health Endpoint...
curl -X GET http://localhost:5005/health
echo.

echo Testing Rasa Webhook Endpoint...
curl -X POST http://localhost:5005/webhooks/rest/webhook -H "Content-Type: application/json" -d "{\"sender\":\"test\",\"message\":\"hello\"}"
echo.

echo If you see connection errors above, Rasa server is not running properly.
pause
