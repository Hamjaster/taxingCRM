import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateJWT } from '@/lib/auth';
import { OTPVerification } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: { userId?: string; firebaseUid?: string; phone?: string } = await request.json();
    const { userId, firebaseUid, phone } = body;

    // Validate required fields
    if (!userId && !phone && !firebaseUid) {
      return NextResponse.json(
        { error: 'User ID, phone number, or Firebase UID is required' },
        { status: 400 }
      );
    }

    // Find user by userId, phone, or create if Firebase verification is successful
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (phone) {
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

    // Since Firebase has already verified the phone number,
    // we just need to mark the user as phone verified
    user.isPhoneVerified = true;
    user.lastLogin = new Date();

    // Store Firebase UID if provided for future reference
    if (firebaseUid) {
      user.firebaseUid = firebaseUid;
    }

    await user.save();

    // Generate JWT token
    const token = generateJWT({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      message: 'Phone verified successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
