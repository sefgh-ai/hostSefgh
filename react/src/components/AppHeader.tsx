import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfileDropdown } from './UserProfileDropdown';
import { AccountSettingsPanel } from './AccountSettingsPanel';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { LayoutGrid, Search, Sun, Moon, User, Github, ChevronDown, Share2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface AppHeaderProps {
  theme: 'light' | 'dark';
  selectedVersion: string;
  onThemeToggle: () => void;
  onNavToggle: () => void;
  onSearchToggle: () => void;
  onVersionChange: (version: string) => void;
}
export const AppHeader = ({
  theme,
  selectedVersion,
  onThemeToggle,
  onNavToggle,
  onSearchToggle,
  onVersionChange
}: AppHeaderProps) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);

  // Mock user data - in a real app this would come from props or context
  const currentUser = {
    id: '1',
    name: 'Florence Shaw',
    email: 'florence@sefgh.ai',
    avatar: '/lovable-uploads/41e43621-ad73-4439-92cb-9be7579c9766.png',
    isActive: true
  };
  const accounts = [{
    id: '1',
    name: 'Florence Shaw',
    email: 'florence@sefgh.ai',
    avatar: '/lovable-uploads/41e43621-ad73-4439-92cb-9be7579c9766.png',
    isActive: true
  }, {
    id: '2',
    name: 'Amélie Laurent',
    email: 'amelie@sefgh.ai',
    avatar: '/placeholder.svg',
    isActive: false
  }];
  const versions = [{
    id: 'v1',
    label: 'SEFGH v1.0',
    description: 'Legacy model for direct search term matching.'
  }, {
    id: 'v2',
    label: 'SEFGH v2.0',
    description: 'Stable model for reliable keyword searches.'
  }, {
    id: 'v3',
    label: 'SEFGH v3.0',
    description: 'Advanced model with contextual understanding.'
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 h-14 glass-effect border-b">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="text-xl font-bold bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
              SEFGH-AI
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  {versions.find(v => v.id === selectedVersion)?.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {versions.map(version => <DropdownMenuItem key={version.id} onClick={() => onVersionChange(version.id)} className={`flex flex-col items-start gap-1 p-4 ${selectedVersion === version.id ? 'bg-accent' : ''}`}>
                    <div className="font-medium">{version.label}</div>
                    <div className="text-xs text-muted-foreground">{version.description}</div>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => window.open('https://github.com/sefgh-ai', '_blank')} className="hidden md:flex">
                <Github className="h-4 w-4 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub Repository</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onNavToggle}>
                <LayoutGrid className="h-4 w-4 text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Navigation</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onSearchToggle}>
                <Search className="h-4 w-4 text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle GitHub Search</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onThemeToggle} className="hidden md:flex">
                {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-purple-500" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="text-xs">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm">{currentUser.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>User Account</p>
              </TooltipContent>
            </Tooltip>

            <UserProfileDropdown isOpen={isUserDropdownOpen} onClose={() => setIsUserDropdownOpen(false)} currentUser={currentUser} accounts={accounts} onSwitchAccount={accountId => {
            console.log('Switch to account:', accountId);
            // Handle account switching logic
          }} onSignOut={() => {
            console.log('Sign out current user');
            // Handle sign out logic
          }} onSignOutAll={() => {
            console.log('Sign out all accounts');
            // Handle sign out all logic
          }} onOpenProfile={() => {
            console.log('Open profile management');
            // Handle profile management
          }} onOpenSettings={() => {
            setIsAccountSettingsOpen(true);
          }} onOpenDeviceManagement={() => {
            console.log('Open device management');
            // Handle device management
          }} onOpenKeyboardShortcuts={() => {
            setIsKeyboardShortcutsOpen(true);
          }} />
          </div>
        </div>
      </div>

      <AccountSettingsPanel isOpen={isAccountSettingsOpen} onClose={() => setIsAccountSettingsOpen(false)} />
      
      <KeyboardShortcuts isOpen={isKeyboardShortcutsOpen} onClose={() => setIsKeyboardShortcutsOpen(false)} onToggleTheme={onThemeToggle} onToggleNav={onNavToggle} onToggleSearch={onSearchToggle} />
    </header>;
};