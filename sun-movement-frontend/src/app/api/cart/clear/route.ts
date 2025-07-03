import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  // Try HTTPS first, then HTTP as fallback
  const httpsUrl = 'https://localhost:5001';
  const httpUrl = 'http://localhost:5000';
  
  try {
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    console.log('Cart CLEAR API - Cookies:', cookies);
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('Cart CLEAR API - Trying:', `${apiUrl}/api/ShoppingCart/clear`);
      
      const response = await fetch(`${apiUrl}/api/ShoppingCart/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        credentials: 'include',
      });

      console.log(`Cart CLEAR API - Response from ${apiUrl}:`, response.status);
      return response;
    };
    
    let response;
    let lastError;
    
    // Try HTTPS first
    try {
      response = await tryApiCall(httpsUrl);
      if (response.ok) {
        console.log('Cart CLEAR API - Success response from HTTPS');
        return NextResponse.json({ success: true });
      }
    } catch (error) {
      console.log('Cart CLEAR API - HTTPS failed, trying HTTP:', error);
      lastError = error;
    }
    
    // Try HTTP as fallback
    try {
      response = await tryApiCall(httpUrl);
      if (response.ok) {
        console.log('Cart CLEAR API - Success response from HTTP');
        return NextResponse.json({ success: true });
      }
    } catch (error) {
      console.log('Cart CLEAR API - HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Cart CLEAR API - Backend error response:', errorText);
      return NextResponse.json(
        { error: `Failed to clear cart: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('Cart CLEAR API - Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
