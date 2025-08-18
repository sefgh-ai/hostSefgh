import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Trash2, 
  Edit2,
  Clock,
  User,
  Plus,
  Search
} from 'lucide-react';

interface ModelSettings {
  modelName: string;
  litellmModelName: string;
  inputCost: string;
  outputCost: string;
  apiBase: string;
}

const ModelsPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [modelSettings, setModelSettings] = useState<ModelSettings>({
    modelName: 'gpt-4o',
    litellmModelName: '',
    inputCost: '2.5000',
    outputCost: '10.0000',
    apiBase: ''
  });

  const models = [
    { name: 'gpt-4o', provider: 'openai', status: 'active', cost: '$2.50/$10.00' },
    { name: 'claude-3-sonnet', provider: 'anthropic', status: 'active', cost: '$3.00/$15.00' },
    { name: 'gemini-pro', provider: 'google', status: 'inactive', cost: '$1.25/$3.75' }
  ];

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Public Model Name: gpt-4o</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            c1b2a30484c45c1ea0a69711c576908d8f26d69f04aae5a289a8a2c79b5886b4
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-600 hover:bg-blue-50">
            <RefreshCw className="h-4 w-4" />
            Re-use Credentials
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-600 border-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            Delete Model
          </Button>
        </div>
      </div>

      {/* Model List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Models</CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredModels.map((model) => (
              <div key={model.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${model.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <span className="font-medium">{model.name}</span>
                    <p className="text-sm text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{model.cost}</span>
                  <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                    {model.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="raw-json" className="text-sm">Raw JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">Provider</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">openai</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">SEFGH-AI Model</div>
                <span className="font-medium">gpt-4o</span>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground mb-2">Pricing</div>
                <div className="space-y-1">
                  <div className="text-sm">Input: $2.50/1M tokens</div>
                  <div className="text-sm">Output: $10.00/1M tokens</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Creation Info */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Created At Not Set</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created By Not Set</span>
            </div>
          </div>

          {/* Model Settings */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-medium">Model Settings</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
                Edit Model
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="modelName" className="text-sm font-medium">Model Name</Label>
                  <Input
                    id="modelName"
                    value={modelSettings.modelName}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, modelName: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="litellmModelName" className="text-sm font-medium">SEFGH-AI Model Name</Label>
                  <Input
                    id="litellmModelName"
                    value={modelSettings.litellmModelName}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, litellmModelName: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="inputCost" className="text-sm font-medium">Input Cost (per 1M tokens)</Label>
                  <Input
                    id="inputCost"
                    value={modelSettings.inputCost}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, inputCost: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="outputCost" className="text-sm font-medium">Output Cost (per 1M tokens)</Label>
                  <Input
                    id="outputCost"
                    value={modelSettings.outputCost}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, outputCost: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="apiBase" className="text-sm font-medium">API Base</Label>
                  <Input
                    id="apiBase"
                    value={modelSettings.apiBase}
                    onChange={(e) => setModelSettings(prev => ({ ...prev, apiBase: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw-json">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Raw JSON Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
{JSON.stringify({
  model_name: modelSettings.modelName,
  litellm_params: {
    model: modelSettings.litellmModelName || "gpt-4o",
    api_base: modelSettings.apiBase || null
  },
  model_info: {
    input_cost_per_token: parseFloat(modelSettings.inputCost) / 1000000,
    output_cost_per_token: parseFloat(modelSettings.outputCost) / 1000000,
    max_tokens: 4096
  }
}, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelsPanel;