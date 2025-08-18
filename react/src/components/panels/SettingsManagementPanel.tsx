import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsManagementPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    appName: 'SEFGH-AI',
    maxTokens: '4096',
    defaultModel: 'gpt-4o',
    autoSave: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    usageAlerts: true,
    errorNotifications: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: '24',
    apiKeyRotation: '90',
    auditLogs: true,
    
    // Appearance
    theme: 'system',
    sidebar: 'expanded',
    compactMode: false,
    animations: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically save to localStorage or send to an API
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      appName: 'SEFGH-AI',
      maxTokens: '4096',
      defaultModel: 'gpt-4o',
      autoSave: true,
      emailNotifications: true,
      pushNotifications: false,
      usageAlerts: true,
      errorNotifications: true,
      twoFactorAuth: false,
      sessionTimeout: '24',
      apiKeyRotation: '90',
      auditLogs: true,
      theme: 'system',
      sidebar: 'expanded',
      compactMode: false,
      animations: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Application Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your SEFGH-AI application preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="appName">Application Name</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => handleSettingChange('appName', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="defaultModel">Default Model</Label>
                <select 
                  id="defaultModel"
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={settings.defaultModel}
                  onChange={(e) => handleSettingChange('defaultModel', e.target.value)}
                >
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => handleSettingChange('maxTokens', e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-save Settings</Label>
                  <p className="text-sm text-muted-foreground">Automatically save changes</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Usage Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when reaching usage limits</p>
                </div>
                <Switch
                  checked={settings.usageAlerts}
                  onCheckedChange={(checked) => handleSettingChange('usageAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Error Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify on system errors</p>
                </div>
                <Switch
                  checked={settings.errorNotifications}
                  onCheckedChange={(checked) => handleSettingChange('errorNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="apiKeyRotation">API Key Rotation (days)</Label>
                <Input
                  id="apiKeyRotation"
                  type="number"
                  value={settings.apiKeyRotation}
                  onChange={(e) => handleSettingChange('apiKeyRotation', e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Logs</Label>
                  <p className="text-sm text-muted-foreground">Keep detailed activity logs</p>
                </div>
                <Switch
                  checked={settings.auditLogs}
                  onCheckedChange={(checked) => handleSettingChange('auditLogs', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <select 
                  id="theme"
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="sidebar">Sidebar Default</Label>
                <select 
                  id="sidebar"
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={settings.sidebar}
                  onChange={(e) => handleSettingChange('sidebar', e.target.value)}
                >
                  <option value="expanded">Expanded</option>
                  <option value="collapsed">Collapsed</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                </div>
                <Switch
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => handleSettingChange('compactMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                </div>
                <Switch
                  checked={settings.animations}
                  onCheckedChange={(checked) => handleSettingChange('animations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagementPanel;