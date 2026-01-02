'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    SlidersHorizontal,
    X,
    Heart,
    ShoppingCart,
    Star,
    GitCompare,
    Check,
    Package,
    Camera,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import ARViewer from '@/components/product/ARViewer';

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
}

export default function EnhancedShopPage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [compareList, setCompareList] = useState<string[]>([]);
    const [showAR, setShowAR] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest',
        inStock: false,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, products]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products');
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (filters.search.trim()) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    p.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter((p) => p.category === filters.category);
        }

        // Price range filter
        if (filters.minPrice) {
            filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
        }

        // Stock filter
        if (filters.inStock) {
            filtered = filtered.filter((p) => p.stock > 0);
        }

        // Sorting
        switch (filters.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.ratings.average - a.ratings.average);
                break;
            case 'popular':
                filtered.sort((a, b) => b.ratings.count - a.ratings.count);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // newest
                break;
        }

        setFilteredProducts(filtered);
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: 'all',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest',
            inStock: false,
        });
    };

    const toggleCompare = (productId: string) => {
        setCompareList((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            } else {
                if (prev.length >= 4) {
                    toast.error('You can compare up to 4 products');
                    return prev;
                }
                return [...prev, productId];
            }
        });
    };

    const handleAddToWishlist = async (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to add to wishlist');
                router.push('/login');
                return;
            }

            await axios.post(
                `/api/cart/wishlist/${productId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Added to wishlist!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    const handleQuickAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0] || '',
        });
        toast.success('Added to cart!');
    };

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'kundan-bangles', label: 'Kundan Bangles' },
        { value: 'handicrafts', label: 'Handicrafts' },
        { value: 'art-decor', label: 'Art & Décor' },
        { value: 'jewelry', label: 'Jewelry' },
    ];

    return (
        <div className="min-h-screen bg-ivory-100 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Our Collection
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our exquisite range of handcrafted bangles and jewelry
                    </p>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                                />
                            </div>

                            {/* Sort */}
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="popular">Most Popular</option>
                                <option value="name">Name: A-Z</option>
                            </select>

                            {/* Filter Toggle */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    showFilters
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                                }`}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </motion.button>
                        </div>

                        {/* Advanced Filters */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="grid md:grid-cols-4 gap-4">
                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    value={filters.category}
                                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    {categories.map((cat) => (
                                                        <option key={cat.value} value={cat.value}>
                                                            {cat.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Min Price */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Min Price
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="₹0"
                                                    value={filters.minPrice}
                                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            {/* Max Price */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Max Price
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="₹10000"
                                                    value={filters.maxPrice}
                                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            {/* In Stock */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Availability
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.inStock}
                                                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                                    />
                                                    <span className="text-gray-700">In Stock Only</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={clearFilters}
                                                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                                            >
                                                Clear All Filters
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Results Count and Compare Button */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Showing {filteredProducts.length} of {products.length} products
                    </p>
                    {compareList.length > 0 && (
                        <Link href={`/compare?products=${compareList.join(',')}`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg"
                            >
                                <GitCompare className="w-5 h-5" />
                                Compare ({compareList.length})
                            </motion.button>
                        </Link>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg h-96 animate-pulse" />
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
                        <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearFilters}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold"
                        >
                            Clear Filters
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group relative"
                                >
                                    {/* Compare Checkbox */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleCompare(product._id)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                                                compareList.includes(product._id)
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white text-gray-600'
                                            }`}
                                        >
                                            {compareList.includes(product._id) ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <GitCompare className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                    </div>

                                    {/* Wishlist & AR Buttons */}
                                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                                        {/* AR Try-On Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedProduct(product);
                                                setShowAR(true);
                                            }}
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gold-50 transition-colors"
                                            title="Try in AR"
                                        >
                                            <Camera className="w-5 h-5 text-gold-600" />
                                        </motion.button>

                                        {/* Wishlist Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => handleAddToWishlist(product._id, e)}
                                            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:text-red-700"
                                        >
                                            <Heart className="w-5 h-5" />
                                        </motion.button>
                                    </div>

                                    <Link href={`/product/${product._id}`}>
                                        {/* Product Image */}
                                        <div className="relative h-64 bg-gradient-to-br from-ivory-100 to-gold-100 overflow-hidden">
                                            {product.images && product.images[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-24 h-24 text-purple-300" />
                                                </div>
                                            )}
                                            {product.stock === 0 && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>

                                            {/* Rating */}
                                            {product.ratings.average > 0 && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < Math.round(product.ratings.average)
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        ({product.ratings.count})
                                                    </span>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-2xl font-bold bg-gradient-to-r from-gold-600 to-maroon-600 bg-clip-text text-transparent">
                                                    ₹{product.price.toLocaleString()}
                                                </p>
                                                {product.stock > 0 && product.stock <= 5 && (
                                                    <span className="text-xs text-orange-600 font-medium">
                                                        Only {product.stock} left
                                                    </span>
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={(e) => handleQuickAddToCart(product, e)}
                                                disabled={product.stock === 0}
                                                className="w-full bg-gradient-to-r from-gold-500 to-maroon-500 hover:from-gold-600 hover:to-maroon-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                            </motion.button>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* AR Viewer Modal */}
            {showAR && selectedProduct && (
                <ARViewer
                    productName={selectedProduct.name}
                    onClose={() => {
                        setShowAR(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
}
