import { NextRequest, NextResponse } from "next/server";
import { withCors } from '@/lib/cors';

async function handler(request: NextRequest) {
  try {
    const testing = process.env.TESTING!;
    
    // Return success response indicating OTP is required
    return NextResponse.json({
      data: testing,
      success: true,
      message: 'This endpoint now supports CORS!',
      origin: request.headers.get('origin') || 'No origin header',
    });

  } catch (error) {
    console.error('Get error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export with CORS support
export const GET = withCors(handler);
export const OPTIONS = withCors(handler);