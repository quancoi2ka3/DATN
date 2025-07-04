import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    // Extract orderId from URL pathname
    const pathname = request.nextUrl.pathname;
    const orderId = pathname.split('/').pop();
    
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
      headers: {
        'Content-Type': 'application/json',
      },
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
