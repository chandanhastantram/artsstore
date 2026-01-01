'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        // Simulate progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/upload/product-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        const data = await response.json();

        if (data.success) {
          return data.data;
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
      setUploadProgress({});
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || images.length >= maxImages,
  });

  const handleDelete = async (publicId: string, index: number) => {
    try {
      const token = localStorage.getItem('token');
      const encodedPublicId = encodeURIComponent(publicId);
      
      const response = await fetch(`http://localhost:5001/api/upload/image/${encodedPublicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        toast.success('Image deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-3">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-sm font-medium text-gray-700">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to browse (max {maxImages} images, 5MB each)
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Supports: JPG, PNG, WebP, AVIF
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 truncate">{filename}</span>
                <span className="text-xs text-gray-500">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all"
            >
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Primary
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(image.publicId, index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Delete image"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs truncate">
                  {image.width && image.height && `${image.width}×${image.height}`}
                  {image.format && ` • ${image.format.toUpperCase()}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-8">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          {images.length} / {maxImages} images uploaded
        </p>
      )}
    </div>
  );
}
