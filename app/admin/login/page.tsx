'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
          setLoginSuccess(true);
          setUserData(data.user);
        } else {
          setError('Access denied. Admin privileges required.');
          localStorage.clear();
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error: any) {
      setError('Connection error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    // Force full page reload to ensure AuthContext picks up the token
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">MegaArtsStore Admin Panel</p>
        </div>

        {loginSuccess ? (
          // Success Screen
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Successful!</h2>
              <p className="text-gray-600">Welcome back, {userData?.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                Role: <span className="font-semibold text-amber-600">
                  {userData?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                </span>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                ✓ Authentication verified
              </p>
              <p className="text-sm text-green-700 mt-1">
                ✓ Access granted to admin panel
              </p>
            </div>

            <button
              onClick={goToDashboard}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-6 rounded-md hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              🚀 Go to Dashboard
            </button>

            <p className="text-xs text-gray-500">
              Click the button above to access your admin dashboard
            </p>
          </div>
        ) : (
          // Login Form
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="admin@megaartsstore.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Logging in...' : 'Login to Admin Panel'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to User Login
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>🔒 Secure Admin Access</strong>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Admin accounts must be created using the secure CLI tool. Contact your system administrator for access.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
