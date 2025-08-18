import React, { useState, useEffect } from 'react';
import { WorkbenchPanel, WorkbenchData } from './WorkbenchPanel';
import { Button } from "@/components/ui/button";
import { PenTool, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkbenchManagerProps {
  onWorkbenchOpen?: () => void;
  onWorkbenchClose?: () => void;
}

export function WorkbenchManager({ onWorkbenchOpen, onWorkbenchClose }: WorkbenchManagerProps) {
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);
  const [currentWorkbench, setCurrentWorkbench] = useState<WorkbenchData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();
  
  // Load saved workbenches from localStorage
  useEffect(() => {
    const loadWorkbench = () => {
      try {
        const savedWorkbenches = JSON.parse(localStorage.getItem('sefgh-workbenches') || '[]');
        
        // If we have a current workbench ID saved, load that one
        const currentId = localStorage.getItem('sefgh-current-workbench-id');
        if (currentId) {
          const found = savedWorkbenches.find((w: WorkbenchData) => w.id === currentId);
          if (found) {
            setCurrentWorkbench({
              ...found,
              lastModified: new Date(found.lastModified)
            });
          }
        }
      } catch (error) {
        console.error('Failed to load workbenches:', error);
      }
    };
    
    loadWorkbench();
  }, []);
  
  const openWorkbench = () => {
    if (!currentWorkbench) {
      // Create a new workbench if none exists
      const newWorkbench: WorkbenchData = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Untitled Workbench',
        content: '',
        mode: 'markdown',
        lastModified: new Date(),
        version: 1
      };
      setCurrentWorkbench(newWorkbench);
    }
    
    setIsWorkbenchOpen(true);
    setHasUnsavedChanges(false);
    onWorkbenchOpen?.();
  };
  
  const closeWorkbench = () => {
    setIsWorkbenchOpen(false);
    onWorkbenchClose?.();
  };
  
  const saveWorkbench = (workbench: WorkbenchData) => {
    setCurrentWorkbench(workbench);
    setHasUnsavedChanges(false);
    
    // Save to localStorage
    try {
      const savedWorkbenches = JSON.parse(localStorage.getItem('sefgh-workbenches') || '[]');
      const existingIndex = savedWorkbenches.findIndex((w: WorkbenchData) => w.id === workbench.id);
      
      if (existingIndex >= 0) {
        savedWorkbenches[existingIndex] = workbench;
      } else {
        savedWorkbenches.push(workbench);
      }
      
      localStorage.setItem('sefgh-workbenches', JSON.stringify(savedWorkbenches));
      localStorage.setItem('sefgh-current-workbench-id', workbench.id);
    } catch (error) {
      console.error('Failed to save workbench:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your workbench",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  const updateWorkbenchContent = (content: string) => {
    if (currentWorkbench) {
      setCurrentWorkbench({ ...currentWorkbench, content });
      setHasUnsavedChanges(true);
    }
  };
  
  const updateWorkbenchTitle = (title: string) => {
    if (currentWorkbench) {
      setCurrentWorkbench({ ...currentWorkbench, title });
      setHasUnsavedChanges(true);
    }
  };
  
  const updateWorkbenchMode = (mode: 'markdown' | 'code' | 'text') => {
    if (currentWorkbench) {
      setCurrentWorkbench({ ...currentWorkbench, mode });
      setHasUnsavedChanges(true);
    }
  };
  
  const updateWorkbenchLanguage = (language: string) => {
    if (currentWorkbench) {
      setCurrentWorkbench({ ...currentWorkbench, language });
      setHasUnsavedChanges(true);
    }
  };

  return (
    <>
      <Button
        variant="outline" 
        size="sm"
        onClick={openWorkbench}
        className="flex items-center gap-2"
      >
        <PenTool className="h-4 w-4" />
        <span>Workbench</span>
      </Button>
      
      {isWorkbenchOpen && currentWorkbench && (
        <WorkbenchPanel
          isOpen={isWorkbenchOpen}
          workbench={currentWorkbench}
          hasUnsavedChanges={hasUnsavedChanges}
          onClose={closeWorkbench}
          onSave={saveWorkbench}
          onContentChange={updateWorkbenchContent}
          onTitleChange={updateWorkbenchTitle}
          onModeChange={updateWorkbenchMode}
          onLanguageChange={updateWorkbenchLanguage}
        />
      )}
    </>
  );
}