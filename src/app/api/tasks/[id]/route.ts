import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { requireAuth, requireAdmin } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);
    const taskId = params.id;

    let query: any = { _id: taskId, isActive: true };

    // If user is a client, only show their tasks
    if (user.role === 'client') {
      query.clientId = user.id;
    } else if (user.role === 'admin') {
      query.assignedAdminId = user.id;
    }

    const task = await Task.findOne(query)
      .populate('clientId', 'firstName lastName email businessName entityName clientType')
      .populate('assignedAdminId', 'firstName lastName email');

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });

  } catch (error) {
    console.error('Get task error:', error);
    
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);
    const taskId = params.id;

    const body = await request.json();
    const updates = { ...body };

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Only admin can update most fields, clients can only update status for their tasks
    let query: any = { _id: taskId, isActive: true };

    if (user.role === 'client') {
      query.clientId = user.id;
      // Clients can only update status and notes
      const allowedUpdates = { status: updates.status, notes: updates.notes };
      Object.keys(updates).forEach(key => {
        if (!['status', 'notes'].includes(key)) {
          delete updates[key];
        }
      });
    } else if (user.role === 'admin') {
      query.assignedAdminId = user.id;
      // Parse numeric fields
      if (updates.priceQuoted) updates.priceQuoted = parseFloat(updates.priceQuoted);
      if (updates.amountPaid) updates.amountPaid = parseFloat(updates.amountPaid);
      // Parse date fields
      if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
      if (updates.startDate) updates.startDate = new Date(updates.startDate);
    }

    const task = await Task.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    )
    .populate('clientId', 'firstName lastName email businessName entityName clientType')
    .populate('assignedAdminId', 'firstName lastName email');

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAdmin(request);
    const taskId = params.id;

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        assignedAdminId: user.id,
      },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    
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
