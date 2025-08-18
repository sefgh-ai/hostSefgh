import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Download, FileText, Code, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CanvasData {
  id: string;
  title: string;
  content: string;
  mode: 'markdown' | 'code' | 'text';
  lastModified: Date;
}

interface CanvasPanelProps {
  isOpen: boolean;
  canvas: CanvasData | null;
  hasUnsavedChanges: boolean;
  onClose: () => void;
  onSave: (canvas: CanvasData) => void;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onModeChange: (mode: 'markdown' | 'code' | 'text') => void;
}

export const CanvasPanel: React.FC<CanvasPanelProps> = ({
  isOpen,
  canvas,
  hasUnsavedChanges,
  onClose,
  onSave,
  onContentChange,
  onTitleChange,
  onModeChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const { toast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canvas) {
      setTempTitle(canvas.title);
    }
  }, [canvas]);

  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
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
  }, [isOpen, canvas]);

  const handleSave = () => {
    if (!canvas) return;
    
    onSave({
      ...canvas,
      lastModified: new Date(),
    });
    
    toast({
      title: "Canvas saved",
      description: "Your document has been saved successfully",
      duration: 2000,
    });
  };

  const handleExport = () => {
    if (!canvas) return;

    const element = document.createElement('a');
    const file = new Blob([canvas.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    const extension = canvas.mode === 'markdown' ? '.md' : canvas.mode === 'code' ? '.txt' : '.txt';
    element.download = `${canvas.title}${extension}`;
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Canvas exported",
      description: `Downloaded as ${canvas.title}${extension}`,
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
      setTempTitle(canvas?.title || '');
      setIsEditing(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'markdown': return FileText;
      case 'code': return Code;
      case 'text': return Type;
      default: return FileText;
    }
  };

  if (!isOpen || !canvas) return null;

  const ModeIcon = getModeIcon(canvas.mode);

  return (
    <div className={`fixed inset-0 z-50 flex ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`}>
      {/* Mobile backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden" onClick={handleClose} />
      
      {/* Canvas Panel */}
      <div className={`
        ml-auto h-full bg-background border-l shadow-2xl
        w-full md:w-[40%] lg:w-[35%] xl:w-[30%]
        transform transition-transform duration-200 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <Card className="h-full rounded-none border-0 flex flex-col">
          {/* Header */}
          <CardHeader className="flex-row items-center justify-between space-y-0 p-4 border-b">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <ModeIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              
              {isEditing ? (
                <input
                  ref={titleInputRef}
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  className="flex-1 text-lg font-semibold bg-transparent border-b border-primary focus:outline-none"
                  placeholder="Document title"
                />
              ) : (
                <h2 
                  className="text-lg font-semibold cursor-pointer hover:text-primary truncate"
                  onClick={handleTitleEdit}
                  title={canvas.title}
                >
                  {canvas.title}
                </h2>
              )}
              
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="text-xs">
                  Unsaved
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mode selector */}
              <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                {(['text', 'markdown', 'code'] as const).map((mode) => {
                  const Icon = getModeIcon(mode);
                  return (
                    <Button
                      key={mode}
                      variant={canvas.mode === mode ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onModeChange(mode)}
                      className="h-7 w-7 p-0"
                      title={`${mode} mode`}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  );
                })}
              </div>

              <Button variant="ghost" size="sm" onClick={handleSave} title="Save (Ctrl+S)">
                <Save className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleExport} title="Export">
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleClose} title="Close (Esc)">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Editor */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <textarea
              ref={editorRef}
              value={canvas.content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder={`Start writing your ${canvas.mode} document...`}
              className="w-full h-full p-6 bg-muted/30 border-0 outline-none resize-none font-mono text-sm leading-relaxed"
              style={{
                fontFamily: canvas.mode === 'code' ? 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' : 'inherit'
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};