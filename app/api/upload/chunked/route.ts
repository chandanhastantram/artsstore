import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { requireAuth, authorizeRole } from '@/lib/auth';
import { addImageOptimizationJob, addModelProcessingJob } from '@/lib/queue/uploadQueue';
import { isRedisAvailable } from '@/lib/redis';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Store for tracking chunk uploads
const chunkStore = new Map<string, { chunks: Buffer[], totalChunks: number, filename: string }>();

// POST /api/upload/chunked - Handle chunked uploads
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
    const chunk = formData.get('chunk') as Blob;
    const index = parseInt(formData.get('index') as string);
    const totalChunks = parseInt(formData.get('totalChunks') as string);
    const fileId = formData.get('fileId') as string;
    const filename = formData.get('filename') as string;

    if (!chunk || isNaN(index) || isNaN(totalChunks) || !fileId || !filename) {
      return NextResponse.json(
        { success: false, message: 'Invalid chunk data' },
        { status: 400 }
      );
    }

    // Initialize chunk storage for this file
    if (!chunkStore.has(fileId)) {
      chunkStore.set(fileId, {
        chunks: new Array(totalChunks),
        totalChunks,
        filename,
      });
    }

    const fileData = chunkStore.get(fileId)!;
    
    // Convert chunk to buffer and store
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());
    fileData.chunks[index] = chunkBuffer;

    // Check if all chunks are received
    const receivedChunks = fileData.chunks.filter(c => c !== undefined).length;

    if (receivedChunks === totalChunks) {
      // All chunks received, combine them
      const completeBuffer = Buffer.concat(fileData.chunks);
      
      // Clean up chunk store
      chunkStore.delete(fileId);

      // Determine file type
      const isModel = filename.endsWith('.glb') || filename.endsWith('.gltf');
      const isImage = /\.(jpg|jpeg|png|webp|avif)$/i.test(filename);

      if (!isModel && !isImage) {
        return NextResponse.json(
          { success: false, message: 'Unsupported file type' },
          { status: 400 }
        );
      }

      // If Redis is available, queue background processing
      if (isRedisAvailable()) {
        try {
          let job;
          
          if (isImage) {
            job = await addImageOptimizationJob({
              uploadId: fileId,
              buffer: completeBuffer,
              filename,
              folder: 'products',
            });
          } else {
            job = await addModelProcessingJob({
              uploadId: fileId,
              buffer: completeBuffer,
              filename,
            });
          }

          return NextResponse.json({
            success: true,
            message: 'File uploaded successfully, processing in background',
            uploadId: fileId,
            jobId: job.id,
            status: 'processing',
          });
        } catch (queueError: any) {
          console.error('Queue error, falling back to direct upload:', queueError);
          // Fall through to direct upload
        }
      }

      // Direct upload if Redis not available or queue failed
      const cloudinary = (await import('@/lib/cloudinary')).default;
      
      const result = await new Promise<any>((resolve, reject) => {
        const uploadOptions: any = {
          folder: `megaartsstore/${isModel ? 'models' : 'products'}`,
        };

        if (isModel) {
          uploadOptions.resource_type = 'raw';
          uploadOptions.public_id = `${fileId}-${filename.replace(/\.(glb|gltf)$/, '')}`;
        } else {
          uploadOptions.transformation = [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ];
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(completeBuffer);
      });

      return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        uploadId: fileId,
        status: 'completed',
        result: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        },
      });
    }

    // Not all chunks received yet
    return NextResponse.json({
      success: true,
      message: `Chunk ${index + 1}/${totalChunks} received`,
      uploadId: fileId,
      progress: ((receivedChunks / totalChunks) * 100).toFixed(2),
    });

  } catch (error: any) {
    console.error('Chunked upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing upload', error: error.message },
      { status: 500 }
    );
  }
}
