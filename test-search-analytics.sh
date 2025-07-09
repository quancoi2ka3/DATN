#!/bin/bash
# Test Search Analytics Integration

echo "🔍 Testing Search Analytics Integration"
echo "======================================="

# Function to send test search event
send_search_event() {
    local search_term="$1"
    local timestamp=$(date +%s)
    local distinct_id="test-user-$(date +%Y%m%d-%H%M%S)"
    
    echo "📊 Sending search event: '$search_term'"
    
    curl -X POST http://localhost:5000/api/mixpanel/track \
        -H "Content-Type: application/json" \
        -d "{
            \"event\": \"Search\",
            \"properties\": {
                \"distinct_id\": \"$distinct_id\",
                \"search_term\": \"$search_term\",
                \"results_count\": $((RANDOM % 10 + 1)),
                \"timestamp\": $timestamp,
                \"time\": $timestamp,
                \"user_agent\": \"Test/1.0\",
                \"ip\": \"127.0.0.1\"
            }
        }"
    echo ""
}

echo "🚀 Sending test search events..."

# Send several test search events
send_search_event "áo thun"
sleep 1
send_search_event "giày thể thao"
sleep 1
send_search_event "túi xách"
sleep 1
send_search_event "đồng hồ"
sleep 1
send_search_event "áo thun" # Duplicate to test counting

echo ""
echo "⏳ Waiting for events to be processed..."
sleep 3

echo ""
echo "📊 Testing search analytics API..."
curl -X GET http://localhost:5000/api/mixpaneldebug/test-search-data

echo ""
echo ""
echo "🌐 Testing Search Analytics page..."
echo "Open browser to: http://localhost:5000/Admin/AnalyticsAdmin/SearchAnalytics"

echo ""
echo "✅ Test completed!"
echo "Check the Search Analytics page to see if data is displayed correctly."
