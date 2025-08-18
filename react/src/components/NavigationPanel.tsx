import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MessageSquare, 
  History, 
  Book, 
  Play, 
  Terminal, 
  Wifi, 
  Languages, 
  Settings, 
  Grid3X3,
  Github,
  Sun,
  Moon,
  X
} from 'lucide-react';

interface NavigationPanelProps {
  isOpen: boolean;
  activeView: string;
  theme: 'light' | 'dark';
  onViewChange: (view: string) => void;
  onThemeToggle: () => void;
  onClose: () => void;
}

export const NavigationPanel = ({
  isOpen,
  activeView,
  theme,
  onViewChange,
  onThemeToggle,
  onClose,
}: NavigationPanelProps) => {
  const navigate = useNavigate();
  const navigationItems = [
    { id: 'new-chat', label: 'New Chat', icon: MessageSquare, description: 'Start a new conversation' },
    { id: 'history', label: 'History', icon: History, description: 'Browse saved chats' },
    { id: 'docs', label: 'Documentation', icon: Book, description: 'Browse documentation and guides' },
    { id: 'playground', label: 'Playground', icon: Play, description: 'Interactive development environment' },
    { id: 'console', label: 'Console', icon: Terminal, description: 'View application logs and debug info' },
    { id: 'proxy', label: 'Proxy Settings', icon: Wifi, description: 'Configure network proxy settings' },
    { id: 'language', label: 'Language', icon: Languages, description: 'Change interface language' },
    { id: 'settings', label: 'System Settings', icon: Settings, description: 'Application preferences and system settings' },
    { id: 'all-pages', label: 'All Pages', icon: Grid3X3, description: 'View all available pages' },
  ];

  if (!isOpen) return null;

  return (
    <div className={`
      fixed lg:static inset-0 lg:inset-auto
      w-full lg:w-80 
      bg-surface lg:bg-sidebar
      border-r border-border
      z-40 lg:z-auto
      animate-slide-in-left
      flex flex-col
    `}>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <div className="text-xl font-bold bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
          SEFGH-AI
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://github.com/sefgh-ai', '_blank')}
              >
                <Github className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub Repository</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onThemeToggle}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Close navigation</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === item.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3 transition-all duration-200 hover:scale-[1.02] hover:bg-accent/50"
                  onClick={() => {
                    if (item.id === 'history' || item.id === 'new-chat') {
                      onViewChange(item.id);
                    } else if ('route' in item && item.route) {
                      navigate(item.route);
                    } else if (item.id === 'settings') {
                      navigate('/settings');
                    } else {
                      onViewChange(item.id);
                    }
                    // Close nav on mobile when item is selected
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </nav>
    </div>
  );
};
