'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    MapPin,
    Calendar,
    CreditCard,
    Phone,
    Mail,
    Download,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Order {
    _id: string;
    orderNumber: string;
    items: any[];
    shippingAddress: any;
    paymentInfo: any;
    pricing: any;
    orderStatus: string;
    statusHistory: any[];
    trackingNumber?: string;
    createdAt: string;
    user: any;
}

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOrder(response.data.order);
            }
        } catch (error: any) {
            toast.error('Failed to load order details');
            if (error.response?.status === 401) {
                router.push('/login');
            } else if (error.response?.status === 404) {
                toast.error('Order not found');
                router.push('/account/orders');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            pending: Package,
            confirmed: CheckCircle,
            processing: Package,
            shipped: Truck,
            delivered: CheckCircle,
            cancelled: XCircle,
        };
        return icons[status] || Package;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'text-yellow-600 bg-yellow-100',
            confirmed: 'text-blue-600 bg-blue-100',
            processing: 'text-purple-600 bg-purple-100',
            shipped: 'text-indigo-600 bg-indigo-100',
            delivered: 'text-green-600 bg-green-100',
            cancelled: 'text-red-600 bg-red-100',
        };
        return colors[status] || 'text-gray-600 bg-gray-100';
    };

    const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    
    const getCurrentStepIndex = () => {
        if (!order) return 0;
        if (order.orderStatus === 'cancelled') return -1;
        return statusSteps.indexOf(order.orderStatus);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/account/orders">
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Orders
                        </motion.button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Order Details
                        </h1>
                        <p className="text-gray-600">Order #{order.orderNumber}</p>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Tracking */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Tracking</h2>

                            {order.orderStatus === 'cancelled' ? (
                                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-red-900 mb-2">Order Cancelled</h3>
                                    <p className="text-red-700">This order has been cancelled</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Progress Bar */}
                                    <div className="relative">
                                        <div className="flex justify-between mb-2">
                                            {statusSteps.map((step, index) => {
                                                const StepIcon = getStatusIcon(step);
                                                const isCompleted = index <= currentStepIndex;
                                                const isCurrent = index === currentStepIndex;

                                                return (
                                                    <div key={step} className="flex flex-col items-center flex-1">
                                                        <div
                                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                                                isCompleted
                                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                                    : 'bg-gray-200 text-gray-400'
                                                            } ${isCurrent ? 'ring-4 ring-purple-200' : ''}`}
                                                        >
                                                            <StepIcon className="w-6 h-6" />
                                                        </div>
                                                        <p
                                                            className={`mt-2 text-xs font-medium text-center ${
                                                                isCompleted ? 'text-purple-600' : 'text-gray-400'
                                                            }`}
                                                        >
                                                            {step.charAt(0).toUpperCase() + step.slice(1)}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                                                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Tracking Number */}
                                    {order.trackingNumber && (
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <p className="text-sm text-purple-700 font-medium mb-1">Tracking Number</p>
                                            <p className="text-lg font-bold text-purple-900">{order.trackingNumber}</p>
                                        </div>
                                    )}

                                    {/* Status History */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                                        <div className="space-y-3">
                                            {order.statusHistory.slice().reverse().map((history, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-purple-600' : 'bg-gray-300'}`} />
                                                        {index !== order.statusHistory.length - 1 && (
                                                            <div className="w-0.5 h-full bg-gray-300 mt-1" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                                                        </p>
                                                        {history.note && (
                                                            <p className="text-sm text-gray-600">{history.note}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(history.timestamp).toLocaleString('en-IN', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name || 'Product'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                                            <p className="text-lg font-bold text-purple-600">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Status Badge */}
                            <div className={`mb-6 px-4 py-3 rounded-lg ${getStatusColor(order.orderStatus)}`}>
                                <p className="text-center font-semibold">
                                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                </p>
                            </div>

                            {/* Order Date */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Order Date</span>
                                </div>
                                <p className="font-semibold text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.pricing.subtotal.toLocaleString()}</span>
                                </div>
                                {order.pricing.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{order.pricing.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>₹{order.pricing.tax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ₹{order.pricing.total.toFixed(2)}
                                </span>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                    Shipping Address
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                        {order.shippingAddress.zipCode}
                                    </p>
                                    <p>{order.shippingAddress.country}</p>
                                    <p className="mt-2 flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        {order.shippingAddress.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-purple-600" />
                                    Payment Method
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                    <p className="font-semibold text-gray-900">
                                        {order.paymentInfo.method === 'razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}
                                    </p>
                                    <p className={`mt-1 ${
                                        order.paymentInfo.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                    }`}>
                                        {order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
