'use client';

import React, { useEffect, useState } from 'react';
import { Link2, Users, Handshake, Lightbulb, ShieldCheck, Globe } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';

const advantages = [
  {
    num: '01',
    label: 'OUR STRENGTH',
    icon: ShieldCheck,
    title: 'Financial Security',
    description:
      'All cooperative funds are kept in a recognized financial institution, with all withdrawals requiring dual-signature controls for asset security.',
    tag: 'Protected Sinking Fund',
  },
  {
    num: '02',
    label: 'OUR LEADERS',
    icon: Users,
    title: 'Cooperative Leadership',
    description:
      "Managed democratically by elected Chairperson, Secretary, Treasurer, and an Investment Committee committed to members' best interests.",
    tag: 'Elected Governance',
  },
  {
    num: '03',
    label: 'OUR APPROACH',
    icon: Handshake,
    title: 'Member-First Philosophy',
    description:
      'Every investment proposal is discussed and voted on collectively, maintaining complete transparency and equal opportunities.',
    tag: 'Democratic Voting',
  },
  {
    num: '04',
    label: 'OUR SYSTEM',
    icon: Link2,
    title: 'Accountability Audits',
    description:
      'Records of all weekly contributions, penalties, and yields are properly documented, transparent, and accessible to members at all times.',
    tag: 'Open Books Policy',
  },
  {
    num: '05',
    label: 'OUR COMMITMENT',
    icon: Lightbulb,
    title: 'Mutual Support',
    description:
      'Providing financial opportunities, emergency resource reserves, and cooperative credits to help members build economic independence.',
    tag: 'Mutual Safety Net',
  },
  {
    num: '06',
    label: 'OUR POLICY',
    icon: Globe,
    title: 'Strategic Diversification',
    description:
      'Pooling resources into diversified, low-risk portfolios vetted through careful research and due diligence to minimize financial risks.',
    tag: 'Low Risk Portfolios',
  },
];

export const Process = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="process" className="relative border-b border-[#E5E7EB] overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* ── LEFT: Dark anchored panel ───────────────────────────── */}
        <div className="lg:w-[38%] bg-[#0d1511] px-10 py-24 lg:sticky lg:top-0 lg:self-start lg:h-screen flex flex-col justify-between">

          <div className="flex flex-col justify-center flex-1 space-y-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-[#00A651]" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#00A651] font-semibold">
                Cooperative Values
              </span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-white font-light leading-[1.2]">
                Why members<br />trust MANUFA
              </h2>
            </div>

            {/* Body */}
            <p className="text-white/45 text-sm font-sans leading-relaxed max-w-sm">
              We combine financial discipline, democratic decision-making, and structured savings
              to deliver sustainable wealth creation and economic empowerment for every member.
            </p>

            {/* Divider */}
            <div className="w-10 h-px bg-[#00A651]/40" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-4xl font-black text-[#00A651] leading-none">6</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/35 mt-2">
                  Core Principles
                </p>
              </div>
              <div>
                <p className="font-mono text-4xl font-black text-white leading-none">100%</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/35 mt-2">
                  Transparency
                </p>
              </div>
            </div>
          </div>

          {/* Bottom constitution note */}
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest leading-relaxed mt-12">
            Established under a formal constitution &amp; governed collectively by elected officers.
          </p>
        </div>

        {/* ── RIGHT: Light scrolling card grid ───────────────────── */}
        <div className="lg:w-[62%] bg-[#F3F4F6] px-8 md:px-12 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-fr">
            {advantages.map((adv, index) => {
              const Icon = adv.icon;
              const delay = shouldReduceMotion ? 0 : index * 0.08;
              return (
                <RevealOnScroll
                  key={adv.num}
                  direction="up"
                  delay={delay}
                  duration={0.5}
                >
                  <motion.div
                    className="group relative bg-white border border-[#E8EAF0] rounded-2xl p-7 flex flex-col justify-between h-[320px] overflow-hidden cursor-default"
                    whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.07)', borderColor: 'rgba(0,166,81,0.25)', transition: { duration: 0.25 } }}
                  >
                    {/* Ghost number — typographic texture */}
                    <span
                      className="pointer-events-none select-none absolute -bottom-5 -right-1 font-mono font-black leading-none text-[7rem] text-[#F0F2F5] group-hover:text-[#E8F5EE] transition-colors duration-500"
                      aria-hidden
                    >
                      {adv.num}
                    </span>

                    {/* Top accent line */}
                    <motion.div
                      className="absolute top-0 left-6 right-6 h-[2px] bg-[#00A651] origin-left rounded-b"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Card body */}
                    <div className="relative z-10 space-y-4">
                      {/* Icon row */}
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] group-hover:bg-[#00A651]/10 flex items-center justify-center transition-colors duration-300">
                          <Icon
                            className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#00A651] transition-colors duration-300"
                            strokeWidth={1.5}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-[#00A651] tracking-[0.2em] uppercase font-semibold">
                          {adv.label}
                        </span>
                      </div>

                      {/* Text */}
                      <div>
                        <h3 className="font-sans text-[15px] font-bold text-[#111827] tracking-tight mb-2 leading-snug">
                          {adv.title}
                        </h3>
                        <p className="text-[13px] text-[#6B7280] font-sans leading-relaxed">
                          {adv.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer tag */}
                    <div className="relative z-10 mt-6 pt-5 border-t border-[#F3F4F6]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF] group-hover:text-[#00A651] transition-colors duration-300 font-semibold">
                        {adv.tag}
                      </span>
                    </div>
                  </motion.div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
