'use client';

import React, { useEffect, useState } from 'react';
import { Coins, BarChart, GraduationCap, HandHelping, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';

const servicesList = [
  {
    id: '01',
    title: 'Regular Savings',
    description: 'Promoting a disciplined savings culture among members to establish a strong financial base for collective growth.',
    bullets: ['Weekly Contributions', 'Savings Discipline', 'Financial Habits'],
    icon: Coins,
    gradient: 'from-[#00A651] to-[#00A651]',
    iconBg: 'bg-[#00A651]/10',
    iconColor: 'text-[#00A651]',
    borderHover: 'rgba(0,166,81,0.25)',
    glowColor: 'rgba(0,166,81,0.06)',
    numColor: 'text-[#00A651]/15',
  },
  {
    id: '02',
    title: 'Strategic Investments',
    description: 'Pooling resources collectively to invest in vetted, high-yield, and sustainable portfolios for maximum mutual benefit.',
    bullets: ['Capital Pooling', 'Diversified Portfolios', 'Collective Sourcing'],
    icon: BarChart,
    gradient: 'from-[#00A651] to-[#00A651]',
    iconBg: 'bg-[#00A651]/10',
    iconColor: 'text-[#00A651]',
    borderHover: 'rgba(0,166,81,0.25)',
    glowColor: 'rgba(0,166,81,0.06)',
    numColor: 'text-[#00A651]/15',
  },
  {
    id: '03',
    title: 'Financial Literacy',
    description: 'Educating and empowering members with financial planning, budget discipline, and investment decision-making skills.',
    bullets: ['Financial Literacy', 'Risk Management', 'Strategic Advisory'],
    icon: GraduationCap,
    gradient: 'from-[#00A651] to-[#00A651]',
    iconBg: 'bg-[#00A651]/10',
    iconColor: 'text-[#00A651]',
    borderHover: 'rgba(0,166,81,0.25)',
    glowColor: 'rgba(0,166,81,0.06)',
    numColor: 'text-[#00A651]/15',
  },
  {
    id: '04',
    title: 'Member Support',
    description: 'Providing financial opportunities, credit support, and investment channels for members during times of need.',
    bullets: ['Mutual Credit Support', 'Privileged Access', 'Cooperative Safety Net'],
    icon: HandHelping,
    gradient: 'from-[#00A651] to-[#00A651]',
    iconBg: 'bg-[#00A651]/10',
    iconColor: 'text-[#00A651]',
    borderHover: 'rgba(0,166,81,0.25)',
    glowColor: 'rgba(0,166,81,0.06)',
    numColor: 'text-[#00A651]/15',
  },
  {
    id: '05',
    title: 'Transparency & Trust',
    description: 'Maintaining accurate, accessible financial records and requiring collective controls for all financial dealings.',
    bullets: ['Accessible Records', 'Dual Signatories', 'Accountability Audits'],
    icon: ShieldCheck,
    gradient: 'from-[#00A651] to-[#00A651]',
    iconBg: 'bg-[#00A651]/10',
    iconColor: 'text-[#00A651]',
    borderHover: 'rgba(0,166,81,0.25)',
    glowColor: 'rgba(0,166,81,0.06)',
    numColor: 'text-[#00A651]/15',
  },
  {
    id: '06',
    title: 'Unity & Cooperation',
    description: 'Fostering mutual trust and community responsibility to resolve conflicts and work towards self-sustained community wealth.',
    bullets: ['Conflict Mediation', 'Democratic Voting', 'Strong Social Bonds'],
    icon: Users,
    gradient: 'from-[#00A651] to-[#00A651]',
    iconBg: 'bg-[#00A651]/10',
    iconColor: 'text-[#00A651]',
    borderHover: 'rgba(0,166,81,0.25)',
    glowColor: 'rgba(0,166,81,0.06)',
    numColor: 'text-[#00A651]/15',
  },
];

export const Services = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="services"
      className="py-32 md:py-40 px-6 md:px-12 relative border-b border-[#E5E7EB] overflow-hidden bg-[#F3F4F6]"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Heading */}
        <RevealOnScroll direction="up" duration={0.7}>
          <div className="flex flex-col gap-4 mb-16 max-w-3xl">
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#00A651] font-semibold">
                OUR CORE OBJECTIVES
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] font-light">
                Guiding Principles of MANUFA
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#7F7F7F] font-sans leading-relaxed">
              Established under a clear constitution, MANUFA operates with these core objectives to deliver sustainable financial growth and mutual community empowerment.
            </p>
          </div>
        </RevealOnScroll>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            const delay = shouldReduceMotion ? 0 : (index % 3) * 0.1 + Math.floor(index / 3) * 0.08;
            return (
              <RevealOnScroll key={service.id} direction="up" delay={delay} duration={0.6} className="h-full">
                <motion.div
                  className="group relative p-8 md:p-10 rounded-2xl flex flex-col justify-between h-full min-h-[440px] overflow-hidden cursor-default bg-white shadow-sm"
                  style={{
                    border: '1px solid #E8EAF0',
                  }}
                  whileHover={{
                    y: -8,
                    border: `1px solid rgba(0,166,81,0.25)`,
                    boxShadow: `0 24px 60px rgba(0,166,81,0.06)`,
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                  whileInView={isMobile ? { y: -4 } : undefined}
                >
                  {/* Top gradient accent bar */}
                  <motion.div
                    className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${service.gradient} origin-left`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.45 }}
                  />

                  <div className="space-y-6">
                    {/* Icon row */}
                    <div className="flex justify-between items-start">
                      <motion.div
                        className={`w-12 h-12 rounded-xl ${service.iconBg} ${service.iconColor} flex items-center justify-center`}
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </motion.div>

                      {/* Number chip */}
                      <span
                        className={`font-mono text-sm tracking-wider font-bold ${service.numColor}`}
                      >
                        {service.id}
                      </span>
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl text-[#1A1A1A] font-normal mb-3">
                        {service.title}
                      </h3>
                      <p className="text-[#7F7F7F] text-sm font-sans leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Bullet list */}
                    <ul className="text-xs font-mono text-[#FFD700] space-y-3 pt-4">
                      {service.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#F59E0B] font-bold">
                            ✓
                          </span>
                          <span className="text-[#374151] leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer link */}
                  <div className="mt-10 pt-6 border-t border-[#F3F4F6]">
                    <motion.a
                      href="#footer"
                      className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-semibold text-[#7F7F7F] group-hover:text-[#1A1A1A] transition-colors duration-300`}
                    >
                      Learn More
                      <motion.span
                        className="inline-block"
                        variants={{
                          initial: { x: 0 },
                          hover: { x: 4 },
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.span>
                    </motion.a>
                  </div>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
