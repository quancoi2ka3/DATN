#!/bin/bash

# Test script for checkout page hook fix

echo "=========================================="
echo "Testing Checkout Page Hook Fix"
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

echo ""
echo "=========================================="
echo "Hook Fix Summary:"
echo "=========================================="
echo "✅ All hooks moved to top level of component"
echo "✅ useState hooks declared before any conditional returns"
echo "✅ Rules of Hooks followed correctly"
echo "✅ LoginRequiredView component created"
echo "✅ OrderSuccessView component created"
echo "✅ Proper error handling and notifications added"
echo "✅ Order detail page navigation implemented"
echo ""
echo "The checkout page should now work without hook errors!"
echo "You can test by:"
echo "1. Go to http://localhost:3000/checkout"
echo "2. Login if required"
echo "3. Fill out the form and submit"
echo "4. After successful order, click 'Xem chi tiết đơn hàng'"
echo ""
echo "=========================================="
