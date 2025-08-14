import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { verifyOTP } from '@/lib/otp';
import { generateJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp } = body;

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpVerification = verifyOTP(email, otp);
    
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

    // Find client by email
    const client = await Client.findOne({ email: email.toLowerCase() });

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    // Check if client is active
    if (!client.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated. Please contact your administrator.' },
        { status: 401 }
      );
    }

    // Update last login and email verification status
    client.lastLogin = new Date();
    client.isEmailVerified = true;
    await client.save();

    // Generate JWT token for client
    const token = generateJWT({
      id: client._id.toString(),
      role: "client",
    });

    // Remove sensitive information before sending response
    const clientData = client.toObject();
    delete clientData.password;

    // Create response with client data
    const response = NextResponse.json({
      message: 'OTP verified successfully. Login completed.',
      data: { ...clientData, token },
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