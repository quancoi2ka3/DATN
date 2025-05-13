import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  // For admin API routes, check for authentication
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Authentication required' }), {
        status: 401, 
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Here we would normally validate the JWT and its roles, but for simplicity 
    // we'll pass it through and let the backend handle validation
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
