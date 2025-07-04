export async function checkServerHealth() {
  const checks = {
    backend: false,
    frontend: false,
    database: false
  };

  try {
    // Check backend health
    const backendResponse = await fetch('http://localhost:5000/api/orders/test-endpoint', {
      method: 'GET',
      cache: 'no-store'
    });
    checks.backend = backendResponse.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
  }

  try {
    // Check frontend proxy health  
    const frontendResponse = await fetch('/api/order?id=999', {
      method: 'GET',
      cache: 'no-store'
    });
    // We expect 404 for non-existent order, but proxy should work
    checks.frontend = frontendResponse.status === 404 || frontendResponse.ok;
  } catch (error) {
    console.error('Frontend health check failed:', error);
  }

  return checks;
}
