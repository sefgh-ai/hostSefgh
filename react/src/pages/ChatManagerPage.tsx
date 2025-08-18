/**
 * ChatManagerPage - Full page wrapper for the ChatManager component
 * Provides the comprehensive chat experience with all features
 */

import React from 'react';
import { ChatManager } from '@/components/chat/ChatManager';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function ChatManagerPage() {
  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        <ChatManager className="flex-1" />
      </div>
    </TooltipProvider>
  );
}