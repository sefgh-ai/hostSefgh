/**
 * useKeyboardShortcuts - Hook for managing keyboard shortcuts in chat
 * Provides common chat shortcuts like Ctrl+Enter, Ctrl+H, etc.
 */

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onSendMessage?: () => void;
  onNewChat?: () => void;
  onOpenHistory?: () => void;
  onFocusInput?: () => void;
  onClearChat?: () => void;
  onExportChat?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onSendMessage,
  onNewChat,
  onOpenHistory,
  onFocusInput,
  onClearChat,
  onExportChat,
  enabled = true
}: KeyboardShortcutsOptions) {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Check if user is typing in an input/textarea
    const isInputFocused = 
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA' ||
      document.activeElement?.getAttribute('contenteditable') === 'true';

    // Ctrl/Cmd + Enter - Send message (only when in input)
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && isInputFocused) {
      event.preventDefault();
      onSendMessage?.();
      return;
    }

    // Don't handle other shortcuts when user is typing
    if (isInputFocused) return;

    // Ctrl/Cmd + Shift + N - New chat
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'N') {
      event.preventDefault();
      onNewChat?.();
      return;
    }

    // Ctrl/Cmd + H - Open history
    if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
      event.preventDefault();
      onOpenHistory?.();
      return;
    }

    // Ctrl/Cmd + K - Focus input
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      onFocusInput?.();
      return;
    }

    // Ctrl/Cmd + Shift + K - Clear chat
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'K') {
      event.preventDefault();
      onClearChat?.();
      return;
    }

    // Ctrl/Cmd + S - Export chat
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      onExportChat?.();
      return;
    }

    // Escape - Blur input (remove focus)
    if (event.key === 'Escape' && isInputFocused) {
      (document.activeElement as HTMLElement)?.blur();
      return;
    }

    // Forward slash - Focus input (like Discord/Slack)
    if (event.key === '/' && !isInputFocused) {
      event.preventDefault();
      onFocusInput?.();
      return;
    }
  }, [
    enabled,
    onSendMessage,
    onNewChat,
    onOpenHistory,
    onFocusInput,
    onClearChat,
    onExportChat
  ]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  // Return helper for displaying shortcuts in UI
  return {
    shortcuts: {
      sendMessage: 'Ctrl + Enter',
      newChat: 'Ctrl + Shift + N',
      openHistory: 'Ctrl + H',
      focusInput: 'Ctrl + K or /',
      clearChat: 'Ctrl + Shift + K',
      exportChat: 'Ctrl + S',
      unfocus: 'Escape'
    }
  };
}