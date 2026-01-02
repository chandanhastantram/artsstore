'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSlide {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
}

interface HeroCarouselProps {
    slides: HeroSlide[];
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    isAdmin?: boolean;
    onEdit?: () => void;
}

export default function HeroCarousel({
    slides,
    autoPlay = true,
    autoPlaySpeed = 5000,
    isAdmin = false,
    onEdit
}: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Default slide if no slides provided
    const defaultSlides: HeroSlide[] = [{
        image: '',
        title: 'Royal Heritage Crafted for You',
        subtitle: 'Discover exquisite handcrafted Kundan bangles and traditional Indian handicrafts',
        buttonText: 'Explore Collection',
        buttonLink: '/shop'
    }];

    const displaySlides = slides.length > 0 ? slides : defaultSlides;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, [displaySlides.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    };

    // Auto-play
    useEffect(() => {
        if (!autoPlay || displaySlides.length <= 1 || isHovered) return;

        const interval = setInterval(nextSlide, autoPlaySpeed);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlaySpeed, displaySlides.length, isHovered, nextSlide]);

    const currentSlide = displaySlides[currentIndex];

    return (
        <section
            className="relative h-screen flex items-center justify-center overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {currentSlide.image ? (
                        <Image
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-ivory-100 via-gold-50 to-maroon-50" />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[url('/patterns/mandala.svg')] opacity-5" />

            {/* Content */}
            <div className="container-custom relative z-10 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 text-white drop-shadow-lg">
                            {currentSlide.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
                            {currentSlide.subtitle}
                        </p>
                        <Link href={currentSlide.buttonLink}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                            >
                                {currentSlide.buttonText}
                            </motion.button>
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            {displaySlides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {displaySlides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {displaySlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Admin Edit Button */}
            {isAdmin && onEdit && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={onEdit}
                    className="absolute top-24 right-4 z-30 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors"
                    title="Edit Hero Section"
                >
                    <Edit2 className="w-5 h-5" />
                </motion.button>
            )}
        </section>
    );
}
