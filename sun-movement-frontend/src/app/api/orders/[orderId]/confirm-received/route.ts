import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;
    console.log('[CONFIRM RECEIVED API] Request for orderId:', orderId);

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Call backend API để xác nhận nhận hàng
    const backendUrl = 'http://localhost:5000';
    console.log('[CONFIRM RECEIVED API] Calling backend:', `${backendUrl}/api/orders/${orderId}/confirm-received`);
    
    // Forward authentication headers from client request
    const authHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Forward cookies for authentication
    const clientCookies = request.headers.get('cookie');
    if (clientCookies) {
      authHeaders['Cookie'] = clientCookies;
      console.log('[CONFIRM RECEIVED API] Forwarding cookies to backend');
    }

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      authHeaders['Authorization'] = authHeader;
      console.log('[CONFIRM RECEIVED API] Forwarding Authorization header to backend');
    }
    
    const response = await fetch(`${backendUrl}/api/orders/${orderId}/confirm-received`, {
      method: 'POST',
      headers: authHeaders,
      cache: 'no-store',
    });

    console.log('[CONFIRM RECEIVED API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[CONFIRM RECEIVED API] Backend error:', errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('[CONFIRM RECEIVED API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
