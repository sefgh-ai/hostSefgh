import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  GitFork, 
  Copy, 
  ExternalLink, 
  Calendar,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Repository {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  license: { name: string } | null;
  updated_at: string;
  html_url: string;
  clone_url: string;
}

interface SearchPanelProps {
  isVisible: boolean;
  onClose: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  autoSearchQuery?: string;
  onQueryProcessed?: () => void;
}

export const SearchPanel = ({ isVisible, onClose, inputRef, autoSearchQuery, onQueryProcessed }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const searchRepositories = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          searchQuery
        )}&sort=stars&order=desc&per_page=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositories(data.items || []);
    } catch (err) {
      setError('Failed to search repositories. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRepositories(query);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle auto search when autoSearchQuery is provided
  useEffect(() => {
    if (autoSearchQuery && isVisible) {
      setQuery(autoSearchQuery);
      searchRepositories(autoSearchQuery);
      onQueryProcessed?.();
    }
  }, [autoSearchQuery, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed lg:static inset-0 lg:inset-auto
      w-full lg:w-96 
      bg-surface lg:bg-sidebar
      border-l border-border
      z-40 lg:z-auto
      animate-slide-in-right
      flex flex-col
    `}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">GitHub Search</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search repositories..."
              className="pr-8"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuery('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-destructive text-sm mb-4 p-3 bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    <div className="skeleton h-5 w-16" />
                    <div className="skeleton h-5 w-16" />
                  </div>
                  <div className="skeleton h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && repositories.length === 0 && query && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No repositories found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}

        {!loading && repositories.length === 0 && !query && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start searching for GitHub repositories</p>
            <p className="text-sm">Enter a search term above</p>
          </div>
        )}

        <div className="space-y-4">
          {repositories.map((repo) => (
            <Card key={repo.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium leading-tight">
                  {repo.full_name}
                </CardTitle>
                {repo.description && (
                  <p className="text-sm text-muted-foreground">
                    {repo.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stargazers_count.toLocaleString()}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks_count.toLocaleString()}
                  </Badge>
                  {repo.language && (
                    <Badge variant="outline">{repo.language}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {formatDate(repo.updated_at)}
                  </span>
                  {repo.license && (
                    <span>{repo.license.name}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(repo.html_url, 'Repository URL')}
                    className="flex-1"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(repo.clone_url, 'Clone URL')}
                    className="flex-1"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(repo.html_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};