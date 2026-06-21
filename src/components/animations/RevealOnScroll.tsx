'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealOnScrollProps {
  children: React.ReactNode;
  /** Direction the element slides in from. Default: 'up' */
  direction?: Direction;
  /** Animation delay in seconds. Default: 0 */
  delay?: number;
  /** Animation duration in seconds. Default: 0.6 */
  duration?: number;
  /** Fraction of element in viewport to trigger. Default: 0.15 */
  amount?: number;
  /** Additional className on the wrapper div */
  className?: string;
  /** Whether to only animate once. Default: true */
  once?: boolean;
  /** Distance to travel in pixels. Default: 40 */
  distance?: number;
}

const directionOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':    return { x: 0, y: distance };
    case 'down':  return { x: 0, y: -distance };
    case 'left':  return { x: distance, y: 0 };
    case 'right': return { x: -distance, y: 0 };
    case 'none':  return { x: 0, y: 0 };
  }
};

/**
 * Reusable scroll-reveal wrapper.
 * Wraps children in a `motion.div` that fades + slides into view.
 */
export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  amount = 0.15,
  className = '',
  once = true,
  distance = 40,
}) => {
  const offset = directionOffset(direction, distance);

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
