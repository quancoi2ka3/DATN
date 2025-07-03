import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7296';

export async function GET(request: NextRequest) {
  try {
    console.log('[ORDERS API] GET request received');

    // Get auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-token');
    
    if (!authCookie?.value) {
      console.log('[ORDERS API] No auth token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login to view orders' },
        { status: 401 }
      );
    }

    console.log('[ORDERS API] Auth token found');

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
        console.log('[ORDERS API] Trying:', `${apiUrl}/api/orders`);
        
        const response = await fetch(`${apiUrl}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authCookie.value}`,
          },
        });

        console.log('[ORDERS API] Response status:', response.status);

        if (response.ok) {
          const text = await response.text();
          console.log('[ORDERS API] Response text:', text.substring(0, 200));

          if (!text.trim()) {
            return NextResponse.json({
              success: true,
              orders: []
            });
          }

          const data = JSON.parse(text);
          return NextResponse.json({
            success: true,
            orders: data.orders || data || []
          });
        } else {
          const errorText = await response.text();
          console.log(`[ORDERS API] Error response from ${apiUrl}:`, response.status, errorText);
          lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.log(`[ORDERS API] Failed to connect to ${apiUrl}:`, error);
        lastError = error as Error;
        continue;
      }
    }

    console.error('[ORDERS API] All endpoints failed. Last error:', lastError);
    return NextResponse.json(
      { 
        success: false, 
        error: lastError?.message || 'Failed to fetch orders'
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('[ORDERS API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
