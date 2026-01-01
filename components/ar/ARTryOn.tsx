'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface ARTryOnProps {
    productImage: string;
    onClose: () => void;
}

export const ARTryOn: React.FC<ARTryOnProps> = ({ productImage, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('Unable to access camera. Please grant camera permissions.');
            setIsLoading(false);
            toast.error('Camera access denied');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);

                // Convert to blob and download
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `bangle-tryOn-${Date.now()}.png`;
                        a.click();
                        toast.success('Photo captured!');
                    }
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-screen p-4">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-10 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* AR View */}
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="spinner"></div>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-center">
                                <p className="text-xl mb-4">{error}</p>
                                <Button onClick={startCamera}>Try Again</Button>
                            </div>
                        </div>
                    )}

                    {/* Video Feed */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Hidden canvas for photo capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* AR Overlay - Bangle positioned on wrist */}
                    {!isLoading && !error && (
                        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
                            <img
                                src={productImage}
                                alt="Bangle AR"
                                className="w-48 h-48 object-contain opacity-80"
                                style={{
                                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
                                }}
                            />
                        </div>
                    )}

                    {/* Instructions */}
                    {!isLoading && !error && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full">
                            <p className="text-sm">Position your wrist in the center</p>
                        </div>
                    )}

                    {/* Controls */}
                    {!isLoading && !error && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                            <Button
                                onClick={capturePhoto}
                                className="flex items-center space-x-2"
                            >
                                <Camera className="w-5 h-5" />
                                <span>Capture Photo</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                    <p>💡 Tip: Use good lighting for best results</p>
                </div>
            </div>
        </div>
    );
};
