import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Try HTTPS first, then HTTP as fallback
  const httpsUrl = 'https://localhost:5001';
  const httpUrl = 'http://localhost:5000';
  
  try {
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    console.log('Cart GET API - Cookies:', cookies);
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('Cart GET API - Trying:', `${apiUrl}/api/ShoppingCart/items`);
      
      const response = await fetch(`${apiUrl}/api/ShoppingCart/items`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        credentials: 'include',
      });

      console.log(`Cart GET API - Response from ${apiUrl}:`, response.status);
      return response;
    };
    
    let response;
    let lastError;
    
    // Try HTTPS first
    try {
      response = await tryApiCall(httpsUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Cart GET API - Success response from HTTPS:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Cart GET API - HTTPS failed, trying HTTP:', error);
      lastError = error;
    }
    
    // Try HTTP as fallback
    try {
      response = await tryApiCall(httpUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('Cart GET API - Success response from HTTP:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Cart GET API - HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Cart GET API - Backend error response:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch cart data: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('Cart GET API - Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Try HTTPS first, then HTTP as fallback
  const httpsUrl = 'https://localhost:5001';
  const httpUrl = 'http://localhost:5000';
  
  try {
    const body = await request.json();
    console.log('Cart API - Request body:', body);
    
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    console.log('Cart API - Cookies:', cookies);
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('Cart API - Trying:', `${apiUrl}/api/ShoppingCart/items`);
      
      const response = await fetch(`${apiUrl}/api/ShoppingCart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      console.log(`Cart API - Response from ${apiUrl}:`, response.status);
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
          console.log('Cart API - Empty response from HTTPS, treating as success');
          data = { success: true, message: 'Item added successfully' };
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.log('Cart API - Failed to parse response as JSON, treating as success');
            data = { success: true, message: 'Item added successfully' };
          }
        }
        
        console.log('Cart API - Success response from HTTPS:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Cart API - HTTPS failed, trying HTTP:', error);
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
          console.log('Cart API - Empty response from HTTP, treating as success');
          data = { success: true, message: 'Item added successfully' };
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.log('Cart API - Failed to parse response as JSON, treating as success');
            data = { success: true, message: 'Item added successfully' };
          }
        }
        
        console.log('Cart API - Success response from HTTP:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Cart API - HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Cart API - Backend error response:', errorText);
      return NextResponse.json(
        { error: `Failed to add to cart: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('Cart API - Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  // Try HTTPS first, then HTTP as fallback
  const httpsUrl = 'https://localhost:5001';
  const httpUrl = 'http://localhost:5000';
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
    console.log('Cart DELETE API - ItemId:', itemId, 'Cookies:', cookies);
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('Cart DELETE API - Trying:', `${apiUrl}/api/ShoppingCart/items/${itemId}`);
      
      const response = await fetch(`${apiUrl}/api/ShoppingCart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        credentials: 'include',
      });

      console.log(`Cart DELETE API - Response from ${apiUrl}:`, response.status);
      return response;
    };
    
    let response;
    let lastError;
    
    // Try HTTPS first
    try {
      response = await tryApiCall(httpsUrl);
      if (response.ok) {
        console.log('Cart DELETE API - Success response from HTTPS');
        return NextResponse.json({ success: true });
      }
    } catch (error) {
      console.log('Cart DELETE API - HTTPS failed, trying HTTP:', error);
      lastError = error;
    }
    
    // Try HTTP as fallback
    try {
      response = await tryApiCall(httpUrl);
      if (response.ok) {
        console.log('Cart DELETE API - Success response from HTTP');
        return NextResponse.json({ success: true });
      }
    } catch (error) {
      console.log('Cart DELETE API - HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Cart DELETE API - Backend error response:', errorText);
      return NextResponse.json(
        { error: `Failed to remove from cart: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('Cart DELETE API - Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Try HTTPS first, then HTTP as fallback
  const httpsUrl = 'https://localhost:5001';
  const httpUrl = 'http://localhost:5000';
  
  try {
    const body = await request.json();
    console.log('Cart PUT API - Request body:', body);
    
    // Extract cookies from incoming request to forward to API
    const cookies = request.headers.get('cookie') || '';
    console.log('Cart PUT API - Cookies:', cookies);
    
    // Function to try API call with different URLs
    const tryApiCall = async (apiUrl: string) => {
      console.log('Cart PUT API - Trying:', `${apiUrl}/api/ShoppingCart/items`);
      
      const response = await fetch(`${apiUrl}/api/ShoppingCart/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      console.log(`Cart PUT API - Response from ${apiUrl}:`, response.status);
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
          console.log('Cart PUT API - Empty response from HTTPS, treating as success');
          data = { success: true, message: 'Item updated successfully' };
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.log('Cart PUT API - Failed to parse response as JSON, treating as success');
            data = { success: true, message: 'Item updated successfully' };
          }
        }
        
        console.log('Cart PUT API - Success response from HTTPS:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Cart PUT API - HTTPS failed, trying HTTP:', error);
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
          console.log('Cart PUT API - Empty response from HTTP, treating as success');
          data = { success: true, message: 'Item updated successfully' };
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.log('Cart PUT API - Failed to parse response as JSON, treating as success');
            data = { success: true, message: 'Item updated successfully' };
          }
        }
        
        console.log('Cart PUT API - Success response from HTTP:', data);
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log('Cart PUT API - HTTP also failed:', error);
      lastError = error;
    }
    
    // If we get here, both attempts failed
    if (response && !response.ok) {
      const errorText = await response.text();
      console.error('Cart PUT API - Backend error response:', errorText);
      return NextResponse.json(
        { error: `Failed to update cart: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    throw lastError;
    
  } catch (error) {
    console.error('Cart PUT API - Fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
