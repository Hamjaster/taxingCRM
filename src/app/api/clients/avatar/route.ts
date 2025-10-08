import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Client from '@/models/Client';
import { requireAuth } from '@/lib/middleware';
import { uploadImageToCloudinary, deleteImageFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary';

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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
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

    // Upload to Cloudinary
    const uploadResult = await uploadImageToCloudinary(buffer, {
      folder: `taxingcrm/clients/${clientId}/avatars`,
      transformation: {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        fetch_format: 'auto',
      },
    });

    // Update client with avatar URL
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { avatar: uploadResult.secure_url },
      { new: true }
    ).select('-password');

    return NextResponse.json({ 
      client: updatedClient,
      avatarUrl: uploadResult.secure_url,
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

    // Get current avatar URL to delete from Cloudinary
    const currentClient = await Client.findById(clientId);
    if (currentClient?.avatar) {
      const publicId = extractPublicIdFromUrl(currentClient.avatar);
      if (publicId) {
        try {
          await deleteImageFromCloudinary(publicId);
        } catch (deleteError) {
          console.error('Failed to delete image from Cloudinary:', deleteError);
          // Continue with database update even if Cloudinary deletion fails
        }
      }
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
