import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { PageTransition } from '@/components/ui/PageTransition';
import { 
  ArrowLeft, 
  Key,
  TestTube,
  Layers,
  BarChart3,
  Users,
  Building,
  UserCog,
  Book,
  Database,
  FileText,
  Beaker,
  Settings as SettingsIcon,
  MessageSquare,
  RefreshCw,
  Trash2
} from 'lucide-react';

// Import panel components
import VirtualKeysPanel from '@/components/panels/VirtualKeysPanel';
import TestKeyPanel from '@/components/panels/TestKeyPanel';
import ModelsPanel from '@/components/panels/ModelsPanel';
import UsagePanel from '@/components/panels/UsagePanel';
import SettingsManagementPanel from '@/components/panels/SettingsManagementPanel';
import { ShareableLinkManager } from '@/components/ShareableLinkManager';

const Settings = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('models');

  const handleBackToChat = () => {
    navigate('/');
  };

  const sidebarItems = [
    { id: 'shared-links', label: 'Shared Links', icon: MessageSquare },
    { id: 'virtual-keys', label: 'Virtual Keys', icon: Key },
    { id: 'test-key', label: 'Test Key', icon: TestTube },
    { id: 'models', label: 'Models', icon: Layers },
    { id: 'usage', label: 'Usage', icon: BarChart3 },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'organizations', label: 'Organizations', icon: Building },
    { id: 'internal-users', label: 'Internal Users', icon: UserCog },
    { id: 'api-reference', label: 'API Reference', icon: Book },
    { id: 'model-hub', label: 'Model Hub', icon: Database },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'experimental', label: 'Experimental', icon: Beaker },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderActivePanel = () => {
    switch (activeNavItem) {
      case 'shared-links':
        return <ShareableLinkManager />;
      case 'virtual-keys':
        return <VirtualKeysPanel />;
      case 'test-key':
        return <TestKeyPanel />;
      case 'models':
        return <ModelsPanel />;
      case 'usage':
        return <UsagePanel />;
      case 'teams':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">Teams</h1>
            <p className="text-muted-foreground">Team management functionality coming soon...</p>
          </div>
        );
      case 'organizations':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">Organizations</h1>
            <p className="text-muted-foreground">Organization management functionality coming soon...</p>
          </div>
        );
      case 'internal-users':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">Internal Users</h1>
            <p className="text-muted-foreground">User management functionality coming soon...</p>
          </div>
        );
      case 'api-reference':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">API Reference</h1>
            <p className="text-muted-foreground">API documentation will be displayed here...</p>
          </div>
        );
      case 'model-hub':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">Model Hub</h1>
            <p className="text-muted-foreground">Browse available models from different providers...</p>
          </div>
        );
      case 'logs':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">System Logs</h1>
            <p className="text-muted-foreground">System logs and debugging information...</p>
          </div>
        );
      case 'experimental':
        return (
          <div className="space-y-6">
            <h1 className="text-xl font-semibold">Experimental Features</h1>
            <p className="text-muted-foreground">Beta features and experimental functionality...</p>
          </div>
        );
      case 'settings':
        return <SettingsManagementPanel />;
      default:
        return <ModelsPanel />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-lg">SEFGH-AI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNavItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Docs</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">User</span>
              <button className="p-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <AnimatedButton
                onClick={handleBackToChat}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Chat
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {renderActivePanel()}
        </div>
      </div>
      </div>
    </PageTransition>
  );
};

export default Settings;