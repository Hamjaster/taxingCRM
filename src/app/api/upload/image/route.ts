import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { uploadFileToS3, validateFile } from '@/lib/aws-s3';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Only admins can upload images
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('type') as string || 'general'; // 'general', 'avatar', etc.

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a temporary client ID for upload organization
    const tempClientId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Upload to S3 with a specific path based on upload type
    const uploadResult = await uploadFileToS3({
      clientId: tempClientId,
      folderId: uploadType === 'avatar' ? 'avatars' : 'uploads',
      originalName: file.name,
      contentType: file.type,
      buffer,
      isPublic: true, // Make images publicly accessible
    });

    return NextResponse.json({ 
      url: uploadResult.url,
      key: uploadResult.key,
      message: 'Image uploaded successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Upload image error:', error);
    
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
