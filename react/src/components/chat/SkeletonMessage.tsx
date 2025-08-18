/**
 * SkeletonMessage - Loading skeleton with shimmer effect
 * Shows before content arrives during streaming
 */

import React from 'react';
import { User, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SkeletonMessageProps {
  type?: 'user' | 'assistant';
  className?: string;
}

export function SkeletonMessage({ 
  type = 'assistant', 
  className = '' 
}: SkeletonMessageProps) {
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

      {/* Message skeleton */}
      <Card className={`
        flex-1 transition-all duration-200 max-w-3xl
        ${type === 'user' ? 'bg-brand text-brand-foreground' : ''}
      `}>
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Shimmer lines */}
            <div className="skeleton h-4 w-3/4 animate-pulse" />
            <div className="skeleton h-4 w-1/2 animate-pulse" />
            <div className="skeleton h-4 w-5/6 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}