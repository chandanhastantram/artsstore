import cloudinary from '../../cloudinary';
import { Job } from 'bull';
import { ModelProcessingJob } from '../uploadQueue';

export default async function processModelUpload(job: Job<ModelProcessingJob>) {
  const { uploadId, buffer, filename } = job.data;

  try {
    // Update progress
    await job.progress(10);

    // Upload 3D model to Cloudinary as raw file
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'megaartsstore/models',
          resource_type: 'raw',
          public_id: `${uploadId}-${filename.replace(/\.(glb|gltf)$/, '')}`,
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
      format: result.format,
      bytes: result.bytes,
      uploadId,
    };

    await job.progress(100);

    return processedData;
  } catch (error: any) {
    console.error('Model processing error:', error);
    throw new Error(`Failed to process 3D model: ${error.message}`);
  }
}
