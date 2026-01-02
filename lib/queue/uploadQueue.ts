import Queue from 'bull';
import redis, { isRedisAvailable } from '../redis';

// Job data interfaces
export interface ImageOptimizationJob {
  uploadId: string;
  buffer: Buffer;
  filename: string;
  folder: string;
}

export interface ModelProcessingJob {
  uploadId: string;
  buffer: Buffer;
  filename: string;
}

// Create upload queue (only if Redis is available)
let uploadQueue: Queue.Queue | null = null;

if (isRedisAvailable()) {
  uploadQueue = new Queue('upload-processing', {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  uploadQueue.on('error', (error) => {
    console.error('Upload queue error:', error);
  });

  uploadQueue.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  uploadQueue.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });
}

export default uploadQueue;

// Helper to add image optimization job
export const addImageOptimizationJob = async (data: ImageOptimizationJob) => {
  if (!uploadQueue) {
    throw new Error('Upload queue not available - Redis is not connected');
  }

  return uploadQueue.add('image-optimization', data, {
    priority: 1,
  });
};

// Helper to add model processing job
export const addModelProcessingJob = async (data: ModelProcessingJob) => {
  if (!uploadQueue) {
    throw new Error('Upload queue not available - Redis is not connected');
  }

  return uploadQueue.add('model-processing', data, {
    priority: 2, // Higher priority for models
  });
};

// Get job status
export const getJobStatus = async (jobId: string) => {
  if (!uploadQueue) {
    return null;
  }

  const job = await uploadQueue.getJob(jobId);
  if (!job) return null;

  const state = await job.getState();
  const progress = job.progress();
  const result = job.returnvalue;

  return {
    id: job.id,
    state,
    progress,
    result,
    failedReason: job.failedReason,
  };
};
