import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import Folder from '@/models/Folder';
import { requireAuth } from '@/lib/middleware';
import { uploadFileToS3, validateFile, getFileTypeFromExtension } from '@/lib/aws-s3';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string;
    const clientId = formData.get('clientId') as string;
    const description = formData.get('description') as string;
    console.log(file, folderId, clientId, 'LOGs');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!folderId || !clientId) {
      return NextResponse.json(
        { error: 'Folder ID and Client ID are required' },
        { status: 400 }
      );
    }

    // Validate file
    try {
      validateFile({
        originalname: file.name,
        size: file.size,
        mimetype: file.type,
      });
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError instanceof Error ? validationError.message : 'Invalid file' },
        { status: 400 }
      );
    }

    // Verify folder exists
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

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const uploadResult = await uploadFileToS3({
      clientId,
      folderId,
      originalName: file.name,
      contentType: file.type,
      buffer,
    });

    // Get file type and extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = getFileTypeFromExtension(file.name);

    // Create document record
    const document = new DocumentModel({
      name: file.name,
      originalName: file.name,
      fileType,
      mimeType: file.type,
      size: file.size,
      s3Key: uploadResult.key,
      s3Url: uploadResult.url,
      s3Bucket: uploadResult.bucket,
      s3ETag: uploadResult.etag,
      s3VersionId: uploadResult.versionId,
      folderId,
      clientId,
      uploadedByAdminId: user.id,
      description: description || '',
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
