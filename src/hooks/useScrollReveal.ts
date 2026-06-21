'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'motion/react';

interface UseScrollRevealOptions {
  /** Fraction of element that must be visible (0–1). Default: 0.2 */
  amount?: number;
  /** Fire only once. Default: true */
  once?: boolean;
  /** Root margin string (CSS format). Default: '0px' */
  margin?: string;
}

/**
 * Lightweight scroll-reveal hook that wraps Motion's `useInView`
 * and automatically respects `prefers-reduced-motion`.
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { amount = 0.2, once = true, margin = '0px' } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isInView = useInView(ref, {
    once,
    amount,
    margin: margin as `${number}px ${number}px ${number}px ${number}px`,
  });

  return {
    ref,
    isInView: prefersReduced ? true : isInView,
    prefersReduced,
  };
}
