'use client';

import React from 'react';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, CheckCircle2, User, Lock, Eye } from 'lucide-react';

const membershipRules = [
  "Membership is subject to approval.",
  "Weekly contributions are mandatory.",
  "Late payments may attract penalties.",
  "Persistent default may result in suspension or termination.",
  "Investment decisions are collective.",
  "Profit sharing shall follow approved organizational policies.",
  "Members must attend meetings except where valid reasons are provided.",
  "Members shall maintain respectful conduct.",
  "Fraud, misconduct, or actions that damage the reputation of the organization may result in disciplinary action.",
  "Members agree to comply with all provisions of the Constitution.",
  "Members acknowledge that refunds and withdrawals shall be governed by the organization's Exit Policy.",
  "Members authorize the organization to maintain records of contributions, investments, and profit allocations.",
  "Members shall nominate a beneficiary or next of kin.",
  "The organization may amend its Constitution through approved procedures."
];

const privacyPolicies = [
  {
    title: "1. Information We Collect",
    icon: User,
    desc: "We collect personal and financial information necessary for membership administration. This includes your full name, contact information, professional background, weekly contribution estimates, and beneficiary or next of kin nominations."
  },
  {
    title: "2. How We Use Your Information",
    icon: FileText,
    desc: "Your data is used solely to maintain accurate records of weekly savings, process collective investment profit sharing, facilitate secure voting on investment proposals, and maintain member verification status."
  },
  {
    title: "3. Data Protection & Security",
    icon: Lock,
    desc: "We implement robust security measures to prevent unauthorized access, modification, or disclosure of members' financial transactions and profile data. Access is strictly limited to authorized administrators."
  },
  {
    title: "4. Disclosure to Third Parties",
    icon: Eye,
    desc: "MANUFA does not sell, trade, or share your personal info with third parties, except where required by law to maintain registration or comply with regulatory audits."
  }
];

export default function TermsPage() {
  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1A1A1A] selection:bg-[#00A651] selection:text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <div className="bg-[#F5F7FA] border-b border-[#7F7F7F]/20 py-20 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#00A651_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="max-w-4xl mx-auto relative z-10 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00A651] font-bold">
              MANUFA Legal Center
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-light leading-tight">
              Terms & Conditions
            </h1>
            <p className="font-mono text-xs text-[#7F7F7F] uppercase tracking-wider">
              Terms and Conditions to Read and Accept Before Joining
            </p>
          </div>
        </div>

        {/* Contents */}
        <div className="max-w-4xl mx-auto px-6 mt-16 space-y-20">
          
          {/* Part 1: Membership Agreement */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-[#7F7F7F]/20">
              <div className="w-10 h-10 rounded-xl bg-[#00A651]/10 flex items-center justify-center text-[#00A651]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sans text-xl md:text-2xl font-semibold text-[#1A1A1A]">
                  Membership Agreement
                </h2>
                <p className="font-mono text-[10px] text-[#7F7F7F] uppercase tracking-wider mt-0.5">
                  Core rules of membership engagement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipRules.map((rule, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.03 }}
                  className="flex gap-3 p-4 border border-[#7F7F7F]/10 rounded-xl bg-[#F5F7FA]/30 hover:border-[#00A651]/30 hover:bg-[#FFFFFF] transition-all duration-300 group"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="font-sans text-sm text-[#52525B] leading-relaxed">
                    {rule}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Part 2: Privacy Policy */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-[#7F7F7F]/20">
              <div className="w-10 h-10 rounded-xl bg-[#00A651]/10 flex items-center justify-center text-[#00A651]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sans text-xl md:text-2xl font-semibold text-[#1A1A1A]">
                  Privacy Policy
                </h2>
                <p className="font-mono text-[10px] text-[#7F7F7F] uppercase tracking-wider mt-0.5">
                  Data protection & usage regulations
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privacyPolicies.map((policy, idx) => {
                const Icon = policy.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-6 border border-[#7F7F7F]/10 rounded-xl bg-[#FFFFFF] space-y-3"
                  >
                    <div className="flex items-center gap-3 text-[#00A651]">
                      <div className="w-8 h-8 rounded-lg bg-[#00A651]/10 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-sans text-base font-semibold text-[#1A1A1A]">
                        {policy.title}
                      </h3>
                    </div>
                    <p className="font-sans text-sm text-[#7F7F7F] leading-relaxed">
                      {policy.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
