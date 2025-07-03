import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Tracking product view:', body);
    
    // Here you would normally save to database for recommendation system
    // For now, just return success
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking product view:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
