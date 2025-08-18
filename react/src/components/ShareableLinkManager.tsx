import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Share2, 
  Copy, 
  Eye, 
  Calendar, 
  Lock, 
  Trash2, 
  ExternalLink,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ShareableLink {
  id: string;
  file_id: string;
  title: string;
  description: string | null;
  link_type: string;
  status: string;
  current_views: number;
  max_views: number | null;
  expires_at: string | null;
  created_at: string;
  password_hash: string | null;
}

export const ShareableLinkManager: React.FC = () => {
  const [links, setLinks] = useState<ShareableLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('shareable_links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      console.error('Error fetching links:', error);
      toast.error('Failed to load shared links');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (fileId: string) => {
    try {
      const url = `https://share.sefgh.org/${fileId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const toggleLinkStatus = async (linkId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
      const { error } = await supabase
        .from('shareable_links')
        .update({ status: newStatus })
        .eq('id', linkId);

      if (error) throw error;
      
      setLinks(prev => prev.map(link => 
        link.id === linkId ? { ...link, status: newStatus } : link
      ));
      
      toast.success(`Link ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      console.error('Error updating link status:', error);
      toast.error('Failed to update link status');
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('shareable_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
      
      setLinks(prev => prev.filter(link => link.id !== linkId));
      toast.success('Link deleted successfully');
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || link.link_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isViewLimitReached = (currentViews: number, maxViews: number | null) => {
    if (!maxViews) return false;
    return currentViews >= maxViews;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shared Links</h2>
          <p className="text-muted-foreground">
            Manage your shareable links and view analytics
          </p>
        </div>
        <Button onClick={fetchLinks}>
          <Search className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="filter">Filter by Type</Label>
          <select
            id="filter"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="profile">Profile</option>
            <option value="document">Document</option>
            <option value="chat">Chat</option>
            <option value="settings">Settings</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shared links found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first shareable link to get started'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLinks.map((link) => {
            const expired = isExpired(link.expires_at);
            const viewLimitReached = isViewLimitReached(link.current_views, link.max_views);
            const isInactive = link.status !== 'active' || expired || viewLimitReached;

            return (
              <Card key={link.id} className={isInactive ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      {link.description && (
                        <CardDescription className="mt-1">
                          {link.description}
                        </CardDescription>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="capitalize">
                          {link.link_type}
                        </Badge>
                        <Badge 
                          variant={link.status === 'active' ? 'default' : 'secondary'}
                        >
                          {link.status}
                        </Badge>
                        {expired && (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                        {viewLimitReached && (
                          <Badge variant="destructive">View limit reached</Badge>
                        )}
                        {link.password_hash && (
                          <Badge variant="outline" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Protected
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.file_id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://share.sefgh.org/${link.file_id}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleLinkStatus(link.id, link.status)}
                        disabled={expired || viewLimitReached}
                      >
                        {link.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {link.current_views} {link.max_views ? `/ ${link.max_views}` : ''} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {format(new Date(link.created_at), 'MMM d, yyyy')}
                    </div>
                    {link.expires_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Expires {format(new Date(link.expires_at), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      https://share.sefgh.org/{link.file_id}
                    </code>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};