import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, PenTool, FileText, Code, Type, 
  MoreHorizontal, Calendar, Trash2, Plus 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkbenchData } from './WorkbenchPanel';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkbenchListProps {
  onSelectWorkbench: (workbench: WorkbenchData) => void;
  onCreateNewWorkbench: () => void;
}

export function WorkbenchList({ onSelectWorkbench, onCreateNewWorkbench }: WorkbenchListProps) {
  const [workbenches, setWorkbenches] = useState<WorkbenchData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    loadWorkbenches();
  }, []);
  
  const loadWorkbenches = () => {
    try {
      const savedWorkbenches = JSON.parse(localStorage.getItem('sefgh-workbenches') || '[]');
      
      // Convert date strings back to Date objects
      const parsedWorkbenches = savedWorkbenches.map((workbench: any) => ({
        ...workbench,
        lastModified: new Date(workbench.lastModified)
      }));
      
      // Sort by last modified (newest first)
      parsedWorkbenches.sort((a: WorkbenchData, b: WorkbenchData) => 
        b.lastModified.getTime() - a.lastModified.getTime()
      );
      
      setWorkbenches(parsedWorkbenches);
    } catch (error) {
      console.error('Failed to load workbenches:', error);
    }
  };
  
  const deleteWorkbench = (id: string) => {
    try {
      const savedWorkbenches = JSON.parse(localStorage.getItem('sefgh-workbenches') || '[]');
      const filteredWorkbenches = savedWorkbenches.filter((w: WorkbenchData) => w.id !== id);
      
      localStorage.setItem('sefgh-workbenches', JSON.stringify(filteredWorkbenches));
      
      // Remove current workbench reference if it was the deleted one
      const currentId = localStorage.getItem('sefgh-current-workbench-id');
      if (currentId === id) {
        localStorage.removeItem('sefgh-current-workbench-id');
      }
      
      // Update state
      setWorkbenches(workbenches.filter(w => w.id !== id));
      
      toast({
        title: "Workbench deleted",
        description: "The workbench has been deleted successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to delete workbench:', error);
    }
  };
  
  const getIconForMode = (mode: string, className: string = 'h-4 w-4') => {
    switch (mode) {
      case 'markdown':
        return <FileText className={className} />;
      case 'code':
        return <Code className={className} />;
      default:
        return <Type className={className} />;
    }
  };
  
  const filteredWorkbenches = workbenches.filter(workbench => 
    workbench.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workbench.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            <span>Workbenches</span>
          </h2>
          <Button
            size="sm"
            onClick={onCreateNewWorkbench}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workbenches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <AnimatePresence>
          {filteredWorkbenches.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="divide-y divide-border"
            >
              {filteredWorkbenches.map(workbench => (
                <motion.div
                  key={workbench.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => onSelectWorkbench(workbench)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        {getIconForMode(workbench.mode, 'h-4 w-4 text-muted-foreground')}
                        <h3 className="font-medium truncate">{workbench.title}</h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {workbench.content.substring(0, 100)}
                        {workbench.content.length > 100 ? '...' : ''}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDistanceToNow(workbench.lastModified, { addSuffix: true })}</span>
                        </div>
                        {workbench.language && (
                          <div className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                            {workbench.language}
                          </div>
                        )}
                        {workbench.version && <div>v{workbench.version}</div>}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                          onClick={e => {
                            e.stopPropagation();
                            deleteWorkbench(workbench.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <PenTool className="h-12 w-12 text-muted-foreground mb-4" />
              {searchQuery ? (
                <>
                  <h3 className="font-medium mb-1">No matching workbenches</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-medium mb-1">No workbenches yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first workbench to get started
                  </p>
                  <Button onClick={onCreateNewWorkbench} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Workbench</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}