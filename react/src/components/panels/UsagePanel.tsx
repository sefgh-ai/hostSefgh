import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

const UsagePanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const usageStats = [
    { metric: 'Total Requests', value: '12,847', change: '+23%', trend: 'up' },
    { metric: 'Total Tokens', value: '2.4M', change: '+18%', trend: 'up' },
    { metric: 'Total Cost', value: '$247.83', change: '+15%', trend: 'up' },
    { metric: 'Avg Response Time', value: '1.2s', change: '-8%', trend: 'down' }
  ];

  const recentUsage = [
    { date: '2024-01-15', model: 'gpt-4o', requests: 145, tokens: 28500, cost: '$12.45' },
    { date: '2024-01-14', model: 'gpt-4o', requests: 132, tokens: 26400, cost: '$11.20' },
    { date: '2024-01-13', model: 'claude-3', requests: 89, tokens: 17800, cost: '$8.90' },
    { date: '2024-01-12', model: 'gpt-4o', requests: 156, tokens: 31200, cost: '$13.65' },
    { date: '2024-01-11', model: 'gemini-pro', requests: 78, tokens: 15600, cost: '$6.24' }
  ];

  const topModels = [
    { name: 'gpt-4o', usage: '45%', requests: 5840, cost: '$124.30' },
    { name: 'claude-3-sonnet', usage: '28%', requests: 3597, cost: '$87.45' },
    { name: 'gemini-pro', usage: '15%', requests: 1927, cost: '$23.80' },
    { name: 'gpt-3.5-turbo', usage: '12%', requests: 1542, cost: '$12.28' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Usage Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your API usage, costs, and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {usageStats.map((stat) => (
          <Card key={stat.metric}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.metric}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">By Models</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded">
                  <p className="text-muted-foreground">Usage chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded">
                  <p className="text-muted-foreground">Cost chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>Top Models by Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topModels.map((model) => (
                  <div key={model.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.requests.toLocaleString()} requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{model.usage}</Badge>
                        <span className="text-sm font-medium">{model.cost}</span>
                      </div>
                      <div className="w-24 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: model.usage }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Usage Logs</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsage.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{log.model}</span>
                        <p className="text-sm text-muted-foreground">{log.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Requests:</span>
                        <span className="ml-1 font-medium">{log.requests}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tokens:</span>
                        <span className="ml-1 font-medium">{log.tokens.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="ml-1 font-medium">{log.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsagePanel;