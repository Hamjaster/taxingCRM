import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Client from '@/models/Client';
import { requireAdmin } from '@/lib/middleware';

// Get all clients for the authenticated admin
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);

    const clients = await Client.find({ 
      assignedAdminId: adminUser.id,
      isActive: true 
    })
    .select('firstName lastName email phone isEmailVerified isPhoneVerified lastLogin createdAt clientType status assignedAdminId')
    .sort({ createdAt: -1 });

    return NextResponse.json({ data: clients, success: true });

  } catch (error) {
    console.error('Get admin clients error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new client for the authenticated admin
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);

    const body = await request.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      clientType = 'Individual',
      ssn,
      address,
      businessName,
      ein
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if client already exists
    const existingClient = await Client.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingClient) {
      return NextResponse.json(
        { success: false, message: 'Client with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new client
    const client = new Client({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      assignedAdminId: adminUser.id,
      clientType,
      status: 'Active',
      ssn,
      address,
      businessName,
      ein,
      isPhoneVerified: false, // Will need verification
    });

    await client.save();

    // Add client to admin's clients array
    await Admin.findByIdAndUpdate(
      adminUser.id,
      { $addToSet: { clients: client._id } }
    );

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      data: client,
    }, { status: 201 });

  } catch (error) {
    console.error('Create client error:', error);
    
    if (error instanceof Error && error.message.includes('required')) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
