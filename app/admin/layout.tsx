'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Palette, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isSuperAdmin, logout, user, loading } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (loading) return;
    
    if (pathname === '/admin/login') return;
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (!isAdmin && !isSuperAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, isSuperAdmin, router, pathname, loading]);

  // Early return for login page AFTER all hooks
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (!isAdmin && !isSuperAdmin)) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
    { name: 'Products', href: '/admin/products', icon: Package, roles: ['admin', 'superadmin'] },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, roles: ['admin', 'superadmin'] },
    { name: 'Customization', href: '/admin/customization', icon: Palette, roles: ['superadmin'] },
    { name: 'Users', href: '/admin/users', icon: Users, roles: ['superadmin'] },
    { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['superadmin'] },
  ];

  const filteredNav = navigation.filter(item => 
    item.roles.includes(user?.role || 'admin')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile - Only visible when menu is open */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always visible on desktop (lg and up), slides in on mobile */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-40
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-serif font-bold text-gold-400">MegaArtsStore</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-6 py-3 
                  transition-colors duration-200
                  ${isActive 
                    ? 'bg-gray-800 border-l-4 border-gold-400 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 ml-12 lg:ml-0">
                <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
                <span className={`
                  px-3 py-1 text-xs font-semibold rounded-full uppercase
                  ${user?.role === 'superadmin' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-blue-100 text-blue-800'
                  }
                `}>
                  {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <Link 
                href="/" 
                className="text-sm text-gold-600 hover:text-gold-700 transition-colors font-medium"
              >
                View Website →
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
