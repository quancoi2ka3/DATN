// Test API endpoints
async function testAPI() {
  try {
    console.log('Testing cookie debug endpoint...');
    const cookieResponse = await fetch('/api/debug/cookies');
    const cookieData = await cookieResponse.json();
    console.log('Cookie debug:', cookieData);
    
    console.log('Testing orders endpoint...');
    const ordersResponse = await fetch('/api/orders');
    const ordersData = await ordersResponse.json();
    console.log('Orders response:', ordersData);
    
    if (ordersData.error) {
      console.error('Orders API error:', ordersData.error);
    }
  } catch (error) {
    console.error('Test API error:', error);
  }
}

// Run test on page load
if (typeof window !== 'undefined') {
  (window as any).testAPI = testAPI;
}

export { testAPI };
