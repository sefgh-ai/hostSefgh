import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppHeader } from './AppHeader';
import { NavigationPanel } from './NavigationPanel';
import { SearchPanel } from './SearchPanel';
import { ChatPanel } from './ChatPanel';
import { ChatManager } from './chat/ChatManager';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { HistoryPanel } from './panels/HistoryPanel';
import { LanguagePanel } from './panels/LanguagePanel';
import { ConsolePanel } from './panels/ConsolePanel';
import { ProxyPanel } from './panels/ProxyPanel';
import { AllPagesPanel } from './panels/AllPagesPanel';
import { AnimationShowcase } from './panels/AnimationShowcase';
import { WorkbenchPanel, WorkbenchData } from './workbench/WorkbenchPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChatService } from '@/services/chatService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

interface LogEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

interface ProxySettings {
  enabled: boolean;
  address: string;
  port: string;
  username: string;
  password: string;
  requiresAuth: boolean;
}

interface WorkbenchData {
  id: string;
  title: string;
  content: string;
  mode: 'markdown' | 'code' | 'text';
  language?: string;
  lastModified: Date;
  version?: number;
}

interface AppState {
  theme: 'light' | 'dark';
  isNavOpen: boolean;
  isSearchVisible: boolean;
  isWorkbenchOpen: boolean;
  activeView: string;
  selectedVersion: string;
  selectedLanguage: string;
  messages: Message[];
  chatSessions: ChatSession[];
  consoleLogs: LogEntry[];
  proxySettings: ProxySettings;
  isLoading: boolean;
  canCancelLoading: boolean;
  githubSearchQuery?: string;
  currentWorkbench: WorkbenchData | null;
  hasUnsavedChanges: boolean;
}

const initialState: AppState = {
  theme: 'light',
  isNavOpen: false,
  isSearchVisible: false,
  isWorkbenchOpen: false,
  activeView: 'chat',
  selectedVersion: 'v3',
  selectedLanguage: 'en',
  messages: [],
  chatSessions: [],
  consoleLogs: [],
  proxySettings: {
    enabled: false,
    address: '',
    port: '',
    username: '',
    password: '',
    requiresAuth: false,
  },
  isLoading: false,
  canCancelLoading: false,
  githubSearchQuery: undefined,
  currentWorkbench: null,
  hasUnsavedChanges: false,
};

export const SEFGHApp = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [chatKey, setChatKey] = useState(0); // Add this line
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const currentAbortControllerRef = useRef<AbortController | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sefgh-app-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore specific state, exclude UI state that should reset on load
        const {
          isNavOpen, // Don't restore - should start closed
          isSearchVisible, // Don't restore - should start closed
          isWorkbenchOpen, // Don't restore - should start closed
          activeView, // Don't restore - should start with 'chat'
          isLoading, // Don't restore - should start false
          canCancelLoading, // Don't restore - should start false
          githubSearchQuery, // Don't restore - should start undefined
          hasUnsavedChanges, // Don't restore - should start false
          ...persistentState
        } = parsed;

        setState(prev => ({
          ...prev,
          ...persistentState,
          // Ensure UI state starts with safe defaults
          isNavOpen: false,
          isSearchVisible: false,
          isWorkbenchOpen: false,
          activeView: 'chat',
          isLoading: false,
          canCancelLoading: false,
          githubSearchQuery: undefined,
          hasUnsavedChanges: false,
          // Parse dates for persistent state
          messages: persistentState.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })) || [],
          consoleLogs: persistentState.consoleLogs?.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          })) || [],
        }));
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }

    // Load chat sessions from ChatService (separate storage)
    try {
      const chatSessions = ChatService.getChatSessions();
      setState(prev => ({ ...prev, chatSessions }));
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('sefgh-theme') || 'light';
    setState(prev => ({ ...prev, theme: savedTheme as 'light' | 'dark' }));
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Save state to localStorage whenever it changes (exclude chatSessions and transient UI state)
  useEffect(() => {
    const { 
      chatSessions, // Managed separately by ChatService
      isNavOpen, // Don't persist - should start closed
      isSearchVisible, // Don't persist - should start closed
      isWorkbenchOpen, // Don't persist - should start closed
      activeView, // Don't persist - should start with 'chat'
      isLoading, // Don't persist - should start false
      canCancelLoading, // Don't persist - should start false
      githubSearchQuery, // Don't persist - should start undefined
      hasUnsavedChanges, // Don't persist - should start false
      ...stateToSave 
    } = state;
    localStorage.setItem('sefgh-app-state', JSON.stringify(stateToSave));
    localStorage.setItem('sefgh-theme', state.theme);
  }, [state]);

  // Override console functions to capture logs
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    const createLogCapture = (type: LogEntry['type'], originalFn: Function) => {
      return (...args: any[]) => {
        originalFn.apply(console, args);
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        const logEntry: LogEntry = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          message,
          timestamp: new Date(),
        };

        setState(prev => ({
          ...prev,
          consoleLogs: [logEntry, ...prev.consoleLogs].slice(0, 100), // Keep last 100 logs
        }));
      };
    };

    console.log = createLogCapture('log', originalConsole.log);
    console.error = createLogCapture('error', originalConsole.error);
    console.warn = createLogCapture('warn', originalConsole.warn);
    console.info = createLogCapture('info', originalConsole.info);

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, []);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    updateState({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    toast({
      title: `Switched to ${newTheme} mode`,
      duration: 2000,
    });
  }, [state.theme, updateState, toast]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    updateState({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
      canCancelLoading: false,
    });

    // Create abort controller for timeout and cancellation
    const abortController = new AbortController();
    currentAbortControllerRef.current = abortController;
    
    // Enable cancellation after 5 seconds
    const cancelTimeoutId = setTimeout(() => {
      updateState({ canCancelLoading: true });
    }, 5000);
    
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 20000); // 20 second timeout

    try {
      const response = await fetch('https://api.sefgh.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
        signal: abortController.signal,
      });

      // Clear timeouts if request completes
      clearTimeout(timeoutId);
      clearTimeout(cancelTimeoutId);
      currentAbortControllerRef.current = null;

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract message and query from API response
      let messageContent = '';
      let shouldOpenGithubSearch = false;
      let githubQuery = '';

      if (data && typeof data === 'object') {
        // Type 1: Has both message and query
        if (data.message && data.query) {
          messageContent = data.message;
          shouldOpenGithubSearch = true;
          githubQuery = data.query;
        }
        // Type 2: Has only message
        else if (data.message) {
          messageContent = data.message;
        }
        // Fallback: stringify the whole response
        else {
          messageContent = JSON.stringify(data, null, 2);
        }
      } else {
        messageContent = String(data);
      }
      
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: messageContent,
        timestamp: new Date(),
      };

      updateState({ 
        messages: [...state.messages, userMessage, assistantMessage],
        isLoading: false,
        canCancelLoading: false,
        // If there's a query, open the GitHub search panel
        ...(shouldOpenGithubSearch && { 
          isSearchVisible: true,
          githubSearchQuery: githubQuery
        })
      });

    } catch (error) {
      // Clear timeouts if error occurs
      clearTimeout(timeoutId);
      clearTimeout(cancelTimeoutId);
      currentAbortControllerRef.current = null;
      
      console.error('API Error:', error);
      
      let errorMessage = 'Sorry, I encountered an error while processing your request. Please try again later.';
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. The AI service may be busy. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the AI service. Please check your internet connection and try again.';
        }
      }
      
      const errorResponseMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };

      updateState({ 
        messages: [...state.messages, userMessage, errorResponseMessage],
        isLoading: false,
        canCancelLoading: false,
      });
    }
  }, [state.messages, updateState]);

  const cancelMessage = useCallback(() => {
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }
    
    updateState({ 
      isLoading: false,
      canCancelLoading: false,
    });
    
    toast({
      title: "Request cancelled",
      description: "The AI request has been cancelled.",
      duration: 2000,
    });
  }, [updateState, toast]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Remove all messages after the edited message and update the edited message
    const updatedMessages = state.messages.slice(0, messageIndex + 1);
    updatedMessages[messageIndex].content = newContent;

    updateState({ messages: updatedMessages });

    // If it's a user message, resend it
    if (updatedMessages[messageIndex].type === 'user') {
      sendMessage(newContent);
    }
  }, [state.messages, updateState, sendMessage]);

  const deleteMessage = useCallback((messageId: string) => {
    const updatedMessages = state.messages.filter(msg => msg.id !== messageId);
    updateState({ messages: updatedMessages });
  }, [state.messages, updateState]);

  const regenerateResponse = useCallback((messageId: string) => {
    const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Find the user message before this assistant message
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex >= 0 && state.messages[userMessageIndex].type === 'user') {
      // Remove the assistant message and regenerate
      const updatedMessages = state.messages.slice(0, messageIndex);
      updateState({ messages: updatedMessages });
      sendMessage(state.messages[userMessageIndex].content);
    }
  }, [state.messages, updateState, sendMessage]);

  const setActiveView = useCallback((view: string) => {
    if (view === 'new-chat') {
      setChatKey(prev => prev + 1);
      updateState({ activeView: 'chat' });
    } else {
      updateState({ activeView: view });
    }
  }, [updateState]);

  const focusSearchInput = useCallback(() => {
    updateState({ isSearchVisible: true });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, [updateState]);

  const focusChatInput = useCallback(() => {
    setActiveView('chat');
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  }, [setActiveView]);

  const handleNewChat = useCallback(() => {
    // Save current chat session if it has messages
    if (state.messages.length > 0) {
      try {
        const savedSession = ChatService.saveChatSession(state.messages);
        
        // Update sessions in state
        const updatedSessions = [savedSession, ...state.chatSessions];
        updateState({ 
          messages: [], 
          activeView: 'chat',
          chatSessions: updatedSessions
        });

        toast({
          title: "Chat saved",
          description: `"${savedSession.title}" has been saved to history`,
          duration: 2000,
        });
      } catch (error) {
        console.error('Failed to save chat session:', error);
        // Still clear the chat even if save fails
        updateState({ messages: [], activeView: 'chat' });
      }
    } else {
      // No messages to save, just clear
      updateState({ messages: [], activeView: 'chat' });
    }
    
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  }, [state.messages, state.chatSessions, updateState, toast]);

  // Workbench handlers
  const openWorkbench = useCallback(() => {
    if (!state.currentWorkbench) {
      const newWorkbench: WorkbenchData = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Untitled Workbench',
        content: '',
        mode: 'markdown',
        lastModified: new Date(),
        version: 1
      };
      updateState({ 
        currentWorkbench: newWorkbench,
        isWorkbenchOpen: true,
        hasUnsavedChanges: false 
      });
    } else {
      updateState({ isWorkbenchOpen: true });
    }
  }, [state.currentWorkbench, updateState]);

  const closeWorkbench = useCallback(() => {
    updateState({ isWorkbenchOpen: false });
  }, [updateState]);

  const saveWorkbench = useCallback((workbench: WorkbenchData) => {
    updateState({ 
      currentWorkbench: workbench,
      hasUnsavedChanges: false 
    });
    
    // Save to localStorage
    const savedWorkbenches = JSON.parse(localStorage.getItem('sefgh-workbenches') || '[]');
    const existingIndex = savedWorkbenches.findIndex((w: WorkbenchData) => w.id === workbench.id);
    
    if (existingIndex >= 0) {
      savedWorkbenches[existingIndex] = workbench;
    } else {
      savedWorkbenches.push(workbench);
    }
    
    localStorage.setItem('sefgh-workbenches', JSON.stringify(savedWorkbenches));
  }, [updateState]);

  const updateWorkbenchContent = useCallback((content: string) => {
    if (state.currentWorkbench) {
      updateState({ 
        currentWorkbench: { ...state.currentWorkbench, content },
        hasUnsavedChanges: true 
      });
    }
  }, [state.currentWorkbench, updateState]);

  const updateWorkbenchTitle = useCallback((title: string) => {
    if (state.currentWorkbench) {
      updateState({ 
        currentWorkbench: { ...state.currentWorkbench, title },
        hasUnsavedChanges: true 
      });
    }
  }, [state.currentWorkbench, updateState]);

  const updateWorkbenchMode = useCallback((mode: 'markdown' | 'code' | 'text') => {
    if (state.currentWorkbench) {
      updateState({ 
        currentWorkbench: { ...state.currentWorkbench, mode },
        hasUnsavedChanges: true 
      });
    }
  }, [state.currentWorkbench, updateState]);

  const updateWorkbenchLanguage = useCallback((language: string) => {
    if (state.currentWorkbench) {
      updateState({ 
        currentWorkbench: { ...state.currentWorkbench, language },
        hasUnsavedChanges: true 
      });
    }
  }, [state.currentWorkbench, updateState]);

  const renderActivePanel = () => {
    switch (state.activeView) {
      case 'chat':
      case 'history':
        return (
          <ChatManager 
            key={chatKey} // Add this line
            initialView={state.activeView as 'chat' | 'history'}
            onViewChange={(view) => setActiveView(view)}
            onOpenWorkbench={openWorkbench}
          />
        );
      case 'language':
        return (
          <LanguagePanel
            selectedLanguage={state.selectedLanguage}
            onLanguageChange={(language) => {
              updateState({ selectedLanguage: language });
              toast({
                title: "Language Changed",
                description: `Interface language changed to ${language.toUpperCase()}`,
                duration: 2000,
              });
            }}
          />
        );
      case 'console':
        return (
          <ConsolePanel
            logs={state.consoleLogs}
            onClearLogs={() => updateState({ consoleLogs: [] })}
          />
        );
      case 'proxy':
        return (
          <ProxyPanel
            settings={state.proxySettings}
            onSettingsChange={(settings) => updateState({ proxySettings: settings })}
          />
        );
      case 'all-pages':
        return <AllPagesPanel onNavigate={setActiveView} />;
      case 'animation-showcase':
        return <AnimationShowcase onNavigate={setActiveView} />;
      case 'docs':
      case 'playground':
      case 'settings':
        return (
          <Card className="m-6">
            <CardHeader>
              <CardTitle className="capitalize">{state.activeView}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section is under development. Check back soon for updates!
              </p>
            </CardContent>
          </Card>
        );
      default:
        return <AllPagesPanel onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <AppHeader
        theme={state.theme}
        selectedVersion={state.selectedVersion}
        onThemeToggle={toggleTheme}
        onNavToggle={() => updateState({ isNavOpen: !state.isNavOpen })}
        onSearchToggle={() => updateState({ isSearchVisible: !state.isSearchVisible })}
        onVersionChange={(version) => {
          updateState({ selectedVersion: version });
          toast({
            title: `Switched to ${version.toUpperCase()}`,
            description: "AI model version updated",
            duration: 2000,
          });
        }}
      />

      <main className="flex-1 flex pt-14 overflow-hidden">
        <NavigationPanel
          isOpen={state.isNavOpen}
          activeView={state.activeView}
          theme={state.theme}
          onViewChange={setActiveView}
          onThemeToggle={toggleTheme}
          onClose={() => updateState({ isNavOpen: false })}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {renderActivePanel()}
          </div>

          <SearchPanel
            isVisible={state.isSearchVisible}
            onClose={() => updateState({ isSearchVisible: false, githubSearchQuery: undefined })}
            inputRef={searchInputRef}
            autoSearchQuery={state.githubSearchQuery}
            onQueryProcessed={() => updateState({ githubSearchQuery: undefined })}
          />

          <WorkbenchPanel
            isOpen={state.isWorkbenchOpen}
            workbench={state.currentWorkbench}
            hasUnsavedChanges={state.hasUnsavedChanges}
            onClose={closeWorkbench}
            onSave={saveWorkbench}
            onContentChange={updateWorkbenchContent}
            onTitleChange={updateWorkbenchTitle}
            onModeChange={updateWorkbenchMode}
            onLanguageChange={updateWorkbenchLanguage}
          />
        </div>
      </main>

      <KeyboardShortcuts
        onFocusSearchInput={focusSearchInput}
        onFocusChatInput={focusChatInput}
        onToggleNav={() => updateState({ isNavOpen: !state.isNavOpen })}
        onToggleSearch={() => updateState({ isSearchVisible: !state.isSearchVisible })}
        onNewChat={handleNewChat}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
};