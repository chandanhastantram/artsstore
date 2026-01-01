'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { BangleViewer3D } from '@/components/3d/BangleViewer3D';
import { CustomizationPanel } from '@/components/customization/CustomizationPanel';
import { ARTryOn } from '@/components/ar/ARTryOn';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart, Camera, Star, Package, Shield, Truck } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showAR, setShowAR] = useState(false);
    const [customization, setCustomization] = useState({
        threadColor: '#D4AF37',
        threadType: 'classic',
        kundanType: 'classic',
        kundanShape: 'round',
        kundanColor: '#50C878',
    });

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${params.id}`);
            setProduct(response.data.product);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images[0]?.url || '',
            customization,
        });

        toast.success('Added to cart!');
    };

    const handleAddToWishlist = async () => {
        try {
            await api.post(`/cart/wishlist/${product._id}`);
            toast.success('Added to wishlist!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    if (loading) {
        return (
            <div className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="shimmer h-96 rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="shimmer h-12 rounded"></div>
                            <div className="shimmer h-24 rounded"></div>
                            <div className="shimmer h-64 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="section-padding">
                <div className="container-custom text-center">
                    <h1 className="text-3xl font-serif font-bold mb-4">Product Not Found</h1>
                    <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="section-padding">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Left: 3D Viewer & Images */}
                    <div>
                        {product.isCustomizable ? (
                            <BangleViewer3D
                                threadColor={customization.threadColor}
                                kundanColor={customization.kundanColor}
                                kundanShape={customization.kundanShape as any}
                                kundanType={customization.kundanType as any}
                            />
                        ) : (
                            <div className="bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={product.images[selectedImage]?.url || ''}
                                    alt={product.name}
                                    className="w-full h-[500px] object-cover"
                                />
                            </div>
                        )}

                        {/* Image Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {product.images.map((image: any, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden transition-all ${selectedImage === index ? 'border-gold-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-20 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* AR Try-On Button */}
                        <Button
                            onClick={() => setShowAR(true)}
                            variant="outline"
                            className="w-full mt-4 flex items-center justify-center space-x-2"
                        >
                            <Camera className="w-5 h-5" />
                            <span>Try with AR</span>
                        </Button>
                    </div>

                    {/* Right: Product Info or Customization */}
                    <div>
                        {product.isCustomizable ? (
                            <CustomizationPanel
                                onCustomizationChange={setCustomization}
                                basePrice={product.price}
                            />
                        ) : (
                            <Card>
                                <CardBody>
                                    <h1 className="text-4xl font-serif font-bold mb-4">{product.name}</h1>

                                    {/* Rating */}
                                    {product.ratings.average > 0 && (
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(product.ratings.average)
                                                                ? 'fill-gold-500 text-gold-500'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-600">
                                                ({product.ratings.count} reviews)
                                            </span>
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-gold-600">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        {product.discountPrice && (
                                            <span className="text-xl text-gray-400 line-through ml-3">
                                                ₹{product.discountPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                                        <p className="text-gray-600">{product.description}</p>
                                    </div>

                                    {/* Material & Care */}
                                    {product.material && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Material</h3>
                                            <p className="text-gray-600">{product.material}</p>
                                        </div>
                                    )}

                                    {product.careInstructions && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
                                            <p className="text-gray-600">{product.careInstructions}</p>
                                        </div>
                                    )}

                                    {/* Stock Status */}
                                    <div className="mb-6">
                                        {product.stock > 0 ? (
                                            <span className="text-emerald-600 font-medium">
                                                ✓ In Stock ({product.stock} available)
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-medium">✗ Out of Stock</span>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    {product.stock > 0 && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity
                                            </label>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 border-2 border-gray-300 rounded-md hover:border-gold-500 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xl font-medium">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                    className="w-10 h-10 border-2 border-gray-300 rounded-md hover:border-gold-500 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex space-x-4 mb-6">
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={product.stock === 0}
                                            className="flex-1 flex items-center justify-center space-x-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>Add to Cart</span>
                                        </Button>
                                        <Button
                                            onClick={handleAddToWishlist}
                                            variant="outline"
                                            className="flex items-center justify-center"
                                        >
                                            <Heart className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    {/* Features */}
                                    <div className="border-t border-gray-200 pt-6 space-y-3">
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Package className="w-5 h-5 text-gold-500" />
                                            <span>Handcrafted with care</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Shield className="w-5 h-5 text-gold-500" />
                                            <span>Authentic quality guaranteed</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <Truck className="w-5 h-5 text-gold-500" />
                                            <span>Free shipping on orders above ₹2000</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-serif font-bold mb-6">Customer Reviews</h2>
                        <div className="space-y-4">
                            {product.reviews.map((review: any, index: number) => (
                                <Card key={index}>
                                    <CardBody>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                                                    ))}
                                                </div>
                                                <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AR Try-On Modal */}
            {showAR && (
                <ARTryOn
                    productImage={product.images[0]?.url || ''}
                    onClose={() => setShowAR(false)}
                />
            )}
        </div>
    );
}
