'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Heart, User, Menu, X, LogOut, Home, Store, Info, Mail } from 'lucide-react';

export const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, isSuperAdmin, logout } = useAuth();
    const { cartCount } = useCart();

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, []);

    const navigation = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Shop', href: '/shop', icon: Store },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Contact', href: '/contact', icon: Mail },
    ];

    return (
        <header className="sticky top-0 z-50 backdrop-luxury border-b border-gold-200">
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-3xl font-serif font-bold gradient-text">
                            MegaArtsStore
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-gold-600 transition-colors duration-300 font-medium"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-6">
                        {/* Cart */}
                        <Link href="/cart" className="relative group">
                            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-gold-600 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-maroon-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Wishlist */}
                        {isAuthenticated && (
                            <Link href="/wishlist" className="group hidden md:block">
                                <Heart className="w-6 h-6 text-gray-700 group-hover:text-gold-600 transition-colors" />
                            </Link>
                        )}

                        {/* User Menu - Desktop */}
                        {isAuthenticated ? (
                            <div className="relative group hidden md:block">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-gold-600 transition-colors">
                                    <User className="w-6 h-6" />
                                    <span className="hidden lg:block">{user?.name}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-luxury opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-3 text-gray-700 hover:bg-gold-50 rounded-t-lg transition-colors"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block px-4 py-3 text-gray-700 hover:bg-gold-50 transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                    {(isAdmin || isSuperAdmin) && (
                                        <Link
                                            href="/admin/dashboard"
                                            className="block px-4 py-3 text-gray-700 hover:bg-gold-50 transition-colors"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:block text-gray-700 hover:text-gold-600 transition-colors font-medium"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sliding Menu */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
            
            <div className={`
                md:hidden fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-serif font-bold gradient-text">Menu</h2>
                    <button onClick={() => setMobileMenuOpen(false)}>
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="p-6 space-y-6">
                    {/* User Info */}
                    {isAuthenticated && (
                        <div className="pb-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-gold-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Actions */}
                    {isAuthenticated ? (
                        <div className="space-y-2 pt-4 border-t border-gray-200">
                            <Link
                                href="/wishlist"
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Heart className="w-5 h-5" />
                                <span className="font-medium">Wishlist</span>
                            </Link>
                            <Link
                                href="/profile"
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                <span className="font-medium">My Profile</span>
                            </Link>
                            <Link
                                href="/orders"
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="font-medium">My Orders</span>
                            </Link>
                            {(isAdmin || isSuperAdmin) && (
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center space-x-3 px-4 py-3 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Admin Panel</span>
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-gray-200">
                            <Link
                                href="/login"
                                className="block w-full text-center px-4 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login / Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
