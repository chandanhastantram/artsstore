import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { requireAuth } from '@/lib/auth';
import { getJobStatus } from '@/lib/queue/uploadQueue';

// GET /api/upload/progress/[id] - Get upload progress
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { user, error } = await requireAuth(request, User);

    if (error) return error;

    const uploadId = params.id;

    // Try to get job status from queue
    const jobStatus = await getJobStatus(uploadId);

    if (!jobStatus) {
      return NextResponse.json(
        { success: false, message: 'Upload not found' },
        { status: 404 }
      );
    }

    // Map job state to user-friendly status
    let status = 'processing';
    let progress = 0;

    switch (jobStatus.state) {
      case 'completed':
        status = 'completed';
        progress = 100;
        break;
      case 'failed':
        status = 'failed';
        break;
      case 'active':
        status = 'processing';
        progress = typeof jobStatus.progress === 'number' ? jobStatus.progress : 50;
        break;
      case 'waiting':
        status = 'queued';
        progress = 0;
        break;
      default:
        status = 'processing';
        progress = 25;
    }

    return NextResponse.json({
      success: true,
      uploadId,
      status,
      progress,
      result: jobStatus.result,
      error: jobStatus.failedReason,
    });

  } catch (error: any) {
    console.error('Progress check error:', error);
    return NextResponse.json(
      { success: false, message: 'Error checking progress', error: error.message },
      { status: 500 }
    );
  }
}
