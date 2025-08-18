/**
 * ThinkingAnimation - Advanced thinking animation component with bouncing dots and typing animation
 * Features smooth Framer Motion transitions, glowing effects, and card-style container
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThinkingAnimationProps {
  className?: string;
  visible?: boolean;
}

export function ThinkingAnimation({ className = '', visible = true }: ThinkingAnimationProps) {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Generating Answer...';

  // Typing animation effect
  useEffect(() => {
    if (!visible) {
      setTypedText('');
      return;
    }

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80); // Typing speed

    return () => clearInterval(typingInterval);
  }, [visible, fullText]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0.0, 0.2, 1] // Custom easing for smooth animation
        }}
        className={`thinking-animation ${className}`}
      >
        <div className="bg-card border border-border rounded-lg shadow-lg p-6 mx-auto max-w-md">
          <div className="flex items-center space-x-4">
            {/* Bouncing Dots */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full shadow-lg"
                  style={{
                    boxShadow: '0 0 10px hsla(var(--primary), 0.6)', // Glowing effect
                  }}
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: [0.42, 0, 0.58, 1], // Smooth bounce
                  }}
                />
              ))}
            </div>

            {/* Thinking Text */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-muted-foreground"
              >
                Thinking...
              </motion.div>
            </div>
          </div>

          {/* Typing Animation */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="text-xs text-muted-foreground flex items-center">
              <span className="mr-2">💭</span>
              <span className="font-mono">
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 bg-muted rounded-full h-1 overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              style={{
                boxShadow: '0 0 8px hsla(var(--primary), 0.4)',
              }}
              animate={{
                width: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}