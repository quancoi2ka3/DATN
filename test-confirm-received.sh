#!/bin/bash

echo "=== TESTING ORDER CONFIRM RECEIVED LOGIC ==="
echo

# Test cases
ORDER_ID="1"
BACKEND_URL="http://localhost:5000"

echo "1. Testing confirm received API endpoint..."
echo "POST $BACKEND_URL/api/orders/$ORDER_ID/confirm-received"

curl -X POST "$BACKEND_URL/api/orders/$ORDER_ID/confirm-received" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo
echo "2. Testing get order details after confirmation..."
echo "GET $BACKEND_URL/api/orders/$ORDER_ID"

curl -X GET "$BACKEND_URL/api/orders/$ORDER_ID" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo
echo "=== TESTING FRONTEND CONFIRM RECEIVED ==="
echo

FRONTEND_URL="http://localhost:3000"

echo "3. Testing frontend proxy confirm received..."
echo "POST $FRONTEND_URL/api/orders/$ORDER_ID/confirm-received"

curl -X POST "$FRONTEND_URL/api/orders/$ORDER_ID/confirm-received" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo
echo "=== TEST COMPLETED ==="
