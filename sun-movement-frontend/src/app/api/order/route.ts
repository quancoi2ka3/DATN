import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const timestamp = searchParams.get('_t'); // Cache busting parameter
    
    console.log('[ORDER API] Request for orderId:', orderId, 'timestamp:', timestamp);

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Call backend with timestamp for cache busting
    const backendUrl = 'http://localhost:5000';
    const backendEndpoint = `${backendUrl}/api/orders/${orderId}${timestamp ? `?_t=${timestamp}` : ''}`;
    console.log('[ORDER API] Calling backend:', backendEndpoint);
    
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
      console.log('[ORDER API] Forwarding cookies to backend');
    }

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      authHeaders['Authorization'] = authHeader;
      console.log('[ORDER API] Forwarding Authorization header to backend');
    }

    const response = await fetch(backendEndpoint, {
      method: 'GET',
      headers: authHeaders,
      cache: 'no-store',
    });

    console.log('[ORDER API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[ORDER API] Backend error:', errorText);
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
    console.error('[ORDER API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
