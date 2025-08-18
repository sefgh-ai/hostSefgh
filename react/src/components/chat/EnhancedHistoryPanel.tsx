import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  Trash2, 
  Calendar, 
  Search, 
  Download, 
  Share2, 
  MoreHorizontal, 
  FileText, 
  FileDown, 
  Code, 
  File,
  Check,
  Copy
} from 'lucide-react';
import { ChatService } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Array<{
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

interface EnhancedHistoryPanelProps {
  sessions: ChatSession[];
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const EnhancedHistoryPanel = ({
  sessions,
  onLoadSession,
  onDeleteSession,
}: EnhancedHistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sharingStates, setSharingStates] = useState<Record<string, 'idle' | 'copying' | 'copied'>>({});
  const { toast } = useToast();

  // Enhanced fuzzy search with highlighting
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions.map(s => ({ ...s, highlightTitle: false, highlightMessage: false }));
    
    const query = searchQuery.toLowerCase();
    return sessions.filter(session => {
      const titleMatch = session.title.toLowerCase().includes(query);
      const messageMatch = session.lastMessage.toLowerCase().includes(query);
      const contentMatch = session.messages.some(msg => 
        msg.content.toLowerCase().includes(query)
      );
      
      return titleMatch || messageMatch || contentMatch;
    }).map(session => ({
      ...session,
      // Add highlight information for rendering
      highlightTitle: session.title.toLowerCase().includes(query),
      highlightMessage: session.lastMessage.toLowerCase().includes(query)
    }));
  }, [sessions, searchQuery]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleExportChat = (session: ChatSession, format: 'txt' | 'md' | 'pdf' | 'json') => {
    try {
      switch (format) {
        case 'txt':
          ChatService.exportAsTxt(session);
          break;
        case 'md':
          ChatService.exportAsMarkdown(session);
          break;
        case 'pdf':
          ChatService.exportAsPdf(session);
          break;
        case 'json':
          ChatService.exportAsJson(session);
          break;
      }
      toast({
        title: "Export successful",
        description: `Chat exported as ${format.toUpperCase()}`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export chat",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleShareChat = async (session: ChatSession) => {
    try {
      setSharingStates(prev => ({ ...prev, [session.id]: 'copying' }));
      
      const shareUrl = ChatService.createShareableLink(session);
      await navigator.clipboard.writeText(shareUrl);
      
      setSharingStates(prev => ({ ...prev, [session.id]: 'copied' }));
      
      setTimeout(() => {
        setSharingStates(prev => ({ ...prev, [session.id]: 'idle' }));
      }, 2000);
      
      toast({
        title: "Share link copied",
        description: "Anyone with this link can view the conversation",
        duration: 3000,
      });
    } catch (error) {
      setSharingStates(prev => ({ ...prev, [session.id]: 'idle' }));
      console.error('Share failed:', error);
      toast({
        title: "Share failed",
        description: "Failed to create shareable link",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleExportAll = () => {
    try {
      ChatService.exportAllChats();
      toast({
        title: "Export successful",
        description: "All chats exported as JSON",
        duration: 2000,
      });
    } catch (error) {
      console.error('Export all failed:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export all chats",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const highlightText = (text: string, shouldHighlight: boolean) => {
    if (!shouldHighlight || !searchQuery.trim()) return text;
    
    const query = searchQuery.toLowerCase();
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-yellow-200 dark:bg-yellow-900 rounded px-1">
          {text.slice(index, index + query.length)}
        </mark>
        {text.slice(index + query.length)}
      </>
    );
  };

  if (sessions.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full text-center p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-2">No Chat History</h3>
        <p className="text-muted-foreground">
          Your conversation history will appear here once you start chatting.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-6">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Chat History</h1>
            <p className="text-muted-foreground">
              Browse and manage your previous conversations
            </p>
          </div>
          <Button onClick={handleExportAll} variant="outline" size="sm" className="hover-scale">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Enhanced search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations, messages, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Search results summary */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div 
              className="mt-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {filteredSessions.length} result{filteredSessions.length !== 1 ? 's' : ''} found
              {filteredSessions.length > 0 && ' with matches highlighted'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat sessions with staggered animation */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              className="will-change-transform"
            >
              <Card className="hover:bg-muted/50 transition-all duration-200 hover:shadow-md border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2 line-clamp-2">
                        {highlightText(session.title, (session as any).highlightTitle)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {highlightText(session.lastMessage, (session as any).highlightMessage)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.timestamp)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {session.messageCount} messages
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {/* Export dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover-scale">
                            <Download className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleExportChat(session, 'txt')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Export as TXT
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportChat(session, 'md')}>
                            <File className="h-4 w-4 mr-2" />
                            Export as Markdown
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportChat(session, 'pdf')}>
                            <FileDown className="h-4 w-4 mr-2" />
                            Export as PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportChat(session, 'json')}>
                            <Code className="h-4 w-4 mr-2" />
                            Export as JSON
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Enhanced share button with animation */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover-scale"
                        onClick={() => handleShareChat(session)}
                        disabled={sharingStates[session.id] === 'copying'}
                      >
                        <AnimatePresence mode="wait">
                          {sharingStates[session.id] === 'copied' ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </motion.div>
                          ) : sharingStates[session.id] === 'copying' ? (
                            <motion.div
                              key="copying"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="h-4 w-4 animate-pulse" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="share"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Share2 className="h-4 w-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>

                      {/* More options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover-scale">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => onDeleteSession(session.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadSession(session.id)}
                      className="w-full transition-all duration-200"
                    >
                      Load Conversation
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Shimmer loading effect placeholder for empty states */}
      <AnimatePresence>
        {filteredSessions.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all conversations.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};