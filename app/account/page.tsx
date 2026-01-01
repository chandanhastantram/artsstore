'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Package, Heart, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface UserData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    createdAt: string;
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    phone: userData.phone || '',
                    street: userData.address?.street || '',
                    city: userData.address?.city || '',
                    state: userData.address?.state || '',
                    zipCode: userData.address?.zipCode || '',
                    country: userData.address?.country || 'India',
                });
            }
        } catch (error: any) {
            toast.error('Failed to load user data');
            if (error.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
                {
                    name: formData.name,
                    phone: formData.phone,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country,
                    },
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setUser(response.data.user);
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center pt-24">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your account...</p>
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
                        My Account
                    </h1>
                    <p className="text-gray-600">Manage your profile and view your orders</p>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Member since {new Date(user?.createdAt || '').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activeTab === 'profile'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-700 hover:bg-purple-50'
                                    }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Profile</span>
                                </button>

                                <Link href="/account/orders">
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors"
                                    >
                                        <Package className="w-5 h-5" />
                                        <span className="font-medium">My Orders</span>
                                    </button>
                                </Link>

                                <Link href="/account/wishlist">
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors"
                                    >
                                        <Heart className="w-5 h-5" />
                                        <span className="font-medium">Wishlist</span>
                                    </button>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </nav>
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                {!isEditing ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </motion.button>
                                ) : (
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset form data
                                                setFormData({
                                                    name: user?.name || '',
                                                    phone: user?.phone || '',
                                                    street: user?.address?.street || '',
                                                    city: user?.address?.city || '',
                                                    state: user?.address?.state || '',
                                                    zipCode: user?.address?.zipCode || '',
                                                    country: user?.address?.country || 'India',
                                                });
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </motion.button>
                                    </div>
                                )}
                            </div>

                            {/* Personal Information */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-purple-600" />
                                    Personal Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                                {user?.name || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="9876543210"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                {user?.phone || 'Not provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-purple-600" />
                                    Address Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                placeholder="123 Main Street, Apartment 4B"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                                {user?.address?.street || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Mumbai"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                                {user?.address?.city || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="Maharashtra"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                                {user?.address?.state || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="400001"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                                {user?.address?.zipCode || 'Not provided'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country
                                        </label>
                                        <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                                            {user?.address?.country || 'India'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
