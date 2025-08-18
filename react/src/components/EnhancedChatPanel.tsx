/**
 * Enhanced ChatPanel with thinking system integration
 * Wraps the existing ChatPanel with minimal modifications
 */

import React, { useRef, useState } from 'react';
import { ChatProvider } from '@/providers/ChatProvider';
import { ChatPanel } from './ChatPanel';
import { ThinkingAnimation } from './ThinkingAnimation';
import { ThoughtTimeline, useThoughtTimeline } from './chat/ThoughtTimeline';
import { useChat } from '@/providers/ChatProvider';
import { useSimulatedStream } from '@/hooks/useStreamSSE';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface EnhancedChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEditMessage: (id: string, newContent: string) => void;
  onDeleteMessage: (id: string) => void;
  onRegenerateResponse: (id: string) => void;
  onToggleGithubSearch?: () => void;
  onOpenCanvas?: () => void;
  onCancelMessage?: () => void;
  isLoading: boolean;
  canCancelLoading?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
  enableThinking?: boolean; // New prop to enable/disable thinking system
}

export function EnhancedChatPanel(props: EnhancedChatPanelProps) {
  const { enableThinking = false, ...chatPanelProps } = props;
  
  if (!enableThinking) {
    // Return original ChatPanel if thinking is disabled
    return <ChatPanel {...chatPanelProps} />;
  }
  
  return (
    <ChatProvider
      onCancel={() => {
        props.onCancelMessage?.();
        console.log('Thinking process cancelled');
      }}
      onRetry={() => {
        console.log('Retry requested');
      }}
    >
      <EnhancedChatPanelInner {...chatPanelProps} />
    </ChatProvider>
  );
}

function EnhancedChatPanelInner(props: Omit<EnhancedChatPanelProps, 'enableThinking'>) {
  const [enhancedMessages, setEnhancedMessages] = useState(props.messages);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  
  const {
    thinking,
    streaming,
    setThinkingVisible,
    setCanCancel,
    startStep,
    completeStep,
    startStreaming,
    appendChunk,
    finishStreaming,
    resetThinking,
    resetStreaming
  } = useChat();
  
  const { isVisible: timelineVisible, toggle: toggleTimeline } = useThoughtTimeline();
  
  const simulatedStream = useSimulatedStream({
    onChunk: (chunk) => {
      appendChunk(chunk);
      // Update the message content in real-time
      setEnhancedMessages(prev => prev.map(msg => 
        msg.id === currentStreamingId 
          ? { ...msg, content: streaming.content }
          : msg
      ));
    },
    onComplete: () => {
      finishStreaming();
      completeStep('finalize');
      
      // Hide thinking bar after completion
      setTimeout(() => {
        setThinkingVisible(false);
        resetThinking();
        setCurrentStreamingId(null);
      }, 600);
    }
  });
  
  // Enhanced message sending with thinking process
  const handleSendMessage = async (message: string) => {
    // Call original handler
    props.onSendMessage(message);
    
    // Start thinking process for the expected assistant response
    setTimeout(async () => {
      const assistantMessageId = `assistant-${Date.now()}`;
      setCurrentStreamingId(assistantMessageId);
      
      // Reset previous state
      resetThinking();
      resetStreaming();
      
      // Start thinking process
      setThinkingVisible(true);
      setCanCancel(true);
      
      // Simulate thinking steps
      await simulateThinkingProcess(assistantMessageId);
    }, 100);
  };
  
  const simulateThinkingProcess = async (messageId: string) => {
    try {
      // Step 1: Understanding
      startStep('understand', 'Understanding your request...');
      await delay(400);
      completeStep('understand');
      
      // Step 2: Planning
      startStep('plan', 'Planning response...');
      await delay(600);
      completeStep('plan');
      
      // Step 3: Searching
      startStep('retrieve', 'Searching knowledge...', { toolName: 'github' });
      await delay(800);
      completeStep('retrieve');
      
      // Step 4: Composing - start streaming
      startStep('compose', 'Composing answer...');
      startStreaming(messageId);
      
      // Start simulated response
      const response = "Based on your question, I've searched through relevant information and can provide you with a comprehensive answer. This response demonstrates the thinking process visualization system working seamlessly with the existing chat interface.";
      
      simulatedStream.startStream(response, messageId, 40);
      
      // Complete compose step
      await delay(200);
      completeStep('compose');
      
      // Start finalize step
      startStep('finalize', 'Finalizing response...');
      
    } catch (error) {
      console.error('Thinking simulation error:', error);
    }
  };
  
  // Sync props.messages with enhanced messages
  React.useEffect(() => {
    setEnhancedMessages(props.messages);
  }, [props.messages]);
  
  return (
    <div className="flex flex-col h-full relative">
      {/* Thinking overlay */}
      {thinking.visible && (
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <ThinkingAnimation visible={thinking.visible} />
          {timelineVisible && (
            <div className="mt-3 ml-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3">
              <ThoughtTimeline visible={timelineVisible} />
            </div>
          )}
        </div>
      )}
      
      {/* Original ChatPanel with enhanced handlers */}
      <div style={{
        paddingTop: thinking.visible ? '120px' : '0px',
        transition: 'padding-top 0.3s ease'
      }}>
        <ChatPanel 
          {...props}
          messages={enhancedMessages}
          onSendMessage={handleSendMessage}
        />
      </div>
      
      {/* Timeline toggle button */}
      {thinking.visible && (
        <div className="absolute bottom-20 right-4 z-20">
          <button
            onClick={toggleTimeline}
            className="bg-card border border-border rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-card-foreground transition-colors shadow-lg"
          >
            {timelineVisible ? 'Hide' : 'Show'} Timeline
          </button>
        </div>
      )}
    </div>
  );
}

// Utility function for delays
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}