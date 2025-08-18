/**
 * useStreamSSE - Generic SSE/Fetch streaming hook with AbortController
 * Handles server-sent events or fetch-based streaming with proper cancellation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { StreamChunk } from '@/lib/chatEvents';

interface UseStreamSSEOptions {
  onChunk?: (chunk: StreamChunk) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

interface StreamState {
  isStreaming: boolean;
  error: string | null;
  chunks: StreamChunk[];
  content: string;
}

export function useStreamSSE(options: UseStreamSSEOptions = {}) {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    error: null,
    chunks: [],
    content: ''
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const { onChunk, onError, onComplete } = options;
  
  const startStream = useCallback(async (
    endpoint: string, 
    payload: Record<string, unknown> = {}
  ) => {
    // Cleanup any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setState({
      isStreaming: true,
      error: null,
      chunks: [],
      content: ''
    });
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('Response body is not readable');
      }
      
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process complete lines (for SSE format)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            // Try to parse as JSON
            let data: StreamChunk;
            
            if (line.startsWith('data: ')) {
              // SSE format
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') {
                setState(prev => ({ ...prev, isStreaming: false }));
                onComplete?.();
                return;
              }
              data = JSON.parse(jsonStr);
            } else {
              // Direct JSON
              data = JSON.parse(line);
            }
            
            // Update state with new chunk
            setState(prev => ({
              ...prev,
              chunks: [...prev.chunks, data],
              content: prev.content + data.delta
            }));
            
            // Call chunk handler
            onChunk?.(data);
            
            // Check if stream is done
            if (data.done) {
              setState(prev => ({ ...prev, isStreaming: false }));
              onComplete?.();
              return;
            }
            
          } catch (parseError) {
            console.warn('Failed to parse stream chunk:', line, parseError);
            // Continue processing other chunks
          }
        }
      }
      
      // Stream completed
      setState(prev => ({ ...prev, isStreaming: false }));
      onComplete?.();
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Stream was cancelled
          setState(prev => ({ ...prev, isStreaming: false }));
          return;
        }
        
        const errorMessage = error.message || 'Stream failed';
        setState(prev => ({ 
          ...prev, 
          isStreaming: false, 
          error: errorMessage 
        }));
        onError?.(errorMessage);
      } else {
        const errorMessage = 'Unknown stream error';
        setState(prev => ({ 
          ...prev, 
          isStreaming: false, 
          error: errorMessage 
        }));
        onError?.(errorMessage);
      }
    }
  }, [onChunk, onError, onComplete]);
  
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  }, []);
  
  const reset = useCallback(() => {
    cancelStream();
    setState({
      isStreaming: false,
      error: null,
      chunks: [],
      content: ''
    });
  }, [cancelStream]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return {
    ...state,
    startStream,
    cancelStream,
    reset
  };
}

// Helper hook for simulating streaming (for testing/development)
export function useSimulatedStream(options: UseStreamSSEOptions = {}) {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    error: null,
    chunks: [],
    content: ''
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onChunk, onError, onComplete } = options;
  
  const startSimulation = useCallback((
    content: string, 
    messageId: string = 'sim-' + Date.now(),
    chunkDelay: number = 50
  ) => {
    setState({
      isStreaming: true,
      error: null,
      chunks: [],
      content: ''
    });
    
    const words = content.split(' ');
    let currentIndex = 0;
    
    const sendNextChunk = () => {
      if (currentIndex >= words.length) {
        // Send final chunk
        const finalChunk: StreamChunk = {
          id: messageId,
          delta: '',
          done: true
        };
        
        setState(prev => ({
          ...prev,
          isStreaming: false,
          chunks: [...prev.chunks, finalChunk]
        }));
        
        onChunk?.(finalChunk);
        onComplete?.();
        return;
      }
      
      const word = words[currentIndex];
      const delta = currentIndex === 0 ? word : ' ' + word;
      
      const chunk: StreamChunk = {
        id: messageId,
        delta,
        done: false
      };
      
      setState(prev => ({
        ...prev,
        chunks: [...prev.chunks, chunk],
        content: prev.content + delta
      }));
      
      onChunk?.(chunk);
      currentIndex++;
      
      timeoutRef.current = setTimeout(sendNextChunk, chunkDelay);
    };
    
    // Start sending chunks
    timeoutRef.current = setTimeout(sendNextChunk, chunkDelay);
  }, [onChunk, onComplete]);
  
  const cancelSimulation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(prev => ({ ...prev, isStreaming: false }));
  }, []);
  
  const reset = useCallback(() => {
    cancelSimulation();
    setState({
      isStreaming: false,
      error: null,
      chunks: [],
      content: ''
    });
  }, [cancelSimulation]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    ...state,
    startStream: startSimulation,
    cancelStream: cancelSimulation,
    reset
  };
}