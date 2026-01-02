'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
        router.push('/');
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Account created successfully!');
          await login(formData.email, formData.password);
          router.push('/');
        } else {
          toast.error(data.message || 'Registration failed');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Cartoon Character with Eyes Following Cursor
  const CartoonCharacter = ({ 
    position, 
    color, 
    name 
  }: { 
    position: React.CSSProperties; 
    color: string;
    name: string;
  }) => {
    const charRef = useRef<HTMLDivElement>(null);
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      if (charRef.current) {
        const rect = charRef.current.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(mousePos.y - charCenterY, mousePos.x - charCenterX);
        const distance = Math.min(8, Math.hypot(mousePos.x - charCenterX, mousePos.y - charCenterY) / 50);

        setEyePosition({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }
    }, [mousePos]);

    return (
      <div
        ref={charRef}
        className="absolute transition-all duration-300 ease-out"
        style={position}
      >
        {/* Character Body */}
        <div className="relative">
          {/* Head */}
          <div className={`w-32 h-32 rounded-full ${color} shadow-2xl relative overflow-hidden animate-bounce-slow`}>
            {/* Face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes Container */}
              <div className="flex gap-4 mb-2">
                {/* Left Eye */}
                <div className="w-8 h-10 bg-white rounded-full relative shadow-inner">
                  <div
                    className="absolute w-4 h-4 bg-black rounded-full top-1/2 left-1/2 transition-all duration-200"
                    style={{
                      transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))`,
                    }}
                  >
                    {/* Pupil shine */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>

                {/* Right Eye */}
                <div className="w-8 h-10 bg-white rounded-full relative shadow-inner">
                  <div
                    className="absolute w-4 h-4 bg-black rounded-full top-1/2 left-1/2 transition-all duration-200"
                    style={{
                      transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))`,
                    }}
                  >
                    {/* Pupil shine */}
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Smile */}
              <div className="w-12 h-6 border-b-4 border-gray-700 rounded-b-full mt-1" />
            </div>

            {/* Blush */}
            <div className="absolute left-2 top-16 w-6 h-4 bg-pink-300 rounded-full opacity-60" />
            <div className="absolute right-2 top-16 w-6 h-4 bg-pink-300 rounded-full opacity-60" />
          </div>

          {/* Name Tag */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border-2 border-gray-200">
            <p className="text-xs font-bold text-gray-700">{name}</p>
          </div>

          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-full ${color} opacity-30 blur-2xl animate-pulse`} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Cartoon Characters */}
      <CartoonCharacter
        position={{ left: '10%', top: '20%' }}
        color="bg-gradient-to-br from-amber-400 to-orange-500"
        name="Goldie"
      />
      <CartoonCharacter
        position={{ right: '10%', top: '25%' }}
        color="bg-gradient-to-br from-purple-400 to-pink-500"
        name="Sparkle"
      />

      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card with glassmorphism */}
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:scale-[1.02]">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <div className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
                  MegaArtsStore
                </div>
              </Link>
              <h1 className="text-3xl font-serif font-bold text-gray-800 mt-4 mb-2">
                {isLogin ? 'Welcome Back!' : 'Join Us'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Our friends are watching you! 👀' : 'Create your luxury account'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white/70"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white/70"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white/70"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white/70 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : (
                  isLogin ? 'Login' : 'Create Account'
                )}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>

            {/* Admin Login Link */}
            <div className="mt-4 text-center">
              <Link
                href="/admin/login"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
              >
                <span>Admin Login</span>
                <span>→</span>
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
              <p className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Demo User Credentials:
              </p>
              <p className="text-xs text-blue-700">📧 Email: user@megaartsstore.com</p>
              <p className="text-xs text-blue-700">🔑 Password: User@123</p>
            </div>
          </div>

          {/* Floating Text */}
          <p className="text-center mt-6 text-sm text-gray-600 animate-pulse">
            👀 Move your mouse and watch our friends follow you!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
