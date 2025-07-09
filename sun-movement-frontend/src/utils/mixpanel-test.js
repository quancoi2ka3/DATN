// Simple Mixpanel testing utility
export const testMixpanelDirectly = async () => {
  const token = '8e22b9a79446802234818ec75fbf40f0';
  
  console.log('🧪 Testing Mixpanel tracking directly...');
  
  // Simple test event
  const testEvent = {
    event: 'Test Event',
    properties: {
      token: token,
      time: Math.floor(Date.now() / 1000),
      distinct_id: `test-user-${Date.now()}`,
      test: true,
      page_url: window.location.href,
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('Test event data:', testEvent);
  
  // Method 1: Try direct fetch
  try {
    const response = await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(JSON.stringify(testEvent))}`
    });
    
    console.log('Direct fetch response:', response.status, response.statusText);
    if (response.ok) {
      const result = await response.text();
      console.log('✅ Direct tracking successful:', result);
      return true;
    }
  } catch (error) {
    console.log('❌ Direct fetch failed:', error.message);
  }
  
  // Method 2: Try sendBeacon
  if (navigator.sendBeacon) {
    try {
      const data = `data=${encodeURIComponent(JSON.stringify(testEvent))}`;
      const sent = navigator.sendBeacon('https://api.mixpanel.com/track', data);
      console.log('Beacon result:', sent);
      if (sent) {
        console.log('✅ Beacon tracking successful');
        return true;
      }
    } catch (error) {
      console.log('❌ Beacon failed:', error.message);
    }
  }
  
  console.log('❌ All tracking methods failed');
  return false;
};

// Export for global testing
if (typeof window !== 'undefined') {
  window.testMixpanelDirectly = testMixpanelDirectly;
}
