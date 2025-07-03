import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7296';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('[ORDER DETAIL API] GET request for orderId:', orderId);

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-token');
    
    if (!authCookie?.value) {
      console.log('[ORDER DETAIL API] No auth token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login to view order details' },
        { status: 401 }
      );
    }

    console.log('[ORDER DETAIL API] Auth token found');

    // Try HTTPS first, then fallback to HTTP
    const apiUrls = [
      API_BASE_URL,
      API_BASE_URL.replace('https://', 'http://'),
      'http://localhost:5000',
      'https://localhost:7296'
    ];

    let lastError: Error | null = null;

    for (const apiUrl of apiUrls) {
      try {
        console.log('[ORDER DETAIL API] Trying:', `${apiUrl}/api/orders/${orderId}`);
        
        const response = await fetch(`${apiUrl}/api/orders/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCookie.value}`,
          },
        });

        console.log('[ORDER DETAIL API] Response status:', response.status);

        if (response.ok) {
          const text = await response.text();
          console.log('[ORDER DETAIL API] Response text:', text.substring(0, 200));

          if (!text.trim()) {
            return NextResponse.json({
              success: false,
              error: 'Order not found'
            }, { status: 404 });
          }

          const data = JSON.parse(text);
          return NextResponse.json({
            success: true,
            order: data.order || data
          });
        } else {
          const errorText = await response.text();
          console.log(`[ORDER DETAIL API] Error response from ${apiUrl}:`, response.status, errorText);
          
          if (response.status === 404) {
            return NextResponse.json({
              success: false,
              error: 'Order not found'
            }, { status: 404 });
          }
          
          lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.log(`[ORDER DETAIL API] Failed to connect to ${apiUrl}:`, error);
        lastError = error as Error;
        continue;
      }
    }

    console.error('[ORDER DETAIL API] All endpoints failed. Last error:', lastError);
    return NextResponse.json(
      { 
        success: false, 
        error: lastError?.message || 'Failed to fetch order details'
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('[ORDER DETAIL API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
