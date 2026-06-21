'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { name: 'About', href: '/#manifesto' },
  { name: 'Objectives', href: '/#services' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Join Us', href: '/register' },
  { name: 'Terms & Conditions', href: '/terms' },
];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Setup intersection observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the intersection entry that is currently intersecting
        // with the largest intersection ratio if multiple are on screen
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' } 
    );

    // Observe all sections
    navLinks.forEach((link) => {
      const id = link.href.includes('#') ? link.href.split('#').pop() : '';
      if (id) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { y: -100, opacity: 0 }}
      animate={mounted ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-[#7F7F7F]/20 py-3 shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#FFFFFF]/90 backdrop-blur-sm border-[#7F7F7F]/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          onClick={() => {
            if (pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              router.push('/');
            }
          }}
          className="flex items-center gap-3 cursor-pointer origin-left"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={mounted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="flex items-center"
          >
            <img src="/company-logo.jpeg" alt="MANUFA Logo" className="h-14 w-auto object-contain" />
          </motion.div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks
            .filter((link) => link.name !== 'Join Us' || !user)
            .map((link) => {
              const linkId = link.href.includes('#') ? link.href.split('#').pop() : '';
              const isActive = link.href === '/terms' 
                ? pathname === '/terms' 
                : (pathname === '/' && !!linkId && activeSection === linkId);
              return (
                <a
                  key={link.name}
                  href={link.href}
                className={`relative font-mono uppercase text-[10px] tracking-widest font-medium transition-colors duration-200 ease-out flex items-center gap-1.5 group ${
                  isActive ? 'text-[#00A651]' : 'text-[#7F7F7F] hover:text-[#1A1A1A]'
                }`}
              >
                {link.name}
                <span className={`transition-all duration-200 ease-out ${isScrolled ? 'opacity-100 max-w-[10px]' : 'opacity-0 max-w-0 overflow-hidden'} ${isActive ? 'text-[#00A651]' : 'text-[#7F7F7F] group-hover:text-[#1A1A1A]'}`}>
                  ↗
                </span>
                {/* Animated underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#00A651] transition-all duration-200 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1.5 rounded border border-[#7F7F7F]/20 text-[#1A1A1A] hover:text-[#00A651] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          {user ? (
            <div className="hidden md:flex items-center gap-4 animate-fadeIn">
              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="font-mono text-[9px] uppercase tracking-widest font-semibold text-[#00A651] hover:text-[#008741] transition-colors"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                href="/dashboard"
                className="font-mono text-[9px] uppercase tracking-widest font-semibold text-[#1A1A1A] hover:text-[#00A651] transition-colors"
              >
                Dashboard
              </Link>
              <motion.button
                onClick={() => signOut()}
                className="px-4 py-1.5 border border-red-500 rounded-full font-mono text-[9px] uppercase tracking-widest font-semibold text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 ease-out cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Out
              </motion.button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="font-mono text-[9px] uppercase tracking-widest font-semibold text-[#00A651] hover:text-[#008741] transition-colors"
              >
                Sign In
              </Link>
              <motion.a
                href="/register"
                className="px-4 py-1.5 border border-[#00A651] rounded-full font-mono text-[9px] uppercase tracking-widest font-semibold text-[#00A651] hover:bg-[#00A651] hover:text-[#FFFFFF] transition-all duration-200 ease-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Become a Member
              </motion.a>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-[#FFFFFF] border-b border-[#7F7F7F]/20 overflow-hidden shadow-2xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="px-6 py-6 flex flex-col gap-4 text-xs font-mono tracking-widest text-[#7F7F7F] uppercase">
              {navLinks
                .filter((link) => link.name !== 'Join Us' || !user)
                .map((link, i) => {
                  const linkId = link.href.includes('#') ? link.href.split('#').pop() : '';
                  const isActive = link.href === '/terms' 
                    ? pathname === '/terms' 
                    : (pathname === '/' && !!linkId && activeSection === linkId);
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className={`py-1.5 flex items-center justify-between transition-colors ${isActive ? 'text-[#00A651]' : 'hover:text-[#1A1A1A]'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      {link.name}
                      <span className={`${isActive ? 'text-[#00A651]' : 'text-[#7F7F7F]'}`}>
                        ↗
                      </span>
                    </motion.a>
                  );
                })}
              
              {user ? (
                <>
                  {profile?.role === 'admin' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Link
                        href="/admin"
                        className="py-2 flex items-center justify-between hover:text-[#1A1A1A]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Portal <span>⚙️</span>
                      </Link>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <Link
                      href="/dashboard"
                      className="py-2 flex items-center justify-between hover:text-[#1A1A1A]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard <span>📊</span>
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="py-2 mt-2 text-center text-[#FFFFFF] font-bold bg-red-500 rounded cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Link
                      href="/login"
                      className="py-2 flex items-center justify-between text-[#00A651] hover:text-[#008741] font-bold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In <span>🔑</span>
                    </Link>
                  </motion.div>
                  <motion.a
                    href="/register"
                    className="py-2 mt-2 text-center text-[#FFFFFF] font-bold bg-[#00A651] rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    Become a Member
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
