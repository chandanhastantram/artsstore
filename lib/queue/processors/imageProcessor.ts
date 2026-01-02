import cloudinary from '../../cloudinary';
import { Job } from 'bull';
import { ImageOptimizationJob } from '../uploadQueue';

export default async function processImageOptimization(job: Job<ImageOptimizationJob>) {
  const { uploadId, buffer, filename, folder } = job.data;

  try {
    // Update progress
    await job.progress(10);

    // Upload to Cloudinary with transformations
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `megaartsstore/${folder}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
          public_id: `${uploadId}-${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    await job.progress(90);

    // Return the result
    const processedData = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      uploadId,
    };

    await job.progress(100);

    return processedData;
  } catch (error: any) {
    console.error('Image optimization error:', error);
    throw new Error(`Failed to optimize image: ${error.message}`);
  }
}
