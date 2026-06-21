'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
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
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#00A651]/5 to-transparent blur-3xl -z-10" />

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
            {success ? 'Check your email' : 'Reset your password'}
          </h2>
          <p className="font-sans text-xs text-[#7F7F7F] mt-1 text-center">
            {success
              ? 'We have sent a password reset link to your email address.'
              : 'Enter your email address and we will send you a recovery link.'}
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle className="h-12 w-12 text-[#00A651] mb-2 animate-bounce" />
              <span className="font-sans text-sm font-semibold text-[#1A1A1A]">Link sent successfully</span>
              <span className="font-sans text-xs text-[#7F7F7F] text-center mt-1">
                Click the link in the email to set a new password.
              </span>
            </div>
            <Link
              href="/login"
              className="w-full py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-5">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#00A651] text-white rounded-lg font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-[#008741] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Recovery Link'
              )}
            </button>

            <Link
              href="/login"
              className="w-full py-2.5 bg-white border border-[#7F7F7F]/20 text-[#7F7F7F] rounded-lg font-mono text-[11px] uppercase tracking-widest font-semibold hover:text-[#1A1A1A] hover:border-[#7F7F7F]/40 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Log in
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
