'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { ArrowRight, Star, Award, Users, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await api.get('/products?featured=true&sort=newest');
            setFeaturedProducts(response.data.products.slice(0, 6));
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    const testimonials = [
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

    return (
        <div className="bg-ivory-100">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ivory-100 via-gold-50 to-maroon-50 opacity-60"></div>
                <div className="absolute inset-0 bg-[url('/patterns/mandala.svg')] opacity-5"></div>

                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6">
                            <span className="gradient-text">Royal Heritage</span>
                            <br />
                            <span className="text-gray-800">Crafted for You</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Discover exquisite handcrafted Kundan bangles and traditional Indian handicrafts
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/shop">
                                <Button size="lg" className="flex items-center space-x-2">
                                    <span>Explore Collection</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline">
                                    Our Story
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-float">
                    <Sparkles className="w-12 h-12 text-gold-400 opacity-60" />
                </div>
                <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
                    <Sparkles className="w-16 h-16 text-maroon-400 opacity-40" />
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card hover>
                            <CardBody className="text-center">
                                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-8 h-8 text-gold-600" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-2">Premium Quality</h3>
                                <p className="text-gray-600">
                                    Handcrafted by master artisans with decades of experience
                                </p>
                            </CardBody>
                        </Card>

                        <Card hover>
                            <CardBody className="text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-2">3D Customization</h3>
                                <p className="text-gray-600">
                                    Visualize and customize your bangles in real-time 3D
                                </p>
                            </CardBody>
                        </Card>

                        <Card hover>
                            <CardBody className="text-center">
                                <div className="w-16 h-16 bg-maroon-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-maroon-600" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-2">AR Try-On</h3>
                                <p className="text-gray-600">
                                    See how bangles look on you with our AR technology
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Featured Collection
                        </h2>
                        <div className="gold-divider"></div>
                        <p className="text-gray-600 mt-4">
                            Handpicked pieces showcasing our finest craftsmanship
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="shimmer h-96 rounded-lg"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredProducts.map((product: any) => (
                                <Link key={product._id} href={`/product/${product._id}`}>
                                    <Card hover className="h-full">
                                        <div className="image-hover-zoom h-64 bg-gray-100">
                                            {product.images && product.images[0] && (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <CardBody>
                                            <h3 className="text-xl font-serif font-bold mb-2">{product.name}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-2xl font-bold text-gold-600">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                                {product.ratings.average > 0 && (
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                                                        <span className="text-sm">{product.ratings.average.toFixed(1)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/shop">
                            <Button size="lg" variant="outline">
                                View All Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Artisan Story */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                                Heritage of <span className="gradient-text">Craftsmanship</span>
                            </h2>
                            <p className="text-gray-600 mb-6 text-lg">
                                Each piece at MegaArtsStore is a testament to centuries-old traditions passed down through generations of master artisans. Our Kundan bangles are meticulously handcrafted using techniques that have remained unchanged for over 400 years.
                            </p>
                            <p className="text-gray-600 mb-8 text-lg">
                                We work directly with artisan families in Rajasthan, ensuring fair wages and preserving this invaluable cultural heritage for future generations.
                            </p>
                            <Link href="/about">
                                <Button>Learn More About Us</Button>
                            </Link>
                        </div>
                        <div className="relative h-96 rounded-lg overflow-hidden shadow-luxury">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-maroon-400/20"></div>
                            {/* Placeholder for artisan image */}
                            <div className="w-full h-full bg-gradient-to-br from-gold-100 to-maroon-100 flex items-center justify-center">
                                <Users className="w-32 h-32 text-gold-400 opacity-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            What Our Customers Say
                        </h2>
                        <div className="gold-divider"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index}>
                                <CardBody>
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
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
            <section className="section-padding bg-gradient-to-br from-gold-500 to-maroon-500 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Ready to Find Your Perfect Piece?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Explore our collection and create something uniquely yours
                    </p>
                    <Link href="/shop">
                        <Button size="lg" className="bg-white text-gold-700 hover:bg-ivory-100">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
