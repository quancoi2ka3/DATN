import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('[ORDER CANCEL API] POST request for orderId:', orderId);

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Forward cookies and Authorization header
    const clientCookies = request.headers.get('cookie');
    let authHeader = request.headers.get('authorization');
    if (!authHeader) {
      // Try to get token from cookie (for SSR)
      const cookieHeader = clientCookies || '';
      const match = cookieHeader.match(/auth-token=([^;]+)/);
      if (match) {
        authHeader = `Bearer ${decodeURIComponent(match[1])}`;
        console.log('[ORDER CANCEL API] Using auth-token from cookie as Bearer token');
      }
    }
    if (!authHeader) {
      console.log('[ORDER CANCEL API] No auth token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login to cancel order' },
        { status: 401 }
      );
    }

    // Try multiple API URLs
    const apiUrls = [
      API_BASE_URL,
      API_BASE_URL.replace('https://', 'http://'),
      'https://localhost:5001',
      'http://localhost:5001',
      'https://localhost:7296',
      'http://localhost:5000'
    ];

    let lastError: Error | null = null;

    for (const apiUrl of apiUrls) {
      try {
        console.log('[ORDER CANCEL API] Trying:', `${apiUrl}/api/orders/${orderId}/cancel`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`${apiUrl}/api/orders/${orderId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
            ...(clientCookies ? { 'Cookie': clientCookies } : {})
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('[ORDER CANCEL API] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            message: 'Order cancelled successfully',
            ...data
          });
        } else {
          const errorText = await response.text();
          console.log(`[ORDER CANCEL API] Error response from ${apiUrl}:`, response.status, errorText);
          
          if (response.status === 404) {
            return NextResponse.json({
              success: false,
              error: 'Order not found or cannot be cancelled'
            }, { status: 404 });
          }
          
          if (response.status === 401) {
            return NextResponse.json({
              success: false,
              error: 'Unauthorized - Please login again'
            }, { status: 401 });
          }
          
          if (response.status === 400) {
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch {
              errorData = { error: errorText };
            }
            return NextResponse.json({
              success: false,
              error: errorData.error || 'Order cannot be cancelled'
            }, { status: 400 });
          }
          
          lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.log(`[ORDER CANCEL API] Failed to connect to ${apiUrl}:`, error);
        lastError = error as Error;
        continue;
      }
    }

    console.error('[ORDER CANCEL API] All endpoints failed. Last error:', lastError);
    return NextResponse.json(
      { 
        success: false, 
        error: lastError?.message || 'Failed to cancel order'
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('[ORDER CANCEL API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
