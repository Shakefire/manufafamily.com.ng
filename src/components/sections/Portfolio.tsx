'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { RevealOnScroll } from '../animations/RevealOnScroll';

const projects = [
  {
    title: 'Structured Weekly Savings',
    context: 'SAVINGS & DISCIPLINE',
    label: 'Consistent savings growth',
    category: 'savings',
    case: 'RULE_01',
    height: 'h-72',
    margin: '',
    image1: '/structured weekly savings.png',
  },
  {
    title: 'Upholding Financial Discipline',
    context: 'SAVINGS & DISCIPLINE',
    label: 'Instilling habits for growth',
    category: 'savings',
    case: 'RULE_02',
    height: 'h-64',
    margin: 'md:translate-y-6',
    image1: '/financial discipline.jpg',
  },
  {
    title: 'Collective Investment Deals',
    context: 'INVESTMENTS',
    label: 'Pooling resources for high yields',
    category: 'investments',
    case: 'RULE_03',
    height: 'h-72',
    margin: '',
    image1: '/collecttive investeement deals.webp',
  },
  {
    title: 'Transparent Profit Sharing',
    context: 'INVESTMENTS',
    label: 'Proportional dividend distributions',
    category: 'investments',
    case: 'RULE_04',
    height: 'h-64',
    margin: 'md:translate-y-6',
    image1: '/transparent profit sharing.avif',
  },
  {
    title: 'Transparent Accountability',
    context: 'TRUST & COMMUNITY',
    label: 'Open records & dual signatories',
    category: 'governance',
    case: 'RULE_05',
    height: 'h-72',
    margin: 'md:pt-8',
    image1: '/transparent-accountability.jpg',
  },
  {
    title: 'Strong Community Support',
    context: 'TRUST & COMMUNITY',
    label: 'Fostering mutual trust & unity',
    category: 'governance',
    case: 'RULE_06',
    height: 'h-64',
    margin: 'md:translate-y-6',
    image1: '/community support.jpg',
  }
];

export const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardVariants = {
    hidden: shouldReduceMotion ? {} : { opacity: 0, y: 40 },
    visible: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
    hover: shouldReduceMotion ? {} : { 
      y: -8,
      borderColor: 'rgba(0, 166, 81, 0.3)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
    }
  };

  const matchesFilter = (category: string) => {
    if (activeFilter === 'all') return true;
    return category === activeFilter;
  };

  const filtered = projects.filter((p) => matchesFilter(p.category));
  const col1 = filtered.filter((_, idx) => idx % 2 === 0);
  const col2 = filtered.filter((_, idx) => idx % 2 === 1);

  const filterOptions = [
    { id: 'all', label: 'All Benefits' },
    { id: 'savings', label: 'Savings & Discipline' },
    { id: 'investments', label: 'Investments' },
    { id: 'governance', label: 'Trust & Community' }
  ];

  return (
    <section id="portfolio" className="py-32 md:py-40 px-6 md:px-12 space-y-12 md:space-y-16 relative bg-[#FFFFFF] border-b border-[#7F7F7F]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <RevealOnScroll direction="up" delay={0.1}>
            <div className="space-y-2">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#00A651] font-semibold">
                COOPERATIVE ADVANTAGES
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] font-light">
                Why Join MANUFA?
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" delay={0.2}>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-widest uppercase relative z-10">
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className="relative px-3 py-1.5 rounded font-semibold transition-colors uppercase focus:outline-none"
                >
                  {activeFilter === f.id && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-[#F5F7FA] rounded -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={activeFilter === f.id ? 'text-[#1A1A1A]' : 'text-[#7F7F7F] hover:text-[#1A1A1A]'}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          {/* Column 1 */}
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {col1.map((project, index) => (
                <motion.div
                  layout={!shouldReduceMotion}
                  key={project.title}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView={isMobile ? ['visible', 'hover'] : 'visible'}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.15 }}
                  whileHover="hover"
                  className={`p-4 rounded-xl border border-[#7F7F7F]/20 cursor-crosshair group ${project.margin} bg-[#F5F7FA] relative`}
                >
                  <div className={`relative w-full ${project.height} rounded border border-[#7F7F7F]/20 overflow-hidden flex flex-col items-center justify-center bg-[#FFFFFF]`}>
                    <motion.div 
                      className="absolute inset-8 bg-contain bg-center bg-no-repeat opacity-85" 
                      style={{ backgroundImage: `url('${project.image1}')` }}
                      variants={{
                        initial: { scale: 1, opacity: 0.85 },
                        hover: { scale: 1.08, opacity: 1 }
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-[#FFFFFF]/10 pointer-events-none transition-all"
                      variants={{
                        initial: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                        hover: { backgroundColor: 'rgba(255, 255, 255, 0)' }
                      }}
                    />
                    
                    <motion.div 
                      variants={{
                        initial: { opacity: 0, y: 15, scale: 0.9, rotate: -2 },
                        hover: { opacity: 1, y: 0, scale: 1, rotate: 0 }
                      }}
                      initial="initial"
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="z-10 px-3 py-1.5 rounded text-center backdrop-blur-sm border bg-[#FFFFFF]/90 border-[#7F7F7F]/20 space-y-1 shadow-sm absolute pointer-events-none"
                    >
                      <span className="font-mono text-[10px] uppercase font-semibold tracking-widest text-[#1A1A1A]">{project.label}</span>
                    </motion.div>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-[#00A651] tracking-widest uppercase font-semibold">{project.context}</span>
                      <h3 className="font-serif text-lg text-[#1A1A1A] font-light mt-1">{project.title}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-[#7F7F7F] border border-[#7F7F7F]/30 rounded px-2 py-0.5 bg-[#FFFFFF] font-semibold">{project.case}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Column 2 */}
          <div className="space-y-12 md:pt-16">
            <AnimatePresence mode="popLayout">
              {col2.map((project, index) => (
                <motion.div
                  layout={!shouldReduceMotion}
                  key={project.title}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView={isMobile ? ['visible', 'hover'] : 'visible'}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.15 + 0.1 }}
                  whileHover="hover"
                  className={`p-4 rounded-xl border border-[#7F7F7F]/20 cursor-crosshair group ${project.margin} bg-[#F5F7FA] relative`}
                >
                  <div className={`relative w-full ${project.height} rounded border border-[#7F7F7F]/20 overflow-hidden flex flex-col items-center justify-center bg-[#FFFFFF]`}>
                    <motion.div 
                      className="absolute inset-8 bg-contain bg-center bg-no-repeat opacity-85" 
                      style={{ backgroundImage: `url('${project.image1}')` }}
                      variants={{
                        initial: { scale: 1, opacity: 0.85 },
                        hover: { scale: 1.08, opacity: 1 }
                      }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    />
                    <motion.div 
                      className="absolute inset-0 bg-[#FFFFFF]/10 pointer-events-none transition-all"
                      variants={{
                        initial: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                        hover: { backgroundColor: 'rgba(255, 255, 255, 0)' }
                      }}
                    />
                    
                    <motion.div 
                      variants={{
                        initial: { opacity: 0, y: 15, scale: 0.9, rotate: -2 },
                        hover: { opacity: 1, y: 0, scale: 1, rotate: 0 }
                      }}
                      initial="initial"
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="z-10 px-3 py-1.5 rounded text-center backdrop-blur-sm border bg-[#FFFFFF]/90 border-[#7F7F7F]/20 space-y-1 shadow-sm absolute pointer-events-none"
                    >
                      <span className="font-mono text-[10px] uppercase font-semibold tracking-widest text-[#1A1A1A]">{project.label}</span>
                    </motion.div>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[9px] text-[#00A651] tracking-widest uppercase font-semibold">{project.context}</span>
                      <h3 className="font-serif text-lg text-[#1A1A1A] font-light mt-1">{project.title}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-[#7F7F7F] border border-[#7F7F7F]/30 rounded px-2 py-0.5 bg-[#FFFFFF] font-semibold">{project.case}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

