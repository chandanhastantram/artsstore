'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface ShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
    });

    const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            router.push('/cart');
        }
    }, [cart, router]);

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const validateShippingAddress = (): boolean => {
        const newErrors: Partial<ShippingAddress> = {};

        if (!shippingAddress.name.trim()) newErrors.name = 'Name is required';
        if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(shippingAddress.phone)) newErrors.phone = 'Invalid phone number';
        if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
        if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
        if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
        if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        else if (!/^\d{6}$/.test(shippingAddress.zipCode)) newErrors.zipCode = 'Invalid ZIP code';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name as keyof ShippingAddress]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const shipping = cartTotal > 1000 ? 0 : 100;
    const tax = cartTotal * 0.18;
    const total = cartTotal + shipping + tax;

    const handlePlaceOrder = async () => {
        if (!validateShippingAddress()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to place order');
                router.push('/login');
                return;
            }

            // Create order items
            const orderItems = cart.map(item => ({
                product: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                customization: item.customization,
            }));

            if (paymentMethod === 'razorpay') {
                // Create Razorpay order
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`,
                    { amount: total },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: data.order.amount,
                    currency: 'INR',
                    name: 'MegaArtsStore',
                    description: 'Order Payment',
                    order_id: data.order.id,
                    handler: async function (response: any) {
                        try {
                            // Verify payment
                            const verifyResponse = await axios.post(
                                `${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`,
                                {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            if (verifyResponse.data.success) {
                                // Create order
                                const orderResponse = await axios.post(
                                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
                                    {
                                        items: orderItems,
                                        shippingAddress,
                                        paymentInfo: {
                                            method: 'razorpay',
                                            razorpayOrderId: response.razorpay_order_id,
                                            razorpayPaymentId: response.razorpay_payment_id,
                                            razorpaySignature: response.razorpay_signature,
                                            status: 'completed',
                                        },
                                        pricing: {
                                            subtotal: cartTotal,
                                            shipping,
                                            tax,
                                            total,
                                        },
                                    },
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );

                                if (orderResponse.data.success) {
                                    clearCart();
                                    toast.success('Order placed successfully!');
                                    router.push(`/order-success?orderId=${orderResponse.data.order._id}`);
                                }
                            }
                        } catch (error: any) {
                            toast.error('Payment verification failed');
                            console.error(error);
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: shippingAddress.name,
                        contact: shippingAddress.phone,
                    },
                    theme: {
                        color: '#9333ea',
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', function (response: any) {
                    toast.error('Payment failed. Please try again.');
                    setIsProcessing(false);
                });
                razorpay.open();
            } else {
                // Cash on Delivery
                const orderResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
                    {
                        items: orderItems,
                        shippingAddress,
                        paymentInfo: {
                            method: 'cod',
                            status: 'pending',
                        },
                        pricing: {
                            subtotal: cartTotal,
                            shipping,
                            tax,
                            total,
                        },
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (orderResponse.data.success) {
                    clearCart();
                    toast.success('Order placed successfully!');
                    router.push(`/order-success?orderId=${orderResponse.data.order._id}`);
                }
                setIsProcessing(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to place order');
            setIsProcessing(false);
        }
    };

    const steps = [
        { number: 1, title: 'Shipping', icon: Truck },
        { number: 2, title: 'Payment', icon: CreditCard },
        { number: 3, title: 'Review', icon: CheckCircle },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/cart">
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Cart
                        </motion.button>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Checkout
                    </h1>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-4 md:gap-8">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                                            currentStep >= step.number
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                                : 'bg-white text-gray-400 border-2 border-gray-300'
                                        }`}
                                    >
                                        <step.icon className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <p className={`mt-2 text-sm font-medium ${
                                        currentStep >= step.number ? 'text-purple-600' : 'text-gray-400'
                                    }`}>
                                        {step.title}
                                    </p>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-1 w-12 md:w-24 rounded transition-all ${
                                            currentStep > step.number
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                                : 'bg-gray-300'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping Address */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={shippingAddress.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="John Doe"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="9876543210"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={shippingAddress.street}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                                errors.street ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="123 Main Street, Apartment 4B"
                                        />
                                        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                                errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Mumbai"
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                                errors.state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Maharashtra"
                                        />
                                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingAddress.zipCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                                errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="400001"
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={shippingAddress.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (validateShippingAddress()) {
                                            setCurrentStep(2);
                                        } else {
                                            toast.error('Please fill in all required fields correctly');
                                        }
                                    }}
                                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    Continue to Payment
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Step 2: Payment Method */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                                
                                <div className="space-y-4 mb-8">
                                    {/* Razorpay */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setPaymentMethod('razorpay')}
                                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                            paymentMethod === 'razorpay'
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-300 hover:border-purple-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                paymentMethod === 'razorpay' ? 'border-purple-600' : 'border-gray-300'
                                            }`}>
                                                {paymentMethod === 'razorpay' && (
                                                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5 text-purple-600" />
                                                    <h3 className="font-semibold text-gray-900">
                                                        Credit/Debit Card, UPI, Net Banking
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Secure payment via Razorpay
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Cash on Delivery */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                                            paymentMethod === 'cod'
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-gray-300 hover:border-purple-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                paymentMethod === 'cod' ? 'border-purple-600' : 'border-gray-300'
                                            }`}>
                                                {paymentMethod === 'cod' && (
                                                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-5 h-5 text-purple-600" />
                                                    <h3 className="font-semibold text-gray-900">
                                                        Cash on Delivery
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Pay when you receive your order
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCurrentStep(1)}
                                        className="flex-1 border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                                    >
                                        Back
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        Review Order
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review Order */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Shipping Address Review */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">Shipping Address</h3>
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="text-gray-600">
                                        <p className="font-semibold text-gray-900">{shippingAddress.name}</p>
                                        <p>{shippingAddress.street}</p>
                                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                                        <p>{shippingAddress.country}</p>
                                        <p className="mt-2">Phone: {shippingAddress.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Method Review */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
                                        <button
                                            onClick={() => setCurrentStep(2)}
                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <p className="text-gray-600">
                                        {paymentMethod === 'razorpay' 
                                            ? 'Credit/Debit Card, UPI, Net Banking (Razorpay)'
                                            : 'Cash on Delivery'}
                                    </p>
                                </div>

                                {/* Place Order Button */}
                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCurrentStep(2)}
                                        className="flex-1 border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                                    >
                                        Back
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>Processing...</>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                Place Order
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {cart.map(item => (
                                    <div key={item.productId} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                                            <Image
                                                src={item.image || '/placeholder.jpg'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-purple-600">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
