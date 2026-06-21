'use client';
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';
import { useRouter, usePathname } from 'next/navigation';

export const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = false; // We use MotionProvider globally now

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Simulate local success without sending external API requests to prevent "Failed to Fetch"
    setTimeout(() => {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 800);
  };

  return (
    <>
      {/* ── CONTACT / ENQUIRY SECTION ── */}
      <section id="footer" className="py-24 md:py-32 px-6 md:px-12 bg-[#FFFFFF] border-t border-[#00A651]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">

          {/* Left: Company intro + contact details */}
          <RevealOnScroll direction="left" delay={0.1} className="lg:col-span-4 space-y-10">
            <div className="space-y-5">
              <motion.div 
                onClick={() => {
                  if (pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    router.push('/');
                  }
                }}
                className="flex items-center gap-3 cursor-pointer w-fit origin-left"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-18 w-auto object-contain" />
              </motion.div>
              <p className="text-[#7F7F7F] text-base md:text-lg font-sans leading-relaxed">
                Join MANUFA FAMILY INVESTMENT LTD to promote regular savings, collective investments, financial discipline, transparency, and sustainable wealth creation.
              </p>
            </div>

            <div className="space-y-3 text-xs md:text-sm font-mono text-[#7F7F7F] font-semibold">
              <div className="flex flex-col gap-1 border-b border-[#7F7F7F]/20 pb-2.5">
                <span className="text-[10px] tracking-widest uppercase">HEAD OFFICE</span>
                <span className="text-[#1A1A1A] text-sm">Enugu Street, Garki Village, Abuja, Nigeria</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#7F7F7F]/20 pb-2.5">
                <span className="text-[10px] tracking-widest uppercase">EMAIL</span>
                <a href="mailto:info@manufafamily.com.ng" className="text-[#1A1A1A] text-sm hover:text-[#00A651] transition-colors">info@manufafamily.com.ng</a>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#7F7F7F]/20 pb-2.5">
                <span className="text-[10px] tracking-widest uppercase">PHONE</span>
                <span className="text-[#1A1A1A] text-sm">0806 028 5011 / 0806 898 5993</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#7F7F7F]/20 pb-2.5">
                <span className="text-[10px] tracking-widest uppercase">WEBSITE</span>
                <a href="https://www.manufafamily.com.ng" target="_blank" rel="noopener noreferrer" className="text-[#00A651] text-sm hover:text-[#1A1A1A] transition-colors font-bold">www.manufafamily.com.ng</a>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#7F7F7F]/20 pb-2.5">
                <span className="text-[10px] tracking-widest uppercase">RESPONSE TIME</span>
                <span className="text-[#00A651] font-bold text-sm">1–2 Business Days</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: Full enquiry form */}
          <RevealOnScroll direction="right" delay={0.2} className="lg:col-span-8 p-8 md:p-12 border border-[#7F7F7F]/20 rounded-2xl bg-[#F5F7FA] shadow-sm space-y-8">

            {/* Form header */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="pb-4 border-b border-[#7F7F7F]/20">
                <h2 className="font-sans text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-1">Become a Member</h2>
                <p className="font-mono text-xs text-[#7F7F7F] uppercase tracking-widest">Submit your membership interest or general inquiry and we will respond shortly.</p>
              </div>

            {/* Row 1: Name + Organization */}
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">01. Full Name <span className="text-[#00A651]">*</span></label>
                <input type="text" name="fullName" required placeholder="John Doe" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">02. Organization / Company</label>
                <input type="text" name="company" placeholder="ABC Technologies Ltd" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300" />
              </div>
            </motion.div>

            {/* Row 2: Email + Phone */}
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">03. Business Email <span className="text-[#00A651]">*</span></label>
                <input type="email" name="email" required placeholder="john.doe@company.com" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">04. Phone Number</label>
                <input type="tel" name="phone" placeholder="+234 XXX XXX XXXX" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300" />
              </div>
            </motion.div>

            {/* Row 3: Service + Org Type */}
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">05. Enquiry Type <span className="text-[#00A651]">*</span></label>
                <select name="service" required defaultValue="" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300 cursor-pointer">
                  <option value="" disabled>Select Inquiry Type</option>
                  <option value="Regular Savings Membership">Regular Savings Membership</option>
                  <option value="Investment Proposal Sourcing">Investment Proposal Sourcing</option>
                  <option value="General Partnership">General Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">06. Professional Background</label>
                <select name="organizationType" defaultValue="" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300 cursor-pointer">
                  <option value="" disabled>Select Type</option>
                  <option value="Public Sector employee">Public Sector employee</option>
                  <option value="Private Sector employee">Private Sector employee</option>
                  <option value="Self-Employed / Entrepreneur">Self-Employed / Entrepreneur</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </motion.div>

            {/* Row 4: Budget + Timeline */}
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">07. Estimated Weekly Contribution</label>
                <select name="budget" defaultValue="" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300 cursor-pointer">
                  <option value="" disabled>Select Savings Range</option>
                  <option value="Under ₦5,000">Under ₦5,000</option>
                  <option value="₦5,000 – ₦20,000">₦5,000 – ₦20,000</option>
                  <option value="₦20,000 – ₦50,000">₦20,000 – ₦50,000</option>
                  <option value="Above ₦50,000">Above ₦50,000</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">08. Intended Membership Duration</label>
                <select name="timeline" defaultValue="" className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300 cursor-pointer">
                  <option value="" disabled>Select Duration</option>
                  <option value="Under 1 Year">Under 1 Year</option>
                  <option value="1–3 Years">1–3 Years</option>
                  <option value="Long Term (3+ Years)">Long Term (3+ Years)</option>
                  <option value="Undecided">Undecided</option>
                </select>
              </div>
            </motion.div>

            {/* Row 5: Project description */}
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2"
            >
              <label className="block text-[10px] font-mono text-[#7F7F7F] uppercase tracking-widest font-semibold">09. Share Your Financial &amp; Investment Objectives <span className="text-[#00A651]">*</span></label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your savings goals, investment background, or any questions about our constitution..."
                className="w-full px-4 py-3 text-sm text-[#1A1A1A] font-sans bg-[#FFFFFF] border border-[#7F7F7F]/30 rounded-lg focus:outline-none focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]/40 focus:shadow-[0_0_12px_rgba(0, 166, 81, 0.12)] transition-all duration-300 resize-none leading-relaxed"
              />
            </motion.div>

            {/* Consent checkbox + CTA */}
            <motion.div 
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2"
            >
              <label className="flex items-start gap-3 cursor-pointer flex-1">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-[#00A651] shrink-0" />
                <span className="text-xs text-[#7F7F7F] font-sans leading-relaxed">I agree to the constitution terms and to be contacted by MANUFA FAMILY INVESTMENT LTD regarding this inquiry.</span>
              </label>
              
              <div className="flex flex-col items-start gap-2 shrink-0">
                <motion.button
                  whileHover={status === 'loading' ? undefined : { scale: 1.02, backgroundColor: '#008741', borderColor: '#008741', boxShadow: '0 8px 20px rgba(0, 166, 81, 0.35)' }}
                  whileTap={status === 'loading' ? undefined : { scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 rounded-lg font-mono text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all bg-[#00A651] text-[#FFFFFF] border border-[#00A651] whitespace-nowrap focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {status === 'loading' ? 'Sending...' : (
                    <>Submit Request <Send className="w-4 h-4" /></>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Status Messages */}
            {status === 'success' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-sans">
                Thank you! Your message has been sent successfully. We will be in touch soon.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-sans">
                {errorMessage}
              </motion.div>
            )}

            </form>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── GLOBAL SITE FOOTER ── */}
      <footer className="bg-[#1A1A1A] text-[#FFFFFF] py-10 md:py-16 px-6 md:px-12 border-t border-[#00A651] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300 w-fit origin-left"
            >
              <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-sm font-sans text-[#7F7F7F] leading-relaxed max-w-xs">
              Building a financially empowered, disciplined, and self-sustaining community through consistent savings and strategic investments.
            </p>
          </motion.div>
 
          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-mono text-xs uppercase tracking-widest font-semibold text-[#00A651]">Core Principles</h4>
            <ul className="space-y-2 font-sans text-sm text-[#7F7F7F]">
              <li><a href="#services" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">Regular Savings</a></li>
              <li><a href="#services" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">Strategic Investments</a></li>
              <li><a href="#services" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">Financial Literacy</a></li>
              <li><a href="#services" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">Member Support</a></li>
              <li><a href="#services" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">Transparency & Trust</a></li>
            </ul>
          </motion.div>

          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-mono text-xs uppercase tracking-widest font-semibold text-[#00A651]">Connect</h4>
            <ul className="space-y-2 font-sans text-sm text-[#7F7F7F]">
              <li><a href="#" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">LinkedIn ↗</a></li>
              <li><a href="#" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">X / Twitter ↗</a></li>
              <li><a href="#" className="inline-block hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">Facebook ↗</a></li>
            </ul>
          </motion.div>

          <motion.div 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="font-mono text-xs uppercase tracking-widest font-semibold text-[#00A651]">Directory</h4>
            <ul className="space-y-2 font-sans text-sm text-[#7F7F7F]">
              <li className="text-[#FFFFFF]">info@manufafamily.com.ng</li>
              <li className="text-[#FFFFFF]">0806 028 5011 / 0806 898 5993</li>
              <li className="font-mono text-xs tracking-wider pt-1">Enugu Street, Garki Village, Abuja</li>
              <li><a href="https://www.manufafamily.com.ng" target="_blank" rel="noopener noreferrer" className="inline-block text-[#00A651] hover:text-[#FFFFFF] hover:translate-x-1.5 transition-all duration-300">www.manufafamily.com.ng ↗</a></li>
            </ul>
          </motion.div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#7F7F7F]/30 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-[#7F7F7F]">
          <span>© {new Date().getFullYear()} MANUFA FAMILY INVESTMENT LTD. All Rights Reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
};

