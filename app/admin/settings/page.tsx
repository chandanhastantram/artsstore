'use client';

import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India'
    },
    branding: {
      logo: '',
      logoPublicId: '',
      favicon: '',
      faviconPublicId: ''
    },
    theme: {
      primaryColor: '#D4AF37',
      secondaryColor: '#8B0000',
      accentColor: '#FFF8DC',
      fontFamily: 'Inter, sans-serif'
    },
    banner: {
      enabled: true,
      title: '',
      subtitle: '',
      image: '',
      imagePublicId: '',
      buttonText: '',
      buttonLink: ''
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      whatsapp: '',
      youtube: ''
    },
    shipping: {
      freeShippingThreshold: 0,
      flatRate: 0
    },
    tax: {
      enabled: false,
      rate: 0,
      gstNumber: ''
    },
    currency: {
      code: 'INR',
      symbol: '₹'
    },
    contactPage: {
      heading: '',
      subheading: '',
      email: '',
      phone: '',
      address: '',
      mapEmbedUrl: '',
      workingHours: ''
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    },
    businessHours: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '10:00 AM - 7:00 PM',
      sunday: 'Closed'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'favicon' | 'banner') => {
    const setUploading = type === 'logo' ? setUploadingLogo : type === 'favicon' ? setUploadingFavicon : setUploadingBanner;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (type === 'logo') {
          setSettings(prev => ({
            ...prev,
            branding: {
              ...prev.branding,
              logo: data.data.url,
              logoPublicId: data.data.publicId
            }
          }));
        } else if (type === 'favicon') {
          setSettings(prev => ({
            ...prev,
            branding: {
              ...prev.branding,
              favicon: data.data.url,
              faviconPublicId: data.data.publicId
            }
          }));
        } else {
          setSettings(prev => ({
            ...prev,
            banner: {
              ...prev.banner,
              image: data.data.url,
              imagePublicId: data.data.publicId
            }
          }));
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Settings saved successfully!');
        setSettings(data.data);
      } else {
        toast.error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section as keyof typeof prev];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Branding */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Logo & Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              {settings.branding?.logo ? (
                <div className="relative">
                  <img 
                    src={settings.branding.logo} 
                    alt="Store Logo" 
                    className="w-full h-32 object-contain border rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('branding', 'logo', '')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  {uploadingLogo ? (
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Logo</span>
                    </>
                  )}
                </label>
              )}
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              {settings.branding?.favicon ? (
                <div className="relative">
                  <img 
                    src={settings.branding.favicon} 
                    alt="Favicon" 
                    className="w-full h-32 object-contain border rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange('branding', 'favicon', '')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'favicon')}
                    className="hidden"
                    disabled={uploadingFavicon}
                  />
                  {uploadingFavicon ? (
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Favicon</span>
                    </>
                  )}
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.theme?.primaryColor || '#D4AF37'}
                  onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.theme?.primaryColor || '#D4AF37'}
                  onChange={(e) => handleChange('theme', 'primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.theme?.secondaryColor || '#8B0000'}
                  onChange={(e) => handleChange('theme', 'secondaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.theme?.secondaryColor || '#8B0000'}
                  onChange={(e) => handleChange('theme', 'secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.theme?.accentColor || '#FFF8DC'}
                  onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.theme?.accentColor || '#FFF8DC'}
                  onChange={(e) => handleChange('theme', 'accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Homepage Banner */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Homepage Banner</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.banner?.enabled}
                  onChange={(e) => handleChange('banner', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Enable Banner</span>
              </label>
            </div>

            {settings.banner?.enabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Title
                    </label>
                    <input
                      type="text"
                      value={settings.banner?.title || ''}
                      onChange={(e) => handleChange('banner', 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Subtitle
                    </label>
                    <input
                      type="text"
                      value={settings.banner?.subtitle || ''}
                      onChange={(e) => handleChange('banner', 'subtitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.banner?.buttonText || ''}
                      onChange={(e) => handleChange('banner', 'buttonText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={settings.banner?.buttonLink || ''}
                      onChange={(e) => handleChange('banner', 'buttonLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image
                  </label>
                  {settings.banner?.image ? (
                    <div className="relative">
                      <img 
                        src={settings.banner.image} 
                        alt="Banner" 
                        className="w-full h-48 object-cover border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('banner', 'image', '')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
                        className="hidden"
                        disabled={uploadingBanner}
                      />
                      {uploadingBanner ? (
                        <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Upload Banner Image</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={settings.seo?.metaTitle || ''}
                onChange={(e) => handleChange('seo', 'metaTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="MegaArtsStore - Handcrafted Kundan Bangles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.seo?.metaDescription || ''}
                onChange={(e) => handleChange('seo', 'metaDescription', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Discover exquisite handcrafted Kundan bangles..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={settings.seo?.metaKeywords || ''}
                onChange={(e) => handleChange('seo', 'metaKeywords', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="kundan bangles, handcrafted jewelry, indian jewelry"
              />
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Email
              </label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Phone
              </label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Store Address */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Store Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={settings.storeAddress.street}
                onChange={(e) => handleChange('storeAddress', 'street', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={settings.storeAddress.city}
                onChange={(e) => handleChange('storeAddress', 'city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={settings.storeAddress.state}
                onChange={(e) => handleChange('storeAddress', 'state', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={settings.storeAddress.zip}
                onChange={(e) => handleChange('storeAddress', 'zip', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={settings.storeAddress.country}
                onChange={(e) => handleChange('storeAddress', 'country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.facebook}
                onChange={(e) => handleChange('socialMedia', 'facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.instagram}
                onChange={(e) => handleChange('socialMedia', 'instagram', e.target.value)}
                placeholder="https://instagram.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={settings.socialMedia.whatsapp}
                onChange={(e) => handleChange('socialMedia', 'whatsapp', e.target.value)}
                placeholder="+91 1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.youtube}
                onChange={(e) => handleChange('socialMedia', 'youtube', e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.shipping.freeShippingThreshold}
                onChange={(e) => handleChange('shipping', 'freeShippingThreshold', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Shipping Rate (₹)
              </label>
              <input
                type="number"
                value={settings.shipping.flatRate}
                onChange={(e) => handleChange('shipping', 'flatRate', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tax Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.tax.enabled}
                  onChange={(e) => handleChange('tax', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Tax</span>
              </label>
            </div>

            {settings.tax.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.tax.rate}
                    onChange={(e) => handleChange('tax', 'rate', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={settings.tax.gstNumber}
                    onChange={(e) => handleChange('tax', 'gstNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Page Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Page Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Heading
              </label>
              <input
                type="text"
                value={settings.contactPage?.heading || ''}
                onChange={(e) => handleChange('contactPage', 'heading', e.target.value)}
                placeholder="Get in Touch"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Subheading
              </label>
              <textarea
                rows={2}
                value={settings.contactPage?.subheading || ''}
                onChange={(e) => handleChange('contactPage', 'subheading', e.target.value)}
                placeholder="We'd love to hear from you..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactPage?.email || ''}
                  onChange={(e) => handleChange('contactPage', 'email', e.target.value)}
                  placeholder="contact@megaartsstore.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={settings.contactPage?.phone || ''}
                  onChange={(e) => handleChange('contactPage', 'phone', e.target.value)}
                  placeholder="+91 1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Address
              </label>
              <textarea
                rows={2}
                value={settings.contactPage?.address || ''}
                onChange={(e) => handleChange('contactPage', 'address', e.target.value)}
                placeholder="Full address to display on contact page"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <input
                type="text"
                value={settings.contactPage?.workingHours || ''}
                onChange={(e) => handleChange('contactPage', 'workingHours', e.target.value)}
                placeholder="Monday - Saturday: 10:00 AM - 7:00 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Embed URL
              </label>
              <input
                type="url"
                value={settings.contactPage?.mapEmbedUrl || ''}
                onChange={(e) => handleChange('contactPage', 'mapEmbedUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get embed URL from Google Maps → Share → Embed a map
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
