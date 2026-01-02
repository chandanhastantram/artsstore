import imageCompression from 'browser-image-compression';

// Client-side image compression options
export const compressionOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
};

// Compress image before upload
export async function compressImage(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    console.log(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    return file; // Return original if compression fails
  }
}

// Chunk size for uploads (2MB)
const CHUNK_SIZE = 2 * 1024 * 1024;

export interface UploadChunk {
  chunk: Blob;
  index: number;
  totalChunks: number;
  fileId: string;
  filename: string;
}

// Split file into chunks
export function createChunks(file: File, fileId: string): UploadChunk[] {
  const chunks: UploadChunk[] = [];
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    chunks.push({
      chunk,
      index: i,
      totalChunks,
      fileId,
      filename: file.name,
    });
  }

  return chunks;
}

// Upload file in chunks with progress tracking
export async function uploadInChunks(
  file: File,
  endpoint: string,
  token: string,
  onProgress?: (progress: number) => void
): Promise<any> {
  const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const chunks = createChunks(file, fileId);

  let uploadedChunks = 0;

  for (const chunkData of chunks) {
    const formData = new FormData();
    formData.append('chunk', chunkData.chunk);
    formData.append('index', chunkData.index.toString());
    formData.append('totalChunks', chunkData.totalChunks.toString());
    formData.append('fileId', chunkData.fileId);
    formData.append('filename', chunkData.filename);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Chunk upload failed: ${response.statusText}`);
    }

    uploadedChunks++;
    const progress = (uploadedChunks / chunks.length) * 100;
    onProgress?.(progress);

    // If this is the last chunk, return the result
    if (chunkData.index === chunkData.totalChunks - 1) {
      return response.json();
    }
  }
}

// Poll for upload progress
export async function pollProgress(
  uploadId: string,
  token: string,
  onProgress?: (progress: number, status: string) => void
): Promise<any> {
  const pollInterval = 1000; // Poll every second
  const maxAttempts = 300; // 5 minutes max
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      attempts++;

      if (attempts > maxAttempts) {
        clearInterval(interval);
        reject(new Error('Upload timeout'));
        return;
      }

      try {
        const response = await fetch(`/api/upload/progress/${uploadId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          onProgress?.(100, 'completed');
          resolve(data.result);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          reject(new Error(data.error || 'Upload failed'));
        } else {
          onProgress?.(data.progress || 0, data.status);
        }
      } catch (error) {
        console.error('Progress poll error:', error);
      }
    }, pollInterval);
  });
}

// Calculate ETA
export function calculateETA(uploadedBytes: number, totalBytes: number, startTime: number): string {
  const elapsed = Date.now() - startTime;
  const bytesPerMs = uploadedBytes / elapsed;
  const remainingBytes = totalBytes - uploadedBytes;
  const remainingMs = remainingBytes / bytesPerMs;

  const seconds = Math.ceil(remainingMs / 1000);
  
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
