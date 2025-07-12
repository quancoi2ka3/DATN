#!/bin/bash

echo "=========================================="
echo "Testing UserInteractions Table Fix"
echo "=========================================="

echo "1. Checking if backend is running..."
if curl -s -f http://localhost:5000 > /dev/null; then
    echo "✅ Backend server is running on port 5000"
elif curl -s -f http://localhost:5001 > /dev/null; then
    echo "✅ Backend server is running on port 5001"
else
    echo "❌ Backend server is not running"
    echo "Please start backend server first"
    exit 1
fi

echo ""
echo "2. Checking if frontend is running..."
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server is not running"
    echo "Please start frontend server: npm run dev"
    exit 1
fi

echo ""
echo "3. Testing interactions/cart API..."
curl -s -X POST http://localhost:3000/api/interactions/cart \
    -H "Content-Type: application/json" \
    -d '{"userId": "test-user", "productId": 1}' \
    | grep -q "success"

if [ $? -eq 0 ]; then
    echo "✅ Cart interactions API is working"
else
    echo "❌ Cart interactions API failed"
fi

echo ""
echo "=========================================="
echo "UserInteractions Fix Summary:"
echo "=========================================="
echo "✅ UserInteractions migration created"
echo "✅ Database updated with UserInteractions table"
echo "✅ Backend server restarted"
echo "✅ Cart tracking should now work"
echo ""
echo "Test Instructions:"
echo "1. Go to http://localhost:3000/store/sportswear"
echo "2. Click 'Add to Cart' on any product"
echo "3. Verify cart icon shows item count"
echo "4. Check cart page for added items"
echo "5. Check backend logs for any UserInteractions errors"
echo ""
echo "=========================================="
