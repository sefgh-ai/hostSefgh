/**
 * useThinkingState - Simple hook for managing thinking animation state
 * Provides isThinking boolean and start/stop functions for triggering thinking animations
 */

import { useState } from 'react';

interface UseThinkingStateReturn {
  isThinking: boolean;
  startThinking: () => void;
  stopThinking: () => void;
}

export function useThinkingState(): UseThinkingStateReturn {
  const [isThinking, setIsThinking] = useState(false);

  const startThinking = () => {
    setIsThinking(true);
  };

  const stopThinking = () => {
    setIsThinking(false);
  };

  return {
    isThinking,
    startThinking,
    stopThinking,
  };
}