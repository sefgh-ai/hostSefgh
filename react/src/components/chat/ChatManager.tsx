/**
 * ChatManager - Central component for managing chat sessions, history, and state
 * Handles the comprehensive chat system with persistence, sharing, and animations
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Share2, 
  Download,
  History,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  X
} from 'lucide-react';
import { ChatService, Message, ChatSession } from '@/services/chatService';
import { HistoryPanel } from '@/components/panels/HistoryPanel';
import { ChatPanel } from '@/components/ChatPanel';
import { useToast } from '@/hooks/use-toast';
import { useThinkingState } from '@/hooks/useThinkingState';

interface ChatManagerProps {
  className?: string;
  initialView?: 'chat' | 'history';
  onViewChange?: (view: 'chat' | 'history') => void;
  onOpenWorkbench?: () => void;
}

export function ChatManager({ className = '', initialView = 'chat', onViewChange, onOpenWorkbench }: ChatManagerProps) {
  // Core state
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'history'>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search and UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);
  
  // Hooks
  const { toast } = useToast();
  const { isThinking, startThinking, stopThinking } = useThinkingState();
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat sessions on mount
  useEffect(() => {
    loadChatSessions();
  }, []);

  // Update internal view state when initialView prop changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Auto-save current session when messages change
  useEffect(() => {
    if (currentMessages.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        saveCurrentSession();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [currentMessages, isLoading]);

  // Notify parent of view changes only when user-initiated
  const notifyViewChange = useCallback((newView: 'chat' | 'history') => {
    onViewChange?.(newView);
  }, [onViewChange]);

  const loadChatSessions = useCallback(() => {
    try {
      const sessions = ChatService.getChatSessions();
      setChatSessions(sessions);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      toast({
        title: "Error loading chat history",
        description: "There was a problem loading your chat sessions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveCurrentSession = useCallback(() => {
    if (currentMessages.length === 0) return;

    try {
      const session = ChatService.saveChatSession(currentMessages);
      setCurrentSessionId(session.id);
      loadChatSessions(); // Refresh the sessions list
    } catch (error) {
      console.error('Failed to save chat session:', error);
    }
  }, [currentMessages, loadChatSessions]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    startThinking();

    try {
      // Simulate AI response with thinking animation
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: `Thank you for your message: "${content}". This is a simulated response demonstrating the chat system with history, animations, and state management.`,
        timestamp: new Date(),
      };

      setCurrentMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast({
        title: "Message failed",
        description: "There was a problem sending your message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      stopThinking();
    }
  };

  const handleNewChat = () => {
    if (currentMessages.length > 0 && !currentSessionId) {
      setShowNewChatConfirm(true);
      return;
    }

    // Save current session if it has messages
    if (currentMessages.length > 0) {
      saveCurrentSession();
    }

    // Clear current chat
    setCurrentMessages([]);
    setCurrentSessionId(null);
    setView('chat');
    notifyViewChange('chat');
    chatInputRef.current?.focus();
    
    toast({
      title: "New chat started",
      description: "Previous conversation saved to history.",
    });
  };

  const handleLoadSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (!session) return;

    // Save current session if it has unsaved changes
    if (currentMessages.length > 0 && !currentSessionId) {
      saveCurrentSession();
    }

    setCurrentMessages(session.messages);
    setCurrentSessionId(session.id);
    setView('chat');
    notifyViewChange('chat');
    
    toast({
      title: "Chat loaded",
      description: `Loaded "${session.title}"`,
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    try {
      ChatService.deleteChatSession(sessionId);
      
      // If the deleted session is the current one, clear it
      if (currentSessionId === sessionId) {
        setCurrentMessages([]);
        setCurrentSessionId(null);
      }
      
      loadChatSessions();
      
      toast({
        title: "Chat deleted",
        description: "The conversation has been removed from history.",
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the conversation.",
        variant: "destructive",
      });
    }
  };

  const handleEditMessage = (id: string, newContent: string) => {
    setCurrentMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, content: newContent, isEditing: false } : msg
      )
    );
  };

  const handleDeleteMessage = (id: string) => {
    setCurrentMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleRegenerateResponse = async (id: string) => {
    const messageIndex = currentMessages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) return;

    // Remove the message and all subsequent messages
    const newMessages = currentMessages.slice(0, messageIndex);
    setCurrentMessages(newMessages);

    // Get the last user message to regenerate response
    const lastUserMessage = newMessages
      .slice()
      .reverse()
      .find(msg => msg.type === 'user');

    if (lastUserMessage) {
      await handleSendMessage(lastUserMessage.content);
    }
  };

  // Filter sessions based on search
  const filteredSessions = searchQuery 
    ? ChatService.searchChatSessions(searchQuery)
    : chatSessions;

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-border bg-card/50"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          {view === 'history' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setView('chat');
                notifyViewChange('chat');
              }}
              className="hover-scale"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Chat
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">
              {view === 'chat' ? 'Chat' : 'Chat History'}
            </h1>
            {currentMessages.length > 0 && view === 'chat' && (
              <Badge variant="secondary" className="text-xs">
                {currentMessages.length} messages
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          {view === 'history' && chatSessions.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ChatPanel
                messages={currentMessages}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onRegenerateResponse={handleRegenerateResponse}
                isLoading={isLoading}
                inputRef={chatInputRef}
                onOpenCanvas={onOpenWorkbench}
              />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <HistoryPanel
                sessions={filteredSessions}
                onLoadSession={handleLoadSession}
                onDeleteSession={handleDeleteSession}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-card border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Chat Confirmation Modal */}
      <AnimatePresence>
        {showNewChatConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowNewChatConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Start New Chat?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your current conversation will be saved to history. You can continue it later from the History panel.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewChatConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setShowNewChatConfirm(false);
                    handleNewChat();
                  }}
                >
                  Start New Chat
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}