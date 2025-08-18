/**
 * ChatProvider - Event bus and context for chat events and streaming state.
 * Manages thinking state, streaming content, and provides actions for the chat system.
 */

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { 
  ChatThinkingState, 
  StreamingState, 
  ThoughtStep, 
  ThoughtStepId, 
  ThoughtStepStatus,
  StreamChunk,
  DEFAULT_THINKING_STEPS 
} from '@/lib/chatEvents';

// Action types for the reducer
type ChatAction = 
  | { type: 'SET_THINKING_VISIBLE'; payload: boolean }
  | { type: 'SET_CAN_CANCEL'; payload: boolean }
  | { type: 'START_STEP'; payload: { id: ThoughtStepId; label?: string; toolName?: string } }
  | { type: 'COMPLETE_STEP'; payload: ThoughtStepId }
  | { type: 'FAIL_STEP'; payload: { id: ThoughtStepId; note?: string } }
  | { type: 'RESET_THINKING' }
  | { type: 'START_STREAMING'; payload: { messageId: string } }
  | { type: 'APPEND_CHUNK'; payload: StreamChunk }
  | { type: 'FINISH_STREAMING' }
  | { type: 'ERROR_STREAMING'; payload: string }
  | { type: 'RESET_STREAMING' };

interface ChatState {
  thinking: ChatThinkingState;
  streaming: StreamingState;
}

interface ChatContextValue {
  // State
  thinking: ChatThinkingState;
  streaming: StreamingState;
  
  // Thinking actions
  setThinkingVisible: (visible: boolean) => void;
  setCanCancel: (canCancel: boolean) => void;
  startStep: (id: ThoughtStepId, label?: string, meta?: { toolName?: string }) => void;
  completeStep: (id: ThoughtStepId) => void;
  failStep: (id: ThoughtStepId, note?: string) => void;
  resetThinking: () => void;
  
  // Streaming actions
  startStreaming: (messageId: string) => void;
  appendChunk: (chunk: StreamChunk) => void;
  finishStreaming: () => void;
  errorStreaming: (error: string) => void;
  resetStreaming: () => void;
  
  // Event handlers
  cancel: () => void;
  retry: () => void;
}

const initialState: ChatState = {
  thinking: {
    visible: false,
    canCancel: false,
    steps: DEFAULT_THINKING_STEPS.map(step => ({ ...step })),
    activeStep: undefined
  },
  streaming: {
    isStreaming: false,
    content: '',
    done: false
  }
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_THINKING_VISIBLE':
      return {
        ...state,
        thinking: {
          ...state.thinking,
          visible: action.payload
        }
      };
      
    case 'SET_CAN_CANCEL':
      return {
        ...state,
        thinking: {
          ...state.thinking,
          canCancel: action.payload
        }
      };
      
    case 'START_STEP': {
      const { id, label, toolName } = action.payload;
      const now = Date.now();
      
      return {
        ...state,
        thinking: {
          ...state.thinking,
          activeStep: id,
          steps: state.thinking.steps.map(step => {
            if (step.id === id) {
              return {
                ...step,
                status: 'active' as ThoughtStepStatus,
                startedAt: now,
                label: label || step.label,
                toolName
              };
            }
            return step;
          })
        }
      };
    }
    
    case 'COMPLETE_STEP': {
      const now = Date.now();
      
      return {
        ...state,
        thinking: {
          ...state.thinking,
          steps: state.thinking.steps.map(step => {
            if (step.id === action.payload) {
              return {
                ...step,
                status: 'done' as ThoughtStepStatus,
                endedAt: now
              };
            }
            return step;
          })
        }
      };
    }
    
    case 'FAIL_STEP': {
      const { id, note } = action.payload;
      const now = Date.now();
      
      return {
        ...state,
        thinking: {
          ...state.thinking,
          steps: state.thinking.steps.map(step => {
            if (step.id === id) {
              return {
                ...step,
                status: 'error' as ThoughtStepStatus,
                endedAt: now,
                note
              };
            }
            return step;
          })
        }
      };
    }
    
    case 'RESET_THINKING':
      return {
        ...state,
        thinking: {
          ...initialState.thinking,
          steps: DEFAULT_THINKING_STEPS.map(step => ({ ...step }))
        }
      };
      
    case 'START_STREAMING':
      return {
        ...state,
        streaming: {
          isStreaming: true,
          messageId: action.payload.messageId,
          content: '',
          done: false
        }
      };
      
    case 'APPEND_CHUNK':
      return {
        ...state,
        streaming: {
          ...state.streaming,
          content: state.streaming.content + action.payload.delta,
          done: action.payload.done || false,
          error: action.payload.error
        }
      };
      
    case 'FINISH_STREAMING':
      return {
        ...state,
        streaming: {
          ...state.streaming,
          isStreaming: false,
          done: true
        }
      };
      
    case 'ERROR_STREAMING':
      return {
        ...state,
        streaming: {
          ...state.streaming,
          isStreaming: false,
          error: action.payload,
          done: true
        }
      };
      
    case 'RESET_STREAMING':
      return {
        ...state,
        streaming: { ...initialState.streaming }
      };
      
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export interface ChatProviderProps {
  children: ReactNode;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function ChatProvider({ children, onCancel, onRetry }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  // Thinking actions
  const setThinkingVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_THINKING_VISIBLE', payload: visible });
  }, []);
  
  const setCanCancel = useCallback((canCancel: boolean) => {
    dispatch({ type: 'SET_CAN_CANCEL', payload: canCancel });
  }, []);
  
  const startStep = useCallback((id: ThoughtStepId, label?: string, meta?: { toolName?: string }) => {
    dispatch({ 
      type: 'START_STEP', 
      payload: { id, label, toolName: meta?.toolName } 
    });
  }, []);
  
  const completeStep = useCallback((id: ThoughtStepId) => {
    dispatch({ type: 'COMPLETE_STEP', payload: id });
  }, []);
  
  const failStep = useCallback((id: ThoughtStepId, note?: string) => {
    dispatch({ type: 'FAIL_STEP', payload: { id, note } });
  }, []);
  
  const resetThinking = useCallback(() => {
    dispatch({ type: 'RESET_THINKING' });
  }, []);
  
  // Streaming actions
  const startStreaming = useCallback((messageId: string) => {
    dispatch({ type: 'START_STREAMING', payload: { messageId } });
  }, []);
  
  const appendChunk = useCallback((chunk: StreamChunk) => {
    dispatch({ type: 'APPEND_CHUNK', payload: chunk });
  }, []);
  
  const finishStreaming = useCallback(() => {
    dispatch({ type: 'FINISH_STREAMING' });
  }, []);
  
  const errorStreaming = useCallback((error: string) => {
    dispatch({ type: 'ERROR_STREAMING', payload: error });
  }, []);
  
  const resetStreaming = useCallback(() => {
    dispatch({ type: 'RESET_STREAMING' });
  }, []);
  
  // Event handlers
  const cancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);
  
  const retry = useCallback(() => {
    onRetry?.();
  }, [onRetry]);
  
  const contextValue: ChatContextValue = {
    thinking: state.thinking,
    streaming: state.streaming,
    setThinkingVisible,
    setCanCancel,
    startStep,
    completeStep,
    failStep,
    resetThinking,
    startStreaming,
    appendChunk,
    finishStreaming,
    errorStreaming,
    resetStreaming,
    cancel,
    retry
  };
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}