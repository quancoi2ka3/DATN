import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Tracking recommendation shown:', body);
    
    // Here you would normally save to database
    // For now, just return success
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking recommendation shown:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
