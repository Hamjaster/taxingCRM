import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import Client from '@/models/Client';
import Admin from '@/models/Admin';
import { requireAuth, requireAdmin } from '@/lib/middleware';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query: any = { isActive: true };

    // If user is a client, only show their tasks
    if (user.role === 'client') {
      query.clientId = user.id;
    } else if (user.role === 'admin') {
      // Admin can see all tasks assigned to them
      query.assignedAdminId = user.id;
    }

    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    if (clientId) {
      query.clientId = clientId;
    }
    if (category) {
      query.category = category;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const [tasks, totalTasks] = await Promise.all([
      Task.find(query)
        .populate('clientId', 'firstName lastName email businessName entityName clientType')
        .populate('assignedAdminId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalTasks / limit);

    return NextResponse.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAdmin(request);

    const body = await request.json();
    const {
      title,
      description,
      category,
      clientId,
      status = 'Pending',
      priority = 'Medium',
      priceQuoted = 0,
      amountPaid = 0,
      dueDate,
      startDate,
      notes
    } = body;

    // Validate required fields
    if (!title || !category || !clientId) {
      return NextResponse.json(
        { error: 'Title, category, and client are required' },
        { status: 400 }
      );
    }
    console.log(user.id, clientId, 'logs')
    // Verify client exists and belongs to this admin
    const client = await Client.findOne({
      _id: new mongoose.Types.ObjectId(clientId),
      assignedAdminId: new mongoose.Types.ObjectId(user.id),
      status: 'Active'
    });


    if (!client) {
      return NextResponse.json(
        { error: 'Invalid client or client not assigned to you' },
        { status: 400 }
      );
    }

    // Create task
    const task = new Task({
      title,
      description,
      category,
      clientId,
      assignedAdminId: user.id,
      status,
      priority,
      priceQuoted: parseFloat(priceQuoted) || 0,
      amountPaid: parseFloat(amountPaid) || 0,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      notes,
    });

    await task.save();

    // Populate the created task
    await task.populate([
      { path: 'clientId', select: 'firstName lastName email businessName entityName clientType' },
      { path: 'assignedAdminId', select: 'firstName lastName email' }
    ]);

    return NextResponse.json({
      message: 'Task created successfully',
      task
    }, { status: 201 });

  } catch (error) {
    console.error('Create task error:', error);
    
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
