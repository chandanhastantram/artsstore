'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { ArrowRight, Star, Award, Users, Sparkles, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductSlideshow from '@/components/home/ProductSlideshow';
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

export default function HomePage() {
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<HomepageSettings | null>(null);

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

    // Default values if settings not loaded
    const defaultTestimonials = [
        {
            name: 'Priya Sharma',
            rating: 5,
            comment: 'Absolutely stunning bangles! The craftsmanship is exceptional and the customization options made it perfect for my wedding.',
        },
        {
            name: 'Anjali Patel',
            rating: 5,
            comment: 'The quality exceeded my expectations. These are truly royal pieces that showcase Indian heritage beautifully.',
        },
        {
            name: 'Meera Reddy',
            rating: 5,
            comment: 'Love the AR try-on feature! Made shopping so much easier. The bangles arrived exactly as shown.',
        },
    ];

    const defaultFeatures = [
        { icon: 'Award', title: 'Premium Quality', description: 'Handcrafted by master artisans with decades of experience' },
        { icon: 'Sparkles', title: '3D Customization', description: 'Visualize and customize your bangles in real-time 3D' },
        { icon: 'Users', title: 'AR Try-On', description: 'See how bangles look on you with our AR technology' },
    ];

    const testimonials = (settings?.testimonials && settings.testimonials.length > 0) ? settings.testimonials : defaultTestimonials;
    const features = (settings?.features && settings.features.length > 0) ? settings.features : defaultFeatures;

    const getFeatureIcon = (iconName: string) => {
        switch (iconName) {
            case 'Award': return Award;
            case 'Sparkles': return Sparkles;
            case 'Users': return Users;
            default: return Award;
        }
    };

    return (
        <div className="bg-ivory-100">
            {/* Admin Edit Link */}
            {isAdmin && (
                <Link href="/admin/homepage">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="fixed right-4 top-24 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Homepage
                    </motion.div>
                </Link>
            )}

            {/* Hero Section - Dynamic Carousel */}
            <HeroCarousel
                slides={settings?.heroSlides || []}
                autoPlay={true}
                autoPlaySpeed={5000}
                isAdmin={isAdmin}
                onEdit={() => window.location.href = '/admin/homepage'}
            />

            {/* Features Section */}
            <section className="section-padding bg-white relative">
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
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature: any, index: number) => {
                            const Icon = getFeatureIcon(feature.icon);
                            const bgColors = ['bg-gold-100', 'bg-emerald-100', 'bg-maroon-100'];
                            const textColors = ['text-gold-600', 'text-emerald-600', 'text-maroon-600'];
                            return (
                                <Card key={index} hover>
                                    <CardBody className="text-center">
                                        <div className={`w-16 h-16 ${bgColors[index % 3]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <Icon className={`w-8 h-8 ${textColors[index % 3]}`} />
                                        </div>
                                        <h3 className="text-xl font-serif font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products - Dynamic Slideshow */}
            {(settings?.featuredSection?.enabled !== false) && (
                <ProductSlideshow
                    products={featuredProducts}
                    title={settings?.featuredSection?.title || 'Featured Collection'}
                    subtitle={settings?.featuredSection?.subtitle || 'Handpicked pieces showcasing our finest craftsmanship'}
                    autoPlay={settings?.featuredSection?.autoPlay !== false}
                    autoPlaySpeed={settings?.featuredSection?.autoPlaySpeed || 3000}
                    isAdmin={isAdmin}
                    onEdit={() => window.location.href = '/admin/homepage'}
                />
            )}

            {/* Artisan Story */}
            {(settings?.artisanStory?.enabled !== false) && (
                <section className="section-padding bg-white relative">
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
                    <div className="container-custom">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                                    {settings?.artisanStory?.title || 'Heritage of'}{' '}
                                    <span className="gradient-text">
                                        {settings?.artisanStory?.highlightedText || 'Craftsmanship'}
                                    </span>
                                </h2>
                                <p className="text-gray-600 mb-6 text-lg">
                                    {settings?.artisanStory?.content || 'Each piece at MegaArtsStore is a testament to centuries-old traditions passed down through generations of master artisans. Our Kundan bangles are meticulously handcrafted using techniques that have remained unchanged for over 400 years.'}
                                </p>
                                <p className="text-gray-600 mb-8 text-lg">
                                    {settings?.artisanStory?.additionalContent || 'We work directly with artisan families in Rajasthan, ensuring fair wages and preserving this invaluable cultural heritage for future generations.'}
                                </p>
                                <Link href={settings?.artisanStory?.buttonLink || '/about'}>
                                    <Button>{settings?.artisanStory?.buttonText || 'Learn More About Us'}</Button>
                                </Link>
                            </div>
                            <div className="relative h-96 rounded-lg overflow-hidden shadow-luxury">
                                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-maroon-400/20" />
                                {settings?.artisanStory?.image ? (
                                    <Image
                                        src={settings.artisanStory.image}
                                        alt="Artisan Story"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gold-100 to-maroon-100 flex items-center justify-center">
                                        <Users className="w-32 h-32 text-gold-400 opacity-40" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="section-padding relative">
                {isAdmin && (
                    <Link href="/admin/homepage">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700"
                            title="Edit Testimonials"
                        >
                            <Edit2 className="w-4 h-4" />
                        </motion.button>
                    </Link>
                )}
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            What Our Customers Say
                        </h2>
                        <div className="gold-divider" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial: any, index: number) => (
                            <Card key={index}>
                                <CardBody>
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                                    <p className="font-semibold text-gray-800">- {testimonial.name}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {(settings?.ctaSection?.enabled !== false) && (
                <section className="section-padding bg-gradient-to-br from-gold-500 to-maroon-500 text-white relative">
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
                    <div className="container-custom text-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            {settings?.ctaSection?.title || 'Ready to Find Your Perfect Piece?'}
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            {settings?.ctaSection?.subtitle || 'Explore our collection and create something uniquely yours'}
                        </p>
                        <Link href={settings?.ctaSection?.buttonLink || '/shop'}>
                            <Button size="lg" className="bg-white text-gold-700 hover:bg-ivory-100">
                                {settings?.ctaSection?.buttonText || 'Start Shopping'}
                            </Button>
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
