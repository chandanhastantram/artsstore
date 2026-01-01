'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
                <Share2 className="w-5 h-5" />
                Share
            </motion.button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 min-w-[200px]"
                    >
                        <button
                            onClick={handleFacebookShare}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <span>Facebook</span>
                        </button>
                        
                        <button
                            onClick={handleTwitterShare}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <Twitter className="w-5 h-5 text-sky-500" />
                            <span>Twitter</span>
                        </button>
                        
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>WhatsApp</span>
                        </button>
                        
                        <div className="border-t border-gray-200 my-2" />
                        
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5 text-green-600" />
                                    <span className="text-green-600">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="w-5 h-5 text-gray-600" />
                                    <span>Copy Link</span>
                                </>
                            )}
                        </button>
                    </motion.div>
                </>
            )}
        </div>
    );
}
