import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orderId = url.pathname.split('/').pop();
    
    return NextResponse.json({ 
      message: 'Simple API works',
      orderId: orderId,
      path: url.pathname,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
