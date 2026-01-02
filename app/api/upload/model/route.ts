import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';
import { addModelProcessingJob } from '@/lib/queue/uploadQueue';
import { isRedisAvailable } from '@/lib/redis';

// POST /api/upload/model - Upload 3D models
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    if (!authorizeRole(user, ['admin', 'superadmin'])) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to upload models' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('model') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No model file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      return NextResponse.json(
        { success: false, message: 'Only .glb and .gltf files are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadId = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // If Redis is available, queue background processing
    if (isRedisAvailable()) {
      try {
        const job = await addModelProcessingJob({
          uploadId,
          buffer,
          filename: file.name,
        });

        return NextResponse.json({
          success: true,
          message: '3D model uploaded successfully, processing in background',
          uploadId,
          jobId: job.id,
          status: 'processing',
        });
      } catch (queueError: any) {
        console.error('Queue error, falling back to direct upload:', queueError);
        // Fall through to direct upload
      }
    }

    // Direct upload if Redis not available
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'megaartsstore/models',
          resource_type: 'raw',
          public_id: `${uploadId}-${file.name.replace(/\.(glb|gltf)$/, '')}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      message: '3D model uploaded successfully',
      uploadId,
      status: 'completed',
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });

  } catch (error: any) {
    console.error('Model upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading model', error: error.message },
      { status: 500 }
    );
  }
}
