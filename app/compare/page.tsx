'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, X, ShoppingCart, Heart, Check, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
    ratings: {
        average: number;
        count: number;
    };
    material?: string;
    weight?: string;
    dimensions?: string;
}

function ComparePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productIds = searchParams.get('products')?.split(',') || [];
        if (productIds.length === 0) {
            router.push('/shop');
            return;
        }
        fetchProducts(productIds);
    }, [searchParams]);

    const fetchProducts = async (productIds: string[]) => {
        try {
            setLoading(true);
            const promises = productIds.map((id) =>
                axios.get(`/api/products/${id}`)
            );
            const responses = await Promise.all(promises);
            const fetchedProducts = responses
                .filter((res) => res.data.success)
                .map((res) => res.data.product);
            setProducts(fetchedProducts);
        } catch (error) {
            toast.error('Failed to load products for comparison');
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = (productId: string) => {
        const remaining = products.filter((p) => p._id !== productId).map((p) => p._id);
        if (remaining.length === 0) {
            router.push('/shop');
        } else {
            router.push(`/compare?products=${remaining.join(',')}`);
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

    const comparisonRows = [
        { label: 'Price', key: 'price', format: (val: any) => `₹${val.toLocaleString()}` },
        { label: 'Category', key: 'category' },
        { label: 'Stock Status', key: 'stock', format: (val: any) => (val > 0 ? `In Stock (${val})` : 'Out of Stock') },
        { label: 'Rating', key: 'ratings', format: (val: any) => `${val.average.toFixed(1)} ⭐ (${val.count} reviews)` },
        { label: 'Material', key: 'material', format: (val: any) => val || 'N/A' },
        { label: 'Weight', key: 'weight', format: (val: any) => val || 'N/A' },
        { label: 'Dimensions', key: 'dimensions', format: (val: any) => val || 'N/A' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading comparison...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/shop">
                        <motion.button
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Shop
                        </motion.button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Product Comparison
                        </h1>
                        <p className="text-gray-600">
                            Compare {products.length} {products.length === 1 ? 'product' : 'products'} side by side
                        </p>
                    </motion.div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                                    <th className="p-6 text-left font-semibold text-gray-900 sticky left-0 bg-gradient-to-r from-purple-50 to-pink-50 z-10">
                                        Features
                                    </th>
                                    {products.map((product) => (
                                        <th key={product._id} className="p-6 min-w-[300px]">
                                            <div className="relative">
                                                {/* Remove Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeProduct(product._id)}
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 z-20"
                                                >
                                                    <X className="w-4 h-4" />
                                                </motion.button>

                                                {/* Product Image */}
                                                <Link href={`/product/${product._id}`}>
                                                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden mb-4 group cursor-pointer">
                                                        {product.images[0] && (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        )}
                                                    </div>
                                                </Link>

                                                {/* Product Name */}
                                                <Link href={`/product/${product._id}`}>
                                                    <h3 className="font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors cursor-pointer">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Description Row */}
                                <tr className="border-t border-gray-200">
                                    <td className="p-6 font-semibold text-gray-900 sticky left-0 bg-white z-10">
                                        Description
                                    </td>
                                    {products.map((product) => (
                                        <td key={product._id} className="p-6 text-gray-600 text-sm">
                                            {product.description}
                                        </td>
                                    ))}
                                </tr>

                                {/* Comparison Rows */}
                                {comparisonRows.map((row, index) => (
                                    <tr
                                        key={row.key}
                                        className={`border-t border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                                    >
                                        <td className="p-6 font-semibold text-gray-900 sticky left-0 z-10" style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                                            {row.label}
                                        </td>
                                        {products.map((product) => {
                                            const value = product[row.key as keyof Product];
                                            const displayValue = row.format ? row.format(value) : value;
                                            
                                            // Highlight best value for price (lowest) and rating (highest)
                                            let isBest = false;
                                            if (row.key === 'price') {
                                                const prices = products.map((p) => p.price);
                                                isBest = product.price === Math.min(...prices);
                                            } else if (row.key === 'ratings') {
                                                const ratings = products.map((p) => p.ratings.average);
                                                isBest = product.ratings.average === Math.max(...ratings) && product.ratings.average > 0;
                                            }

                                            return (
                                                <td key={product._id} className="p-6">
                                                    <div className={`flex items-center gap-2 ${isBest ? 'text-green-600 font-semibold' : 'text-gray-700'}`}>
                                                        {isBest && <Check className="w-5 h-5" />}
                                                        {displayValue}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}

                                {/* Action Buttons Row */}
                                <tr className="border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                                    <td className="p-6 font-semibold text-gray-900 sticky left-0 bg-gradient-to-r from-purple-50 to-pink-50 z-10">
                                        Actions
                                    </td>
                                    {products.map((product) => (
                                        <td key={product._id} className="p-6">
                                            <div className="space-y-3">
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
                                                <Link href={`/product/${product._id}`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                                                    >
                                                        View Details
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add More Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center"
                >
                    <p className="text-gray-600 mb-4">Want to compare more products?</p>
                    <Link href="/shop">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                        >
                            Browse More Products
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading comparison...</p>
                </div>
            </div>
        }>
            <ComparePageContent />
        </Suspense>
    );
}
