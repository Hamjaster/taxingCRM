import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { generateOTP, storeOTP, hasActiveOTP, getOTPRemainingTime } from '@/lib/otp';
import { sendEmail, generateOTPEmailHTML, generateOTPEmailText } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find client by email
    const client = await Client.findOne({ email: email.toLowerCase() });

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'No client found with this email address' },
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

    // Check if there's already an active OTP
    if (hasActiveOTP(email)) {
      const remainingTime = getOTPRemainingTime(email);
      return NextResponse.json(
        { 
          success: false, 
          message: `OTP already sent. Please wait ${remainingTime} minutes before requesting a new code.`,
          remainingTime 
        },
        { status: 429 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(email, otp, 10); // 10 minutes expiry

    // Prepare email content
    const emailHTML = generateOTPEmailHTML(otp, client.firstName);
    const emailText = generateOTPEmailText(otp, client.firstName);

    // Send OTP email
    const emailSent = await sendEmail({
      to: email,
      subject: 'Your TaxingCRM Login Code',
      html: emailHTML,
      text: emailText,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email address',
      email: email,
      expiryMinutes: 10,
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
