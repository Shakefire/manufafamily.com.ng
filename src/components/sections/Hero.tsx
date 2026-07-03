'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedCounter } from '../animations/AnimatedCounter';
import { createClient } from '@/utils/supabase/client';

const HERO_IMAGES = ['/1.png', '/2.jpg'];
const INTERVAL_MS = 4000; // each image shows for 4 s

const stagger = (i: number) => ({ delay: 0.15 + i * 0.12 });

export const Hero = () => {
  const [active, setActive] = useState(0);
  const [memberCount, setMemberCount] = useState(500);
  const supabase = createClient();


  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMemberCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (error) {
        console.error('Failed to load approved member count:', error);
        return;
      }

      if (typeof count === 'number') {
        setMemberCount(count);
      }
    };

    void fetchMemberCount();
  }, [supabase]);

  const lineVariant = {
    hidden: { opacity: 0, y: 35 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.15 + i * 0.12,
      },
    }),
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-[#FFFFFF]">
      {/* Subtle dot-grid background */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle,_#1A1A1A_1px,_transparent_1px)] [background-size:40px_40px]" />

      {/* Decorative slow floating gradient elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-[#00A651]/6 to-[#FFD700]/2 blur-3xl -z-10 pointer-events-none"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#FFD700]/4 to-[#FFEB3B]/2 blur-3xl -z-10 pointer-events-none"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center py-12 relative z-10">

        {/* ── Left column: Text ── */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-3">
            <motion.div
              className="flex flex-col gap-2"
              variants={lineVariant}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-px bg-[#00A651]" />
                <span className="font-mono text-[10px] text-[#7F7F7F] tracking-[0.25em] uppercase font-semibold">
                  MANUFA FAMILY INVESTMENT LTD
                </span>
              </div>
              <div className="flex items-center gap-2 pl-8">
                <span className="inline-block w-2 h-2 rounded-full bg-[#00A651]" />
                <span className="font-mono text-xs sm:text-sm text-[#00A651] tracking-wider font-bold">
                  Since February 1st, 2023
                </span>
              </div>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] font-light tracking-tight leading-[1.2] flex flex-col gap-1.5">
              <span className="block overflow-hidden py-0.5">
                <motion.span
                  className="block"
                  variants={lineVariant}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  Building a Financially
                </motion.span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <motion.span
                  className="block italic font-light text-[#00A651]"
                  variants={lineVariant}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  Empowered &amp; Disciplined
                </motion.span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <motion.span
                  className="block"
                  variants={lineVariant}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  Self-Sustaining Community.
                </motion.span>
              </span>
            </h1>
          </div>

          <motion.p
            className="font-sans text-[#7F7F7F] text-xs sm:text-sm max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.75 }}
          >
            Building a financially empowered, disciplined, and self-sustaining community through consistent savings and strategic investments. We promote regular savings, collective investment opportunities, and transparent wealth management for long-term growth.
          </motion.p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <motion.a
              href="/register"
              className="px-5 py-2.5 rounded text-xs tracking-widest font-mono uppercase bg-[#00A651] text-[#FFFFFF] hover:bg-[#008741] transition-colors flex items-center gap-2 font-semibold shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Become a Member <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
            <motion.a
              href="#manifesto"
              className="px-5 py-2.5 rounded text-xs tracking-widest font-mono uppercase border border-[#7F7F7F]/40 text-[#1A1A1A] hover:bg-[#F5F7FA] transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
            </motion.a>
          </div>

          {/* Metrics bar */}
          <motion.div
            className="grid grid-cols-3 gap-4 pt-6 border-t border-[#7F7F7F]/20 max-w-md"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15 }}
          >
            <div>
              <span className="block font-mono text-[10px] text-[#7F7F7F] uppercase tracking-widest">Members Joined</span>
              <AnimatedCounter target={memberCount} suffix="+ Active" className="text-xs text-[#1A1A1A] font-semibold tracking-tight font-display" duration={2} />
            </div>
            <div>
              <span className="block font-mono text-[10px] text-[#7F7F7F] uppercase tracking-widest">Savings Cycle</span>
              <span className="block text-xs text-[#1A1A1A] font-semibold tracking-tight font-display mt-0.5">Weekly / Monthly</span>
            </div>
            <div>
              <span className="block font-mono text-[10px] text-[#7F7F7F] uppercase tracking-widest">Investments</span>
              <AnimatedCounter target={5} suffix="+ Portfolios" className="text-xs text-[#1A1A1A] font-semibold tracking-tight font-display" duration={1.5} />
            </div>
          </motion.div>

          </div>
        {/* ── Right column: animated image panel ── */}
        {/* ── Right column: animated image panel ── */}
        <motion.div
          className="md:col-span-5 relative hidden md:block pr-2 lg:pr-4"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          {/* Fixed-height container — both images share this space */}
          <div className="relative h-[560px] w-full rounded-sm border border-[#7F7F7F]/20 shadow-xl overflow-hidden bg-[#FFFFFF]">

            {/* Static background fallback of the previous image to prevent background bleed-through during crossfade */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_IMAGES[(active - 1 + HERO_IMAGES.length) % HERO_IMAGES.length]}')` }}
            />

            <AnimatePresence>
              <motion.div
                key={active}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${HERO_IMAGES[active]}')` }}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </AnimatePresence>

            {/* Bottom gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/55 via-transparent to-transparent pointer-events-none" />

            {/* Corner label */}
            <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-widest text-[#FFFFFF] uppercase bg-[#1A1A1A]/60 backdrop-blur-sm px-2 py-1 rounded">
              Cooperative Savings
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === active
                      ? 'w-4 h-1.5 bg-[#00A651]'
                      : 'w-1.5 h-1.5 bg-[#FFFFFF]/50 hover:bg-[#FFFFFF]'
                  }`}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
