/**
 * FloatingActions - Floating Action Buttons for quick chat actions
 * Provides easy access to scroll, export, and other chat functions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ChevronUp, 
  Download, 
  Share2, 
  MoreHorizontal,
  ChevronDown,
  Copy,
  Trash2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FloatingActionsProps {
  onScrollToTop?: () => void;
  onScrollToBottom?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onClearChat?: () => void;
  onCopyChat?: () => void;
  showScrollToTop?: boolean;
  showScrollToBottom?: boolean;
  messageCount?: number;
}

export function FloatingActions({
  onScrollToTop,
  onScrollToBottom,
  onExport,
  onShare,
  onClearChat,
  onCopyChat,
  showScrollToTop = false,
  showScrollToBottom = false,
  messageCount = 0
}: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show FAB when there are messages
  useEffect(() => {
    setIsVisible(messageCount > 2);
  }, [messageCount]);

  if (!isVisible) return null;

  const fabVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3"
      variants={fabVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Expanded action menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex flex-col gap-2"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Scroll actions */}
            {(showScrollToTop || showScrollToBottom) && (
              <div className="flex flex-col gap-2">
                {showScrollToTop && (
                  <motion.div variants={itemVariants}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onScrollToTop}
                      className="h-10 w-10 p-0 bg-card shadow-lg hover:shadow-xl transition-shadow"
                      title="Scroll to top"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
                
                {showScrollToBottom && (
                  <motion.div variants={itemVariants}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onScrollToBottom}
                      className="h-10 w-10 p-0 bg-card shadow-lg hover:shadow-xl transition-shadow"
                      title="Scroll to bottom"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Quick actions */}
            <motion.div variants={itemVariants}>
              <Button
                size="sm"
                variant="outline"
                onClick={onCopyChat}
                className="h-10 w-10 p-0 bg-card shadow-lg hover:shadow-xl transition-shadow"
                title="Copy chat"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                size="sm"
                variant="outline"
                onClick={onShare}
                className="h-10 w-10 p-0 bg-card shadow-lg hover:shadow-xl transition-shadow"
                title="Share chat"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                size="sm"
                variant="outline"
                onClick={onExport}
                className="h-10 w-10 p-0 bg-card shadow-lg hover:shadow-xl transition-shadow"
                title="Export chat"
              >
                <Download className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <DropdownMenu open={isExpanded} onOpenChange={setIsExpanded}>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <MoreHorizontal className="h-5 w-5" />
              </motion.div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" side="top" className="mb-2">
            {/* Scroll options */}
            {showScrollToTop && (
              <DropdownMenuItem onClick={onScrollToTop}>
                <ChevronUp className="h-4 w-4 mr-2" />
                Scroll to Top
              </DropdownMenuItem>
            )}
            
            {showScrollToBottom && (
              <DropdownMenuItem onClick={onScrollToBottom}>
                <ChevronDown className="h-4 w-4 mr-2" />
                Scroll to Bottom
              </DropdownMenuItem>
            )}
            
            {/* Actions */}
            <DropdownMenuItem onClick={onCopyChat}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Chat
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Chat
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Chat
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onClearChat} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.div>
  );
}