import { NextRequest, NextResponse } from 'next/server';

type Params = {
  orderId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    return NextResponse.json({ 
      message: 'Dynamic route works',
      orderId: resolvedParams.orderId,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to resolve params',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
