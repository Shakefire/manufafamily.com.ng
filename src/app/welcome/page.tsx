 'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // Redirect users who have already submitted their profile
  useEffect(() => {
    if (user && profile && profile.status !== 'pending_registration') {
      router.push('/dashboard');
    }
  }, [user, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return null; // AuthContext handles redirect
  }

  const completionPercent = profile?.profile_completion_percent ?? 0;
  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? 'Valued Investor';
  const isCompanyAccount = profile?.registration_type === 'company' || user?.user_metadata?.registration_type === 'company';
  const onboardingHint = isCompanyAccount
    ? 'To complete onboarding, please provide your company information and payout bank details.'
    : 'To make investments and save, please fill out your profile details (Personal Info, Address, Next of Kin, and Bank Details).';

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#00A651]/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      
      {/* Empty header for spacing */}
      <header className="px-6 py-6 flex items-center justify-between border-b border-gray-100 bg-white">
        <Link href="/">
          <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-10 w-auto object-contain" />
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F] bg-gray-50 px-2.5 py-1 rounded">
          Onboarding
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex p-3 bg-[#00A651]/10 text-[#00A651] rounded-full"
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>

          <div className="space-y-3">
            <motion.h1
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl text-[#1A1A1A] font-semibold tracking-tight leading-[1.2]"
            >
              Welcome to MANUFA, <br />
              <span className="text-[#00A651]">{displayName}</span>
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans text-sm text-[#7F7F7F] max-w-md mx-auto"
            >
              We're excited to have you join our cooperative savings and investment family. Let's get your account verified and approved.
            </motion.p>
          </div>

          {/* Progress Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border border-[#7F7F7F]/20 rounded-2xl p-6 text-left shadow-[0_4px_20px_rgb(0,0,0,0.02)]"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                Profile Completion Progress
              </span>
              <span className="font-mono text-xs font-bold text-[#00A651] bg-[#00A651]/10 px-2 py-0.5 rounded-full">
                {completionPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-[#00A651] h-full rounded-full"
              />
            </div>

            {/* Description / Instructions */}
            {completionPercent === 100 ? (
              <div className="flex gap-3 items-start bg-green-50/50 border border-green-100 rounded-xl p-4">
                <CheckCircle2 className="h-5 w-5 text-[#00A651] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs font-semibold text-[#1A1A1A]">Profile Complete!</h4>
                  <p className="font-sans text-[11px] text-[#7F7F7F] mt-0.5">
                    Your profile is completely filled and is pending admin approval. You can view progress on your dashboard.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 items-start bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-xl p-4">
                <ShieldAlert className="h-5 w-5 text-[#008741] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans text-xs font-semibold text-[#1A1A1A]">Onboarding Required</h4>
                  <p className="font-sans text-[11px] text-[#7F7F7F] mt-0.5">
                    {onboardingHint}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            {completionPercent < 100 ? (
              <>
                <Link
                  href="/profile-completion"
                  className="w-full sm:w-auto px-8 py-3 bg-[#00A651] text-white rounded-full font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-[#008741] transition-all flex items-center justify-center gap-2 group shadow-sm"
                >
                  Complete Profile
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3 bg-white border border-[#7F7F7F]/20 text-[#7F7F7F] hover:text-[#1A1A1A] hover:border-[#7F7F7F]/40 rounded-full font-mono text-[11px] uppercase tracking-widest font-semibold transition-all text-center"
                >
                  Skip for Now
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3 bg-[#00A651] text-white rounded-full font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-[#008741] transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-gray-100 text-center">
        <p className="font-sans text-[10px] text-[#7F7F7F]">
          © {new Date().getFullYear()} MANUFA Family Investment Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
