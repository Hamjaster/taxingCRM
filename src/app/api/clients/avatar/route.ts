import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { requireAuth } from '@/lib/middleware';
import { uploadFileToS3, validateFile } from '@/lib/aws-s3';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);
    
    // Only admins can upload client avatars
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
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

    // Verify client exists and belongs to the admin
    const client = await Client.findOne({
      _id: clientId,
      assignedAdminId: user.id,
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3 with a specific path for avatars
    const uploadResult = await uploadFileToS3({
      clientId,
      folderId: 'avatars', // Special folder for avatars
      originalName: file.name,
      contentType: file.type,
      buffer,
      isPublic: true, // Make avatars publicly accessible
    });

    // Update client with avatar URL
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { avatar: uploadResult.url },
      { new: true }
    ).select('-password');

    return NextResponse.json({ 
      client: updatedClient,
      avatarUrl: uploadResult.url,
      message: 'Avatar uploaded successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Upload avatar error:', error);
    
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

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);
    
    // Only admins can delete client avatars
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Verify client exists and belongs to the admin
    const client = await Client.findOne({
      _id: clientId,
      assignedAdminId: user.id,
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Remove avatar from client
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { $unset: { avatar: 1 } },
      { new: true }
    ).select('-password');

    return NextResponse.json({ 
      client: updatedClient,
      message: 'Avatar removed successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Delete avatar error:', error);
    
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
