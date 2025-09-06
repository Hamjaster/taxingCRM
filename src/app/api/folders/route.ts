import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Folder from '@/models/Folder';
import DocumentModel from '@/models/Document';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    let query: any = { isActive: true };
    
    // If user is a client, only show their folders
    if (user.role === 'client') {
      query.clientId = user.id;
    } else if (clientId) {
      // Admin can filter by specific client
      query.clientId = clientId;
    }

    const folders = await Folder.find(query)
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Get document count for each folder
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        const documentCount = await DocumentModel.countDocuments({
          folderId: folder._id,
          isActive: true,
        });
        return {
          ...folder.toObject(),
          documentCount,
        };
      })
    );

    return NextResponse.json({ folders: foldersWithCounts });

  } catch (error) {
    console.error('Get folders error:', error);
    
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
    const user = requireAuth(request);
    
    // Only admins can create folders
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, clientId, description } = body;

    // Validate required fields
    if (!name || !clientId) {
      return NextResponse.json(
        { error: 'Folder name and client ID are required' },
        { status: 400 }
      );
    }

    // Check if folder with same name already exists for this client
    const existingFolder = await Folder.findOne({
      name,
      clientId,
      isActive: true,
    });

    if (existingFolder) {
      return NextResponse.json(
        { error: 'A folder with this name already exists for this client' },
        { status: 409 }
      );
    }

    // Create folder
    const folder = new Folder({
      name,
      clientId,
      assignedAdminId: user.id,
      description,
    });

    await folder.save();

    // Populate the created folder
    const populatedFolder = await Folder.findById(folder._id)
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email');

    return NextResponse.json({ 
      folder: {
        ...populatedFolder?.toObject(),
        documentCount: 0,
      },
      message: 'Folder created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Create folder error:', error);
    
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
