'use client';

import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Award, Heart, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-br from-gold-50 to-maroon-50">
                <div className="container-custom text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                        Our <span className="gradient-text">Story</span>
                    </h1>
                    <div className="gold-divider"></div>
                    <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
                        Preserving centuries of heritage craftsmanship while embracing modern innovation
                    </p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-serif font-bold mb-6">
                                A Legacy of Excellence
                            </h2>
                            <p className="text-gray-600 mb-4 text-lg">
                                MegaArtsStore was born from a passion to preserve and celebrate India's rich heritage of Kundan jewelry craftsmanship. For over three generations, our family has been dedicated to the art of creating exquisite bangles that blend traditional techniques with contemporary design.
                            </p>
                            <p className="text-gray-600 mb-4 text-lg">
                                Each piece in our collection tells a story—a story of skilled artisans who have spent years perfecting their craft, of precious materials sourced with care, and of designs that honor our cultural heritage while appealing to modern sensibilities.
                            </p>
                            <p className="text-gray-600 text-lg">
                                Today, we're proud to bring this heritage to you through our innovative platform, where tradition meets technology with features like 3D customization and AR try-on, making luxury accessible to everyone.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-lg p-8 flex flex-col items-center justify-center">
                                <Award className="w-16 h-16 text-gold-600 mb-4" />
                                <h3 className="text-3xl font-bold text-gold-700">400+</h3>
                                <p className="text-gray-700">Years of Tradition</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg p-8 flex flex-col items-center justify-center">
                                <Users className="w-16 h-16 text-emerald-600 mb-4" />
                                <h3 className="text-3xl font-bold text-emerald-700">50+</h3>
                                <p className="text-gray-700">Master Artisans</p>
                            </div>
                            <div className="bg-gradient-to-br from-maroon-100 to-maroon-200 rounded-lg p-8 flex flex-col items-center justify-center">
                                <Heart className="w-16 h-16 text-maroon-600 mb-4" />
                                <h3 className="text-3xl font-bold text-maroon-700">10,000+</h3>
                                <p className="text-gray-700">Happy Customers</p>
                            </div>
                            <div className="bg-gradient-to-br from-gold-100 to-maroon-100 rounded-lg p-8 flex flex-col items-center justify-center">
                                <Sparkles className="w-16 h-16 text-gold-600 mb-4" />
                                <h3 className="text-3xl font-bold text-gold-700">500+</h3>
                                <p className="text-gray-700">Unique Designs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Craftsmanship */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            The Art of Kundan
                        </h2>
                        <div className="gold-divider"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card>
                            <CardBody>
                                <div className="text-6xl mb-4">🎨</div>
                                <h3 className="text-xl font-serif font-bold mb-3">Design</h3>
                                <p className="text-gray-600">
                                    Each design is carefully sketched and planned, drawing inspiration from Mughal architecture and traditional Indian motifs.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <div className="text-6xl mb-4">⚒️</div>
                                <h3 className="text-xl font-serif font-bold mb-3">Crafting</h3>
                                <p className="text-gray-600">
                                    Master artisans meticulously set each Kundan stone by hand, a process that can take several days for a single piece.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <div className="text-6xl mb-4">✨</div>
                                <h3 className="text-xl font-serif font-bold mb-3">Finishing</h3>
                                <p className="text-gray-600">
                                    Every piece undergoes rigorous quality checks and finishing touches to ensure it meets our exacting standards.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Card>
                            <CardBody>
                                <h3 className="text-3xl font-serif font-bold mb-4 text-gold-600">
                                    Our Vision
                                </h3>
                                <p className="text-gray-600 text-lg">
                                    To be the world's leading platform for authentic Indian handcrafted jewelry, making heritage craftsmanship accessible to everyone while supporting artisan communities and preserving traditional skills for future generations.
                                </p>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <h3 className="text-3xl font-serif font-bold mb-4 text-maroon-600">
                                    Our Mission
                                </h3>
                                <p className="text-gray-600 text-lg">
                                    To create exceptional handcrafted jewelry that celebrates India's rich cultural heritage, empowers artisan communities through fair trade practices, and delivers an unparalleled customer experience through innovation and technology.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            Our Values
                        </h2>
                        <div className="gold-divider"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: 'Authenticity',
                                description: 'Every piece is genuinely handcrafted using traditional techniques',
                            },
                            {
                                title: 'Quality',
                                description: 'We never compromise on materials or craftsmanship',
                            },
                            {
                                title: 'Fair Trade',
                                description: 'Artisans receive fair compensation for their exceptional work',
                            },
                            {
                                title: 'Innovation',
                                description: 'Blending heritage with modern technology for better experiences',
                            },
                        ].map((value, index) => (
                            <Card key={index} hover>
                                <CardBody className="text-center">
                                    <h3 className="text-xl font-serif font-bold mb-3 text-gold-600">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
