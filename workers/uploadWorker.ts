import uploadQueue from '../lib/queue/uploadQueue';
import processImageOptimization from '../lib/queue/processors/imageProcessor';
import processModelUpload from '../lib/queue/processors/modelProcessor';

// Worker process for handling upload jobs
if (!uploadQueue) {
  console.error('❌ Upload queue not available. Make sure Redis is running.');
  process.exit(1);
}

console.log('🚀 Upload worker started...');

// Process image optimization jobs
uploadQueue.process('image-optimization', 5, async (job) => {
  console.log(`Processing image optimization job ${job.id}`);
  return processImageOptimization(job);
});

// Process model upload jobs
uploadQueue.process('model-processing', 3, async (job) => {
  console.log(`Processing model upload job ${job.id}`);
  return processModelUpload(job);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...');
  if (uploadQueue) {
    await uploadQueue.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing worker...');
  if (uploadQueue) {
    await uploadQueue.close();
  }
  process.exit(0);
});

console.log('✅ Worker is ready to process jobs');
