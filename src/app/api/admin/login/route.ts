import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Client from '@/models/Client';
import { verifyPassword, generateJWT } from '@/lib/auth';
import { LoginCredentials } from '@/types';

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

    // Find user in both collections
    const admin = await 
    Admin.findOne({ email: email.toLowerCase() })

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
        { success : false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token directly (no OTP required for login)
    const token = generateJWT({
      id: admin._id.toString(),
      role: "admin",
    });

    // Create response with user data
    const response = NextResponse.json({
      message: 'Login successful',
      data: {...admin._doc, token},
      success: true,
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
