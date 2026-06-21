'use client';

import React, { useRef } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Coins,
  Vote,
  TrendingUp,
} from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useInView,
} from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';

/* ─── Step Data ─────────────────────────────────────────────── */
const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Register as a Member',
    description:
      'Submit your membership application and provide basic personal details. Membership is open to any individual approved by the organization.',
    accent: 'Onboarding',
    color: '#00A651',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Complete Profile Verification',
    description:
      'Confirm your identity, provide your Next-of-Kin or beneficiary details, and agree to abide by the MANUFA Constitution and its governing articles.',
    accent: 'Verification',
    color: '#FFD700',
  },
  {
    num: '03',
    icon: Coins,
    title: 'Make Weekly Contributions',
    description:
      'Consistently contribute your agreed weekly savings on or before the designated contribution date to build your share pool and avoid penalties.',
    accent: 'Savings',
    color: '#FFEB3B',
  },
  {
    num: '04',
    icon: Vote,
    title: 'Participate in Investment Decisions',
    description:
      'Vote on investment proposals in monthly meetings. All investment decisions are made collectively — no officer can act without member approval.',
    accent: 'Governance',
    color: '#00A651',
  },
  {
    num: '05',
    icon: TrendingUp,
    title: 'Earn from Investment Returns',
    description:
      'Receive proportional profit distributions based on your total contributions and share ownership. A portion is retained for reinvestment and emergency reserves.',
    accent: 'Wealth Growth',
    color: '#FFD700',
  },
];

/* ─── Connector Line ─────────────────────────────────────────── */
const Connector: React.FC<{ inView: boolean; delay: number }> = ({ inView, delay }) => (
  <div className="hidden lg:flex items-center justify-center flex-1 px-2">
    <motion.div
      className="h-[2px] w-full bg-gradient-to-r from-[#00A651]/60 to-[#FFD700]/30 rounded-full origin-left"
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    />
  </div>
);

/* ─── Step Card ──────────────────────────────────────────────── */
const StepCard: React.FC<{
  step: (typeof steps)[number];
  index: number;
  inView: boolean;
}> = ({ step, index, inView }) => {
  const Icon = step.icon;
  const delay = index * 0.12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: delay + 0.2 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group relative flex flex-col items-center text-center lg:items-start lg:text-left"
    >
      {/* Glow halo on hover */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${step.color}10 0%, transparent 70%)`,
        }}
      />

      {/* Step number badge + connector anchor */}
      <div className="relative mb-6 flex flex-col items-center lg:items-start">
        {/* Animated ring */}
        <div className="relative">
          <motion.div
            className="absolute -inset-3 rounded-full border border-[#00A651]/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.35 }}
          />
          <motion.div
            className="absolute -inset-6 rounded-full border border-[#00A651]/10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.45 }}
          />

          {/* Icon circle */}
          <motion.div
            className="relative w-16 h-16 rounded-full flex items-center justify-center border border-[#7F7F7F]/20 bg-[#FFFFFF] group-hover:border-[#00A651]/50 transition-all duration-300"
            style={{
              boxShadow: `0 0 0 0 ${step.color}00`,
            }}
            whileHover={{
              boxShadow: `0 0 0 8px ${step.color}15`,
            }}
          >
            <motion.div
              animate={inView ? { rotate: [0, -8, 8, 0] } : {}}
              transition={{ duration: 0.6, delay: delay + 0.6 }}
            >
              <Icon
                className="w-6 h-6 transition-colors duration-300 group-hover:text-[#00A651]"
                style={{ color: '#1A1A1A' }}
                strokeWidth={1.5}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Step number pill */}
        <motion.span
          className="mt-4 font-mono text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border"
          style={{
            color: step.color,
            borderColor: `${step.color}40`,
            backgroundColor: `${step.color}08`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.4, delay: delay + 0.55 }}
        >
          STEP {step.num}
        </motion.span>
      </div>

      {/* Text content */}
      <motion.div
        className="space-y-2 max-w-[200px]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.65 }}
      >
        <h3 className="font-sans text-base font-semibold text-[#1A1A1A] tracking-tight leading-snug group-hover:text-[#00A651] transition-colors duration-300">
          {step.title}
        </h3>
        <p className="text-[#7F7F7F] text-xs font-sans leading-relaxed">
          {step.description}
        </p>
      </motion.div>

      {/* Bottom accent line */}
      <motion.div
        className="mt-5 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }}
        initial={{ width: 0 }}
        animate={inView ? { width: 32 } : { width: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.75 }}
      />
    </motion.div>
  );
};

/* ─── Section ────────────────────────────────────────────────── */
export const HowItWorks: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 md:py-44 px-6 md:px-12 bg-[#FFFFFF] border-b border-[#7F7F7F]/20 overflow-hidden"
    >
      {/* Subtle dot-grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #00A651 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Decorative blurred orbs */}
      <motion.div
        className="absolute top-1/3 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0, 166, 81, 0.07) 0%, transparent 70%)' }}
        animate={shouldReduceMotion ? {} : { x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)' }}
        animate={shouldReduceMotion ? {} : { x: [0, 15, 0], y: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <RevealOnScroll direction="up" delay={0} duration={0.7}>
          <div className="flex flex-col gap-3 mb-20 md:mb-28 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-px bg-[#00A651]" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#00A651] font-semibold">
                MEMBER JOURNEY
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-light leading-tight">
              How It Works
            </h2>
            <p className="text-sm text-[#7F7F7F] font-sans leading-relaxed">
              Five structured steps from registration to earning — built on transparency,
              discipline, and collective decision-making.
            </p>
          </div>
        </RevealOnScroll>

        {/* ── Steps row: desktop horizontal layout ── */}
        <div className="hidden lg:flex items-start gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className="flex-1 min-w-0">
                <StepCard step={step} index={i} inView={inView} />
              </div>
              {i < steps.length - 1 && (
                <Connector inView={inView} delay={i * 0.12 + 0.55} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Steps: mobile vertical layout ── */}
        <div className="lg:hidden flex flex-col gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const delay = i * 0.1;
            return (
              <motion.div
                key={step.num}
                className="group relative flex gap-5 pb-10"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: delay + 0.2 }}
              >
                {/* Left: icon + vertical connector */}
                <div className="flex flex-col items-center shrink-0">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-[#7F7F7F]/20 bg-[#FFFFFF] group-hover:border-[#00A651]/50 transition-all duration-300 shrink-0"
                    whileHover={{ scale: 1.08 }}
                  >
                    <Icon
                      className="w-5 h-5 group-hover:text-[#00A651] transition-colors duration-300"
                      style={{ color: '#1A1A1A' }}
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  {i < steps.length - 1 && (
                    <motion.div
                      className="w-[2px] flex-1 mt-2 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${step.color}80, ${steps[i + 1].color}30)`,
                        minHeight: '40px',
                      }}
                      initial={{ scaleY: 0, originY: 0 }}
                      animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.5, delay: delay + 0.5 }}
                    />
                  )}
                </div>

                {/* Right: text */}
                <div className="pt-1 pb-2 space-y-1.5">
                  <span
                    className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: step.color }}
                  >
                    Step {step.num}
                  </span>
                  <h3 className="font-sans text-base font-semibold text-[#1A1A1A] leading-snug group-hover:text-[#00A651] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-[#7F7F7F] text-xs font-sans leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom CTA strip ── */}
        <RevealOnScroll direction="up" delay={0.5} duration={0.7}>
          <div className="mt-20 pt-10 border-t border-[#7F7F7F]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="font-sans text-sm text-[#7F7F7F] leading-relaxed max-w-md">
              Ready to begin your journey toward financial empowerment? Join hundreds of members building wealth together.
            </p>
            <motion.a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-mono text-[10px] uppercase tracking-widest font-bold bg-[#00A651] text-[#FFFFFF] hover:bg-[#008741] transition-all duration-300 whitespace-nowrap shrink-0 shadow-lg"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Your Journey →
            </motion.a>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
