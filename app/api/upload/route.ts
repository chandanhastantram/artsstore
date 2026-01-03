import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';

// Configure for Vercel's payload limits (Next.js 14 App Router)
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic'; // Disable static optimization

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string, resourceType: 'image' | 'raw' = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder: `megaartsstore/${folder}`,
    };

    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ];
    } else {
      uploadOptions.resource_type = 'raw';
      uploadOptions.public_id = `model-${Date.now()}`;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/upload - Upload images or 3D models
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    if (!authorizeRole(user, ['admin', 'superadmin'])) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to upload files' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'model'

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine upload type
    const isModel = type === 'model' || file.name.endsWith('.glb') || file.name.endsWith('.gltf');
    const folder = isModel ? 'models' : 'products';
    const resourceType = isModel ? 'raw' : 'image';

    // Upload to Cloudinary
    const result: any = await uploadToCloudinary(buffer, folder, resourceType);

    return NextResponse.json({
      success: true,
      message: `${isModel ? '3D model' : 'Image'} uploaded successfully`,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading file', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    if (!authorizeRole(user, ['admin', 'superadmin'])) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to delete files' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Public ID required' },
        { status: 400 }
      );
    }

    const decodedPublicId = decodeURIComponent(publicId);
    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to delete file' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting file', error: error.message },
      { status: 500 }
    );
  }
}
