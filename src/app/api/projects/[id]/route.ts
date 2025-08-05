import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import ServiceType from '@/models/ServiceType';
import { requireAuth, requireAdmin } from '@/lib/middleware';
import { UpdateProjectData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);
    const { id } = params;

    let query: any = { _id: id, isActive: true };
    
    // If user is a client, only allow access to their own projects
    if (user.role === 'client') {
      query.clientId = user.id;
    }

    const project = await Project.findOne(query)
      .populate('clientId', 'firstName lastName email')
      .populate('assignedAdminId', 'firstName lastName email')
      .populate('serviceTypes', 'name description');

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });

  } catch (error) {
    console.error('Get project error:', error);
    
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
    const user = requireAdmin(request);
    const { id } = params;

    const body: UpdateProjectData = await request.json();
    const { name, description, status, serviceTypes, startDate, dueDate, priority } = body;

    // Find the project
    const project = await Project.findOne({ _id: id, isActive: true });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify service types if provided
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

    // Update project fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) {
      project.status = status;
      if (status === 'Completed' && !project.completedDate) {
        project.completedDate = new Date();
      }
    }
    if (serviceTypes !== undefined) project.serviceTypes = serviceTypes;
    if (startDate !== undefined) project.startDate = startDate ? new Date(startDate) : undefined;
    if (dueDate !== undefined) project.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (priority !== undefined) project.priority = priority;

    await project.save();

    // Populate the updated project
    await project.populate([
      { path: 'clientId', select: 'firstName lastName email' },
      { path: 'assignedAdminId', select: 'firstName lastName email' },
      { path: 'serviceTypes', select: 'name description' }
    ]);

    return NextResponse.json({ 
      message: 'Project updated successfully',
      project 
    });

  } catch (error) {
    console.error('Update project error:', error);
    
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
    const { id } = params;

    // Soft delete - set isActive to false
    const project = await Project.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    });

  } catch (error) {
    console.error('Delete project error:', error);
    
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
