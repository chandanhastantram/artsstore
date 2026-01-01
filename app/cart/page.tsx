'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
    const router = useRouter();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setIsValidatingCoupon(true);
        try {
            const response = await axios.post('/api/coupons/validate', {
                code: couponCode,
                orderTotal: cartTotal,
            });

            if (response.data.success) {
                setAppliedCoupon(response.data.coupon);
                toast.success('Coupon applied successfully!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        
        if (appliedCoupon.discountType === 'percentage') {
            const discount = (cartTotal * appliedCoupon.discountValue) / 100;
            return Math.min(discount, appliedCoupon.maxDiscount || discount);
        }
        return appliedCoupon.discountValue;
    };

    const discount = calculateDiscount();
    const shipping = cartTotal > 1000 ? 0 : 100;
    const tax = (cartTotal - discount) * 0.18; // 18% GST
    const finalTotal = cartTotal - discount + shipping + tax;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-12">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-purple-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                            <p className="text-gray-600 mb-8">
                                Looks like you haven't added any items to your cart yet.
                            </p>
                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    Continue Shopping
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.productId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                                            <Image
                                                src={item.image || '/placeholder.jpg'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {item.name}
                                                </h3>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </motion.button>
                                            </div>

                                            {/* Customization Details */}
                                            {item.customization && (
                                                <div className="mb-3 text-sm text-gray-600 space-y-1">
                                                    {item.customization.threadColor && (
                                                        <p>Thread Color: {item.customization.threadColor}</p>
                                                    )}
                                                    {item.customization.threadType && (
                                                        <p>Thread Type: {item.customization.threadType}</p>
                                                    )}
                                                    {item.customization.kundanType && (
                                                        <p>Kundan Type: {item.customization.kundanType}</p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 hover:from-purple-200 hover:to-pink-200 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </motion.button>
                                                    <span className="text-lg font-semibold w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 hover:from-purple-200 hover:to-pink-200 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </motion.button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ₹{item.price.toLocaleString()} each
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Code
                                </label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-green-600" />
                                            <span className="font-semibold text-green-700">
                                                {appliedCoupon.code}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter code"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleApplyCoupon}
                                            disabled={isValidatingCoupon}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50"
                                        >
                                            {isValidatingCoupon ? 'Validating...' : 'Apply'}
                                        </motion.button>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
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
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ₹{finalTotal.toFixed(2)}
                                </span>
                            </div>

                            {/* Checkout Button */}
                            <Link href="/checkout">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>

                            {/* Continue Shopping */}
                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-3 border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                                >
                                    Continue Shopping
                                </motion.button>
                            </Link>

                            {/* Free Shipping Notice */}
                            {cartTotal < 1000 && (
                                <p className="text-sm text-gray-500 text-center mt-4">
                                    Add ₹{(1000 - cartTotal).toLocaleString()} more for free shipping!
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
