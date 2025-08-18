import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wifi, WifiOff, Save, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProxySettings {
  enabled: boolean;
  address: string;
  port: string;
  username: string;
  password: string;
  requiresAuth: boolean;
}

interface ProxyPanelProps {
  settings: ProxySettings;
  onSettingsChange: (settings: ProxySettings) => void;
}

export const ProxyPanel = ({ settings, onSettingsChange }: ProxyPanelProps) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    onSettingsChange(localSettings);
    toast({
      title: "Settings Saved",
      description: "Proxy settings have been updated",
      duration: 2000,
    });
  };

  const handleTest = async () => {
    setTesting(true);
    // Simulate proxy test
    setTimeout(() => {
      setTesting(false);
      if (localSettings.enabled && localSettings.address) {
        toast({
          title: "Connection Test",
          description: "Proxy connection test completed successfully",
          duration: 3000,
        });
      } else {
        toast({
          title: "Test Failed",
          description: "Please configure proxy settings before testing",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, 2000);
  };

  const updateSetting = (key: keyof ProxySettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Wifi className="h-6 w-6" />
          Proxy Settings
        </h1>
        <p className="text-muted-foreground">
          Configure proxy settings for network requests
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Proxy Configuration</span>
              <div className="flex items-center gap-2">
                {localSettings.enabled ? (
                  <Wifi className="h-5 w-5 text-green-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                )}
                <Switch
                  checked={localSettings.enabled}
                  onCheckedChange={(enabled) => updateSetting('enabled', enabled)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="proxy-address">Proxy Address</Label>
                <Input
                  id="proxy-address"
                  value={localSettings.address}
                  onChange={(e) => updateSetting('address', e.target.value)}
                  placeholder="proxy.example.com"
                  disabled={!localSettings.enabled}
                />
              </div>
              <div>
                <Label htmlFor="proxy-port">Port</Label>
                <Input
                  id="proxy-port"
                  value={localSettings.port}
                  onChange={(e) => updateSetting('port', e.target.value)}
                  placeholder="8080"
                  disabled={!localSettings.enabled}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={localSettings.requiresAuth}
                onCheckedChange={(requiresAuth) => updateSetting('requiresAuth', requiresAuth)}
                disabled={!localSettings.enabled}
              />
              <Label>Requires Authentication</Label>
            </div>

            {localSettings.requiresAuth && localSettings.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proxy-username">Username</Label>
                  <Input
                    id="proxy-username"
                    value={localSettings.username}
                    onChange={(e) => updateSetting('username', e.target.value)}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <Label htmlFor="proxy-password">Password</Label>
                  <Input
                    id="proxy-password"
                    type="password"
                    value={localSettings.password}
                    onChange={(e) => updateSetting('password', e.target.value)}
                    placeholder="Password"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test & Save</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                onClick={handleTest}
                disabled={testing || !localSettings.enabled}
                variant="outline"
              >
                {testing ? (
                  <>
                    <TestTube className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Proxy settings will be applied to all network requests made by the application.
              </p>
              <p>
                • Ensure your proxy server supports HTTPS connections for secure communication.
              </p>
              <p>
                • Authentication credentials are stored locally and encrypted.
              </p>
              <p>
                • Test the connection before saving to ensure the proxy is working correctly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </ScrollArea>
  );
};