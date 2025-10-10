import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { requireAuth } from '@/lib/middleware';
import { generateOTP, sendOTPEmail } from '@/lib/otp';
import OTP from '@/models/OTP';
import { generateOTPEmailHTML, generateOTPEmailText, sendEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const adminUser = requireAuth(request);
    
    // Only admins can request password reset
    if (adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Verify the admin exists and the email matches
    const admin = await (Admin as any).findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Email already verified by finding admin by email

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email, type: 'PASSWORD_RESET' },
      {
        email,
        otp: otpCode,
        type: 'PASSWORD_RESET',
        expiresAt,
        isUsed: false,
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    try {
          // Prepare email content
    const emailHTML = generateOTPEmailHTML(otpCode, admin.firstName);
    const emailText = generateOTPEmailText(otpCode, admin.firstName);

    // Send OTP email
    const emailSent = await sendEmail({
      to: email,
      subject: `Your TaxingCRM Admin Password Reset Code`,
      html: emailHTML,
      text: emailText,
    });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
    });

  } catch (error) {
    console.error('Send password reset OTP error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
