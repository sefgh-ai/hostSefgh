/**
 * useTypingAnimation - Typewriter effect hook with reduced motion support
 * Provides a controlled typing effect that respects user preferences
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypingAnimationOptions {
  speed?: number; // Characters per second (default: 50)
  enabled?: boolean; // Allow disabling the effect
  onComplete?: () => void;
}

interface TypingState {
  displayedText: string;
  isTyping: boolean;
  currentIndex: number;
}

export function useTypingAnimation(
  targetText: string = '',
  options: UseTypingAnimationOptions = {}
) {
  const { speed = 50, enabled = true, onComplete } = options;
  const [state, setState] = useState<TypingState>({
    displayedText: '',
    isTyping: false,
    currentIndex: 0
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const startTyping = useCallback(() => {
    if (!enabled || prefersReducedMotion || !targetText) {
      // If typing is disabled or reduced motion is preferred, show full text immediately
      setState({
        displayedText: targetText,
        isTyping: false,
        currentIndex: targetText.length
      });
      onComplete?.();
      return;
    }
    
    setState(prev => ({
      ...prev,
      isTyping: true,
      currentIndex: 0,
      displayedText: ''
    }));
    
    startTimeRef.current = Date.now();
    
    const typeNextChar = () => {
      setState(prev => {
        const elapsed = Date.now() - (startTimeRef.current || 0);
        const targetIndex = Math.min(
          Math.floor((elapsed / 1000) * speed),
          targetText.length
        );
        
        if (targetIndex >= targetText.length) {
          // Typing complete
          onComplete?.();
          return {
            displayedText: targetText,
            isTyping: false,
            currentIndex: targetText.length
          };
        }
        
        // Continue typing
        rafRef.current = requestAnimationFrame(typeNextChar);
        
        return {
          ...prev,
          displayedText: targetText.slice(0, targetIndex),
          currentIndex: targetIndex
        };
      });
    };
    
    rafRef.current = requestAnimationFrame(typeNextChar);
  }, [targetText, speed, enabled, prefersReducedMotion, onComplete]);
  
  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      isTyping: false
    }));
  }, []);
  
  const reset = useCallback(() => {
    stopTyping();
    setState({
      displayedText: '',
      isTyping: false,
      currentIndex: 0
    });
  }, [stopTyping]);
  
  const skipToEnd = useCallback(() => {
    stopTyping();
    setState({
      displayedText: targetText,
      isTyping: false,
      currentIndex: targetText.length
    });
    onComplete?.();
  }, [targetText, stopTyping, onComplete]);
  
  // Auto-start typing when targetText changes
  useEffect(() => {
    if (targetText) {
      reset();
      // Small delay to ensure smooth transition
      timeoutRef.current = setTimeout(startTyping, 50);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [targetText, startTyping, reset]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return {
    ...state,
    startTyping,
    stopTyping,
    reset,
    skipToEnd
  };
}

// Hook for incremental text updates (for streaming)
export function useIncrementalTyping(options: UseTypingAnimationOptions = {}) {
  const { speed = 60, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const bufferRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const appendText = useCallback((newText: string) => {
    bufferRef.current += newText;
    
    if (!enabled || prefersReducedMotion) {
      // Show immediately if animations are disabled
      setDisplayedText(bufferRef.current);
      return;
    }
    
    // Rate-limited typing
    const now = Date.now();
    const minInterval = 1000 / speed; // milliseconds per character
    
    if (now - lastUpdateRef.current >= minInterval) {
      setDisplayedText(bufferRef.current);
      lastUpdateRef.current = now;
    } else {
      // Schedule update
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setIsTyping(true);
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(bufferRef.current);
        setIsTyping(false);
        lastUpdateRef.current = Date.now();
      }, minInterval - (now - lastUpdateRef.current));
    }
  }, [speed, enabled, prefersReducedMotion]);
  
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    bufferRef.current = '';
    setDisplayedText('');
    setIsTyping(false);
    lastUpdateRef.current = 0;
  }, []);
  
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setDisplayedText(bufferRef.current);
    setIsTyping(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    displayedText,
    isTyping,
    appendText,
    reset,
    flush
  };
}