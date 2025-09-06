import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import { requireAuth } from '@/lib/middleware';
import { deleteFileFromS3, getDownloadUrl } from '@/lib/aws-s3';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const document = await DocumentModel.findOne({ 
      _id: params.id, 
      isActive: true 
    })
      .populate('folderId', 'name')
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('uploadedByAdminId', 'firstName lastName email');

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'client' && document.clientId._id.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ document });

  } catch (error) {
    console.error('Get document error:', error);
    
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
    
    // Only admins can update documents
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, tags } = body;

    const document = await DocumentModel.findOne({ 
      _id: params.id, 
      isActive: true 
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Update document fields
    if (name) document.name = name;
    if (description !== undefined) document.description = description;
    if (tags) document.tags = tags;

    await document.save();

    // Return updated document with populated fields
    const updatedDocument = await DocumentModel.findById(document._id)
      .populate('folderId', 'name')
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('uploadedByAdminId', 'firstName lastName email');

    return NextResponse.json({ 
      document: updatedDocument,
      message: 'Document updated successfully' 
    });

  } catch (error) {
    console.error('Update document error:', error);
    
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
    
    // Only admins can delete documents
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const document = await DocumentModel.findOne({ 
      _id: params.id, 
      isActive: true 
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete file from S3
    try {
      await deleteFileFromS3(document.s3Key);
    } catch (s3Error) {
      console.error(`Failed to delete file from S3: ${document.s3Key}`, s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Soft delete - set isActive to false
    document.isActive = false;
    await document.save();

    return NextResponse.json({ 
      message: 'Document deleted successfully' 
    });

  } catch (error) {
    console.error('Delete document error:', error);
    
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
