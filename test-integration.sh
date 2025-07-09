#!/bin/bash

# Test Mixpanel integration script
echo "🧪 Testing Mixpanel Integration..."

# Check if frontend is running
echo "📱 Checking frontend..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not running on port 3000"
fi

# Check if backend is running
echo "🔧 Checking backend..."
curl -s http://localhost:5000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running on port 5000"
else
    echo "❌ Backend is not running on port 5000"
fi

# Test admin dashboard
echo "🎯 Testing admin dashboard..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/admin
response_code=$?
if [ $response_code -eq 200 ]; then
    echo "✅ Admin dashboard accessible"
else
    echo "❌ Admin dashboard not accessible (code: $response_code)"
fi

# Test Mixpanel API directly
echo "🌐 Testing Mixpanel API..."
curl -s -X POST "https://api.mixpanel.com/track" \
     -H "Content-Type: application/json" \
     -d '{
       "event": "Test Connection",
       "properties": {
         "token": "6a87b4d11fab9c9b8ece4b3d31978893",
         "test": true,
         "source": "bash_test",
         "time": '$(date +%s)'
       }
     }'

if [ $? -eq 0 ]; then
    echo "✅ Mixpanel API reachable"
else
    echo "❌ Mixpanel API not reachable"
fi

echo "🏁 Test completed!"
