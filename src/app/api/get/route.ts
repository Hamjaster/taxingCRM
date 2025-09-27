import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
     
     
  
      
  
     const testing = process.env.TESTING!;
      
  
        
      // Return success response indicating OTP is required
      return NextResponse.json({
        data: testing,
        success: true,
      });
  
    } catch (error) {
      console.error('Get error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }