import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Client from '@/models/Client';
import { generateJWT, hashPassword } from '@/lib/auth';
import { RegisterData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: RegisterData  = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }


    // Check if user already exists in both collections
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    let user;

      // Create admin user
      user = new Admin({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        clients: [], // Initialize empty clients array
      });
   

    await user.save();

    const token = generateJWT({
      id: user._id.toString(),
      role: "admin",
    });

    return NextResponse.json({
      message: `Admin registered!`,
      success : true,
      data : {...user._doc, token}
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
