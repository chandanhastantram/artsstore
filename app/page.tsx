'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { ArrowRight, Star, Award, Users, Sparkles, Edit2, Heart, ShoppingBag, Gem, Crown } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductSlideshow from '@/components/home/ProductSlideshow';
import FloatingParticles from '@/components/home/FloatingParticles';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import { useAuth } from '@/contexts/AuthContext';

interface HomepageSettings {
    heroSlides: any[];
    featuredSection: {
        enabled: boolean;
        title: string;
        subtitle: string;
        displayCount: number;
        autoPlay: boolean;
        autoPlaySpeed: number;
    };
    features: any[];
    artisanStory: {
        enabled: boolean;
        title: string;
        highlightedText: string;
        content: string;
        additionalContent: string;
        buttonText: string;
        buttonLink: string;
        image: string;
    };
    testimonials: any[];
    ctaSection: {
        enabled: boolean;
        title: string;
        subtitle: string;
        buttonText: string;
        buttonLink: string;
    };
}

// Animated text component
const AnimatedText = ({ text, className = '' }: { text: string; className?: string }) => {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default function HomePage() {
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<HomepageSettings | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    useEffect(() => {
        fetchFeaturedProducts();
        fetchHomepageSettings();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await api.get('/products?featured=true&sort=newest');
            setFeaturedProducts(response.data.products.slice(0, 8));
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHomepageSettings = async () => {
        try {
            const response = await fetch('/api/homepage');
            const data = await response.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (error) {
            console.error('Error fetching homepage settings:', error);
        }
    };

    // Default testimonials with enhanced styling
    const defaultTestimonials = [
        {
            name: 'Priya Sharma',
            rating: 5,
            comment: 'Absolutely stunning bangles! The craftsmanship is exceptional and the customization options made it perfect for my wedding.',
            image: '',
        },
        {
            name: 'Anjali Patel',
            rating: 5,
            comment: 'The quality exceeded my expectations. These are truly royal pieces that showcase Indian heritage beautifully.',
            image: '',
        },
        {
            name: 'Meera Reddy',
            rating: 5,
            comment: 'Love the AR try-on feature! Made shopping so much easier. The bangles arrived exactly as shown.',
            image: '',
        },
    ];

    const defaultFeatures = [
        { 
            icon: 'Crown', 
            title: 'Royal Craftsmanship', 
            description: 'Handcrafted by master artisans with decades of experience in traditional Kundan art',
            gradient: 'from-gold-400 to-amber-600'
        },
        { 
            icon: 'Gem', 
            title: '3D Customization', 
            description: 'Visualize and customize your bangles in stunning real-time 3D before you buy',
            gradient: 'from-emerald-400 to-teal-600'
        },
        { 
            icon: 'Sparkles', 
            title: 'AR Virtual Try-On', 
            description: 'Experience how bangles look on you with our cutting-edge AR technology',
            gradient: 'from-purple-400 to-pink-600'
        },
    ];

    const testimonials = (settings?.testimonials && settings.testimonials.length > 0) ? settings.testimonials : defaultTestimonials;
    const features = (settings?.features && settings.features.length > 0) ? settings.features : defaultFeatures;

    const getFeatureIcon = (iconName: string) => {
        switch (iconName) {
            case 'Award': return Award;
            case 'Sparkles': return Sparkles;
            case 'Users': return Users;
            case 'Crown': return Crown;
            case 'Gem': return Gem;
            case 'Heart': return Heart;
            default: return Crown;
        }
    };

    return (
        <div className="bg-ivory-100 overflow-hidden">
            {/* Admin Edit Link */}
            {isAdmin && (
                <Link href="/admin/homepage">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fixed right-4 top-24 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="font-medium">Edit Page</span>
                    </motion.div>
                </Link>
            )}

            {/* Hero Section - Enhanced with Particles */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <AnimatedBackground />
                
                {/* Floating Gold Particles */}
                <FloatingParticles count={25} colors={['#D4AF37', '#FFD700', '#F0E68C', '#B8860B']} />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-ivory-100/90 via-gold-50/80 to-maroon-50/70" />
                
                {/* Mandala Pattern */}
                <div className="absolute inset-0 bg-[url('/patterns/mandala.svg')] opacity-5" />

                {/* Hero Content */}
                <div className="container-custom relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        {/* Decorative Crown */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, type: 'spring' }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl">
                                <Crown className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <span className="inline-block bg-gradient-to-r from-gold-600 via-gold-500 to-maroon-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                                Royal Heritage
                            </span>
                            <br />
                            <motion.span
                                className="text-gray-800"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                Crafted for You
                            </motion.span>
                        </motion.h1>

                        {/* Animated Divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="w-32 h-1 mx-auto bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-6"
                        />

                        {/* Subtitle */}
                        <motion.p
                            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                        >
                            Discover exquisite <span className="text-gold-600 font-semibold">handcrafted Kundan bangles</span> and traditional Indian handicrafts that celebrate centuries of artistry
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.6 }}
                        >
                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-full shadow-lg flex items-center gap-3 hover:from-gold-600 hover:to-gold-700 transition-all group"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span>Explore Collection</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link href="/about">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 border-2 border-gold-500 text-gold-600 font-semibold rounded-full hover:bg-gold-50 transition-colors flex items-center gap-2"
                                >
                                    <Gem className="w-5 h-5" />
                                    Our Story
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            className="flex justify-center gap-12 mt-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3, duration: 0.6 }}
                        >
                            {[
                                { value: '500+', label: 'Designs' },
                                { value: '10K+', label: 'Happy Customers' },
                                { value: '25+', label: 'Years Legacy' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    className="text-center"
                                >
                                    <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-600 to-maroon-500 bg-clip-text text-transparent">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-gold-500/50 rounded-full flex justify-center pt-2">
                        <motion.div
                            className="w-1.5 h-3 bg-gold-500 rounded-full"
                            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Features Section - Enhanced Cards */}
            <section className="section-padding bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#D4AF37_1px,transparent_1px)] bg-[length:60px_60px]" />
                </div>

                {isAdmin && (
                    <Link href="/admin/homepage">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700"
                            title="Edit Features"
                        >
                            <Edit2 className="w-4 h-4" />
                        </motion.button>
                    </Link>
                )}

                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Why Choose <span className="gradient-text">MegaArtsStore</span>
                        </h2>
                        <div className="gold-divider mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature: any, index: number) => {
                            const Icon = getFeatureIcon(feature.icon);
                            const gradients = [
                                'from-gold-400 to-amber-600',
                                'from-emerald-400 to-teal-600',
                                'from-purple-400 to-pink-600'
                            ];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    onHoverStart={() => setHoveredIndex(index)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                    className="relative group"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center border border-gray-100 overflow-hidden">
                                        {/* Animated Background on Hover */}
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${gradients[index % 3]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                        />
                                        
                                        {/* Icon */}
                                        <motion.div
                                            className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${gradients[index % 3]} rounded-2xl flex items-center justify-center shadow-lg`}
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Icon className="w-10 h-10 text-white" />
                                        </motion.div>
                                        
                                        {/* Content */}
                                        <h3 className="text-xl font-serif font-bold mb-3 text-gray-900">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                        
                                        {/* Decorative Line */}
                                        <motion.div
                                            className={`h-1 bg-gradient-to-r ${gradients[index % 3]} mt-6 rounded-full`}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products - Dynamic Slideshow */}
            {(settings?.featuredSection?.enabled !== false) && (
                <section className="relative">
                    <FloatingParticles count={10} colors={['#D4AF37', '#FFD700']} />
                    <ProductSlideshow
                        products={featuredProducts}
                        title={settings?.featuredSection?.title || 'Featured Collection'}
                        subtitle={settings?.featuredSection?.subtitle || 'Handpicked pieces showcasing our finest craftsmanship'}
                        autoPlay={settings?.featuredSection?.autoPlay !== false}
                        autoPlaySpeed={settings?.featuredSection?.autoPlaySpeed || 3000}
                        isAdmin={isAdmin}
                        onEdit={() => window.location.href = '/admin/homepage'}
                    />
                </section>
            )}

            {/* Artisan Story - Enhanced Layout */}
            {(settings?.artisanStory?.enabled !== false) && (
                <section className="section-padding bg-gradient-to-br from-ivory-100 via-white to-gold-50 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold-200/30 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-maroon-200/20 to-transparent rounded-full blur-3xl" />

                    {isAdmin && (
                        <Link href="/admin/homepage">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700"
                                title="Edit Artisan Story"
                            >
                                <Edit2 className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    )}

                    <div className="container-custom relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 px-4 py-2 rounded-full mb-6">
                                    <Gem className="w-4 h-4" />
                                    <span className="text-sm font-semibold">400 Years of Legacy</span>
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                                    {settings?.artisanStory?.title || 'Heritage of'}{' '}
                                    <span className="bg-gradient-to-r from-gold-600 to-maroon-500 bg-clip-text text-transparent">
                                        {settings?.artisanStory?.highlightedText || 'Craftsmanship'}
                                    </span>
                                </h2>
                                
                                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                                    {settings?.artisanStory?.content || 'Each piece at MegaArtsStore is a testament to centuries-old traditions passed down through generations of master artisans. Our Kundan bangles are meticulously handcrafted using techniques that have remained unchanged for over 400 years.'}
                                </p>
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    {settings?.artisanStory?.additionalContent || 'We work directly with artisan families in Rajasthan, ensuring fair wages and preserving this invaluable cultural heritage for future generations.'}
                                </p>
                                
                                <Link href={settings?.artisanStory?.buttonLink || '/about'}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all group"
                                    >
                                        {settings?.artisanStory?.buttonText || 'Discover Our Story'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Image */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative"
                            >
                                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                    {/* Decorative Frame */}
                                    <div className="absolute inset-4 border-2 border-gold-300/50 rounded-2xl z-10" />
                                    
                                    {settings?.artisanStory?.image ? (
                                        <Image
                                            src={settings.artisanStory.image}
                                            alt="Artisan Story"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gold-200 via-gold-100 to-maroon-100 flex items-center justify-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <Crown className="w-32 h-32 text-gold-400/50" />
                                            </motion.div>
                                        </div>
                                    )}
                                    
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                
                                {/* Floating Badge */}
                                <motion.div
                                    className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                                            <Award className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">100%</p>
                                            <p className="text-sm text-gray-600">Handcrafted</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials - Enhanced Cards */}
            <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-maroon-500/10 rounded-full blur-3xl" />
                </div>

                {isAdmin && (
                    <Link href="/admin/homepage">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                            title="Edit Testimonials"
                        >
                            <Edit2 className="w-4 h-4" />
                        </motion.button>
                    </Link>
                )}

                <div className="container-custom relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
                            What Our <span className="text-gold-400">Customers</span> Say
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="relative"
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold-400/30 transition-all">
                                    {/* Quote Icon */}
                                    <div className="text-6xl text-gold-400/20 font-serif absolute top-4 right-6">"</div>
                                    
                                    {/* Stars */}
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 * i }}
                                            >
                                                <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
                                            </motion.div>
                                        ))}
                                    </div>
                                    
                                    {/* Quote */}
                                    <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
                                    
                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {testimonial.name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{testimonial.name}</p>
                                            <p className="text-sm text-gray-400">Verified Buyer</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Enhanced */}
            {(settings?.ctaSection?.enabled !== false) && (
                <section className="relative py-24 overflow-hidden">
                    {/* Animated Gradient Background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gold-500 via-gold-600 to-maroon-500"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{ backgroundSize: '200% 200%' }}
                    />
                    
                    {/* Overlay Pattern */}
                    <div className="absolute inset-0 bg-[url('/patterns/mandala.svg')] opacity-10" />
                    
                    {/* Floating Particles */}
                    <FloatingParticles count={15} colors={['#FFFFFF', '#F0E68C', '#FFD700']} />

                    {isAdmin && (
                        <Link href="/admin/homepage">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                                title="Edit CTA"
                            >
                                <Edit2 className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    )}

                    <div className="container-custom text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="mb-6"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Crown className="w-16 h-16 text-white mx-auto" />
                            </motion.div>
                            
                            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-lg">
                                {settings?.ctaSection?.title || 'Ready to Find Your Perfect Piece?'}
                            </h2>
                            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
                                {settings?.ctaSection?.subtitle || 'Explore our collection and create something uniquely yours'}
                            </p>
                            
                            <Link href={settings?.ctaSection?.buttonLink || '/shop'}>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-12 py-5 bg-white text-gold-700 font-bold text-lg rounded-full shadow-2xl hover:bg-ivory-100 transition-colors flex items-center gap-3 mx-auto"
                                >
                                    <ShoppingBag className="w-6 h-6" />
                                    {settings?.ctaSection?.buttonText || 'Start Shopping'}
                                    <ArrowRight className="w-6 h-6" />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
}
