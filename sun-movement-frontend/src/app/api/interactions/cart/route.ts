import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';
  const response = await fetch(`${backendUrl}/api/cart`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
      'Cookie': request.headers.get('cookie') || '',
    },
    credentials: 'include',
  });
  const data = await response.text();
  return new NextResponse(data, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' }
  });
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[INTERACTIONS CART API] Request body:', body);
    
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    console.log('[INTERACTIONS CART API] Cookies:', cookies);
    
    // Try HTTPS first, then HTTP as fallback
    const httpsUrl = 'https://localhost:5001';
    const httpUrl = 'http://localhost:5000';
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('[INTERACTIONS CART API] Trying:', `${apiUrl}/api/interactions/cart`);
      
      const response = await fetch(`${apiUrl}/api/interactions/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      console.log(`[INTERACTIONS CART API] Response from ${apiUrl}:`, response.status);
      return response;
    };
    
    let response;
    let lastError;
    
    // Try HTTPS first
    try {
      response = await tryApiCall(httpsUrl);
      if (response.ok) {
        // Handle empty response from backend
        const responseText = await response.text();
        let data;
        
        if (responseText.trim() === '') {
          // Backend returned empty response (just Ok()), which is success
          console.log('[INTERACTIONS CART API] Empty response from HTTPS, treating as success');
          data = { success: true, message: 'Interaction tracked successfully' };
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.log('[INTERACTIONS CART API] Failed to parse response as JSON, treating as success');
            data = { success: true, message: 'Interaction tracked successfully' };
          }
        }
        
        console.log('[INTERACTIONS CART API] Success response from HTTPS:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('[INTERACTIONS CART API] HTTPS failed, trying HTTP:', error);
      lastError = error;
    }
    
    // Try HTTP as fallback
    try {
      response = await tryApiCall(httpUrl);
      if (response.ok) {
        // Handle empty response from backend
        const responseText = await response.text();
        let data;
        
        if (responseText.trim() === '') {
          // Backend returned empty response (just Ok()), which is success
          console.log('[INTERACTIONS CART API] Empty response from HTTP, treating as success');
          data = { success: true, message: 'Interaction tracked successfully' };
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.log('[INTERACTIONS CART API] Failed to parse response as JSON, treating as success');
            data = { success: true, message: 'Interaction tracked successfully' };
          }
        }
        
        console.log('[INTERACTIONS CART API] Success response from HTTP:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('[INTERACTIONS CART API] HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('[INTERACTIONS CART API] Backend error response:', errorText);
      
      // Don't fail the request - just log and return success
      // Analytics should not break the cart functionality
      console.log('[INTERACTIONS CART API] Analytics failed but continuing...');
      return NextResponse.json(
        { success: true, message: 'Interaction tracking failed but cart operation can continue' },
        { status: 200 }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('[INTERACTIONS CART API] Fetch error:', error);
    
    // Don't fail the request - just log and return success
    // Analytics should not break the cart functionality
    console.log('[INTERACTIONS CART API] Analytics failed but continuing...');
    return NextResponse.json(
      { success: true, message: 'Interaction tracking failed but cart operation can continue' },
      { status: 200 }
    );
  }
}
