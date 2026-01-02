'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    Image as ImageIcon,
    Loader2,
    ArrowLeft,
    Layout,
    Sparkles,
    Users,
    MessageSquare,
    Megaphone
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface HeroSlide {
    image: string;
    imagePublicId: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    order: number;
}

interface Testimonial {
    name: string;
    rating: number;
    comment: string;
    image: string;
    order: number;
}

export default function AdminHomepagePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'featured' | 'artisan' | 'testimonials' | 'cta'>('hero');

    // Hero Slides
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

    // Featured Section
    const [featuredSection, setFeaturedSection] = useState({
        enabled: true,
        title: 'Featured Collection',
        subtitle: 'Handpicked pieces showcasing our finest craftsmanship',
        displayCount: 6,
        autoPlay: true,
        autoPlaySpeed: 3000
    });

    // Artisan Story
    const [artisanStory, setArtisanStory] = useState({
        enabled: true,
        title: 'Heritage of',
        highlightedText: 'Craftsmanship',
        content: '',
        additionalContent: '',
        buttonText: 'Learn More About Us',
        buttonLink: '/about',
        image: '',
        imagePublicId: ''
    });

    // Testimonials
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // CTA Section
    const [ctaSection, setCtaSection] = useState({
        enabled: true,
        title: 'Ready to Find Your Perfect Piece?',
        subtitle: 'Explore our collection and create something uniquely yours',
        buttonText: 'Start Shopping',
        buttonLink: '/shop'
    });

    useEffect(() => {
        fetchHomepageSettings();
    }, []);

    const fetchHomepageSettings = async () => {
        try {
            const response = await fetch('/api/homepage');
            const data = await response.json();

            if (data.success) {
                if (data.data.heroSlides?.length > 0) {
                    setHeroSlides(data.data.heroSlides);
                }
                if (data.data.featuredSection) {
                    setFeaturedSection(prev => ({ ...prev, ...data.data.featuredSection }));
                }
                if (data.data.artisanStory) {
                    setArtisanStory(prev => ({ ...prev, ...data.data.artisanStory }));
                }
                if (data.data.testimonials?.length > 0) {
                    setTestimonials(data.data.testimonials);
                }
                if (data.data.ctaSection) {
                    setCtaSection(prev => ({ ...prev, ...data.data.ctaSection }));
                }
            }
        } catch (error) {
            toast.error('Failed to load homepage settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/homepage', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    heroSlides,
                    featuredSection,
                    artisanStory,
                    testimonials,
                    ctaSection
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Homepage updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update');
            }
        } catch (error) {
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (
        file: File,
        onSuccess: (url: string, publicId: string) => void
    ) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();
            if (data.url) {
                onSuccess(data.url, data.publicId || '');
                toast.success('Image uploaded!');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        }
    };

    // Hero Slide Management
    const addHeroSlide = () => {
        setHeroSlides([...heroSlides, {
            image: '',
            imagePublicId: '',
            title: 'New Slide Title',
            subtitle: 'Slide subtitle text',
            buttonText: 'Shop Now',
            buttonLink: '/shop',
            order: heroSlides.length
        }]);
    };

    const updateHeroSlide = (index: number, updates: Partial<HeroSlide>) => {
        const updated = [...heroSlides];
        updated[index] = { ...updated[index], ...updates };
        setHeroSlides(updated);
    };

    const removeHeroSlide = (index: number) => {
        setHeroSlides(heroSlides.filter((_, i) => i !== index));
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= heroSlides.length) return;
        const updated = [...heroSlides];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setHeroSlides(updated);
    };

    // Testimonial Management
    const addTestimonial = () => {
        setTestimonials([...testimonials, {
            name: '',
            rating: 5,
            comment: '',
            image: '',
            order: testimonials.length
        }]);
    };

    const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
        const updated = [...testimonials];
        updated[index] = { ...updated[index], ...updates };
        setTestimonials(updated);
    };

    const removeTestimonial = (index: number) => {
        setTestimonials(testimonials.filter((_, i) => i !== index));
    };

    const tabs = [
        { id: 'hero', label: 'Hero Banner', icon: Layout },
        { id: 'featured', label: 'Featured Products', icon: Sparkles },
        { id: 'artisan', label: 'Artisan Story', icon: Users },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { id: 'cta', label: 'Call to Action', icon: Megaphone }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Homepage</h1>
                                <p className="text-sm text-gray-500">Customize your store's homepage</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-4 sticky top-28">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {/* Hero Banner Tab */}
                        {activeTab === 'hero' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Hero Banner Slides</h2>
                                    <button
                                        onClick={addHeroSlide}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Slide
                                    </button>
                                </div>

                                {heroSlides.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>No slides yet. Add your first slide!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {heroSlides.map((slide, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Image Preview */}
                                                    <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        {slide.image ? (
                                                            <Image src={slide.image} alt="Slide" fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleImageUpload(file, (url, publicId) => {
                                                                        updateHeroSlide(index, { image: url, imagePublicId: publicId });
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Fields */}
                                                    <div className="flex-1 space-y-3">
                                                        <input
                                                            type="text"
                                                            value={slide.title}
                                                            onChange={(e) => updateHeroSlide(index, { title: e.target.value })}
                                                            placeholder="Slide Title"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={slide.subtitle}
                                                            onChange={(e) => updateHeroSlide(index, { subtitle: e.target.value })}
                                                            placeholder="Subtitle"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                        />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                value={slide.buttonText}
                                                                onChange={(e) => updateHeroSlide(index, { buttonText: e.target.value })}
                                                                placeholder="Button Text"
                                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={slide.buttonLink}
                                                                onChange={(e) => updateHeroSlide(index, { buttonLink: e.target.value })}
                                                                placeholder="Button Link"
                                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => moveSlide(index, 'up')}
                                                            disabled={index === 0}
                                                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                                                        >
                                                            <ArrowUp className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => moveSlide(index, 'down')}
                                                            disabled={index === heroSlides.length - 1}
                                                            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                                                        >
                                                            <ArrowDown className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeHeroSlide(index)}
                                                            className="p-2 hover:bg-red-100 text-red-600 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Featured Products Tab */}
                        {activeTab === 'featured' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Products Section</h2>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={featuredSection.enabled}
                                            onChange={(e) => setFeaturedSection({ ...featuredSection, enabled: e.target.checked })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="font-medium">Show Featured Products Section</span>
                                    </label>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                                        <input
                                            type="text"
                                            value={featuredSection.title}
                                            onChange={(e) => setFeaturedSection({ ...featuredSection, title: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                                        <input
                                            type="text"
                                            value={featuredSection.subtitle}
                                            onChange={(e) => setFeaturedSection({ ...featuredSection, subtitle: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Products to Display</label>
                                            <input
                                                type="number"
                                                value={featuredSection.displayCount}
                                                onChange={(e) => setFeaturedSection({ ...featuredSection, displayCount: parseInt(e.target.value) })}
                                                min={1}
                                                max={12}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Auto-play Speed (ms)</label>
                                            <input
                                                type="number"
                                                value={featuredSection.autoPlaySpeed}
                                                onChange={(e) => setFeaturedSection({ ...featuredSection, autoPlaySpeed: parseInt(e.target.value) })}
                                                min={1000}
                                                max={10000}
                                                step={500}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={featuredSection.autoPlay}
                                            onChange={(e) => setFeaturedSection({ ...featuredSection, autoPlay: e.target.checked })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="font-medium">Enable Auto-play</span>
                                    </label>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-700">
                                            💡 Products marked as "Featured" in the product settings will automatically appear in this slideshow.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Artisan Story Tab */}
                        {activeTab === 'artisan' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Artisan Story Section</h2>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={artisanStory.enabled}
                                            onChange={(e) => setArtisanStory({ ...artisanStory, enabled: e.target.checked })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="font-medium">Show Artisan Story Section</span>
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title Start</label>
                                            <input
                                                type="text"
                                                value={artisanStory.title}
                                                onChange={(e) => setArtisanStory({ ...artisanStory, title: e.target.value })}
                                                placeholder="Heritage of"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Highlighted Text</label>
                                            <input
                                                type="text"
                                                value={artisanStory.highlightedText}
                                                onChange={(e) => setArtisanStory({ ...artisanStory, highlightedText: e.target.value })}
                                                placeholder="Craftsmanship"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
                                        <textarea
                                            value={artisanStory.content}
                                            onChange={(e) => setArtisanStory({ ...artisanStory, content: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Content</label>
                                        <textarea
                                            value={artisanStory.additionalContent}
                                            onChange={(e) => setArtisanStory({ ...artisanStory, additionalContent: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                            <input
                                                type="text"
                                                value={artisanStory.buttonText}
                                                onChange={(e) => setArtisanStory({ ...artisanStory, buttonText: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                                            <input
                                                type="text"
                                                value={artisanStory.buttonLink}
                                                onChange={(e) => setArtisanStory({ ...artisanStory, buttonLink: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Image</label>
                                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                            {artisanStory.image ? (
                                                <Image src={artisanStory.image} alt="Artisan" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleImageUpload(file, (url, publicId) => {
                                                            setArtisanStory({ ...artisanStory, image: url, imagePublicId: publicId });
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Testimonials Tab */}
                        {activeTab === 'testimonials' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Customer Testimonials</h2>
                                    <button
                                        onClick={addTestimonial}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Testimonial
                                    </button>
                                </div>

                                {testimonials.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>No testimonials yet. Add customer reviews!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {testimonials.map((testimonial, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <input
                                                        type="text"
                                                        value={testimonial.name}
                                                        onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                                                        placeholder="Customer Name"
                                                        className="px-3 py-2 border border-gray-300 rounded-lg w-48"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={testimonial.rating}
                                                            onChange={(e) => updateTestimonial(index, { rating: parseInt(e.target.value) })}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg"
                                                        >
                                                            {[1, 2, 3, 4, 5].map((r) => (
                                                                <option key={r} value={r}>{r} Stars</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => removeTestimonial(index)}
                                                            className="p-2 hover:bg-red-100 text-red-600 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={testimonial.comment}
                                                    onChange={(e) => updateTestimonial(index, { comment: e.target.value })}
                                                    placeholder="Customer review..."
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CTA Section Tab */}
                        {activeTab === 'cta' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Call to Action Section</h2>
                                
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={ctaSection.enabled}
                                            onChange={(e) => setCtaSection({ ...ctaSection, enabled: e.target.checked })}
                                            className="w-5 h-5 rounded"
                                        />
                                        <span className="font-medium">Show CTA Section</span>
                                    </label>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            value={ctaSection.title}
                                            onChange={(e) => setCtaSection({ ...ctaSection, title: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                                        <input
                                            type="text"
                                            value={ctaSection.subtitle}
                                            onChange={(e) => setCtaSection({ ...ctaSection, subtitle: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                            <input
                                                type="text"
                                                value={ctaSection.buttonText}
                                                onChange={(e) => setCtaSection({ ...ctaSection, buttonText: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                                            <input
                                                type="text"
                                                value={ctaSection.buttonLink}
                                                onChange={(e) => setCtaSection({ ...ctaSection, buttonLink: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
