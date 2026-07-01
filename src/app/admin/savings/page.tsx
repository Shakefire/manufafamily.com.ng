'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet, Plus, Check, X, ShieldAlert, ArrowLeft, RefreshCw,
  Search, Trash2, AlertTriangle, Loader2, Edit3, ToggleLeft, ToggleRight,
  Users, Calendar, Clock, DollarSign, Bell, BellOff, Tag, FileText, Building2, PiggyBank
} from 'lucide-react';

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

interface MemberProfile {
  id: string;
  full_name: string;
  phone: string | null;
  status: string;
}

interface SavingsPlanForm {
  name: string;
  contribution_amount: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  cashout_amount: string;
  start_date: string;
  end_date: string;
  description: string;
  account_name: string;
  account_bank: string;
  account_number: string;
  recipients_mode: 'all' | 'selected' | 'individual';
  selected_recipient_ids: string[];
  selected_recipient_id: string;
  auto_reminder: boolean;
}

const emptyForm: SavingsPlanForm = {
  name: '',
  contribution_amount: '',
  frequency: 'monthly',
  cashout_amount: '',
  start_date: '',
  end_date: '',
  description: '',
  account_name: '',
  account_bank: '',
  account_number: '',
  recipients_mode: 'all',
  selected_recipient_ids: [],
  selected_recipient_id: '',
  auto_reminder: true,
};

export default function AdminSavingsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [savingsTableMissing, setSavingsTableMissing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SavingsPlan | null>(null);
  const [form, setForm] = useState<SavingsPlanForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SavingsPlanForm, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const frequencyLabels: Record<string, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };

  const fetchPlans = async () => {
    setAdminLoading(true);
    setSavingsTableMissing(false);
    try {
      const { data, error } = await supabase
        .from('savings_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('Could not find the table')) {
          setSavingsTableMissing(true);
          setPlans([]);
          return;
        }
        console.error('Error fetching savings plans:', error.message);
      } else {
        setPlans((data as SavingsPlan[]) || []);
      }
    } catch (err) {
      console.error('Error in fetchPlans:', err);
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, status')
        .eq('status', 'approved')
        .order('full_name', { ascending: true });

      if (!error && data) {
        setMembers((data as MemberProfile[]) || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    if (user && profile && profile.role === 'admin') {
      fetchPlans();
      fetchMembers();
    }
  }, [user, profile]);

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
        matchesStatus = p.status === statusFilter;
      }
      return matchesSearch && matchesStatus;
    });
  }, [plans, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = plans.length;
    const active = plans.filter((p) => p.status === 'active').length;
    let memberCount = 0;
    plans.forEach((p) => {
      if (p.recipients_mode === 'all') memberCount += members.length;
      else if (p.recipients_mode === 'selected' && p.recipient_ids) memberCount += p.recipient_ids.length;
      else if (p.recipients_mode === 'individual' && p.recipient_id) memberCount += 1;
    });
    return { total, active, memberCount };
  }, [plans, members]);

  const openCreateForm = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (plan: SavingsPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      contribution_amount: String(plan.contribution_amount),
      frequency: plan.frequency,
      cashout_amount: String(plan.cashout_amount),
      start_date: plan.start_date,
      end_date: plan.end_date || '',
      description: plan.description || '',
      account_name: plan.account_name || '',
      account_bank: plan.account_bank || '',
      account_number: plan.account_number || '',
      recipients_mode: plan.recipients_mode,
      selected_recipient_ids: plan.recipient_ids || [],
      selected_recipient_id: plan.recipient_id || '',
      auto_reminder: plan.auto_reminder,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof SavingsPlanForm, string>> = {};
    if (!form.name.trim()) errors.name = 'Plan name is required';
    if (!form.contribution_amount || Number(form.contribution_amount) <= 0) errors.contribution_amount = 'Valid contribution amount is required';
    if (!form.cashout_amount || Number(form.cashout_amount) <= 0) errors.cashout_amount = 'Valid cashout amount is required';
    if (!form.start_date) errors.start_date = 'Start date is required';
    if (form.recipients_mode === 'individual' && !form.selected_recipient_id) errors.selected_recipient_id = 'Select a member';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createNotifications = async (plan: SavingsPlan) => {
    if (!plan.auto_reminder) return;

    let targetIds: string[] = [];
    if (plan.recipients_mode === 'all') {
      targetIds = members.map((m) => m.id);
    } else if (plan.recipients_mode === 'selected' && plan.recipient_ids) {
      targetIds = plan.recipient_ids;
    } else if (plan.recipients_mode === 'individual' && plan.recipient_id) {
      targetIds = [plan.recipient_id];
    }

    if (targetIds.length === 0) return;

    const freqLabel = frequencyLabels[plan.frequency] || plan.frequency;
    const notifications = targetIds.map((pid) => ({
      profile_id: pid,
      type: 'savings' as const,
      title: `Savings Plan: ${plan.name}`,
      body: `A new savings plan "${plan.name}" has been created. Your contribution of ₦${Number(plan.contribution_amount).toLocaleString()} is due ${freqLabel.toLowerCase()}. Target cashout: ₦${Number(plan.cashout_amount).toLocaleString()}. Starts: ${plan.start_date}${plan.end_date ? `, Ends: ${plan.end_date}` : ''}.`,
      metadata: { plan_id: plan.id, frequency: plan.frequency, contribution_amount: plan.contribution_amount },
      read: false,
    }));

    await supabase.from('notifications').insert(notifications);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      admin_id: profile!.id,
      name: form.name.trim(),
      contribution_amount: Number(form.contribution_amount),
      frequency: form.frequency,
      cashout_amount: Number(form.cashout_amount),
      start_date: form.start_date,
      end_date: form.end_date || null,
      description: form.description.trim() || null,
      account_name: form.account_name.trim() || null,
      account_bank: form.account_bank.trim() || null,
      account_number: form.account_number.trim() || null,
      recipients_mode: form.recipients_mode,
      recipient_ids: form.recipients_mode === 'selected' ? form.selected_recipient_ids : null,
      recipient_id: form.recipients_mode === 'individual' ? form.selected_recipient_id : null,
      auto_reminder: form.auto_reminder,
    };

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('savings_plans')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingPlan.id);

        if (error) {
          alert('Failed to update plan: ' + error.message);
          return;
        }

        if (form.auto_reminder) {
          await createNotifications({ ...editingPlan, ...payload } as SavingsPlan);
        }
      } else {
        const { data, error } = await supabase
          .from('savings_plans')
          .insert(payload)
          .select()
          .single();

        if (error) {
          alert('Failed to create plan: ' + error.message);
          return;
        }

        if (data && form.auto_reminder) {
          await createNotifications(data as SavingsPlan);
        }
      }

      setShowForm(false);
      setEditingPlan(null);
      setForm(emptyForm);
      await fetchPlans();
    } catch (err: any) {
      console.error('Error saving plan:', err);
      alert('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleReminder = async (plan: SavingsPlan) => {
    setActionLoading(plan.id);
    const newVal = !plan.auto_reminder;
    try {
      const { error } = await supabase
        .from('savings_plans')
        .update({ auto_reminder: newVal, updated_at: new Date().toISOString() })
        .eq('id', plan.id);

      if (error) {
        alert('Failed to toggle reminder: ' + error.message);
        return;
      }

      setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, auto_reminder: newVal } : p)));

      if (newVal) {
        await createNotifications({ ...plan, auto_reminder: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (plan: SavingsPlan) => {
    setActionLoading(plan.id);
    const newStatus = plan.status === 'active' ? 'paused' : 'active';
    try {
      const { error } = await supabase
        .from('savings_plans')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', plan.id);

      if (error) {
        alert('Failed to update status: ' + error.message);
        return;
      }

      setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status: newStatus } : p)));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setActionLoading(deleteConfirmId);
    try {
      const { error } = await supabase
        .from('savings_plans')
        .delete()
        .eq('id', deleteConfirmId);

      if (error) {
        alert('Failed to delete plan: ' + error.message);
        return;
      }

      setPlans((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]" />
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px] pointer-events-none" />
        <header className="px-6 py-6 border-b border-gray-100 bg-white">
          <Link href="/"><img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-10 w-auto object-contain" /></Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-6 shadow-sm">
            <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full"><ShieldAlert className="h-8 w-8" /></div>
            <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">Access Denied</h2>
            <p className="font-sans text-sm text-[#7F7F7F]">You must have an administrator account to manage savings plans.</p>
            <Link href="/dashboard" className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Go to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-sm text-[#1A1A1A]">
      <nav className="bg-[#1A1A1A] border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30 text-white">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-1.5 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Link href="/"><img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-9 w-auto object-contain cursor-pointer invert brightness-200" /></Link>
          <div className="h-5 w-px bg-gray-700" />
          <h1 className="font-display font-semibold text-base flex items-center gap-2 tracking-tight">
            <PiggyBank className="h-5 w-5 text-[#00A651]" /> Savings Plans
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchPlans} disabled={adminLoading}
            className="inline-flex items-center gap-2 rounded-full border border-[#00A651]/30 bg-[#00A651] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008741] disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${adminLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-[#1A1A1A]">Manage Savings Plans</h2>
            <p className="text-sm text-[#7F7F7F]">Create and manage member savings plans, contributions, and reminders.</p>
          </div>
          <button onClick={openCreateForm} disabled={savingsTableMissing}
            className="inline-flex items-center gap-2 rounded-xl bg-[#00A651] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008741] disabled:cursor-not-allowed disabled:opacity-50">
            <Plus className="h-4 w-4" /> New Savings Plan
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Total Plans</p>
            <p className="mt-1 font-display text-3xl font-bold text-[#1A1A1A]">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Active Plans</p>
            <p className="mt-1 font-display text-3xl font-bold text-[#00A651]">{stats.active}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Members Covered</p>
            <p className="mt-1 font-display text-3xl font-bold text-[#1A1A1A]">{stats.memberCount}</p>
          </div>
        </div>

        <section className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by plan name..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl font-sans text-xs focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2 border border-gray-200 rounded-xl bg-white text-xs font-sans focus:outline-none focus:border-[#00A651]">
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </section>

        <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
          {adminLoading ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#00A651]" />
              <p className="font-sans text-xs text-[#7F7F7F]">Loading savings plans...</p>
            </div>
          ) : savingsTableMissing ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-16 text-center space-y-4">
              <div className="inline-flex p-3 bg-amber-100 text-amber-700 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-amber-900">Unable to load Savings Plans</h3>
              <p className="font-sans text-xs text-amber-900 max-w-sm mx-auto">
                The database table <span className="font-mono">public.savings_plans</span> is missing. Please apply the correct migration or verify your Supabase schema.
              </p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-4">
              <div className="inline-flex p-3 bg-gray-50 border border-gray-100 text-gray-400 rounded-full">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1A1A1A]">No Savings Plans Yet</h3>
              <p className="font-sans text-xs text-[#7F7F7F] max-w-sm mx-auto">
                Create your first savings plan to start managing member contributions and savings goals.
              </p>
              <button onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-xl bg-[#00A651] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#008741]">
                <Plus className="h-4 w-4" /> Create Savings Plan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => (
                <article key={plan.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#00A651]/20 hover:shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-[#1A1A1A]">{plan.name}</h3>
                        <StatusBadge status={plan.status} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Contribution</p>
                          <p className="text-sm font-bold text-[#1A1A1A]">₦{Number(plan.contribution_amount).toLocaleString()}</p>
                          <p className="text-[11px] text-[#7F7F7F] capitalize">{frequencyLabels[plan.frequency] || plan.frequency}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Cashout Target</p>
                          <p className="text-sm font-bold text-[#00A651]">₦{Number(plan.cashout_amount).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Duration</p>
                          <p className="text-sm text-[#1A1A1A]">{new Date(plan.start_date).toLocaleDateString()}{plan.end_date ? ` - ${new Date(plan.end_date).toLocaleDateString()}` : ''}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F] font-semibold">Recipients</p>
                          <p className="text-sm text-[#1A1A1A] capitalize">{plan.recipients_mode.replace('_', ' ')}</p>
                        </div>
                      </div>
                      {plan.description && (
                        <p className="mt-2 text-xs text-[#7F7F7F] line-clamp-2">{plan.description}</p>
                      )}
                      {(plan.account_name || plan.account_bank || plan.account_number) && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#7F7F7F]">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>{[plan.account_name, plan.account_bank, plan.account_number].filter(Boolean).join(' | ')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end shrink-0">
                      <button onClick={() => openEditForm(plan)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                        <Edit3 className="h-4 w-4" /> Edit
                      </button>
                      <button onClick={() => handleToggleStatus(plan)} disabled={actionLoading === plan.id}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50">
                        {actionLoading === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.status === 'active' ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                        {plan.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button onClick={() => handleToggleReminder(plan)} disabled={actionLoading === plan.id}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${plan.auto_reminder ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                        {actionLoading === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.auto_reminder ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        {plan.auto_reminder ? 'ON' : 'OFF'}
                      </button>
                      <button onClick={() => setDeleteConfirmId(plan.id)} disabled={actionLoading !== null}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50">
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs z-40 cursor-pointer" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl z-10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#7F7F7F]">{editingPlan ? 'Edit Savings Plan' : 'New Savings Plan'}</p>
                    <h3 className="font-display text-xl font-semibold text-[#1A1A1A]">{editingPlan ? 'Update plan details' : 'Create a new savings plan'}</h3>
                  </div>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-6 py-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Savings Plan Name</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#00A651] ${formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                        placeholder="e.g. Annual Savings 2026" />
                      {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Contribution Amount (₦)</label>
                      <input type="number" value={form.contribution_amount} onChange={(e) => setForm({ ...form, contribution_amount: e.target.value })}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#00A651] ${formErrors.contribution_amount ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                        placeholder="5000" min="0" step="0.01" />
                      {formErrors.contribution_amount && <p className="mt-1 text-xs text-red-500">{formErrors.contribution_amount}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Frequency</label>
                      <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as SavingsPlanForm['frequency'] })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Cashout Amount (₦)</label>
                      <input type="number" value={form.cashout_amount} onChange={(e) => setForm({ ...form, cashout_amount: e.target.value })}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#00A651] ${formErrors.cashout_amount ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
                        placeholder="100000" min="0" step="0.01" />
                      {formErrors.cashout_amount && <p className="mt-1 text-xs text-red-500">{formErrors.cashout_amount}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Starting Date</label>
                      <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#00A651] ${formErrors.start_date ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
                      {formErrors.start_date && <p className="mt-1 text-xs text-red-500">{formErrors.start_date}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Finishing Date (optional)</label>
                      <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Description (optional)</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]"
                      placeholder="Describe the savings plan purpose and terms..." />
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#7F7F7F] font-bold mb-3">Savings Account Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Account Name</label>
                        <input value={form.account_name} onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]"
                          placeholder="e.g. MANUFA Savings Account" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Bank</label>
                        <input value={form.account_bank} onChange={(e) => setForm({ ...form, account_bank: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]"
                          placeholder="e.g. GTBank" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Account Number</label>
                        <input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]"
                          placeholder="0123456789" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="font-mono text-[9px] uppercase tracking-widest text-[#7F7F7F] font-bold mb-3">Members</h4>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Select Members</label>
                      <select value={form.recipients_mode} onChange={(e) => setForm({ ...form, recipients_mode: e.target.value as SavingsPlanForm['recipients_mode'] })}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#00A651]">
                        <option value="all">All Approved Members</option>
                        <option value="selected">Selected Members</option>
                        <option value="individual">Individual Member</option>
                      </select>
                    </div>

                    {form.recipients_mode === 'all' && (
                      <p className="mt-2 text-xs text-[#00A651] font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> All {members.length} approved members will be added to this plan.
                      </p>
                    )}

                    {form.recipients_mode === 'individual' && (
                      <div className="mt-3">
                        <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">Choose a member</label>
                        <select value={form.selected_recipient_id} onChange={(e) => setForm({ ...form, selected_recipient_id: e.target.value })}
                          className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#00A651] ${formErrors.selected_recipient_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
                          <option value="">Select a member</option>
                          {members.map((m) => (
                            <option key={m.id} value={m.id}>{m.full_name}</option>
                          ))}
                        </select>
                        {formErrors.selected_recipient_id && <p className="mt-1 text-xs text-red-500">{formErrors.selected_recipient_id}</p>}
                      </div>
                    )}

                    {form.recipients_mode === 'selected' && (
                      <div className="mt-3 rounded-xl border border-gray-200 p-3">
                        <p className="mb-2 text-sm font-semibold text-[#1A1A1A]">{members.length} members available</p>
                        <div className="max-h-48 space-y-1.5 overflow-y-auto">
                          {members.map((m) => (
                            <label key={m.id} className="flex items-center gap-2.5 text-sm text-[#7F7F7F] hover:text-[#1A1A1A] cursor-pointer py-0.5">
                              <input type="checkbox" checked={form.selected_recipient_ids.includes(m.id)}
                                onChange={() => setForm({
                                  ...form,
                                  selected_recipient_ids: form.selected_recipient_ids.includes(m.id)
                                    ? form.selected_recipient_ids.filter((id) => id !== m.id)
                                    : [...form.selected_recipient_ids, m.id],
                                })}
                                className="h-4 w-4 rounded border-gray-300 text-[#00A651] focus:ring-[#00A651]" />
                              <span>{m.full_name}</span>
                            </label>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-[#7F7F7F]">{form.selected_recipient_ids.length} member(s) selected</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1A1A1A]">Auto Reminder</h4>
                        <p className="text-xs text-[#7F7F7F]">Send contribution reminders to members based on the frequency</p>
                      </div>
                      <button type="button" onClick={() => setForm({ ...form, auto_reminder: !form.auto_reminder })}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${form.auto_reminder ? 'bg-[#00A651]' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${form.auto_reminder ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSave} disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#00A651] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#008741] disabled:opacity-50 cursor-pointer">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs cursor-pointer" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-150 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4 relative z-10">
              <div className="mx-auto w-12 h-12 bg-red-100 border border-red-200 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-base text-[#1A1A1A]">Delete Savings Plan?</h4>
                <p className="font-sans text-xs text-[#7F7F7F] leading-relaxed">
                  Are you sure you want to delete this savings plan? This action is permanent and cannot be undone.
                </p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button onClick={handleDelete} disabled={actionLoading !== null}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50">
                  {actionLoading === deleteConfirmId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yes, Delete'}
                </button>
                <button onClick={() => setDeleteConfirmId(null)} disabled={actionLoading !== null}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-mono text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: SavingsPlan['status'] }) {
  const config = useMemo(() => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-50 text-green-700 border-green-200/50', dot: 'bg-green-500', text: 'Active' };
      case 'paused':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200/50', dot: 'bg-amber-500', text: 'Paused' };
      case 'closed':
        return { bg: 'bg-gray-50 text-gray-600 border-gray-200/50', dot: 'bg-gray-400', text: 'Closed' };
      default:
        return { bg: 'bg-gray-50 text-gray-600 border-gray-200/50', dot: 'bg-gray-400', text: status };
    }
  }, [status]);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.text}</span>
    </span>
  );
}
