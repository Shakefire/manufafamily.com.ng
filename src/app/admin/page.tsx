'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Check, X, ShieldAlert, FileText, ArrowLeft, RefreshCw, 
  MapPin, Phone, Calendar, UserCheck, Loader2,
  Search, Eye, Trash2, AlertTriangle, ShieldOff, Clock, UserX, UserMinus, ChevronRight, ToggleRight, Wallet
} from 'lucide-react';

// Types representing a member profile
interface MemberProfile {
  id: string;
  full_name: string;
  registration_type: 'individual' | 'company';
  company_name: string | null;
  company_registration_number: string | null;
  company_email: string | null;
  company_type: string | null;
  registered_office_address: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  state: string | null;
  city: string | null;
  address: string | null;
  next_of_kin_name: string | null;
  next_of_kin_phone: string | null;
  next_of_kin_relationship: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  beneficiary_name: string | null;
  beneficiary_phone: string | null;
  beneficiary_relationship: string | null;
  profile_completion_percent: number;
  status: 'pending_registration' | 'active_basic' | 'profile_incomplete' | 'pending_approval' | 'approved' | 'suspended';
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface SavingsPlan {
  id: string;
  admin_id: string;
  name: string;
  contribution_amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  cashout_amount: number;
  start_date: string;
  end_date: string | null;
  description: string | null;
  account_name: string | null;
  account_bank: string | null;
  account_number: string | null;
  recipients_mode: 'all' | 'selected' | 'individual';
  recipient_ids: string[] | null;
  recipient_id: string | null;
  auto_reminder: boolean;
  status: 'active' | 'paused' | 'closed';
  created_at: string;
  updated_at: string;
}

export default function AdminDashboardPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // State Management
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [adminLoading, setAdminLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [togglingRole, setTogglingRole] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch all members
  const fetchAllMembers = async () => {
    setAdminLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', getDatabaseErrorMessage(error), error);
      } else {
        setMembers((data as MemberProfile[]) || []);
      }
    } catch (err) {
      console.error('Error in fetchAllMembers:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleMakeMeAdmin = async () => {
    if (!profile) return;
    setTogglingRole(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', profile.id);

      if (error) {
        alert('Unable to grant admin access: ' + getDatabaseErrorMessage(error));
        return;
      }

      await refreshProfile();
    } catch (err) {
      console.error('Error promoting to admin:', err);
      alert('An unexpected error occurred while promoting this account.');
    } finally {
      setTogglingRole(false);
    }
  };

  const getDatabaseErrorMessage = (error: any) => {
    if (!error) return 'Unknown database error.';
    const candidates = [
      error.message,
      error.details,
      error.hint,
      error.code,
      error.status,
      JSON.stringify(error)
    ].filter(Boolean);
    return candidates.join(' | ');
  };

  useEffect(() => {
    if (user && profile && profile.role === 'admin') {
      fetchAllMembers();
    }
  }, [user, profile]);



  // Filtered list based on Search & Status Filter
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // 1. Search Query filter (matches full name or phone)
      const matchesSearch = 
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.phone && m.phone.includes(searchQuery));
      
      // 2. Status Filter
      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'INCOMPLETE') {
          matchesStatus = m.status === 'profile_incomplete' || m.status === 'pending_registration';
        } else {
          matchesStatus = m.status === statusFilter;
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  // Handler for Updating User Status
  const handleUpdateStatus = async (targetId: string, nextStatus: MemberProfile['status']) => {
    setActionLoading(targetId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', targetId);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        // Update local React state optimistically/incrementally
        setMembers(prev => prev.map(m => m.id === targetId ? { ...m, status: nextStatus } : m));
        
        // Update currently inspected member drawer if active
        if (selectedMember && selectedMember.id === targetId) {
          setSelectedMember(prev => prev ? { ...prev, status: nextStatus } : null);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handler for Removing User Profile
  const handleRemoveMember = async (targetId: string) => {
    setActionLoading(targetId);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', targetId);

      if (error) {
        alert('Failed to delete member: ' + error.message + '\n\nNote: If this error mentions database rules, check if you have created a DELETE policy for admins on the public.profiles table.');
      } else {
        // Remove from local list
        setMembers(prev => prev.filter(m => m.id !== targetId));
        if (selectedMember?.id === targetId) {
          setSelectedMember(null);
        }
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    );
  }

  // Deny access view if not admin
  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-red-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
        
        <header className="px-6 py-6 border-b border-gray-100 bg-white">
          <Link href="/">
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-10 w-auto object-contain" />
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
            <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Access Denied</h2>
            <p className="font-sans text-sm text-[#7F7F7F] leading-relaxed">
              You must have an administrator account to view the admin portal. Currently, your account role is <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-800">{profile?.role || 'user'}</span>.
            </p>

            {/* Quick Testing Helper */}
            {profile && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="font-sans text-[11px] text-amber-600 font-semibold bg-amber-50 p-2.5 rounded border border-amber-100">
                  💡 Dev Testing Help: Click below to grant admin status to your profile.
                </p>
                <button
                  onClick={handleMakeMeAdmin}
                  disabled={togglingRole}
                  className="w-full py-2.5 bg-[#00A651] text-white hover:bg-[#008741] transition-colors rounded-lg font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {togglingRole ? <Loader2 className="h-4 w-4 animate-spin" /> : <ToggleRight className="h-4 w-4" />}
                  Make Me Admin
                </button>
              </div>
            )}

            <Link
              href="/dashboard"
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Go to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Helper function to extract initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'M';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-sm text-[#1A1A1A]">
      
      {/* 1. DARK NAVBAR */}
      <nav className="bg-[#1A1A1A] border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30 text-white">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/">
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-9 w-auto object-contain cursor-pointer invert brightness-200" />
          </Link>
          <div className="h-5 w-px bg-gray-700" />
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/admin" className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#00A651]/20 text-white transition-colors">
              <Users className="h-4 w-4 inline mr-1.5" />Members
            </Link>
            <Link href="/admin/savings" className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <Wallet className="h-4 w-4 inline mr-1.5" />Savings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAllMembers} 
            disabled={adminLoading}
            className="inline-flex items-center gap-2 rounded-full border border-[#00A651]/30 bg-[#00A651] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008741] disabled:opacity-50"
            title="Refresh Pending Requests"
          >
            <RefreshCw className={`h-4 w-4 ${adminLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Requests</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        


        {/* 3. FILTERS & SEARCH ROW */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by full name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl font-sans text-xs focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-sans focus:outline-none focus:border-[#00A651]"
            >
              <option value="ALL">All Categories</option>
              <option value="pending_approval">Pending Review</option>
              <option value="approved">Approved Members</option>
              <option value="INCOMPLETE">Incomplete / Drafts</option>
              <option value="suspended">Suspended Accounts</option>
            </select>
          </div>

        </section>

        {/* 4. REQUEST LIST */}
        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1A1A1A]">Review Queue</h2>
              <p className="text-sm text-[#7F7F7F]">Approve new members, request updates, and manage pending profiles faster.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00A651]/15 bg-[#F6FFF9] px-3 py-2 text-sm font-medium text-[#00A651]">
              <Clock className="h-4 w-4" />
              <span>{filteredMembers.length} requests</span>
            </div>
          </div>

          {adminLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#00A651]" />
              <p className="font-sans text-xs text-[#7F7F7F]">Fetching pending requests from the database...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-4">
              <div className="inline-flex p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1A1A1A]">No Pending Requests</h3>
              <p className="font-sans text-xs text-[#7F7F7F] max-w-sm mx-auto">
                No profiles match the selected status filters or search term. Try adjusting your query parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMembers.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl border p-4 transition-all ${selectedMember?.id === item.id ? 'border-[#00A651]/40 bg-[#F7FFF9] shadow-sm' : 'border-gray-200 bg-white hover:border-[#00A651]/20 hover:shadow-sm'}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedMember(item)}
                      className="flex flex-1 items-start gap-3 text-left"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#00A651]/15 bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/20 font-mono text-sm font-bold text-[#00A651]">
                        {getInitials(item.full_name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#1A1A1A]">{item.full_name}</h3>
                          <StatusBadge status={item.status} />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#7F7F7F]">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            {item.phone || 'No phone number'}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-[#7F7F7F]">
                            <span>Profile completion</span>
                            <span>{item.profile_completion_percent}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.profile_completion_percent === 100
                                  ? 'bg-[#00A651]'
                                  : item.profile_completion_percent > 40
                                    ? 'bg-amber-500'
                                    : 'bg-red-400'
                              }`}
                              style={{ width: `${item.profile_completion_percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedMember(item)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </button>

                      {item.status === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'approved')}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                          >
                            {actionLoading === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'profile_incomplete')}
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
                          >
                            <FileText className="h-4 w-4" />
                            Request changes
                          </button>
                        </>
                      )}

                      {item.status !== 'suspended' ? (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'suspended')}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                        >
                          <ShieldOff className="h-4 w-4" />
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'approved')}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4" />
                          Reinstate
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* 5. ANIMATED RIGHT-SIDE INSPECTOR DRAWER */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs z-40 cursor-pointer"
            />

            {/* Drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-white border-l border-gray-100 shadow-2xl flex flex-col"
            >
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/20 text-[#00A651] border border-[#00A651]/20 font-mono font-bold flex items-center justify-center">
                    {getInitials(selectedMember.full_name)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base leading-tight">{selectedMember.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[9px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {selectedMember.role}
                      </span>
                      <StatusBadge status={selectedMember.status} />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                
                {/* Status Warning/Alert */}
                {selectedMember.status === 'pending_approval' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
                    <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-xs">Awaiting Approval Review</h5>
                      <p className="text-[11px] text-blue-700/90 mt-0.5 leading-relaxed">
                        This user has fully completed their onboarding profiles (100%) and submitted it for verification. Please inspect the details below.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMember.status === 'suspended' && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-800">
                    <UserX className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-xs">Account Suspended</h5>
                      <p className="text-[11px] text-red-700/90 mt-0.5 leading-relaxed">
                        This profile access has been revoked. The member cannot access their investment dashboard.
                      </p>
                    </div>
                  </div>
                )}

                {/* Section 1: Personal Details */}
                <div className="space-y-3">
                  <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#7F7F7F] font-bold flex items-center gap-1.5">
                    <span>Personal Information</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Gender" value={selectedMember.gender} />
                    <DetailRow 
                      label="Date of Birth" 
                      value={selectedMember.date_of_birth ? new Date(selectedMember.date_of_birth).toLocaleDateString(undefined, { dateStyle: 'medium' }) : null} 
                    />
                    <DetailRow label="Phone Number" value={selectedMember.phone} />
                    <DetailRow label="Completion Progress" value={`${selectedMember.profile_completion_percent}%`} />
                  </div>
                </div>

                {/* Section 2: Residential Address */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#7F7F7F] font-bold flex items-center gap-1.5">
                    <span>Residential Address</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2 items-center text-xs font-semibold text-[#1A1A1A]">
                      <MapPin className="h-4 w-4 text-[#00A651] shrink-0" />
                      <span>{selectedMember.city || 'No City'}, {selectedMember.state || 'No State'}</span>
                    </div>
                    <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                      {selectedMember.address || 'No physical street address provided.'}
                    </p>
                  </div>
                </div>

                {/* Section 3: Next of Kin */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#7F7F7F] font-bold flex items-center gap-1.5">
                    <span>Next of Kin details</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <DetailRow label="Full Name" value={selectedMember.next_of_kin_name} isBold />
                    </div>
                    <DetailRow label="Phone" value={selectedMember.next_of_kin_phone} />
                    <DetailRow label="Relationship" value={selectedMember.next_of_kin_relationship} />
                  </div>
                </div>

                {/* Section 4: Beneficiary Details */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#7F7F7F] font-bold flex items-center gap-1.5">
                    <span>Beneficiary details</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </h4>
                  {selectedMember.beneficiary_name ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <DetailRow label="Full Name" value={selectedMember.beneficiary_name} isBold />
                      </div>
                      <DetailRow label="Phone" value={selectedMember.beneficiary_phone} />
                      <DetailRow label="Relationship" value={selectedMember.beneficiary_relationship} />
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 p-3 rounded-lg text-center">
                      No beneficiary has been specified.
                    </p>
                  )}
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-gray-150 p-5 bg-gray-50 space-y-2.5">
                
                {selectedMember.status === 'pending_approval' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedMember.id, 'approved')}
                    disabled={actionLoading !== null}
                    className="w-full py-3 bg-[#00A651] text-white hover:bg-[#008741] transition-colors rounded-xl font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === selectedMember.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve & Verify Member
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {selectedMember.status !== 'profile_incomplete' && selectedMember.status !== 'pending_registration' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedMember.id, 'profile_incomplete')}
                      disabled={actionLoading !== null}
                      className="py-2.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-mono text-[9px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      Request changes
                    </button>
                  )}
                  
                  {selectedMember.status !== 'suspended' ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedMember.id, 'suspended')}
                      disabled={actionLoading !== null}
                      className="py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-mono text-[9px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      Suspend Access
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedMember.id, 'approved')}
                      disabled={actionLoading !== null}
                      className="py-2.5 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-mono text-[9px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      Reinstate Member
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setDeleteConfirmId(selectedMember.id)}
                  disabled={actionLoading !== null}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-[9px] uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Permanently Delete Profile
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>


        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark blurred background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-150 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4 relative z-10"
            >
              <div className="mx-auto w-12 h-12 bg-red-100 border border-red-200 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-base text-[#1A1A1A]">Remove Member?</h4>
                <p className="font-sans text-xs text-[#7F7F7F] leading-relaxed">
                  Are you sure you want to delete this profile? This deletes the user's registry data from the profiles table. This action is permanent.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => handleRemoveMember(deleteConfirmId)}
                  disabled={actionLoading !== null}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoading === deleteConfirmId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={actionLoading !== null}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-mono text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

    </div>
  );
}

// 7. STATUS BADGE COMPONENT
function StatusBadge({ status }: { status: MemberProfile['status'] }) {
  const config = useMemo(() => {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-green-50 text-green-700 border-green-200/50',
          dot: 'bg-green-500',
          text: 'Approved'
        };
      case 'pending_approval':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/50',
          dot: 'bg-blue-500',
          text: 'Pending Review'
        };
      case 'profile_incomplete':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/50',
          dot: 'bg-amber-500',
          text: 'Changes Requested'
        };
      case 'pending_registration':
        return {
          bg: 'bg-gray-50 text-gray-600 border-gray-200/50',
          dot: 'bg-gray-400',
          text: 'Draft Profile'
        };
      case 'active_basic':
        return {
          bg: 'bg-gray-50 text-gray-600 border-gray-200/50',
          dot: 'bg-gray-400',
          text: 'Basic Registered'
        };
      case 'suspended':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200/50',
          dot: 'bg-red-500',
          text: 'Suspended'
        };
      default:
        return {
          bg: 'bg-gray-50 text-gray-600 border-gray-200/50',
          dot: 'bg-gray-400',
          text: status
        };
    }
  }, [status]);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.text}</span>
    </span>
  );
}

// 8. DETAIL ROW HELPER COMPONENT
function DetailRow({ label, value, isBold = false }: { label: string; value: string | null; isBold?: boolean }) {
  return (
    <div>
      <span className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F] block">{label}</span>
      <span className={`font-sans text-xs mt-0.5 block ${isBold ? 'font-bold' : 'font-medium'} text-[#1A1A1A]`}>
        {value || 'Not provided'}
      </span>
    </div>
  );
}
