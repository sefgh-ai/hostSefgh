import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Smartphone, 
  LogOut, 
  ChevronDown,
  Check,
  X,
  HelpCircle,
  Mail,
  ExternalLink,
  Keyboard
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isActive: boolean;
}

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  accounts: UserAccount[];
  onSwitchAccount: (accountId: string) => void;
  onSignOut: () => void;
  onSignOutAll: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenDeviceManagement: () => void;
  onOpenKeyboardShortcuts?: () => void;
}

export const UserProfileDropdown = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onSwitchAccount,
  onSignOut,
  onSignOutAll,
  onOpenProfile,
  onOpenSettings,
  onOpenDeviceManagement,
  onOpenKeyboardShortcuts,
}: UserProfileDropdownProps) => {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 z-50">
        <Card className="w-80 bg-card text-card-foreground border shadow-xl">
          {/* Current User Header */}
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{currentUser.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  Pro
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-1 pb-2">
            {/* Menu Items */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => {
                navigate('/profile');
                onClose();
              }}
            >
              <User className="h-4 w-4" />
              <span>My profile</span>
              <span className="text-muted-foreground text-sm ml-auto">@{currentUser.email.split('@')[0]}</span>
            </Button>


            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => {
                onOpenDeviceManagement();
                onClose();
              }}
            >
              <Smartphone className="h-4 w-4" />
              <span>Device management</span>
            </Button>

            <Popover open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHelpOpen(!isHelpOpen);
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-64 p-0 z-[60]" 
                side="left" 
                align="start"
                onInteractOutside={() => {
                  setIsHelpOpen(false);
                  onClose();
                }}
              >
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <h3 className="text-sm font-semibold">Help & Support</h3>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 hover:bg-accent"
                      onClick={() => {
                        window.open('https://sefgh.org/contact', '_blank');
                        setIsHelpOpen(false);
                        onClose();
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Contact us</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 hover:bg-accent"
                      onClick={() => {
                        window.open('mailto:support@sefgh.org', '_blank');
                        setIsHelpOpen(false);
                        onClose();
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      <span>support@sefgh.org</span>
                    </Button>
                    
                    {onOpenKeyboardShortcuts && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 hover:bg-accent"
                        onClick={() => {
                          onOpenKeyboardShortcuts();
                          setIsHelpOpen(false);
                          onClose();
                        }}
                      >
                        <Keyboard className="h-4 w-4" />
                        <span>Keyboard shortcuts</span>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => {
                onSignOut();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </CardContent>

          <Separator />

          {/* Switch Account Section */}
          <CardContent className="pt-3">
            <div className="text-xs text-muted-foreground font-medium mb-2">SWITCH ACCOUNT</div>
            
            <div className="space-y-1">
              {accounts.map((account) => (
                <Button
                  key={account.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 p-2 h-auto hover:bg-accent"
                  onClick={() => {
                    onSwitchAccount(account.id);
                    onClose();
                  }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={account.avatar} alt={account.name} />
                    <AvatarFallback className="text-xs">
                      {account.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{account.name}</div>
                    <div className="text-xs text-muted-foreground">{account.email}</div>
                  </div>
                  {account.isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="my-3" />

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => {
                onSignOutAll();
                onClose();
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out of all accounts</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};