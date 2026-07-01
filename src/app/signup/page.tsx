'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Eye, EyeOff, Loader2, Lock, Mail, User, ArrowLeft, Building2, BadgeCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type RegistrationType = 'individual' | 'company';

export default function SignupPage() {
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedEmail = registrationType === 'company' ? officialEmail : email;
    const displayName = registrationType === 'company' ? businessName : fullName;

    if (!registrationType) {
      setError('Please choose an account type to continue.');
      setLoading(false);
      return;
    }

    if (!displayName || !selectedEmail || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (registrationType === 'company' && (!businessName || !registrationNumber)) {
      setError('Please provide your registered business name and CAC registration number.');
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
      const { error: signupError } = await supabase.auth.signUp({
        email: selectedEmail,
        password,
        options: {
          data: {
            full_name: displayName,
            registration_type: registrationType,
            company_name: registrationType === 'company' ? businessName : null,
            company_registration_number: registrationType === 'company' ? registrationNumber : null,
            company_email: registrationType === 'company' ? officialEmail : null,
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: selectedEmail,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          router.push('/welcome');
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4 relative overflow-hidden">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-mono text-[#7F7F7F] hover:text-[#00A651] transition-colors group z-20"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to Home
      </Link>

      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#00A651]/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#FFD700]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-[#7F7F7F]/20 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-16 w-auto object-contain mb-4 cursor-pointer" />
          </Link>
          <h2 className="font-display text-2xl text-[#1A1A1A] font-semibold tracking-tight">Create your account</h2>
          <p className="font-sans text-xs text-[#7F7F7F] mt-1 text-center">
            Join MANUFA Family Investment Ltd to start building your future.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-sans font-medium"
            >
              {error}
            </motion.div>
          )}

          {!registrationType ? (
            <div className="space-y-3">
              <div className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                Choose account type
              </div>
              <button
                type="button"
                onClick={() => setRegistrationType('individual')}
                className="w-full border border-[#7F7F7F]/20 rounded-xl p-4 text-left hover:border-[#00A651] hover:bg-[#00A651]/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#00A651]/10 p-2 text-[#00A651]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Individual Registration</div>
                    <div className="text-xs text-[#7F7F7F]">Create an account as an individual member.</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRegistrationType('company')}
                className="w-full border border-[#7F7F7F]/20 rounded-xl p-4 text-left hover:border-[#00A651] hover:bg-[#00A651]/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#00A651]/10 p-2 text-[#00A651]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Company Registration</div>
                    <div className="text-xs text-[#7F7F7F]">Register your business with CAC details.</div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                    {registrationType === 'company' ? 'Company details' : 'Personal details'}
                  </div>
                  <div className="text-sm font-semibold text-[#1A1A1A]">
                    {registrationType === 'company' ? 'Register your business' : 'Create your personal account'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRegistrationType(null)}
                  className="text-xs font-medium text-[#00A651] hover:text-[#008741]"
                >
                  Change type
                </button>
              </div>

              {registrationType === 'individual' ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                        required
                      />
                    </div>
                  </div>

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
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                      Registered Business Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Exact name on registration certificate"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                      RC Number or BN Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                        <BadgeCheck className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. RC1234567"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7F7F]">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                        placeholder="official@company.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                  Password
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
                <p className="font-sans text-[10px] text-[#7F7F7F]/70">Must be at least 6 characters.</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                  Confirm Password
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
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#7F7F7F]/20 rounded-lg font-sans text-sm text-[#1A1A1A] placeholder-[#7F7F7F]/50 focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] transition-all"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#00A651] text-white rounded-lg font-mono text-[11px] uppercase tracking-widest font-semibold hover:bg-[#008741] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              registrationType ? 'Sign Up' : 'Continue'
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#7F7F7F]/10 text-center">
          <p className="font-sans text-xs text-[#7F7F7F]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#00A651] hover:text-[#008741] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
