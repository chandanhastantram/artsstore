'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/settings');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  // Default values if settings not loaded
  const storeName = settings?.storeName || 'MegaArtsStore';
  const storeEmail = settings?.storeEmail || 'info@megaartsstore.com';
  const storePhone = settings?.storePhone || '+91 98765 43210';
  const address = settings?.storeAddress 
    ? `${settings.storeAddress.street}, ${settings.storeAddress.city}, ${settings.storeAddress.state}, ${settings.storeAddress.country}`
    : '123 Heritage Lane, Jaipur, Rajasthan, India';

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold text-gold-400 mb-4">
              {storeName}
            </h3>
            <p className="text-gray-400 mb-6">
              Discover the finest collection of handcrafted Kundan bangles and traditional Indian handicrafts.
            </p>
            <div className="flex space-x-4">
              {settings?.socialMedia?.facebook && (
                <a 
                  href={settings.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.socialMedia?.instagram && (
                <a 
                  href={settings.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.socialMedia?.twitter && (
                <a 
                  href={settings.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings?.socialMedia?.youtube && (
                <a 
                  href={settings.socialMedia.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold-400 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="hover:text-gold-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold-400 mt-1" />
                <a href={`mailto:${storeEmail}`} className="hover:text-gold-400 transition-colors">
                  {storeEmail}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gold-400 mt-1" />
                <a href={`tel:${storePhone}`} className="hover:text-gold-400 transition-colors">
                  {storePhone}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-1" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 {storeName}. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gold-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
