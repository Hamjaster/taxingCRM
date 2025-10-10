import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { requireAdmin } from '@/lib/middleware';
import bcrypt from 'bcryptjs';

// Update client password
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);
    const clientId = await params.id;
    const { newPassword } = await request.json();

    // Validate input
    if (!newPassword) {
      return NextResponse.json(
        { success: false, message: 'New password is required' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }


    // Find the client and verify admin has access
    const client = await Client.findOne({
      _id: clientId,
      assignedAdminId: adminUser.id,
    });

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the client's password
    await Client.findByIdAndUpdate(
      clientId,
      { $set: { password: hashedPassword } },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Client password updated successfully'
    });

  } catch (error) {
    console.error('Update client password error:', error);
    
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
