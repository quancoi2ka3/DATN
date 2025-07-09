// Mixpanel Connection Test Script
// Run this in browser console to test your setup

function testMixpanelConnection() {
  console.log('🧪 Testing Mixpanel Connection...');
  
  // Check if Mixpanel is loaded
  if (typeof mixpanel === 'undefined') {
    console.error('❌ Mixpanel not loaded!');
    return;
  }
  
  console.log('✅ Mixpanel loaded successfully');
  
  // Send a test event
  try {
    mixpanel.track('Connection Test', {
      timestamp: new Date().toISOString(),
      test_source: 'browser_console',
      page_url: window.location.href
    });
    
    console.log('✅ Test event sent successfully!');
    console.log('📊 Check your Mixpanel dashboard for "Connection Test" event');
    
    // Check project token
    console.log('🔑 Project Token configured:', mixpanel.get_property('token') || 'Not found');
    
  } catch (error) {
    console.error('❌ Error sending test event:', error);
  }
}

// Auto-run after 2 seconds
setTimeout(testMixpanelConnection, 2000);

console.log(`
🎯 MIXPANEL SETUP GUIDE:

1. Replace YOUR_REAL_PROJECT_TOKEN_HERE in:
   - Frontend: .env.local -> NEXT_PUBLIC_MIXPANEL_TOKEN
   - Backend: appsettings.json -> Mixpanel:ProjectToken

2. Start your frontend and backend

3. Navigate around your website to generate events

4. Check Mixpanel dashboard for real-time data

5. Run testMixpanelConnection() in console to verify
`);
