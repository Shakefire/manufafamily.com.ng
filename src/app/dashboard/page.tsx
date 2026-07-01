'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'motion/react';
import { 
  ShieldAlert, ShieldCheck, AlertOctagon, Lock, 
  Wallet, TrendingUp, Calendar, PlusCircle, Settings, LogOut, MessageSquare, Bell, X, Check, Users, Plus, Loader2
} from 'lucide-react';

interface DashboardMessage {
  id: string;
  subject: string;
  body: string;
  recipients: string;
  createdAt: string;
}

interface ActiveMemberSummary {
  id: string;
  full_name: string;
  phone: string | null;
  status: string;
}

interface DashboardNotification {
  id: string;
  type: 'general' | 'savings';
  title: string;
  body: string;
  metadata: any;
  read: boolean;
  created_at: string;
}

interface DashboardSavingsPlan {
  id: string;
  name: string;
  contribution_amount: number;
  frequency: string;
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
  status: string;
  auto_reminder: boolean;
  created_at: string;
}

type PanelType = 'messages' | 'notifications' | 'savings' | 'members' | 'preferences' | null;
type RecipientMode = 'all' | 'selected' | 'individual';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const supabase = createClient();

  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [messages, setMessages] = useState<DashboardMessage[]>([
    {
      id: 'welcome-msg',
      subject: 'Welcome to MANUFA',
      body: 'Your dashboard is ready. Use the quick links to send updates and review your savings activity.',
      recipients: 'All members',
      createdAt: 'Today'
    }
  ]);
  const [activeMembers, setActiveMembers] = useState<ActiveMemberSummary[]>([]);
  const [recipientMode, setRecipientMode] = useState<RecipientMode>('all');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [dbNotifications, setDbNotifications] = useState<DashboardNotification[]>([]);
  const [savingsPlans, setSavingsPlans] = useState<DashboardSavingsPlan[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [savingsLoading, setSavingsLoading] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, status')
        .eq('status', 'approved')
        .order('full_name', { ascending: true });

      if (!error && data) {
        setActiveMembers((data as ActiveMemberSummary[]) || []);
      }
    };

    const loadNotifications = async () => {
      if (!user) return;
      setNotifLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setDbNotifications((data as DashboardNotification[]) || []);
      }
      setNotifLoading(false);
    };

    const loadSavingsPlans = async () => {
      if (!user) return;
      setSavingsLoading(true);
      const { data, error } = await supabase
        .from('savings_plans')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const plans = data as DashboardSavingsPlan[];
        const userId = user.id;
        const filtered = plans.filter((p) => {
          if (p.recipients_mode === 'all') return true;
          if (p.recipients_mode === 'selected' && p.recipient_ids) return p.recipient_ids.includes(userId);
          if (p.recipients_mode === 'individual') return p.recipient_id === userId;
          return false;
        });
        setSavingsPlans(filtered);
      }
      setSavingsLoading(false);
    };

    loadMembers();
    loadNotifications();
    loadSavingsPlans();
  }, [supabase, user]);

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

  const handleSendMessage = () => {
    if (!draftSubject.trim() || !draftBody.trim()) return;

    const recipientLabel = recipientMode === 'all'
      ? 'All members'
      : recipientMode === 'individual' && selectedRecipientId
        ? activeMembers.find((member) => member.id === selectedRecipientId)?.full_name || 'Selected member'
        : `${selectedRecipientIds.length} selected members`;

    const newMessage: DashboardMessage = {
      id: Date.now().toString(),
      subject: draftSubject.trim(),
      body: draftBody.trim(),
      recipients: recipientLabel,
      createdAt: 'Just now'
    };

    setMessages((prev) => [newMessage, ...prev]);
    setDraftSubject('');
    setDraftBody('');
    setSelectedRecipientIds([]);
    setSelectedRecipientId('');
    setRecipientMode('all');
    setComposeOpen(false);
    setActivePanel('messages');
  };

  const toggleSelectedMember = (memberId: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };
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
          <button
            type="button"
            onClick={() => setActivePanel('messages')}
            className="relative overflow-hidden rounded-xl border border-[#E4F7EB] bg-gradient-to-br from-white via-[#FCFDFD] to-[#F4FFF8] p-6 text-left shadow-sm transition-all hover:border-[#00A651]/40 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4B5563] font-semibold">Messages</span>
              <div className="rounded-full bg-[#E8F9EE] p-2 text-[#00A651]">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-3xl font-bold text-[#111827]">{messages.length}</h3>
              <p className="font-sans text-[11px] leading-5 text-[#4B5563]">{isApproved ? 'Open your latest updates' : 'Awaiting profile activation'}</p>
            </div>
            {!isApproved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center gap-1.5 text-xs text-gray-500 font-sans font-medium">
                <Lock className="h-3.5 w-3.5" /> Feature Locked
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActivePanel('notifications')}
            className="relative overflow-hidden rounded-xl border border-[#E4F7EB] bg-gradient-to-br from-white via-[#FCFDFD] to-[#F4FFF8] p-6 text-left shadow-sm transition-all hover:border-[#00A651]/40 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4B5563] font-semibold">Notifications</span>
              <div className="rounded-full bg-[#E8F9EE] p-2 text-[#00A651]">
                <Bell className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-3xl font-bold text-[#111827]">{dbNotifications.length}</h3>
              <p className="font-sans text-[11px] leading-5 text-[#4B5563]">{isApproved ? (dbNotifications.length > 0 ? `${dbNotifications.filter(n => !n.read).length} unread` : 'No notifications') : 'Awaiting profile activation'}</p>
            </div>
            {!isApproved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center gap-1.5 text-xs text-gray-500 font-sans font-medium">
                <Lock className="h-3.5 w-3.5" /> Feature Locked
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActivePanel('savings')}
            className="relative overflow-hidden rounded-xl border border-[#E4F7EB] bg-gradient-to-br from-white via-[#FCFDFD] to-[#F4FFF8] p-6 text-left shadow-sm transition-all hover:border-[#00A651]/40 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4B5563] font-semibold">Active Savings</span>
              <div className="rounded-full bg-[#E8F9EE] p-2 text-[#00A651]">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-3xl font-bold text-[#111827]">₦{savingsPlans.reduce((sum, p) => sum + Number(p.contribution_amount), 0).toLocaleString()}</h3>
              <p className="font-sans text-[11px] leading-5 text-[#4B5563]">{isApproved ? (savingsPlans.length > 0 ? `${savingsPlans.length} active plan(s)` : 'No active savings plan yet') : 'Awaiting profile activation'}</p>
            </div>
            {!isApproved && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center gap-1.5 text-xs text-gray-500 font-sans font-medium">
                <Lock className="h-3.5 w-3.5" /> Feature Locked
              </div>
            )}
          </button>
        </div>

        {/* Action Center (Visible to Approved Users) */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-display text-lg font-bold text-[#111827]">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {profile.role === 'admin' ? (
              <Link
                href="/admin/savings"
                className="flex flex-col items-center gap-2 rounded-xl border border-[#DCEFE3] bg-[#F7FFF9] py-4 transition-all hover:border-[#00A651] hover:bg-[#ECFDF3] group"
              >
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <Wallet className="h-5 w-5 text-[#00A651] transition-transform group-hover:scale-105" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[#1F2937]">Manage Savings</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-[#DCEFE3] bg-[#F7FFF9] py-4 text-center opacity-80">
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <Lock className="h-5 w-5 text-[#9CA3AF]" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[#6B7280]">Add Savings</span>
                <p className="text-[10px] text-[#6B7280] max-w-[11rem]">Admin-only feature</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setComposeOpen(true)}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#DCEFE3] bg-[#F7FFF9] py-4 transition-all hover:border-[#00A651] hover:bg-[#ECFDF3] group"
            >
              <div className="rounded-full bg-white p-2 shadow-sm">
                <PlusCircle className="h-5 w-5 text-[#00A651] transition-transform group-hover:scale-105" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[#1F2937]">Add Message</span>
            </button>
            {profile.role === 'admin' && (
              <Link
                href="/admin"
                className="flex flex-col items-center gap-2 rounded-xl border border-[#DCEFE3] bg-[#F7FFF9] py-4 transition-all hover:border-[#00A651] hover:bg-[#ECFDF3] group"
              >
                <div className="rounded-full bg-white p-2 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-[#00A651] transition-transform group-hover:scale-105" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[#1F2937]">Admin Portal</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setActivePanel('members')}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#DCEFE3] bg-[#F7FFF9] py-4 transition-all hover:border-[#00A651] hover:bg-[#ECFDF3] group"
            >
              <div className="rounded-full bg-white p-2 shadow-sm">
                <Users className="h-5 w-5 text-[#00A651] transition-transform group-hover:scale-105" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[#1F2937]">Members List</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel('preferences')}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#DCEFE3] bg-[#F7FFF9] py-4 transition-all hover:border-[#00A651] hover:bg-[#ECFDF3] group"
            >
              <div className="rounded-full bg-white p-2 shadow-sm">
                <Settings className="h-5 w-5 text-[#00A651] transition-transform group-hover:scale-105" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-[#1F2937]">Preferences</span>
            </button>
          </div>
        </div>

        {activePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#1A1A1A]/55 p-4"
          >
            <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F]">Dashboard View</p>
                  <h3 className="font-display text-xl font-semibold text-[#1A1A1A]">
                    {activePanel === 'messages' && 'Messages'}
                    {activePanel === 'notifications' && 'Notifications'}
                    {activePanel === 'savings' && 'Savings Overview'}
                    {activePanel === 'members' && 'Active Members'}
                    {activePanel === 'preferences' && 'Preferences'}
                  </h3>
                </div>
                <button type="button" onClick={() => setActivePanel(null)} className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {activePanel === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">Your messages</p>
                      <p className="text-xs text-[#7F7F7F]">Manage updates and outreach</p>
                    </div>
                    <button type="button" onClick={() => setComposeOpen(true)} className="rounded-lg bg-[#00A651] px-3 py-2 text-sm font-semibold text-white">New message</button>
                  </div>
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="rounded-xl border border-gray-200 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h4 className="font-semibold text-[#1A1A1A]">{message.subject}</h4>
                          <span className="text-[11px] text-[#7F7F7F]">{message.createdAt}</span>
                        </div>
                        <p className="mb-2 text-sm text-[#7F7F7F]">{message.body}</p>
                        <p className="text-[11px] font-medium text-[#00A651]">To: {message.recipients}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'notifications' && (
                notifLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-[#00A651]" />
                  </div>
                ) : dbNotifications.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-[#7F7F7F]">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No notifications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {dbNotifications.map((n) => (
                      <div key={n.id} className={`rounded-xl border p-4 ${n.type === 'savings' ? 'border-green-100 bg-green-50/50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`text-sm font-semibold ${n.type === 'savings' ? 'text-green-800' : 'text-[#1A1A1A]'}`}>{n.title}</p>
                            <p className="mt-1 text-sm text-[#7F7F7F]">{n.body}</p>
                          </div>
                          {!n.read && <span className="shrink-0 w-2 h-2 rounded-full bg-[#00A651] mt-1.5" />}
                        </div>
                        <p className="mt-2 text-[11px] text-[#7F7F7F]">{new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activePanel === 'savings' && (
                savingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-[#00A651]" />
                  </div>
                ) : savingsPlans.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-[#6B7280]">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] px-3 py-2 text-xs font-semibold text-[#6B7280]">
                      <Wallet className="h-4 w-4" /> {profile.role === 'admin' ? 'No Plans Created' : 'No Active Plans'}
                    </div>
                    <p>{profile.role === 'admin' ? 'Head to the Savings Plans admin page to create a new plan.' : 'You are not currently enrolled in any active savings plan. Contact your admin for more information.'}</p>
                    {profile.role === 'admin' && (
                      <Link href="/admin/savings" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00A651] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008741]">
                        <Plus className="h-4 w-4" /> Create Savings Plan
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#00A651]/15 bg-[#F7FFF9] p-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#00A651]">Total Planned Contributions</p>
                      <p className="mt-2 font-display text-3xl font-bold text-[#1A1A1A]">₦{savingsPlans.reduce((sum, p) => sum + Number(p.contribution_amount), 0).toLocaleString()}</p>
                      <p className="mt-2 text-sm text-[#7F7F7F]">{savingsPlans.length} active savings plan(s)</p>
                    </div>
                    {savingsPlans.map((plan) => (
                      <div key={plan.id} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-[#1A1A1A]">{plan.name}</h4>
                            <p className="text-sm text-[#7F7F7F] mt-1">{plan.description || 'No description'}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700 border border-green-200 capitalize">{plan.frequency}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F]">Contribution</p>
                            <p className="font-semibold text-[#1A1A1A]">₦{Number(plan.contribution_amount).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F]">Cashout Target</p>
                            <p className="font-semibold text-[#00A651]">₦{Number(plan.cashout_amount).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F]">Duration</p>
                            <p className="font-semibold text-[#1A1A1A]">{new Date(plan.start_date).toLocaleDateString()}{plan.end_date ? ` - ${new Date(plan.end_date).toLocaleDateString()}` : ''}</p>
                          </div>
                        </div>
                        {(plan.account_name || plan.account_bank || plan.account_number) && (
                          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-[#7F7F7F]">
                            <span className="font-medium">Account:</span> {[plan.account_name, plan.account_bank, plan.account_number].filter(Boolean).join(' | ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              {activePanel === 'members' && (
                <div className="space-y-3">
                  {activeMembers.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-[#7F7F7F]">No active members are available right now.</p>
                  ) : (
                    activeMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">{member.full_name}</p>
                          <p className="text-sm text-[#7F7F7F]">{member.phone || 'No phone number'}</p>
                        </div>
                        <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">Active</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activePanel === 'preferences' && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-[#1A1A1A]">Notification preferences</p>
                    <p className="mt-1 text-sm text-[#7F7F7F]">Manage how updates, savings reminders, and compliance notices reach you.</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-[#1A1A1A]">Privacy controls</p>
                    <p className="mt-1 text-sm text-[#7F7F7F]">Adjust visibility of your profile and contact details.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {composeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/60 p-4"
          >
            <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F]">Compose Message</p>
                  <h3 className="font-display text-xl font-semibold text-[#1A1A1A]">Create a new message</h3>
                </div>
                <button type="button" onClick={() => setComposeOpen(false)} className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Subject</label>
                  <input
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#00A651]"
                    placeholder="Enter a subject"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Recipients</label>
                  <select
                    value={recipientMode}
                    onChange={(e) => setRecipientMode(e.target.value as RecipientMode)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#00A651]"
                  >
                    <option value="all">All members</option>
                    <option value="selected">Selected members</option>
                    <option value="individual">Individual member</option>
                  </select>
                </div>

                {recipientMode === 'individual' && (
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Choose a member</label>
                    <select
                      value={selectedRecipientId}
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#00A651]"
                    >
                      <option value="">Select a member</option>
                      {activeMembers.map((member) => (
                        <option key={member.id} value={member.id}>{member.full_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {recipientMode === 'selected' && (
                  <div className="rounded-xl border border-gray-200 p-3">
                    <p className="mb-2 text-sm font-semibold text-[#1A1A1A]">Choose members</p>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {activeMembers.map((member) => (
                        <label key={member.id} className="flex items-center gap-2 text-sm text-[#7F7F7F]">
                          <input
                            type="checkbox"
                            checked={selectedRecipientIds.includes(member.id)}
                            onChange={() => toggleSelectedMember(member.id)}
                            className="h-4 w-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]"
                          />
                          <span>{member.full_name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#1A1A1A]">Message</label>
                  <textarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    rows={5}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#00A651]"
                    placeholder="Write your message"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setComposeOpen(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700">Cancel</button>
                <button type="button" onClick={handleSendMessage} className="inline-flex items-center gap-2 rounded-xl bg-[#00A651] px-4 py-2.5 text-sm font-semibold text-white">
                  <Check className="h-4 w-4" />
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
