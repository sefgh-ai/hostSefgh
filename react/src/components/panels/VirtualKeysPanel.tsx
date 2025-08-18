import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Key, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

interface VirtualKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const VirtualKeysPanel = () => {
  const [keys, setKeys] = useState<VirtualKey[]>([
    {
      id: '1',
      name: 'OpenAI Production Key',
      key: 'sk-***************************',
      provider: 'OpenAI',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Anthropic Test Key',
      key: 'sk-ant-*********************',
      provider: 'Anthropic',
      status: 'active',
      createdAt: '2024-01-10'
    }
  ]);

  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState({ name: '', key: '', provider: '' });

  const handleCreateKey = () => {
    if (newKey.name && newKey.key && newKey.provider) {
      const key: VirtualKey = {
        id: Date.now().toString(),
        name: newKey.name,
        key: `${newKey.key.substring(0, 8)}***${newKey.key.substring(newKey.key.length - 4)}`,
        provider: newKey.provider,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setKeys([...keys, key]);
      setNewKey({ name: '', key: '', provider: '' });
      setIsCreating(false);
    }
  };

  const handleDeleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Virtual Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your API keys and credentials
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Key
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Virtual Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={newKey.name}
                onChange={(e) => setNewKey({...newKey, name: e.target.value})}
                placeholder="e.g., OpenAI Production Key"
              />
            </div>
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={newKey.provider}
                onChange={(e) => setNewKey({...newKey, provider: e.target.value})}
                placeholder="e.g., OpenAI, Anthropic"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={newKey.key}
                onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                placeholder="sk-..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateKey}>Create Key</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {keys.map((key) => (
          <Card key={key.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {showKey === key.id ? key.key : key.key}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                      >
                        {showKey === key.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                    {key.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{key.provider}</span>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteKey(key.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeysPanel;