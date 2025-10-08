import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import Admin from '@/models/Admin';
import { verifyOTP } from '@/lib/otp';
import { generateJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp, userType } = body;

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpVerification = await verifyOTP(email, otp);
    
    if (!otpVerification.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: otpVerification.message,
          attemptsLeft: otpVerification.attemptsLeft 
        },
        { status: 400 }
      );
    }

    // Find user by email and type
    let user;
    let role;
    
    if (userType === 'admin') {
      user = await Admin.findOne({ email: email.toLowerCase() });
      role = 'admin';
    } else {
      user = await Client.findOne({ email: email.toLowerCase() });
      role = 'client';
    }
    console.log(user, "USER FOUND !")

    if (!user) {
      return NextResponse.json(
        { success: false, message: `${userType === 'admin' ? 'Admin' : 'Client'} not found` },
        { status: 404 }
      );
    }

    // Check if user is active
    if (user.status !== 'Active' && userType === 'client') {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated. Please contact your administrator.' },
        { status: 401 }
      );
    }

    // Update last login and email verification status
    user.lastLogin = new Date();
    if (userType === 'client') {
      user.isEmailVerified = true;
    }
    await user.save();

    // Generate JWT token
    const token = generateJWT({
      id: user._id.toString(),
      role: role,
    });

    // Remove sensitive information before sending response
    const userData = user.toObject();
    delete userData.password;

    // Create response with user data
    const response = NextResponse.json({
      message: 'OTP verified successfully. Login completed.',
      data: { ...userData, token },
      success: true,
    });

    return response;

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}