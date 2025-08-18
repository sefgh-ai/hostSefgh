import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageSquare, Trash2, Calendar, Search, Download, Share2, MoreHorizontal, FileText, FileDown, Code, File } from 'lucide-react';
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

interface HistoryPanelProps {
  sessions: ChatSession[];
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const HistoryPanel = ({
  sessions,
  onLoadSession,
  onDeleteSession,
}: HistoryPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter sessions based on search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    return ChatService.searchChatSessions(searchQuery);
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
      const shareUrl = ChatService.createShareableLink(session);
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share link copied",
        description: "Anyone with this link can view the conversation",
        duration: 3000,
      });
    } catch (error) {
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

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Chat History</h3>
        <p className="text-muted-foreground">
          Your conversation history will appear here once you start chatting.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Chat History</h1>
            <p className="text-muted-foreground">
              Browse and manage your previous conversations
            </p>
          </div>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery && (
          <div className="mt-2 text-sm text-muted-foreground">
            {filteredSessions.length} result{filteredSessions.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base mb-2 line-clamp-2">
                    {session.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {session.lastMessage}
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

                  {/* Share button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleShareChat(session)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  {/* More options */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => onDeleteSession(session.id)}
                        className="text-destructive"
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadSession(session.id)}
                className="w-full"
              >
                Load Conversation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </ScrollArea>
  );
};