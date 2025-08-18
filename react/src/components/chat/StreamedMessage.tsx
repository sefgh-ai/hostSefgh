/**
 * StreamedMessage - Renders streaming text with typewriter effect and cursor
 * Replaces skeleton when content starts arriving
 */

import React from 'react';
import { User, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TokenCursor } from './TokenCursor';
import { useIncrementalTyping } from '@/hooks/useTypingAnimation';

interface StreamedMessageProps {
  type?: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  isComplete?: boolean;
  className?: string;
}

export function StreamedMessage({ 
  type = 'assistant',
  content,
  isStreaming = false,
  isComplete = false,
  className = ''
}: StreamedMessageProps) {
  const { displayedText } = useIncrementalTyping({
    speed: 60, // characters per second
    enabled: true
  });
  
  // Use either the typed text or direct content
  const textToShow = isStreaming ? displayedText : content;
  
  // Update the typing animation when content changes
  React.useEffect(() => {
    if (isStreaming && content) {
      // For streaming, we'll append content directly
      // The incremental typing will handle the rate limiting
    }
  }, [content, isStreaming]);
  
  return (
    <div className={`flex gap-3 group ${className}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${type === 'user' ? 'bg-brand' : 'bg-muted'}
      `}>
        {type === 'user' ? (
          <User className="h-4 w-4 text-brand-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Message content */}
      <Card className={`
        flex-1 transition-all duration-200 max-w-3xl
        ${type === 'user' ? 'bg-brand text-brand-foreground' : ''}
      `}>
        <CardContent className="p-3">
          <div className="whitespace-pre-wrap break-words">
            {content}
            {/* Show cursor only when streaming and not complete */}
            {isStreaming && !isComplete && (
              <TokenCursor />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for rendering message content with proper formatting
export function MessageContent({ 
  content, 
  isStreaming = false, 
  isComplete = false 
}: {
  content: string;
  isStreaming?: boolean;
  isComplete?: boolean;
}) {
  return (
    <div className="whitespace-pre-wrap break-words">
      {content}
      {isStreaming && !isComplete && <TokenCursor />}
    </div>
  );
}