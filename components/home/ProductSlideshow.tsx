'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Edit2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    ratings: {
        average: number;
        count: number;
    };
}

interface ProductSlideshowProps {
    products: Product[];
    title?: string;
    subtitle?: string;
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    isAdmin?: boolean;
    onEdit?: () => void;
}

export default function ProductSlideshow({
    products,
    title = 'Featured Collection',
    subtitle = 'Handpicked pieces showcasing our finest craftsmanship',
    autoPlay = true,
    autoPlaySpeed = 3000,
    isAdmin = false,
    onEdit
}: ProductSlideshowProps) {
    const { addToCart } = useCart();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate visible items based on screen size
    const getVisibleCount = () => {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    };

    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const handleResize = () => setVisibleCount(getVisibleCount());
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, products.length - visibleCount);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    // Auto-play
    useEffect(() => {
        if (!autoPlay || products.length <= visibleCount || isHovered) return;

        const interval = setInterval(nextSlide, autoPlaySpeed);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlaySpeed, products.length, visibleCount, isHovered, nextSlide]);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0] || '',
        });
        toast.success('Added to cart!');
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="section-padding relative">
            {/* Admin Edit Button */}
            {isAdmin && onEdit && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={onEdit}
                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                    title="Edit Featured Section"
                >
                    <Edit2 className="w-4 h-4" />
                </motion.button>
            )}

            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        {title}
                    </h2>
                    <div className="gold-divider" />
                    <p className="text-gray-600 mt-4">{subtitle}</p>
                </div>

                {/* Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    ref={containerRef}
                >
                    {/* Navigation Arrows */}
                    {products.length > visibleCount && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Products Container */}
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex gap-6"
                            animate={{
                                x: `-${currentIndex * (100 / visibleCount + 1.5)}%`
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {products.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/product/${product._id}`}
                                    className="flex-shrink-0"
                                    style={{ width: `calc(${100 / visibleCount}% - 1rem)` }}
                                >
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                                    >
                                        {/* Product Image */}
                                        <div className="relative h-64 bg-gradient-to-br from-gold-50 to-maroon-50 overflow-hidden">
                                            {product.images && product.images[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingCart className="w-16 h-16 text-gold-300" />
                                                </div>
                                            )}

                                            {/* Quick Add Button */}
                                            <motion.button
                                                initial={{ opacity: 0, y: 20 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gold-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
                                                onClick={(e) => handleAddToCart(product, e)}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </motion.button>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="text-lg font-serif font-bold mb-2 line-clamp-1 group-hover:text-gold-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-gold-600">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                                {product.ratings.average > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                                                        <span className="text-sm text-gray-600">
                                                            {product.ratings.average.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>

                    {/* Dots Indicator */}
                    {products.length > visibleCount && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        index === currentIndex
                                            ? 'bg-gold-600 w-6'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/shop">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 border-2 border-gold-600 text-gold-600 font-semibold rounded-lg hover:bg-gold-600 hover:text-white transition-colors"
                        >
                            View All Products
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
