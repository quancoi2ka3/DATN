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
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/Cart/apply-coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({ couponCode }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend apply coupon error:', errorText);
      
      let errorMessage = 'Không thể áp dụng mã giảm giá';
      
      if (response.status === 400) {
        errorMessage = 'Mã giảm giá không hợp lệ hoặc không áp dụng được cho đơn hàng này';
      } else if (response.status === 404) {
        errorMessage = 'Mã giảm giá không tồn tại';
      } else if (response.status === 409) {
        errorMessage = 'Mã giảm giá đã được sử dụng hoặc đã hết lượt sử dụng';
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error applying coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi hệ thống khi áp dụng mã giảm giá' },
      { status: 500 }
    );
  }
}
