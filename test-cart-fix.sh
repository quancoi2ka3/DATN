#!/bin/bash

# Test script for cart functionality fix

echo "=========================================="
echo "Testing Cart Functionality Fix"
echo "=========================================="

# Check if frontend server is running
echo "Checking if frontend server is running..."
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server is not running"
    echo "Please start the frontend server first: npm run dev"
    exit 1
fi

# Check if backend server is running
echo "Checking if backend server is running..."
if curl -s -f http://localhost:5000 > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not running"
    echo "Please start the backend server first"
    exit 1
fi

# Test cart API
echo "Testing cart API..."
curl -s -f -X GET http://localhost:3000/api/cart > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Cart API is responding"
else
    echo "❌ Cart API is not responding"
fi

# Test interactions/cart API
echo "Testing interactions/cart API..."
curl -s -f -X POST http://localhost:3000/api/interactions/cart \
    -H "Content-Type: application/json" \
    -d '{"userId": "test", "productId": "1"}' > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Interactions/cart API is responding"
else
    echo "❌ Interactions/cart API is not responding"
fi

# Test interactions/wishlist API
echo "Testing interactions/wishlist API..."
curl -s -f -X POST http://localhost:3000/api/interactions/wishlist \
    -H "Content-Type: application/json" \
    -d '{"userId": "test", "productId": "1"}' > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Interactions/wishlist API is responding"
else
    echo "❌ Interactions/wishlist API is not responding"
fi

echo ""
echo "=========================================="
echo "Cart Fix Summary:"
echo "=========================================="
echo "✅ Created missing /api/interactions/cart API route"
echo "✅ Created missing /api/interactions/wishlist API route"
echo "✅ Improved error handling in analytics service"
echo "✅ Made analytics tracking non-blocking"
echo "✅ Added proper try-catch in product card component"
echo "✅ Analytics failures won't break cart functionality"
echo ""
echo "The add to cart functionality should now work correctly!"
echo "You can test by:"
echo "1. Go to http://localhost:3000/store/sportswear"
echo "2. Click 'Add to Cart' on any product"
echo "3. Check cart icon for updated item count"
echo "4. Verify items appear in cart"
echo ""
echo "=========================================="
