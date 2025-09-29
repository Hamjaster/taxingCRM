import { NextRequest, NextResponse } from 'next/server';

// Define allowed origins - you can customize this based on your needs
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'https://yourdomain.com', // Replace with your production domain
  // Add more domains as needed
];

// For development, you might want to allow all origins
const ALLOW_ALL_ORIGINS = process.env.NODE_ENV === 'development';

export function getCorsHeaders(origin?: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours
  };

  // Set Access-Control-Allow-Origin
  if (ALLOW_ALL_ORIGINS || !origin) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    // For production, you might want to be more restrictive
    headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGINS[0] || '*';
  }

  // Set credentials header if needed
  if (headers['Access-Control-Allow-Origin'] !== '*') {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

export function handleCors(request: NextRequest): NextResponse | Record<string, string> {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  return corsHeaders;
}

export function withCors(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const corsResult = handleCors(request);
    
    // If it's a preflight request, return early
    if (request.method === 'OPTIONS') {
      return corsResult as NextResponse;
    }

    const corsHeaders = corsResult as Record<string, string>;

    try {
      const response = await handler(request);
      
      // Add CORS headers to the response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse = NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
      
      // Add CORS headers to error response too
      Object.entries(corsHeaders).forEach(([key, value]) => {
        errorResponse.headers.set(key, value);
      });

      return errorResponse;
    }
  };
}
