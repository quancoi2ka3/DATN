export async function checkOrderExists(orderId: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
