import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import Folder from '@/models/Folder';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');
    const clientId = searchParams.get('clientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let query: any = { isActive: true };
    
    // If user is a client, only show their documents
    if (user.role === 'client') {
      query.clientId = user.id;
    } else if (clientId) {
      // Admin can filter by specific client
      query.clientId = clientId;
    }

    // Filter by folder if provided
    if (folderId) {
      query.folderId = folderId;
    }

    const [documents, total] = await Promise.all([
      DocumentModel.find(query)
        .populate('folderId', 'name')
        .populate('clientId', 'firstName lastName email businessName entityName')
        .populate('uploadedByAdminId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      DocumentModel.countDocuments(query)
    ]);

    return NextResponse.json({ 
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get documents error:', error);
    
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
    
    // Only admins can upload documents
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      originalName, 
      fileType, 
      mimeType, 
      size, 
      s3Key, 
      s3Url, 
      s3Bucket,
      s3ETag,
      s3VersionId,
      folderId, 
      clientId, 
      description, 
      tags,
      fileExtension,
    } = body;

    // Validate required fields
    if (!name || !originalName || !s3Key || !s3Url || !folderId || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify folder exists and user has access
    const folder = await Folder.findOne({
      _id: folderId,
      isActive: true,
    });

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder not found' },
        { status: 404 }
      );
    }

    // Create document
    const document = new DocumentModel({
      name,
      originalName,
      fileType,
      mimeType,
      size,
      s3Key,
      s3Url,
      s3Bucket,
      s3ETag,
      s3VersionId,
      folderId,
      clientId,
      uploadedByAdminId: user.id,
      description,
      tags: tags || [],
      fileExtension,
    });

    await document.save();

    // Populate the created document
    const populatedDocument = await DocumentModel.findById(document._id)
      .populate('folderId', 'name')
      .populate('clientId', 'firstName lastName email businessName entityName')
      .populate('uploadedByAdminId', 'firstName lastName email');

    return NextResponse.json({ 
      document: populatedDocument,
      message: 'Document uploaded successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Upload document error:', error);
    
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
