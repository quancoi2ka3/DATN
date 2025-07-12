import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    // Extract orderId from URL pathname
    const pathname = request.nextUrl.pathname;
    const orderId = pathname.split('/').pop();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Forward cookies for authentication
    const clientCookies = request.headers.get('cookie');
    if (clientCookies) {
      headers['Cookie'] = clientCookies;
      console.log('[ORDER DETAIL API] Forwarding cookies to backend');
    }

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
      console.log('[ORDER DETAIL API] Forwarding Authorization header to backend');
    }
    console.log('[ORDER DETAIL API] GET request for orderId:', orderId);

    if (!orderId || orderId === 'undefined') {
      console.log('[ORDER DETAIL API] Missing or invalid orderId');
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Try to connect to backend
    const backendUrl = 'http://localhost:5000';
    
    console.log('[ORDER DETAIL API] Calling backend:', `${backendUrl}/api/orders/${orderId}`);
    
    const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
      method: 'GET',
      headers
    });

    console.log('[ORDER DETAIL API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[ORDER DETAIL API] Backend error:', errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[ORDER DETAIL API] Backend data received successfully');

    return NextResponse.json(data);

  } catch (error) {
    console.error('[ORDER DETAIL API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
