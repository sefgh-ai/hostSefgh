import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Trash2, Terminal, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

interface ConsolePanelProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const ConsolePanel = ({ logs, onClearLogs }: ConsolePanelProps) => {
  const { toast } = useToast();

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-destructive';
      case 'warn':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  const copyLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp.toISOString()}] ${log.type.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(logText);
    toast({
      title: "Copied!",
      description: "Console logs copied to clipboard",
      duration: 2000,
    });
  };

  const downloadLogs = () => {
    const logText = logs
      .map(log => `[${log.timestamp.toISOString()}] ${log.type.toUpperCase()}: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Console logs downloaded as file",
      duration: 2000,
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const logCounts = logs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            Developer Console
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLogs}
              disabled={logs.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadLogs}
              disabled={logs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearLogs}
              disabled={logs.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Log statistics */}
        <div className="flex gap-2 mb-4">
          <Badge variant="secondary">
            Total: {logs.length}
          </Badge>
          {Object.entries(logCounts).map(([type, count]) => (
            <Badge key={type} variant="outline" className={getLogColor(type)}>
              {type}: {count}
            </Badge>
          ))}
        </div>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Terminal className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Console Logs</h3>
            <p className="text-muted-foreground text-center">
              Console logs will appear here when the application generates them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Console Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-md bg-muted/30 font-mono text-sm"
                >
                  <div className={`flex-shrink-0 ${getLogColor(log.type)}`}>
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {log.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <div className={`break-words ${getLogColor(log.type)}`}>
                      {log.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </ScrollArea>
  );
};