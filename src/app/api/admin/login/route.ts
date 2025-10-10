import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Client from '@/models/Client';
import { verifyPassword, generateJWT } from '@/lib/auth';
import { LoginCredentials } from '@/types';
import { generateOTP, storeOTP, hasActiveOTP, getOTPRemainingTime } from '@/lib/otp';
import { sendEmail, generateOTPEmailHTML, generateOTPEmailText } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'No such admin found' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if there's already an active OTP
    if (await hasActiveOTP(email)) {
      const remainingTime = await getOTPRemainingTime(email);
      return NextResponse.json(
        { 
          success: false, 
          requiresOTP: true,
          message: `OTP already sent. Please check your email or wait ${remainingTime} minutes for a new code.`,
          email: email,
          remainingTime 
        },
        { status: 200 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp, 1); // 1 minute expiry

    // Prepare email content
    const emailHTML = generateOTPEmailHTML(otp, admin.firstName);
    const emailText = generateOTPEmailText(otp, admin.firstName);

    // Send OTP email
    console.log('Sending OTP to admin:', email);
    const emailSent = await sendEmail({
      to: email,
      subject: 'Your TaxingCRM Admin Login Code',
      html: emailHTML,
      text: emailText,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    // Return success response indicating OTP is required
    return NextResponse.json({
      success: true,
      requiresOTP: true,
      message: 'Password verified. Please check your email for the OTP code.',
      email: email,
      expiryMinutes: 1,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
