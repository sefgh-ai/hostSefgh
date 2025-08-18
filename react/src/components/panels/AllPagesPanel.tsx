import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HoverCard } from '@/components/ui/HoverCard';
import { FadeIn } from '@/components/ui/FadeIn';
import { 
  MessageSquare, 
  History, 
  Book, 
  Play, 
  Terminal, 
  Wifi, 
  Languages, 
  Settings,
  Search,
  Github,
  Zap,
  Shield,
  Palette
} from 'lucide-react';

interface AllPagesPanelProps {
  onNavigate: (view: string) => void;
}

export const AllPagesPanel = ({ onNavigate }: AllPagesPanelProps) => {
  const pages = [
    {
      id: 'chat',
      title: 'AI Chat',
      description: 'Start a new conversation with the AI assistant',
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'history',
      title: 'Chat History',
      description: 'Browse your previous conversations',
      icon: History,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'search',
      title: 'GitHub Search',
      description: 'Search and explore GitHub repositories',
      icon: Search,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Learn how to use SEFGH-AI effectively',
      icon: Book,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      id: 'playground',
      title: 'Playground',
      description: 'Experiment with AI features and tools',
      icon: Play,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      id: 'console',
      title: 'Developer Console',
      description: 'View application logs and debug information',
      icon: Terminal,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
    },
    {
      id: 'proxy',
      title: 'Proxy Settings',
      description: 'Configure network proxy settings',
      icon: Wifi,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      id: 'language',
      title: 'Language',
      description: 'Change the interface language',
      icon: Languages,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      id: 'animation-showcase',
      title: 'Animation Showcase',
      description: 'Explore the enhanced UI animations and interactions',
      icon: Palette,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Customize your application preferences',
      icon: Settings,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Search',
      description: 'Natural language queries for GitHub repositories',
    },
    {
      icon: Github,
      title: 'GitHub Integration',
      description: 'Direct access to GitHub API for real-time data',
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your data stays secure with local storage',
    },
    {
      icon: Palette,
      title: 'Customizable',
      description: 'Multiple themes and language support',
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to SEFGH-AI</h1>
        <p className="text-muted-foreground text-lg">
          Your intelligent GitHub search companion powered by advanced AI
        </p>
      </div>

      {/* Features overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <feature.icon className="h-8 w-8 mx-auto mb-2 text-brand" />
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All pages grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page, index) => (
            <FadeIn key={page.id} delay={index * 0.1} direction="up">
              <HoverCard
                className="cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => onNavigate(page.id)}
              >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${page.bgColor}`}>
                    <page.icon className={`h-5 w-5 ${page.color}`} />
                  </div>
                  <h3 className="font-semibold">{page.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
              </div>
            </HoverCard>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-brand">∞</div>
              <div className="text-sm text-muted-foreground">Repositories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand">8</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand">Free</div>
              <div className="text-sm text-muted-foreground">To Use</div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </ScrollArea>
  );
};