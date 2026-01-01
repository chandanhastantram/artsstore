'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    category: string;
    stock: number;
}

export default function WishlistPage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/wishlist`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setWishlist(response.data.wishlist);
            }
        } catch (error: any) {
            toast.error('Failed to load wishlist');
            if (error.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/wishlist/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setWishlist(prev => prev.filter(item => item._id !== productId));
                toast.success('Removed from wishlist');
            }
        } catch (error: any) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0] || '',
        });
        toast.success('Added to cart!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/account">
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Account
                        </motion.button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            My Wishlist
                        </h1>
                        <p className="text-gray-600">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </motion.div>
                </div>

                {/* Wishlist Items */}
                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <Heart className="w-12 h-12 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-6">
                            Save items you love to your wishlist
                        </p>
                        <Link href="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                            >
                                Start Shopping
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {wishlist.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                                >
                                    {/* Product Image */}
                                    <Link href={`/product/${product._id}`}>
                                        <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                                            {product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            )}
                                            {/* Remove Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveFromWishlist(product._id);
                                                }}
                                                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:text-red-700 z-10"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <Link href={`/product/${product._id}`}>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                ₹{product.price.toLocaleString()}
                                            </p>
                                            {product.stock > 0 ? (
                                                <span className="text-sm text-green-600 font-medium">In Stock</span>
                                            ) : (
                                                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                                            )}
                                        </div>

                                        {/* Add to Cart Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
