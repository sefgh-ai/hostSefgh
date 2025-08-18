import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface KeyboardShortcut {
  label: string;
  shortcut: string;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFocusSearchInput?: () => void;
  onFocusChatInput?: () => void;
  onToggleNav?: () => void;
  onToggleSearch?: () => void;
  onNewChat?: () => void;
  onToggleTheme?: () => void;
}

export const KeyboardShortcuts = ({
  isOpen,
  onClose,
  onFocusSearchInput,
  onFocusChatInput,
  onToggleNav,
  onToggleSearch,
  onNewChat,
  onToggleTheme,
}: KeyboardShortcutsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const shortcuts: KeyboardShortcut[] = [
    { label: 'Search GitHub repos', shortcut: 'Ctrl + K' },
    { label: 'Focus chat input', shortcut: 'Ctrl + I' },
    { label: 'New chat', shortcut: 'Ctrl + Shift + O' },
    { label: 'Toggle sidebar', shortcut: 'Ctrl + B' },
    { label: 'Toggle search panel', shortcut: 'Ctrl + G' },
    { label: 'Toggle dark mode', shortcut: 'Ctrl + D' },
    { label: 'Chat', shortcut: '' },
    { label: 'Copy last code block', shortcut: 'Ctrl + Shift + ;' },
    { label: 'Next message', shortcut: 'Shift + ↓' },
    { label: 'Previous message', shortcut: 'Shift + ↑' },
    { label: 'Delete chat', shortcut: 'Ctrl + Shift + ⌫' },
    { label: 'Settings', shortcut: '' },
    { label: 'Show shortcuts', shortcut: 'Ctrl + /' },
    { label: 'Set custom instructions', shortcut: 'Ctrl + Shift + I' },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onFocusSearchInput?.();
        }
        
        if (event.key === 'i' && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
          event.preventDefault();
          onFocusChatInput?.();
        }
        
        if (event.key === 'o' && (event.ctrlKey || event.metaKey) && event.shiftKey) {
          event.preventDefault();
          onNewChat?.();
        }
        
        if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onToggleNav?.();
        }
        
        if (event.key === 'g' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onToggleSearch?.();
        }
        
        if (event.key === 'd' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onToggleTheme?.();
        }
        
        if (event.key === '/' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          if (isOpen !== undefined) {
            onClose?.();
          } else {
            setIsVisible(!isVisible);
          }
        }
      }

      // Close shortcuts modal on Escape
      if (event.key === 'Escape') {
        if (isOpen !== undefined) {
          onClose?.();
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, isOpen, onClose, onFocusSearchInput, onFocusChatInput, onToggleNav, onToggleSearch, onNewChat, onToggleTheme]);

  const shouldShow = isOpen !== undefined ? isOpen : isVisible;
  
  if (!shouldShow) return null;

  const handleClose = () => {
    if (isOpen !== undefined) {
      onClose?.();
    } else {
      setIsVisible(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <Card className="w-full max-w-md bg-background border-border shadow-2xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Keyboard shortcuts</h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-sm ${shortcut.shortcut ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {shortcut.label}
                </span>
                {shortcut.shortcut && (
                  <span className="text-sm text-muted-foreground font-mono">
                    {shortcut.shortcut}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};