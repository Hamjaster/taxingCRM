import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import Admin from '@/models/Admin';
import { generateOTP, storeOTP, hasActiveOTP, getOTPRemainingTime } from '@/lib/otp';
import { sendEmail, generateOTPEmailHTML, generateOTPEmailText } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, userType } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email and type
    let user: any;
    let userTypeLabel: string;
    
    if (userType === 'admin') {
      user = await (Admin as any).findOne({ email: email.toLowerCase() });
      userTypeLabel = 'admin';
    } else {
      user = await (Client as any).findOne({ email: email.toLowerCase() });
      userTypeLabel = 'client';
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: `No ${userTypeLabel} found with this email address` },
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

    // Check if there's already an active OTP
    if (await hasActiveOTP(email)) {
      const remainingTime = await getOTPRemainingTime(email);
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
    await storeOTP(email, otp, 10); // 10 minutes expiry

    // Prepare email content
    const emailHTML = generateOTPEmailHTML(otp, user.firstName);
    const emailText = generateOTPEmailText(otp, user.firstName);

    // Send OTP email
    const emailSent = await sendEmail({
      to: email,
      subject: `Your TaxingCRM ${userType === 'admin' ? 'Admin' : 'Customer'} Login Code`,
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
