import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { requireAuth } from '@/lib/middleware';
import bcrypt from 'bcryptjs';
import OTP from '@/models/OTP';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const adminUser = requireAuth(request);
    
    // Only admins can reset password
    if (adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify the admin exists and the email matches
    const admin = await Admin.findById(adminUser.id);
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    if (admin.email !== email) {
      return NextResponse.json(
        { error: 'Email does not match your account' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: 'PASSWORD_RESET',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update admin password
    await Admin.findByIdAndUpdate(adminUser.id, {
      password: hashedPassword
    });

    // Mark OTP as used
    await OTP.findByIdAndUpdate(otpRecord._id, {
      isUsed: true
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
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
