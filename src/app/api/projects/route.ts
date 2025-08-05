import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import ServiceType from '@/models/ServiceType';
import { requireAuth, requireAdmin } from '@/lib/middleware';
import { CreateProjectData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    let query = {};
    
    // If user is a client, only show their projects
    if (user.role === 'client') {
      query = { clientId: user.id, isActive: true };
    } else {
      // Admin can see all projects
      query = { isActive: true };
    }

    const projects = await Project.find(query)
      .populate('clientId', 'firstName lastName email')
      .populate('assignedAdminId', 'firstName lastName email')
      .populate('serviceTypes', 'name description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('Get projects error:', error);
    
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

    const body: CreateProjectData = await request.json();
    const { name, description, clientId, serviceTypes, startDate, dueDate, priority } = body;

    // Validate required fields
    if (!name || !clientId) {
      return NextResponse.json(
        { error: 'Project name and client are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') {
      return NextResponse.json(
        { error: 'Invalid client' },
        { status: 400 }
      );
    }

    // Verify service types exist
    if (serviceTypes && serviceTypes.length > 0) {
      const validServiceTypes = await ServiceType.find({
        _id: { $in: serviceTypes },
        isActive: true
      });
      
      if (validServiceTypes.length !== serviceTypes.length) {
        return NextResponse.json(
          { error: 'One or more service types are invalid' },
          { status: 400 }
        );
      }
    }

    // Create project
    const project = new Project({
      name,
      description,
      clientId,
      assignedAdminId: user.id,
      serviceTypes: serviceTypes || [],
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'Medium',
    });

    await project.save();

    // Populate the created project
    await project.populate([
      { path: 'clientId', select: 'firstName lastName email' },
      { path: 'assignedAdminId', select: 'firstName lastName email' },
      { path: 'serviceTypes', select: 'name description' }
    ]);

    return NextResponse.json({ 
      message: 'Project created successfully',
      project 
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    
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
