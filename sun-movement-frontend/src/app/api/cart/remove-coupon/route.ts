import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json();

    if (!couponCode) {
      return NextResponse.json(
        { success: false, error: 'Mã giảm giá không được để trống' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const backendUrl = process.env.BACKEND_API_URL || 'https://localhost:7092';
    const response = await fetch(`${backendUrl}/api/Cart/remove-coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({ couponCode }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend remove coupon error:', errorText);
      
      return NextResponse.json(
        { success: false, error: 'Không thể gỡ bỏ mã giảm giá' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error removing coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi hệ thống khi gỡ bỏ mã giảm giá' },
      { status: 500 }
    );
  }
}
