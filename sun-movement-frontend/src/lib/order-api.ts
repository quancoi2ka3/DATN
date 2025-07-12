export async function checkOrderExists(orderId: string): Promise<boolean> {
  try {
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking order existence:', error);
    return false;
  }
}

export async function getOrderInfo(orderId: string) {
  try {
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      return data.order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order info:', error);
    return null;
  }
}
