import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, phone } = body;

    // Validate required fields
    if (!userId && !phone) {
      return NextResponse.json(
        { error: 'User ID or phone number is required' },
        { status: 400 }
      );
    }

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // With Firebase, resending is handled on the client side
    // This endpoint is kept for compatibility but doesn't do much
    return NextResponse.json({
      message: 'Please use Firebase to resend verification code',
      phoneNumber: user.phone,
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
