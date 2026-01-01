'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Home, Download } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import confetti from 'canvas-confetti';

interface Order {
    _id: string;
    orderNumber: string;
    items: any[];
    shippingAddress: any;
    pricing: {
        total: number;
    };
    createdAt: string;
    orderStatus: string;
}

function OrderSuccessPageContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#9333ea', '#ec4899', '#f97316'],
        });

        // Fetch order details
        const fetchOrder = async () => {
            if (!orderId) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    setOrder(response.data.order);
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Success Icon */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
                        >
                            <CheckCircle className="w-16 h-16 text-white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                        >
                            Order Placed Successfully!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-gray-600"
                        >
                            Thank you for your purchase. Your order has been confirmed.
                        </motion.p>
                    </div>

                    {/* Order Details Card */}
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
                        >
                            <div className="border-b border-gray-200 pb-6 mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            Order Details
                                        </h2>
                                        <p className="text-gray-600">
                                            Order Number: <span className="font-semibold text-purple-600">{order.orderNumber}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            ₹{order.pricing.total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Status */}
                                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                    <Package className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-green-700">
                                        Status: {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-purple-600" />
                                    Shipping Address
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                                    <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                        {order.shippingAddress.zipCode}
                                    </p>
                                    <p>{order.shippingAddress.country}</p>
                                    <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                    Items ({order.items.length})
                                </h3>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-purple-600">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid md:grid-cols-2 gap-4"
                    >
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </motion.button>
                        </Link>
                        <Link href="/shop">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Package className="w-5 h-5" />
                                Continue Shopping
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Email Confirmation Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-gray-600">
                            A confirmation email has been sent to your registered email address.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            You can track your order status from your account dashboard.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        }>
            <OrderSuccessPageContent />
        </Suspense>
    );
}
