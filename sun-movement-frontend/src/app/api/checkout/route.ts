import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Try HTTPS first, then HTTP as fallback
  const httpsUrl = 'https://localhost:5001';
  const httpUrl = 'http://localhost:5000';
  
  try {
    const body = await request.json();
    console.log('Checkout API - Request body:', body);
    
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    console.log('Checkout API - Cookies:', cookies);
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('Checkout API - Trying:', `${apiUrl}/api/orders/checkout`);
      
      const response = await fetch(`${apiUrl}/api/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      console.log(`Checkout API - Response from ${apiUrl}:`, response.status);
      return response;
    };
    
    let response;
    let lastError;
    
    // Try HTTPS first
    try {
      response = await tryApiCall(httpsUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Checkout API - Success response from HTTPS:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Checkout API - HTTPS failed, trying HTTP:', error);
      lastError = error;
    }
    
    // Try HTTP as fallback
    try {
      response = await tryApiCall(httpUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Checkout API - Success response from HTTP:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Checkout API - HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Checkout API - Backend error response:', errorText);
      return NextResponse.json(
        { error: `Failed to process checkout: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('Checkout API - Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
