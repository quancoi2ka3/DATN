import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { couponCode, orderTotal, items } = await request.json();

    if (!couponCode) {
      return NextResponse.json(
        { isValid: false, discountAmount: 0, error: 'Mã giảm giá không được để trống' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const backendUrl = process.env.BACKEND_API_URL || 'https://localhost:7092';
    const response = await fetch(`${backendUrl}/api/Cart/validate-coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        couponCode,
        orderTotal,
        items
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend validation error:', errorText);
      
      return NextResponse.json(
        { 
          isValid: false, 
          discountAmount: 0, 
          error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' 
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { 
        isValid: false, 
        discountAmount: 0, 
        error: 'Lỗi hệ thống khi xác thực mã giảm giá' 
      },
      { status: 500 }
    );
  }
}
