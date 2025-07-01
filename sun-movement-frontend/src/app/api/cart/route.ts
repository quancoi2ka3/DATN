import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';
  
  try {
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    
    const response = await fetch(`${apiUrl}/api/ShoppingCart/items`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch cart data: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';
  const body = await request.json();
  
  try {
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    
    const response = await fetch(`${apiUrl}/api/ShoppingCart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to add to cart: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001';
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('itemId');
  
  if (!itemId) {
    return NextResponse.json(
      { error: 'Item ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    
    const response = await fetch(`${apiUrl}/api/ShoppingCart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to remove from cart: ${response.status}` },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
