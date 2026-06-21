'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#00A651]/5 to-transparent blur-3xl -z-10" />

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
          <h2 className="font-display text-2xl text-[#1A1A1A] font-semibold tracking-tight">
            {success ? 'Password Updated!' : 'Set new password'}
          </h2>
          <p className="font-sans text-xs text-[#7F7F7F] mt-1 text-center">
            {success
              ? 'Your password has been successfully reset. Redirecting you to login...'
              : 'Choose a strong, secure password for your MANUFA account.'}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="h-12 w-12 text-[#00A651] mb-2 animate-bounce" />
            <span className="font-sans text-sm font-semibold text-[#1A1A1A]">Updated successfully</span>
            <span className="font-sans text-xs text-[#7F7F7F] text-center mt-1">
              You will be redirected to the login page shortly.
            </span>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-sans font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                New Password
              </label>
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                  required
                />
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
                  Updating Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
