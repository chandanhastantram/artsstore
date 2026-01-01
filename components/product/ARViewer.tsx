'use client';

import React, { useEffect, useRef } from 'react';
import { X, Camera, Maximize2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ARViewerProps {
    productName: string;
    modelUrl?: string;
    onClose: () => void;
}

export default function ARViewer({ productName, modelUrl, onClose }: ARViewerProps) {
    const modelViewerRef = useRef<any>(null);

    useEffect(() => {
        // Load model-viewer script
        if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js';
            document.head.appendChild(script);
        }
    }, []);

    // Default 3D model URL - replace with your actual bangle model
    const defaultModelUrl = '/models/bangle.glb';
    const model3D = modelUrl || defaultModelUrl;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-gold-500 to-maroon-500 text-white p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">AR Try-On</h2>
                        <p className="text-sm opacity-90">{productName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* AR Viewer */}
                <div className="relative bg-gray-100" style={{ height: '500px' }}>
                    <model-viewer
                        ref={modelViewerRef}
                        src={model3D}
                        alt={productName}
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls
                        auto-rotate
                        shadow-intensity="1"
                        environment-image="neutral"
                        style={{ width: '100%', height: '100%' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                                <Camera className="w-12 h-12 text-gold-600 mx-auto mb-2" />
                                <p className="text-sm text-gray-700 font-medium">
                                    Rotate to view from all angles
                                </p>
                            </div>
                        </div>
                    </model-viewer>
                </div>

                {/* Controls */}
                <div className="p-6 bg-gray-50 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* AR Button */}
                        <button
                            onClick={() => {
                                const viewer = modelViewerRef.current;
                                if (viewer) {
                                    viewer.activateAR();
                                }
                            }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-maroon-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-gold-600 hover:to-maroon-600 transition-all"
                        >
                            <Camera className="w-5 h-5" />
                            View in Your Space
                        </button>

                        {/* Fullscreen */}
                        <button
                            onClick={() => {
                                const viewer = modelViewerRef.current;
                                if (viewer) {
                                    viewer.requestFullscreen?.();
                                }
                            }}
                            className="flex items-center justify-center gap-2 border-2 border-gold-500 text-gold-600 px-6 py-3 rounded-lg font-semibold hover:bg-gold-50 transition-colors"
                        >
                            <Maximize2 className="w-5 h-5" />
                            Fullscreen
                        </button>

                        {/* Reset */}
                        <button
                            onClick={() => {
                                const viewer = modelViewerRef.current;
                                if (viewer) {
                                    viewer.resetTurntableRotation?.();
                                }
                            }}
                            className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Reset View
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <strong>💡 Tip:</strong> Click "View in Your Space" to see this product in AR on your phone or tablet. 
                            You can place it in your real environment and see how it looks!
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
