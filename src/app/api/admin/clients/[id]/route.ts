import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { requireAdmin } from '@/lib/middleware';

// Get specific client details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);
    const clientId = await params.id;

    const client = await Client.findOne({
      _id: clientId,
      assignedAdminId: adminUser.id,
    });

    if (!client) {
      return NextResponse.json(
        { success : false, message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: client, success: true });

  } catch (error) {
    console.error('Get client error:', error);
    
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

// Update client information
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);
    const clientId = await params.id;
    const updates = await request.json();

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.assignedAdminId;
    delete updates._id;

    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        assignedAdminId: adminUser.id,
      
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Client updated successfully',
      data: client,
      success: true
    });

  } catch (error) {
    console.error('Update client error:', error);
    
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

// Deactivate client (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const adminUser = requireAdmin(request);
    const clientId = await params.id;

    const client = await Client.findOneAndUpdate(
      {
        _id: clientId,
        assignedAdminId: adminUser.id,
      },
      { $set: { status: 'Inactive' } },
      { new: true }
    );

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Client deactivated successfully'
    });

  } catch (error) {
    console.error('Delete client error:', error);
    
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
