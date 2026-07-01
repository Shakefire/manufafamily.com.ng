'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import {
  User,
  MapPin,
  Users,
  Building2,
  Landmark,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

type Tab = 'personal' | 'address' | 'kin' | 'bank' | 'company_info' | 'company_bank';

export default function ProfileCompletionPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const isCompanyAccount = profile?.registration_type === 'company' || user?.user_metadata?.registration_type === 'company';

  useEffect(() => {
    if (user && profile) {
      if (profile.status === 'approved' || profile.status === 'suspended' || profile.status === 'pending_approval') {
        router.push('/dashboard');
      }
    }
  }, [user, profile, router]);

  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const [kinName, setKinName] = useState('');
  const [kinPhone, setKinPhone] = useState('');
  const [kinRelation, setKinRelation] = useState('');

  const [bankName, setBankName] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [registeredOfficeAddress, setRegisteredOfficeAddress] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setDob(profile.date_of_birth || '');
      setGender(profile.gender || '');
      setState(profile.state || '');
      setCity(profile.city || '');
      setAddress(profile.address || '');
      setKinName(profile.next_of_kin_name || '');
      setKinPhone(profile.next_of_kin_phone || '');
      setKinRelation(profile.next_of_kin_relationship || '');
      setBankName(profile.bank_name || '');
      setBankAccountName(profile.bank_account_name || '');
      setBankAccountNumber(profile.bank_account_number || '');
      setCompanyName(profile.company_name || '');
      setCompanyRegistrationNumber(profile.company_registration_number || '');
      setCompanyEmail(profile.company_email || '');
      setCompanyType(profile.company_type || '');
      setRegisteredOfficeAddress(profile.registered_office_address || '');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setCompanyName(user.user_metadata?.company_name || user.user_metadata?.full_name || '');
      setCompanyRegistrationNumber(user.user_metadata?.company_registration_number || '');
      setCompanyEmail(user.user_metadata?.company_email || '');
    }
  }, [profile, user]);

  useEffect(() => {
    setActiveTab(isCompanyAccount ? 'company_info' : 'personal');
  }, [isCompanyAccount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalFields = isCompanyAccount ? 8 : 13;
  let filledFields = 0;

  if (isCompanyAccount) {
    if (companyName.trim()) filledFields++;
    if (companyRegistrationNumber.trim()) filledFields++;
    if (companyEmail.trim()) filledFields++;
    if (companyType) filledFields++;
    if (registeredOfficeAddress.trim()) filledFields++;
    if (bankName.trim()) filledFields++;
    if (bankAccountName.trim()) filledFields++;
    if (bankAccountNumber.trim()) filledFields++;
  } else {
    if (fullName.trim()) filledFields++;
    if (phone.trim()) filledFields++;
    if (dob) filledFields++;
    if (gender) filledFields++;
    if (state.trim()) filledFields++;
    if (city.trim()) filledFields++;
    if (address.trim()) filledFields++;
    if (kinName.trim()) filledFields++;
    if (kinPhone.trim()) filledFields++;
    if (kinRelation.trim()) filledFields++;
    if (bankName.trim()) filledFields++;
    if (bankAccountName.trim()) filledFields++;
    if (bankAccountNumber.trim()) filledFields++;
  }

  const liveCompletionPercent = Math.round((filledFields * 100) / totalFields);

  const getPayload = () => {
    if (isCompanyAccount) {
      return {
        full_name: companyName,
        company_name: companyName || null,
        company_registration_number: companyRegistrationNumber || null,
        company_email: companyEmail || null,
        company_type: companyType || null,
        registered_office_address: registeredOfficeAddress || null,
        bank_name: bankName || null,
        bank_account_name: bankAccountName || null,
        bank_account_number: bankAccountNumber || null,
      };
    }

    return {
      full_name: fullName,
      phone: phone || null,
      date_of_birth: dob || null,
      gender: gender || null,
      state: state || null,
      city: city || null,
      address: address || null,
      next_of_kin_name: kinName || null,
      next_of_kin_phone: kinPhone || null,
      next_of_kin_relationship: kinRelation || null,
      bank_name: bankName || null,
      bank_account_name: bankAccountName || null,
      bank_account_number: bankAccountNumber || null,
    };
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: saveError } = await supabase
        .from('profiles')
        .update(getPayload())
        .eq('id', user.id);

      if (saveError) {
        setError(saveError.message);
      } else {
        setSuccessMsg('Draft saved successfully!');
        await refreshProfile();
      }
    } catch (err: any) {
      setError(err.message || 'Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    if (isCompanyAccount) {
      if (!companyName.trim() || !companyRegistrationNumber.trim() || !companyEmail.trim() || !companyType || !registeredOfficeAddress.trim() || !bankName.trim() || !bankAccountName.trim() || !bankAccountNumber.trim()) {
        setError('Please complete all company information and bank details before submitting.');
        setSubmitting(false);
        return;
      }
    } else if (!fullName.trim() || !phone.trim() || !dob || !gender || !state.trim() || !city.trim() || !address.trim() || !kinName.trim() || !kinPhone.trim() || !kinRelation.trim() || !bankName.trim() || !bankAccountName.trim() || !bankAccountNumber.trim()) {
      setError('Please complete all personal, address, next of kin, and bank details before submitting.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...getPayload(),
        status: 'pending_approval',
      };

      const { error: submitError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (submitError) {
        setError(submitError.message);
      } else {
        setSuccessMsg('Profile submitted for approval successfully!');
        await refreshProfile();
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting profile');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = isCompanyAccount
    ? [
        { id: 'company_info', label: 'Company Info', icon: Building2 },
        { id: 'company_bank', label: 'Bank Details', icon: Landmark },
      ]
    : [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'address', label: 'Address Details', icon: MapPin },
        { id: 'kin', label: 'Next of Kin', icon: Users },
        { id: 'bank', label: 'Bank Details', icon: Landmark },
      ];

  const isLastStep = isCompanyAccount ? activeTab === 'company_bank' : activeTab === 'bank';

  const handleNextTab = () => {
    if (isCompanyAccount) {
      if (activeTab === 'company_info') setActiveTab('company_bank');
    } else if (activeTab === 'personal') setActiveTab('address');
    else if (activeTab === 'address') setActiveTab('kin');
    else if (activeTab === 'kin') setActiveTab('bank');
  };

  const handlePrevTab = () => {
    if (isCompanyAccount) {
      if (activeTab === 'company_bank') setActiveTab('company_info');
    } else if (activeTab === 'bank') setActiveTab('kin');
    else if (activeTab === 'kin') setActiveTab('address');
    else if (activeTab === 'address') setActiveTab('personal');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/welcome" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-[#7F7F7F]" />
          </Link>
          <Link href="/">
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-10 w-auto object-contain hidden sm:block cursor-pointer" />
          </Link>
          <h1 className="font-display font-semibold text-lg text-[#1A1A1A]">Complete Profile</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#7F7F7F]">Completion Status</p>
            <p className="font-sans text-xs font-semibold text-[#1A1A1A]">{liveCompletionPercent}% Complete</p>
          </div>
          <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#00A651] h-full rounded-full transition-all duration-500"
              style={{ width: `${liveCompletionPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 sticky top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap md:whitespace-normal shrink-0 w-auto md:w-full font-mono text-[10px] uppercase tracking-widest font-semibold ${
                    isActive
                      ? 'bg-[#00A651]/10 text-[#00A651] border border-[#00A651]/20'
                      : 'text-[#7F7F7F] hover:text-[#1A1A1A] hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#00A651]' : 'text-[#7F7F7F]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-sans font-medium"
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-sans font-medium flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4 text-[#00A651]" />
              {successMsg}
            </motion.div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {isCompanyAccount ? (
                  <>
                    {activeTab === 'company_info' && (
                      <motion.div
                        key="company_info"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                          Company Information
                        </h3>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Registered Business Name
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Exact name on certificate"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              RC Number or BN Number
                            </label>
                            <input
                              type="text"
                              value={companyRegistrationNumber}
                              onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                              placeholder="RC1234567"
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              Official Email
                            </label>
                            <input
                              type="email"
                              value={companyEmail}
                              onChange={(e) => setCompanyEmail(e.target.value)}
                              placeholder="official@company.com"
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Company Type
                          </label>
                          <select
                            value={companyType}
                            onChange={(e) => setCompanyType(e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] bg-white transition-colors"
                            required
                          >
                            <option value="">Select Company Type</option>
                            <option value="Limited Liability Company (LTD)">Limited Liability Company (LTD)</option>
                            <option value="Business Name/Enterprise">Business Name/Enterprise</option>
                            <option value="Incorporated Trustee">Incorporated Trustee</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Registered Office Address
                          </label>
                          <textarea
                            value={registeredOfficeAddress}
                            onChange={(e) => setRegisteredOfficeAddress(e.target.value)}
                            placeholder="Office address"
                            rows={3}
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors resize-none"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'company_bank' && (
                      <motion.div
                        key="company_bank"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                          Company Bank Details
                        </h3>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. Access Bank"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={bankAccountName}
                            onChange={(e) => setBankAccountName(e.target.value)}
                            placeholder="Account name for payouts"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Account Number
                          </label>
                          <input
                            type="text"
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    {activeTab === 'personal' && (
                      <motion.div
                        key="personal"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                          Personal Information
                        </h3>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Full Name (Primary Identifier)
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+234..."
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Gender
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] bg-white transition-colors"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'address' && (
                      <motion.div
                        key="address"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                          Residential Address Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              State
                            </label>
                            <input
                              type="text"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              placeholder="Lagos"
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              City
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="Ikeja"
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Street Address
                          </label>
                          <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="12, Allen Avenue, Ikeja, Lagos"
                            rows={3}
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'kin' && (
                      <motion.div
                        key="kin"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                          Next of Kin Information
                        </h3>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Next of Kin Full Name
                          </label>
                          <input
                            type="text"
                            value={kinName}
                            onChange={(e) => setKinName(e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              Next of Kin Phone
                            </label>
                            <input
                              type="tel"
                              value={kinPhone}
                              onChange={(e) => setKinPhone(e.target.value)}
                              placeholder="+234..."
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                              Relationship
                            </label>
                            <input
                              type="text"
                              value={kinRelation}
                              onChange={(e) => setKinRelation(e.target.value)}
                              placeholder="Spouse / Sibling / Parent"
                              className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'bank' && (
                      <motion.div
                        key="bank"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                          Bank Account Details
                        </h3>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. Access Bank"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={bankAccountName}
                            onChange={(e) => setBankAccountName(e.target.value)}
                            placeholder="Account name for payouts"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                            Account Number
                          </label>
                          <input
                            type="text"
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                            className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrevTab}
                  disabled={isCompanyAccount ? activeTab === 'company_info' : activeTab === 'personal'}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-gray-200 rounded-lg text-[#7F7F7F] hover:text-[#1A1A1A] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNextTab}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="w-0 sm:w-auto" />
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving || submitting}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-white border border-[#00A651]/30 hover:border-[#00A651] text-[#00A651] rounded-lg font-mono text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Draft
                </button>

                {isLastStep ? (
                  <button
                    type="button"
                    onClick={handleSubmitForApproval}
                    disabled={saving || submitting || liveCompletionPercent < 75}
                    className="flex-1 sm:flex-initial px-5 py-2 bg-[#00A651] hover:bg-[#008741] text-white rounded-lg font-mono text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Submit Profile
                  </button>
                ) : (
                  <div className="w-0 sm:w-auto" />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
