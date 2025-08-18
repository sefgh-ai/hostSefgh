import React, { useState, useRef, useEffect } from 'react';
import { Filter, BookOpen, Lightbulb, Brain, Globe, PenTool, ChevronDown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface Tool {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface ToolsDropdownProps {
  onToggleGithubSearch?: () => void;
  onOpenWorkbench?: () => void;
  className?: string;
}

export const ToolsDropdown: React.FC<ToolsDropdownProps> = ({ 
  onToggleGithubSearch,
  onOpenWorkbench,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const tools: Tool[] = [
    {
      id: 'study',
      label: 'Study and Learn',
      icon: BookOpen,
      action: () => console.log('Study and Learn tool launched')
    },
    {
      id: 'think',
      label: 'Think Longer',
      icon: Lightbulb,
      action: () => console.log('Think Longer tool launched')
    },
    {
      id: 'research',
      label: 'Deep Research',
      icon: Brain,
      action: () => console.log('Deep Research tool launched')
    },
    {
      id: 'websearch',
      label: 'Web Search',
      icon: Globe,
      action: () => console.log('Web Search tool launched')
    },
    {
      id: 'workbench',
      label: 'Workbench',
      icon: PenTool,
      action: () => onOpenWorkbench?.()
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: Settings,
      action: () => navigate('/settings')
    }
  ];

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => (prev + 1) % tools.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => prev <= 0 ? tools.length - 1 : prev - 1);
          break;
        case 'Enter':
          if (focusedIndex >= 0) {
            event.preventDefault();
            handleToolClick(tools[focusedIndex]);
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex, tools]);

  const handleToolClick = (tool: Tool) => {
    tool.action();
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 border border-gray-300 dark:border-gray-600"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter className="h-4 w-4" />
        <span>+ Tools</span>
        <ChevronDown 
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`absolute bottom-full left-0 mb-2 bg-gray-900 dark:bg-gray-800 text-white rounded-xl shadow-2xl p-2 w-56 z-50 transition-all duration-200 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ 
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
          role="menu"
          aria-orientation="vertical"
        >
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            const isFocused = index === focusedIndex;
            
            return (
              <div
                key={tool.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                  isFocused 
                    ? 'bg-gray-700 dark:bg-gray-600 scale-105' 
                    : 'hover:bg-gray-700 dark:hover:bg-gray-600 hover:scale-105'
                }`}
                onClick={() => handleToolClick(tool)}
                onMouseEnter={() => setFocusedIndex(index)}
                role="menuitem"
                tabIndex={-1}
              >
                <IconComponent 
                  className={`h-4 w-4 transition-colors duration-150 ${
                    isFocused ? 'text-blue-400' : 'text-gray-300'
                  }`} 
                />
                <span className="text-sm font-medium">{tool.label}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};