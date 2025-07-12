import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001';

export async function GET(request: NextRequest) {
  try {
    console.log('[ORDERS API] GET request received');

    // Get auth token from cookies
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth-token');
    const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
    console.log('[ORDERS API] Auth token:', authCookie?.value ? 'found' : 'not found');

    // Try multiple API URLs
    const apiUrls = [
      'http://localhost:5000', // Prioritize HTTP first
      'https://localhost:5001',
      API_BASE_URL,
      API_BASE_URL.replace('https://', 'http://'),
      'http://localhost:5001', 
      'https://localhost:7296'
    ];

    let lastError: Error | null = null;

    for (const apiUrl of apiUrls) {
      try {
        console.log('[ORDERS API] Trying:', `${apiUrl}/api/orders`);
        
        // Forward authentication headers from client request
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching
          'Pragma': 'no-cache',
          'Expires': '0'
        };

        // Forward cookies for authentication
        const clientCookies = request.headers.get('cookie');
        if (clientCookies) {
          headers['Cookie'] = clientCookies;
          console.log('[ORDERS API] Forwarding cookies to backend');
        }

        // Forward Authorization header if present
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
          headers['Authorization'] = authHeader;
          console.log('[ORDERS API] Forwarding Authorization header to backend');
        }
        
        // Add authorization header from cookie if available
        if (authCookie?.value) {
          headers['Authorization'] = `Bearer ${authCookie.value}`;
          console.log('[ORDERS API] Using auth cookie as Bearer token');
        }
        
        const response = await fetch(`${apiUrl}/api/orders`, {
          method: 'GET',
          headers,
          cache: 'no-store', // Prevent Next.js caching
        });

        console.log('[ORDERS API] Response status:', response.status);

        if (response.ok) {
          const text = await response.text();
          console.log('[ORDERS API] Response text:', text.substring(0, 200));

          if (!text.trim()) {
            return NextResponse.json({
              success: true,
              orders: []
            }, {
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
          }

          const data = JSON.parse(text);
          return NextResponse.json({
            success: true,
            orders: data.orders || data || []
          }, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
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
