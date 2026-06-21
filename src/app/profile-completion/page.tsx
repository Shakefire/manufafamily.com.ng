'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { 
  User, MapPin, Users, Award, 
  ChevronRight, ChevronLeft, Save, Send, Loader2, ArrowLeft, CheckCircle 
} from 'lucide-react';

type Tab = 'personal' | 'address' | 'kin' | 'beneficiary';

export default function ProfileCompletionPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Redirect users who have already submitted their profile
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

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Next of Kin states
  const [kinName, setKinName] = useState('');
  const [kinPhone, setKinPhone] = useState('');
  const [kinRelation, setKinRelation] = useState('');

  // Beneficiary states
  const [benName, setBenName] = useState('');
  const [benPhone, setBenPhone] = useState('');
  const [benRelation, setBenRelation] = useState('');

  // Populate form fields with existing profile data
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
      setBenName(profile.beneficiary_name || '');
      setBenPhone(profile.beneficiary_phone || '');
      setBenRelation(profile.beneficiary_relationship || '');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '');
    }
  }, [profile, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A651]"></div>
      </div>
    );
  }

  if (!user) return null;

  // Calculate live percentage completed
  const totalFields = 13;
  let filledFields = 0;
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
  if (benName.trim()) filledFields++;
  if (benPhone.trim()) filledFields++;
  if (benRelation.trim()) filledFields++;

  const liveCompletionPercent = Math.round((filledFields * 100) / totalFields);

  // Helper to compile form payload
  const getPayload = () => ({
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
    beneficiary_name: benName || null,
    beneficiary_phone: benPhone || null,
    beneficiary_relationship: benRelation || null,
  });

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

    // Validate required fields (all fields except beneficiary which can be optional)
    if (!fullName.trim() || !phone.trim() || !dob || !gender || !state.trim() || !city.trim() || !address.trim() || !kinName.trim() || !kinPhone.trim() || !kinRelation.trim()) {
      setError('Please fill in all Personal, Address, and Next of Kin fields before submitting.');
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

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'address', label: 'Address Details', icon: MapPin },
    { id: 'kin', label: 'Next of Kin', icon: Users },
    { id: 'beneficiary', label: 'Beneficiary', icon: Award },
  ];

  const handleNextTab = () => {
    if (activeTab === 'personal') setActiveTab('address');
    else if (activeTab === 'address') setActiveTab('kin');
    else if (activeTab === 'kin') setActiveTab('beneficiary');
  };

  const handlePrevTab = () => {
    if (activeTab === 'beneficiary') setActiveTab('kin');
    else if (activeTab === 'kin') setActiveTab('address');
    else if (activeTab === 'address') setActiveTab('personal');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
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

        {/* Completion Progress Bar */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar (Desktop) / Horizontal Tabs (Mobile) */}
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

        {/* Form Container */}
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
            {/* Form Fields Render */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
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

                    {/* Full Name */}
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
                      {/* Phone Number */}
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

                      {/* Date of Birth */}
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

                    {/* Gender */}
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
                      {/* State */}
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

                      {/* City */}
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

                    {/* Address Line */}
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

                    {/* Next of Kin Name */}
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
                      {/* Next of Kin Phone */}
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

                      {/* Relationship */}
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

                {activeTab === 'beneficiary' && (
                  <motion.div
                    key="beneficiary"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-display font-semibold text-base text-[#1A1A1A] border-b pb-2">
                      Beneficiary Details (Optional)
                    </h3>

                    {/* Beneficiary Name */}
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                        Beneficiary Full Name
                      </label>
                      <input
                        type="text"
                        value={benName}
                        onChange={(e) => setBenName(e.target.value)}
                        placeholder="Child / Business partner name"
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Beneficiary Phone */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                          Beneficiary Phone
                        </label>
                        <input
                          type="tel"
                          value={benPhone}
                          onChange={(e) => setBenPhone(e.target.value)}
                          placeholder="+234..."
                          className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                        />
                      </div>

                      {/* Relationship */}
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] uppercase tracking-wider font-semibold text-[#7F7F7F]">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={benRelation}
                          onChange={(e) => setBenRelation(e.target.value)}
                          placeholder="Son / Daughter / Partner"
                          className="w-full px-3.5 py-2 border border-gray-200 rounded-lg font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#00A651] transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions Bar */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrevTab}
                  disabled={activeTab === 'personal'}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-gray-200 rounded-lg text-[#7F7F7F] hover:text-[#1A1A1A] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>

                {activeTab !== 'beneficiary' ? (
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
                {/* Save Draft */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving || submitting}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-white border border-[#00A651]/30 hover:border-[#00A651] text-[#00A651] rounded-lg font-mono text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Draft
                </button>

                {/* Submit for Approval */}
                <button
                  type="button"
                  onClick={handleSubmitForApproval}
                  disabled={saving || submitting || liveCompletionPercent < 75}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-[#00A651] hover:bg-[#008741] text-white rounded-lg font-mono text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Submit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
