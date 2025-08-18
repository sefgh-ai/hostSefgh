import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { TestTube, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  id: string;
  provider: string;
  model: string;
  status: 'success' | 'failed' | 'running';
  response?: string;
  error?: string;
  timestamp: string;
}

const TestKeyPanel = () => {
  const [selectedKey, setSelectedKey] = useState('');
  const [testPrompt, setTestPrompt] = useState('Hello, how are you?');
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: '1',
      provider: 'OpenAI',
      model: 'gpt-4',
      status: 'success',
      response: 'Hello! I\'m doing well, thank you for asking.',
      timestamp: '2024-01-15 14:30:22'
    },
    {
      id: '2',
      provider: 'Anthropic',
      model: 'claude-3',
      status: 'failed',
      error: 'Invalid API key',
      timestamp: '2024-01-15 14:25:10'
    }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTest = async () => {
    if (!selectedKey || !testPrompt) return;
    
    setIsRunning(true);
    
    // Simulate API test
    const testResult: TestResult = {
      id: Date.now().toString(),
      provider: 'OpenAI',
      model: 'gpt-4',
      status: 'running',
      timestamp: new Date().toLocaleString()
    };
    
    setTestResults([testResult, ...testResults]);
    
    // Simulate async result
    setTimeout(() => {
      setTestResults(prev => prev.map(result => 
        result.id === testResult.id 
          ? { 
              ...result, 
              status: Math.random() > 0.3 ? 'success' : 'failed',
              response: Math.random() > 0.3 ? 'Test response from AI model' : undefined,
              error: Math.random() > 0.3 ? undefined : 'Connection timeout'
            }
          : result
      ));
      setIsRunning(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'success' ? 'default' : status === 'failed' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Test Key</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Test your API keys to ensure they're working correctly
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Run API Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="keySelect">Select Virtual Key</Label>
            <select 
              id="keySelect"
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
            >
              <option value="">Choose a key to test...</option>
              <option value="openai-prod">OpenAI Production Key</option>
              <option value="anthropic-test">Anthropic Test Key</option>
            </select>
          </div>

          <div>
            <Label htmlFor="testPrompt">Test Prompt</Label>
            <Textarea
              id="testPrompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Enter a test prompt..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleRunTest} 
            disabled={!selectedKey || !testPrompt || isRunning}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running Test...' : 'Run Test'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((result) => (
              <div key={result.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.provider} - {result.model}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">{result.timestamp}</span>
                </div>
                
                {result.response && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Response:</strong> {result.response}
                  </div>
                )}
                
                {result.error && (
                  <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-sm">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestKeyPanel;