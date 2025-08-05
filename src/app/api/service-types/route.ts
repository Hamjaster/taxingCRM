import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ServiceType from '@/models/ServiceType';
import { requireAuth, requireAdmin } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const serviceTypes = await ServiceType.find({ isActive: true })
      .sort({ name: 1 });

    return NextResponse.json({ serviceTypes });

  } catch (error) {
    console.error('Get service types error:', error);
    
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
    const { name, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Service type name is required' },
        { status: 400 }
      );
    }

    // Check if service type already exists
    const existingServiceType = await ServiceType.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      isActive: true 
    });

    if (existingServiceType) {
      return NextResponse.json(
        { error: 'Service type with this name already exists' },
        { status: 409 }
      );
    }

    // Create service type
    const serviceType = new ServiceType({
      name: name.trim(),
      description: description?.trim(),
    });

    await serviceType.save();

    return NextResponse.json({ 
      message: 'Service type created successfully',
      serviceType 
    }, { status: 201 });

  } catch (error) {
    console.error('Create service type error:', error);
    
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
