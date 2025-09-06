import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Folder from '@/models/Folder';
import DocumentModel from '@/models/Document';
import { requireAuth } from '@/lib/middleware';
import { deleteFileFromS3 } from '@/lib/aws-s3';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const folder = await Folder.findOne({ 
      _id: params.id, 
      isActive: true 
    })
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email');

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'client' && folder.clientId._id.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get documents in this folder
    const documents = await DocumentModel.find({
      folderId: params.id,
      isActive: true,
    })
      .populate('uploadedByAdminId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      folder: folder.toObject(),
      documents,
    });

  } catch (error) {
    console.error('Get folder error:', error);
    
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
    
    // Only admins can update folders
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    const folder = await Folder.findOne({ 
      _id: params.id, 
      isActive: true 
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing folder
    if (name && name !== folder.name) {
      const existingFolder = await Folder.findOne({
        name,
        clientId: folder.clientId,
        isActive: true,
        _id: { $ne: params.id },
      });

      if (existingFolder) {
        return NextResponse.json(
          { error: 'A folder with this name already exists for this client' },
          { status: 409 }
        );
      }
    }

    // Update folder fields
    if (name) folder.name = name;
    if (description !== undefined) folder.description = description;

    await folder.save();

    // Return updated folder with populated fields
    const updatedFolder = await Folder.findById(folder._id)
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('assignedAdminId', 'firstName lastName email');

    const documentCount = await DocumentModel.countDocuments({
      folderId: folder._id,
      isActive: true,
    });

    return NextResponse.json({ 
      folder: {
        ...updatedFolder?.toObject(),
        documentCount,
      },
      message: 'Folder updated successfully' 
    });

  } catch (error) {
    console.error('Update folder error:', error);
    
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
    const user = requireAuth(request);
    
    // Only admins can delete folders
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const folder = await Folder.findOne({ 
      _id: params.id, 
      isActive: true 
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Get all documents in this folder
    const documents = await DocumentModel.find({
      folderId: params.id,
      isActive: true,
    });

    // Delete all documents from S3 and database
    for (const document of documents) {
      try {
        await deleteFileFromS3(document.s3Key);
      } catch (s3Error) {
        console.error(`Failed to delete file from S3: ${document.s3Key}`, s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
      
      document.isActive = false;
      await document.save();
    }

    // Soft delete - set isActive to false
    folder.isActive = false;
    await folder.save();

    return NextResponse.json({ 
      message: 'Folder and all documents deleted successfully' 
    });

  } catch (error) {
    console.error('Delete folder error:', error);
    
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
