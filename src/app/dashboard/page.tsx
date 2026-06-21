'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, AlertOctagon, Lock, 
  Wallet, TrendingUp, Calendar, PlusCircle, ArrowRightLeft, Settings, LogOut, ShieldCheck as AdminIcon
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const status = profile.status;
  const isApproved = status === 'approved';
  const isSuspended = status === 'suspended';
  const isPending = status === 'pending_approval';
  const isNewUser = status === 'pending_registration';        // never submitted yet
  const isChangesRequested = status === 'profile_incomplete'; // admin sent back for changes

  // Suspended Account Lockout View
  if (isSuspended) {
    return (
      <div className="min-h-screen bg-red-50/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center shadow-xl space-y-6">
          <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Account Suspended</h2>
          <p className="font-sans text-sm text-[#7F7F7F]">
            Your MANUFA Family Investment Ltd profile has been suspended or rejected by our compliance team. If you believe this is a mistake, please reach out to our admin team.
          </p>
          <button
            onClick={signOut}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Define status badge configuration
  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
            <ShieldCheck className="h-3.5 w-3.5" /> Approved / Active
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
            <ShieldAlert className="h-3.5 w-3.5 animate-pulse" /> Pending Approval
          </span>
        );
      case 'profile_incomplete':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
            <ShieldAlert className="h-3.5 w-3.5" /> Re-submission Needed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
            <ShieldAlert className="h-3.5 w-3.5" /> Registration Incomplete
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-10 w-auto object-contain" />
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="font-display font-semibold text-base text-[#1A1A1A] hidden sm:block">Client Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {profile.role === 'admin' && (
            <Link
              href="/admin"
              className="px-3.5 py-1.5 bg-gray-950 text-white hover:bg-gray-800 transition-colors rounded-lg font-mono text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5"
            >
              <AdminIcon className="h-3.5 w-3.5 text-[#00A651]" /> Admin Portal
            </Link>
          )}

          <button
            onClick={signOut}
            className="p-1.5 rounded-lg border border-gray-200 text-[#7F7F7F] hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-1.5 font-mono text-[9px] uppercase tracking-widest font-semibold"
          >
            <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Hello, {profile.full_name}</h2>
              {getStatusBadge()}
            </div>
            <p className="font-sans text-xs text-[#7F7F7F] mt-1">
              Member ID: <span className="font-mono text-gray-900 font-semibold">{profile.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>

          {!isApproved && (
            <Link
              href="/profile-completion"
              className="px-5 py-2.5 bg-[#00A651] hover:bg-[#008741] text-white rounded-lg font-mono text-[10px] uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              Edit Profile details
            </Link>
          )}
        </div>

        {/* Access Restriction Alerts — one per status */}

        {/* 1. New user — never submitted profile yet */}
        {isNewUser && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex items-start gap-4 text-yellow-800">
            <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans text-sm font-bold">Action Required: Complete Your Profile</h4>
              <p className="font-sans text-xs text-yellow-700 mt-1">
                Your profile is {profile.profile_completion_percent}% complete. Please fill in your details and submit them for admin review to unlock your investment portfolio access.
              </p>
              <Link href="/profile-completion" className="inline-block mt-3 text-xs font-semibold text-yellow-800 underline hover:text-yellow-900 transition-colors">
                Go to Profile Completion &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* 2. Changes requested — admin sent profile back */}
        {isChangesRequested && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-start gap-4 text-orange-800">
            <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans text-sm font-bold">Profile Returned — Changes Requested</h4>
              <p className="font-sans text-xs text-orange-700 mt-1">
                Our compliance team has reviewed your profile and requested some updates. Please revisit your profile, make the necessary corrections, and re-submit for approval.
              </p>
              <Link href="/profile-completion" className="inline-block mt-3 text-xs font-semibold text-orange-800 underline hover:text-orange-900 transition-colors">
                Update &amp; Re-submit Profile &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* 3. Submitted — awaiting admin review */}
        {isPending && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4 text-blue-800">
            <ShieldAlert className="h-5 w-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="font-sans text-sm font-bold">Profile Under Review</h4>
              <p className="font-sans text-xs text-blue-700 mt-1">
                Your profile has been successfully submitted and is currently being reviewed by our compliance team. You will be notified once your registration is approved. This typically takes 24–48 hours.
              </p>
            </div>
          </div>
        )}

        {/* 4. Approved */}
        {isApproved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4 text-green-800">
            <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-sans text-sm font-bold">Profile Verified &amp; Approved</h4>
              <p className="font-sans text-xs text-green-700 mt-1">
                Welcome to MANUFA Family Investment Ltd! Your membership profile is verified. You now have full access to savings products and strategic deals.
              </p>
            </div>
          </div>
        )}

        {/* Portfolio Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Savings Balance */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F] font-semibold">
                Cooperative Savings
              </span>
              <Wallet className="h-5 w-5 text-[#00A651]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-3xl font-bold text-[#1A1A1A]">₦0.00</h3>
              <p className="font-sans text-[10px] text-[#7F7F7F]">
                {isApproved ? 'Portfolio tracking coming soon' : 'Awaiting profile activation'}
              </p>
            </div>
            {!isApproved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center gap-1.5 text-xs text-gray-500 font-sans font-medium">
                <Lock className="h-3.5 w-3.5" /> Feature Locked
              </div>
            )}
          </div>

          {/* Card 2: Investment Portfolio */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F] font-semibold">
                Strategic Investments
              </span>
              <TrendingUp className="h-5 w-5 text-[#00A651]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-3xl font-bold text-[#1A1A1A]">₦0.00</h3>
              <p className="font-sans text-[10px] text-[#7F7F7F]">
                {isApproved ? 'Portfolio tracking coming soon' : 'Awaiting profile activation'}
              </p>
            </div>
            {!isApproved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center gap-1.5 text-xs text-gray-500 font-sans font-medium">
                <Lock className="h-3.5 w-3.5" /> Feature Locked
              </div>
            )}
          </div>

          {/* Card 3: Next Savings Event */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F] font-semibold">
                Next Savings Date
              </span>
              <Calendar className="h-5 w-5 text-[#00A651]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-2xl font-bold text-[#1A1A1A]">
                {isApproved ? 'Coming Soon' : 'N/A'}
              </h3>
              <p className="font-sans text-[10px] text-[#7F7F7F]">
                {isApproved ? 'Savings schedule not yet configured' : 'Awaiting profile activation'}
              </p>
            </div>
            {!isApproved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center gap-1.5 text-xs text-gray-500 font-sans font-medium">
                <Lock className="h-3.5 w-3.5" /> Feature Locked
              </div>
            )}
          </div>
        </div>

        {/* Action Center (Visible to Approved Users) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-[#1A1A1A] mb-4">Quick Transactions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              disabled={!isApproved}
              className="py-4 border border-gray-200 hover:border-[#00A651] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00A651]/5 rounded-xl transition-all flex flex-col items-center gap-2 group"
            >
              <PlusCircle className="h-6 w-6 text-[#00A651] group-hover:scale-105 transition-transform" />
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-gray-700">Add Savings</span>
            </button>
            <button
              disabled={!isApproved}
              className="py-4 border border-gray-200 hover:border-[#00A651] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00A651]/5 rounded-xl transition-all flex flex-col items-center gap-2 group"
            >
              <TrendingUp className="h-6 w-6 text-[#00A651] group-hover:scale-105 transition-transform" />
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-gray-700">Invest in Deal</span>
            </button>
            <button
              disabled={!isApproved}
              className="py-4 border border-gray-200 hover:border-[#00A651] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00A651]/5 rounded-xl transition-all flex flex-col items-center gap-2 group"
            >
              <ArrowRightLeft className="h-6 w-6 text-[#00A651] group-hover:scale-105 transition-transform" />
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-gray-700">Transfer</span>
            </button>
            <button
              disabled={!isApproved}
              className="py-4 border border-gray-200 hover:border-[#00A651] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00A651]/5 rounded-xl transition-all flex flex-col items-center gap-2 group"
            >
              <Settings className="h-6 w-6 text-[#00A651] group-hover:scale-105 transition-transform" />
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-gray-700">Preferences</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
