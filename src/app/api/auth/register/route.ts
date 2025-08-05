import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { formatPhoneNumber } from '@/lib/firebase-auth';
import { RegisterData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterData = await request.json();
    const { email, password, firstName, lastName, phone, role } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'client'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone: formatPhoneNumber(phone) }]
    });

    if (existingUser) {
      // If user exists but phone is not verified, allow them to complete verification
      if (!existingUser.isPhoneVerified) {
        return NextResponse.json({
          message: 'Account exists but phone not verified. Please complete phone verification.',
          userId: existingUser._id,
          phoneNumber: existingUser.phone,
          needsVerification: true,
        }, { status: 200 });
      }

      return NextResponse.json(
        { error: 'User with this email or phone already exists and is already verified' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone);

    // Create user (without OTP fields since Firebase handles verification)
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone: formattedPhone,
      role,
      // Note: isPhoneVerified will be set to true after Firebase verification
    });

    await user.save();

    return NextResponse.json({
      message: 'User registered successfully. Please verify your phone number with Firebase.',
      userId: user._id,
      phoneNumber: formattedPhone,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
