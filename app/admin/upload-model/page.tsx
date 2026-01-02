'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadInChunks, pollProgress, formatFileSize, calculateETA } from '@/lib/utils/uploadHelpers';

export default function ModelUploadPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadSpeed, setUploadSpeed] = useState('');
    const [startTime, setStartTime] = useState(0);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
            setError('Please upload a .glb or .gltf file');
            toast.error('Only .glb and .gltf files are allowed');
            return;
        }

        // Validate file size (50MB max for models)
        if (file.size > 50 * 1024 * 1024) {
            setError('File size must be less than 50MB');
            toast.error('File too large. Maximum size is 50MB');
            return;
        }

        setUploading(true);
        setError('');
        setProgress(0);
        setUploadedUrl('');
        setStartTime(Date.now());

        try {
            const token = localStorage.getItem('token');
            const fileSize = formatFileSize(file.size);
            
            setUploadStatus(`Uploading ${fileSize}...`);

            // Use chunked upload for files larger than 2MB
            if (file.size > 2 * 1024 * 1024) {
                const response = await uploadInChunks(
                    file,
                    '/api/upload/model',
                    token || '',
                    (uploadProgress) => {
                        setProgress(uploadProgress);
                        const elapsed = Date.now() - startTime;
                        const bytesUploaded = (file.size * uploadProgress) / 100;
                        const eta = calculateETA(bytesUploaded, file.size, startTime);
                        setUploadSpeed(`ETA: ${eta}`);
                    }
                );

                // If background processing, poll for completion
                if (response.status === 'processing') {
                    setUploadStatus('Processing model...');
                    
                    const result = await pollProgress(
                        response.uploadId,
                        token || '',
                        (processingProgress, status) => {
                            setProgress(processingProgress);
                            setUploadStatus(status);
                        }
                    );
                    
                    setUploadedUrl(result.url);
                    toast.success('3D model uploaded successfully!');
                } else {
                    setUploadedUrl(response.url);
                    toast.success('3D model uploaded successfully!');
                }
            } else {
                // Direct upload for smaller files
                const formData = new FormData();
                formData.append('model', file);

                const response = await fetch('/api/upload/model', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    setUploadedUrl(data.url);
                    setProgress(100);
                    toast.success('3D model uploaded successfully!');
                } else {
                    setError(data.message || 'Upload failed');
                    toast.error(data.message || 'Upload failed');
                }
            }
        } catch (err: any) {
            setError('Error uploading file');
            toast.error(err.message || 'Error uploading file');
        } finally {
            setUploading(false);
            setUploadStatus('');
            setUploadSpeed('');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-gold-50 to-maroon-50 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload 3D Model</h1>
                    <p className="text-gray-600 mb-8">Upload your .glb or .gltf file for AR try-on</p>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-gold-500 transition-colors">
                        <input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="model-upload"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="model-upload"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-16 h-16 text-gold-500 mb-4 animate-spin" />
                                    <p className="text-lg font-semibold text-gray-700 mb-2">
                                        {uploadStatus || 'Uploading...'}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">{uploadSpeed}</p>
                                    <div className="w-full max-w-md">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gold-500 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}%</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-16 h-16 text-gold-500 mb-4" />
                                    <p className="text-lg font-semibold text-gray-700 mb-2">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        .glb or .gltf files only (Max 50MB)
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Large files will be uploaded in chunks for better performance
                                    </p>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {uploadedUrl && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-green-800 font-semibold mb-2">Upload Successful!</p>
                                    <p className="text-sm text-green-700 mb-2">Model URL:</p>
                                    <code className="block p-2 bg-white rounded text-xs break-all">
                                        {uploadedUrl}
                                    </code>
                                </div>
                            </div>
                            <p className="text-sm text-green-700 mt-3">
                                ✅ Your 3D model is now available for AR try-on!
                            </p>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-3">📝 Instructions:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                            <li>Make sure you're logged in as admin</li>
                            <li>Click the upload area above</li>
                            <li>Select your .glb or .gltf file</li>
                            <li>Wait for upload to complete (large files use chunked upload)</li>
                            <li>Copy the URL to use in products</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
