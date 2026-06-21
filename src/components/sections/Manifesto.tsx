'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';

export const Manifesto = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="manifesto" className="py-32 md:py-48 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 relative border-b border-[#7F7F7F]/20 bg-[#FFFFFF]">
      <div className="md:col-span-3 hidden md:block border-r border-[#7F7F7F]/20 pr-6">
        <RevealOnScroll direction="left" delay={0} duration={0.6}>
          <span className="font-mono text-[10px] text-[#00A651] tracking-[0.25em] block mb-4 font-semibold">
            ABOUT MANUFA
          </span>
        </RevealOnScroll>
        <RevealOnScroll direction="left" delay={0.1} duration={0.6}>
          <p className="text-xs text-[#7F7F7F] font-sans leading-relaxed mb-6">
            MANUFA FAMILY INVESTMENT LTD is a cooperative investment organization established to promote regular savings, collective investments, financial discipline, transparency, and sustainable wealth creation among members.
          </p>
        </RevealOnScroll>
        <RevealOnScroll direction="left" delay={0.2} duration={0.6}>
          <p className="text-xs text-[#7F7F7F] font-sans leading-relaxed">
            We voluntarily come together for financial growth, mutual support, and sustainable wealth creation, guided by constitutional transparency, accountability, and unity to promote the collective interest of all members.
          </p>
        </RevealOnScroll>
      </div>
      <div className="md:col-span-9 flex flex-col justify-center">
        <RevealOnScroll direction="up" delay={0} className="md:hidden">
          <span className="font-mono text-[10px] text-[#00A651] tracking-[0.25em] block mb-4 font-semibold">
            ABOUT MANUFA
          </span>
        </RevealOnScroll>

        {/* Animated accent line */}
        <motion.div
          className="w-12 h-[2px] bg-gradient-to-r from-[#00A651] to-[#FFD700] mb-6 rounded-full"
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          style={{ transformOrigin: 'left' }}
        />

        <RevealOnScroll direction="up" delay={0.15} duration={0.8}>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-light text-[#1A1A1A] leading-relaxed italic mb-4">
             &ldquo;To build a financially empowered, disciplined, and self-sustaining community through consistent savings and strategic investments.&rdquo;
          </h2>
        </RevealOnScroll>
        <RevealOnScroll direction="up" delay={0.25} duration={0.6}>
          <span className="font-mono text-[10px] text-[#00A651] tracking-widest uppercase mb-10 block font-semibold">
            — OUR VISION
          </span>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={0.35} duration={0.8}>
          <p className="font-sans text-base sm:text-lg md:text-xl font-light text-[#555555] leading-relaxed">
            To promote a culture of regular savings, collective investment, financial responsibility, and transparent management for sustainable wealth creation and economic empowerment.
          </p>
        </RevealOnScroll>
        <RevealOnScroll direction="up" delay={0.45} duration={0.6}>
          <span className="font-mono text-[10px] text-[#7F7F7F] tracking-widest uppercase mt-4 block font-semibold">
            — OUR MISSION STATEMENT
          </span>
        </RevealOnScroll>
      </div>
    </section>
  );
};
