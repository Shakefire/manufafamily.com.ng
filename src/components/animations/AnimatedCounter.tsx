'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react';

interface AnimatedCounterProps {
  /** Target number to count up to */
  target: number;
  /** Suffix appended after the number (e.g. "+") */
  suffix?: string;
  /** Prefix before the number */
  prefix?: string;
  /** Duration in seconds. Default: 2 */
  duration?: number;
  /** Additional className */
  className?: string;
}

/**
 * Animated counter that counts from 0 to `target` when scrolled into view.
 * Uses Motion's spring-based animation for a smooth feel.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      motionValue.set(target);
      return;
    }

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
    });

    return controls.stop;
  }, [isInView, target, duration, motionValue, shouldReduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};
