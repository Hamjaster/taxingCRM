import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8080',
      'https://totportal.us',
      "https://taxing-crm.vercel.app/",
      process.env.NEXT_PUBLIC_API_URL, // Replace with your production domain
    ];

    // For development, allow all origins
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAllowedOrigin = isDevelopment || !origin || allowedOrigins.includes(origin);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      
      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin || '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400');
        
        if (origin && allowedOrigins.includes(origin)) {
          response.headers.set('Access-Control-Allow-Credentials', 'true');
        }
      }
      
      return response;
    }

    // For non-preflight requests, add CORS headers to the response
    const response = NextResponse.next();
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
