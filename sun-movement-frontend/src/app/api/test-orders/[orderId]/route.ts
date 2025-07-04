import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log('[TEST ORDER API] Testing orderId:', orderId);

    // Directly call backend without multiple retries
    const backendUrl = 'http://localhost:5000';
    
    console.log('[TEST ORDER API] Calling:', `${backendUrl}/api/orders/${orderId}`);
    
    const response = await fetch(`${backendUrl}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[TEST ORDER API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[TEST ORDER API] Backend error:', errorText);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[TEST ORDER API] Backend data:', data);

    return NextResponse.json(data);

  } catch (error) {
    console.error('[TEST ORDER API] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
