import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageSquare, 
  ExternalLink, 
  Lock,
  AlertCircle
} from 'lucide-react';
import { ChatService, ShareableChatData } from '@/services/chatService';

export default function SharedChat() {
  const { shareId } = useParams<{ shareId: string }>();
  const [chatData, setChatData] = useState<ShareableChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) {
      setError('No share ID provided');
      setLoading(false);
      return;
    }

    try {
      const data = ChatService.getSharedChat(shareId);
      if (!data) {
        setError('Shared chat not found or expired');
      } else {
        setChatData(data);
      }
    } catch (err) {
      setError('Failed to load shared chat');
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !chatData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Chat Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || 'The shared conversation could not be found or may have expired.'}
            </p>
            <Button variant="outline" asChild>
              <a href="/">Return to Chat</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold line-clamp-1">
                  {chatData.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Shared conversation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Read-only
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="/" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Start Your Own Chat
                </a>
              </Button>
            </div>
          </div>
          
          {/* Chat metadata */}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Shared on {formatDate(chatData.timestamp)}
            </div>
            <Badge variant="secondary">
              {chatData.messages.length} messages
            </Badge>
          </div>
        </div>
      </header>

      {/* Chat messages */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {chatData.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] rounded-lg p-4 
                ${message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border border-border'
                }
              `}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={message.type === 'user' ? 'secondary' : 'outline'} className="text-xs">
                    {message.type === 'user' ? '👤 User' : '🤖 Assistant'}
                  </Badge>
                  <span className="text-xs opacity-70">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap break-words m-0">
                    {message.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
            This is a shared conversation from SEFGH-AI. Messages are read-only.
          </p>
          <Button asChild>
            <a href="/">Start Your Own Conversation</a>
          </Button>
        </div>
      </main>
    </div>
  );
}