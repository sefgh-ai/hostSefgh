/**
 * TokenCursor - Soft blinking cursor for streaming text
 * Respects reduced motion preferences
 */

import React from 'react';
import { motion } from 'framer-motion';

interface TokenCursorProps {
  className?: string;
}

export function TokenCursor({ className = '' }: TokenCursorProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Static cursor for reduced motion
    return (
      <span 
        className={`inline-block w-0.5 h-4 bg-primary/70 ml-0.5 ${className}`}
        aria-hidden="true"
      />
    );
  }
  
  return (
    <motion.span
      className={`inline-block w-0.5 h-4 bg-primary/70 ml-0.5 ${className}`}
      animate={{ 
        opacity: [1, 0.3, 1] 
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      aria-hidden="true"
    />
  );
}