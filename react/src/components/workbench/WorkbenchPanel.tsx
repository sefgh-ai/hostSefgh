import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, X, Download, Edit, Code, FileText, Type, 
  ChevronDown, Copy, Trash2, RotateCcw, Play 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export interface WorkbenchData {
  id: string;
  title: string;
  content: string;
  mode: 'markdown' | 'code' | 'text';
  language?: string;
  lastModified: Date;
  version?: number;
}

interface WorkbenchPanelProps {
  isOpen: boolean;
  workbench: WorkbenchData | null;
  hasUnsavedChanges: boolean;
  onClose: () => void;
  onSave: (workbench: WorkbenchData) => void;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onModeChange: (mode: 'markdown' | 'code' | 'text') => void;
  onLanguageChange?: (language: string) => void;
}

export const WorkbenchPanel: React.FC<WorkbenchPanelProps> = ({
  isOpen,
  workbench,
  hasUnsavedChanges,
  onClose,
  onSave,
  onContentChange,
  onTitleChange,
  onModeChange,
  onLanguageChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const { toast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  const codeLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ];

  useEffect(() => {
    if (workbench) {
      setTempTitle(workbench.title);
    }
  }, [workbench]);

  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isOpen]);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    
    textarea.addEventListener('input', adjustHeight);
    adjustHeight();
    
    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, [workbench?.content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'e':
            e.preventDefault();
            handleExecuteCode();
            break;
          case 'Escape':
            handleClose();
            break;
        }
      }
      
      if (e.key === 'Escape' && !e.ctrlKey && !e.metaKey) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, workbench]);

  const handleSave = () => {
    if (!workbench) return;
    
    onSave({
      ...workbench,
      lastModified: new Date(),
      version: (workbench.version || 0) + 1
    });
    
    toast({
      title: "Workbench saved",
      description: "Your document has been saved successfully",
      duration: 2000,
    });
  };

  const handleExport = () => {
    if (!workbench) return;

    const element = document.createElement('a');
    const file = new Blob([workbench.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    const getExtension = () => {
      if (workbench.mode === 'markdown') return '.md';
      if (workbench.mode === 'code') {
        switch (workbench.language) {
          case 'javascript': return '.js';
          case 'typescript': return '.ts';
          case 'python': return '.py';
          case 'java': return '.java';
          case 'csharp': return '.cs';
          case 'go': return '.go';
          case 'rust': return '.rs';
          case 'sql': return '.sql';
          case 'html': return '.html';
          case 'css': return '.css';
          default: return '.txt';
        }
      }
      return '.txt';
    };
    
    element.download = `${workbench.title}${getExtension()}`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Workbench exported",
      description: `Downloaded as ${workbench.title}${getExtension()}`,
      duration: 2000,
    });
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  const handleTitleEdit = () => {
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTempTitle(workbench?.title || '');
      setIsEditing(false);
    }
  };

  const handleCopyContent = () => {
    if (!workbench) return;
    navigator.clipboard.writeText(workbench.content);
    toast({
      title: "Content copied",
      description: "Content has been copied to clipboard",
      duration: 1500,
    });
  };

  const handleResetContent = () => {
    if (!workbench) return;
    const confirmed = window.confirm('This will reset all content. Are you sure?');
    if (confirmed) {
      onContentChange('');
      toast({
        title: "Content reset",
        description: "All content has been cleared",
        duration: 2000,
      });
    }
  };

  const handleExecuteCode = () => {
    if (!workbench || workbench.mode !== 'code') return;
    
    setIsExecuting(true);
    // Simulate code execution
    setTimeout(() => {
      try {
        let result;
        
        if (workbench.language === 'javascript' || workbench.language === 'typescript') {
          // Very simple and unsafe eval for demo purposes only
          // In a real app, use a secure sandbox
          try {
            result = String(eval(`(function(){${workbench.content}})()`));
          } catch (error) {
            if (error instanceof Error) {
              result = `Error: ${error.message}`;
            } else {
              result = 'Unknown error occurred';
            }
          }
        } else {
          result = `Execution for ${workbench.language || 'this language'} is not supported yet.`;
        }
        
        setExecutionResult(result);
      } finally {
        setIsExecuting(false);
      }
    }, 1000);
  };

  // Determine if code execution is available
  const canExecuteCode = workbench?.mode === 'code' && 
    ['javascript', 'typescript'].includes(workbench.language || '');

  if (!isOpen || !workbench) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-background/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="border-b border-border flex justify-between items-center p-4 bg-card">
        <div className="flex items-center space-x-4">
          {/* Title */}
          {isEditing ? (
            <input
              ref={titleInputRef}
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="bg-background border border-border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          ) : (
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">{workbench.title}</h2>
              <button onClick={handleTitleEdit} className="text-muted-foreground hover:text-foreground">
                <Edit size={14} />
              </button>
            </div>
          )}
          
          {/* Mode selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                {workbench.mode === 'markdown' ? (
                  <FileText size={16} />
                ) : workbench.mode === 'code' ? (
                  <Code size={16} />
                ) : (
                  <Type size={16} />
                )}
                <span className="capitalize">{workbench.mode}</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onModeChange('text')}>
                <Type size={16} className="mr-2" /> Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModeChange('markdown')}>
                <FileText size={16} className="mr-2" /> Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModeChange('code')}>
                <Code size={16} className="mr-2" /> Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language selector (only for code mode) */}
          {workbench.mode === 'code' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <span>{workbench.language || 'Select Language'}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                {codeLanguages.map(lang => (
                  <DropdownMenuItem 
                    key={lang.value} 
                    onClick={() => onLanguageChange?.(lang.value)}
                    className={cn(
                      workbench.language === lang.value && 'bg-secondary'
                    )}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Actions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleCopyContent}
              >
                <Copy size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy content</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleResetContent}
              >
                <Trash2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear content</TooltipContent>
          </Tooltip>
          
          {canExecuteCode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant={isExecuting ? "secondary" : "outline"}
                  onClick={handleExecuteCode}
                  disabled={isExecuting}
                  className="flex items-center space-x-1"
                >
                  {isExecuting ? (
                    <RotateCcw size={18} className="animate-spin" />
                  ) : (
                    <Play size={18} />
                  )}
                  <span>Run</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Execute code (Ctrl+E)</TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
                className="flex items-center space-x-1"
              >
                <Download size={18} />
                <span>Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export as file</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={hasUnsavedChanges ? "default" : "outline"}
                onClick={handleSave}
                className="flex items-center space-x-1"
              >
                <Save size={18} />
                <span>Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save document (Ctrl+S)</TooltipContent>
          </Tooltip>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClose}
          >
            <X size={20} />
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6" ref={contentAreaRef}>
        <div className="mx-auto max-w-5xl">
          {workbench.mode === 'code' && (
            <div className="bg-card border border-border rounded-t-md p-2 text-xs text-muted-foreground flex justify-between">
              <span>{workbench.language || 'No language selected'}</span>
              <span>{workbench.content.split('\n').length} lines</span>
            </div>
          )}

          <textarea
            ref={editorRef}
            value={workbench.content}
            onChange={(e) => onContentChange(e.target.value)}
            className={cn(
              "w-full min-h-[300px] border border-border rounded-md p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary",
              workbench.mode === 'code' && "rounded-t-none bg-muted font-mono",
            )}
            placeholder={
              workbench.mode === 'markdown' 
                ? '# Start typing your markdown...' 
                : workbench.mode === 'code'
                ? '// Start typing your code...'
                : 'Start typing...'
            }
            spellCheck={workbench.mode !== 'code'}
          />

          {/* Code execution result */}
          {workbench.mode === 'code' && executionResult !== null && (
            <div className="mt-4 border border-border rounded-md">
              <div className="bg-card p-2 border-b border-border text-xs font-semibold">
                Execution Result
              </div>
              <pre className="p-4 bg-muted font-mono text-sm overflow-auto max-h-[200px]">
                {executionResult}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Status bar */}
      <div className="border-t border-border p-2 px-4 bg-card flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {workbench.mode === 'markdown' && "Markdown"}
          {workbench.mode === 'code' && workbench.language}
          {workbench.mode === 'text' && "Plain Text"}
          
          {" • "}
          
          {workbench.content.length} characters
          {" • "}
          {workbench.content.split('\n').length} lines
        </div>
        <div>
          Last modified: {workbench.lastModified.toLocaleString()}
          {workbench.version && ` • v${workbench.version}`}
        </div>
      </div>
    </motion.div>
  );
};