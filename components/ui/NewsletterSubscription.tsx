'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function NewsletterSubscription() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`,
                { email }
            );
            
            if (response.data.success) {
                setSubscribed(true);
                setEmail('');
                toast.success('Successfully subscribed to newsletter!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    if (subscribed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 text-center"
            >
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-900 mb-2">Thank You!</h3>
                <p className="text-green-700">You're now subscribed to our newsletter.</p>
            </motion.div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="max-w-2xl mx-auto text-center">
                <Mail className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="mb-6 opacity-90">
                    Get exclusive offers, new product updates, and artisan stories delivered to your inbox
                </p>
                
                <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                        disabled={loading}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Subscribing...' : 'Subscribe'}
                    </motion.button>
                </form>
                
                <p className="mt-4 text-sm opacity-75">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </div>
    );
}
