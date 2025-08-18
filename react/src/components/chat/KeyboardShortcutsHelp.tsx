/**
 * KeyboardShortcutsHelp - Modal showing available keyboard shortcuts
 * Displays a helpful guide for all chat keyboard shortcuts
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    {
      category: 'Chat Actions',
      items: [
        { keys: ['Ctrl', 'Enter'], description: 'Send message (when typing)' },
        { keys: ['Ctrl', 'Shift', 'N'], description: 'Start new chat' },
        { keys: ['Ctrl', 'Shift', 'K'], description: 'Clear current chat' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', 'H'], description: 'Open chat history' },
        { keys: ['Ctrl', 'K'], description: 'Focus message input' },
        { keys: ['/'], description: 'Quick focus input' },
        { keys: ['Escape'], description: 'Unfocus input' }
      ]
    },
    {
      category: 'Export & Share',
      items: [
        { keys: ['Ctrl', 'S'], description: 'Export current chat' },
        { keys: ['Ctrl', 'C'], description: 'Copy chat content' }
      ]
    }
  ];

  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  const formatKey = (key: string) => {
    if (key === 'Ctrl' && isMac) return '⌘';
    if (key === 'Shift') return '⇧';
    if (key === 'Enter') return '↵';
    if (key === 'Escape') return 'Esc';
    return key;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-card/95 backdrop-blur-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {shortcuts.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                      {category.category}
                    </h3>
                    
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={item.description}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                        >
                          <span className="text-sm text-foreground">
                            {item.description}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, keyIndex) => (
                              <React.Fragment key={key}>
                                <Badge 
                                  variant="outline" 
                                  className="px-2 py-1 text-xs font-mono bg-background"
                                >
                                  {formatKey(key)}
                                </Badge>
                                {keyIndex < item.keys.length - 1 && (
                                  <span className="text-xs text-muted-foreground mx-1">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  className="pt-4 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-muted-foreground text-center">
                    Press <Badge variant="outline" className="px-1 py-0.5 text-xs">?</Badge> to toggle this help panel
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}