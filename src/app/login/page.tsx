'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Fetch profile to determine redirect destination
        const { data: profileData } = await supabase
          .from('profiles')
          .select('status, profile_completion_percent')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          if (profileData.status === 'pending_registration') {
            router.push('/welcome');
          } else {
            router.push('/dashboard');
          }
        } else {
          // Fallback if profile doesn't exist yet
          router.push('/welcome');
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-mono text-[#7F7F7F] hover:text-[#00A651] transition-colors group z-20"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to Home
      </Link>

      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#00A651]/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#FFD700]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-[#7F7F7F]/20 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-16 w-auto object-contain mb-4 cursor-pointer" />
          </Link>
          <h2 className="font-display text-2xl text-[#1A1A1A] font-semibold tracking-tight">Welcome back</h2>
          <p className="font-sans text-xs text-[#7F7F7F] mt-1 text-center">
            Sign in to access your investment profile and savings portfolio.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-sans font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="font-sans text-xs text-[#00A651] hover:text-[#008741] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7F7F7F] hover:text-[#1A1A1A] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#00A651] text-white rounded-lg font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-[#008741] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 pt-5 border-t border-[#7F7F7F]/10 text-center">
          <p className="font-sans text-xs text-[#7F7F7F]">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-[#00A651] hover:text-[#008741] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
