import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import { requireAuth } from '@/lib/middleware';
import { getDownloadUrl, s3Client } from '@/lib/aws-s3';

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
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check permissions
    if (user.role === 'client' && document.clientId.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Generate download URL
    const downloadUrl = await getDownloadUrl(document.s3Key, 3600); // 1 hour expiry
    // const bucketName = document.s3Bucket;
    // const fileName = document.s3Key;
    // const expiry = 3600;
    // const downloadUrl = await s3Client.presignedGetObject(bucketName, fileName, expiry);

    // Increment download count
    await document.incrementDownloadCount();

    return NextResponse.json({ 
      downloadUrl,
      fileName: document.originalName,
      fileType: document.fileType,
      size: document.size,
    });

  } catch (error) {
    console.error('Generate download URL error:', error);
    
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
