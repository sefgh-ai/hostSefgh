import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Copy, QrCode, Share2, Calendar, Eye, Lock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  contentType?: string;
  linkType?: 'profile' | 'document' | 'chat' | 'settings' | 'other';
  title?: string;
  description?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  content,
  contentType = 'application/json',
  linkType = 'other',
  title: defaultTitle = '',
  description: defaultDescription = '',
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [expiresIn, setExpiresIn] = useState<string>('never');
  const [maxViews, setMaxViews] = useState<string>('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const generateShareLink = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your shared link');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create shared links');
        return;
      }

      // Generate file ID
      const { data: fileIdData, error: fileIdError } = await supabase.rpc('generate_file_id');
      if (fileIdError) throw fileIdError;

      // Calculate expiry date
      let expiresAt = null;
      if (expiresIn !== 'never') {
        const now = new Date();
        switch (expiresIn) {
          case '1hour':
            expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
            break;
          case '1day':
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
          case '1week':
            expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case '1month':
            expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      // Create the shareable link
      const { error } = await supabase.from('shareable_links').insert({
        file_id: fileIdData,
        title: title.trim(),
        description: description.trim() || null,
        link_type: linkType,
        content: content,
        content_type: contentType,
        user_id: user.id,
        max_views: maxViews ? parseInt(maxViews) : null,
        expires_at: expiresAt,
        password_hash: passwordProtected && password ? btoa(password) : null, // Simple encoding for demo
      });

      if (error) throw error;

      const generatedUrl = `https://share.sefgh.org/${fileIdData}`;
      setShareUrl(generatedUrl);
      setIsCreated(true);
      toast.success('Share link created successfully!');

    } catch (error: any) {
      console.error('Error creating share link:', error);
      toast.error(error.message || 'Failed to create share link');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const resetForm = () => {
    setIsCreated(false);
    setShareUrl('');
    setTitle(defaultTitle);
    setDescription(defaultDescription);
    setExpiresIn('never');
    setMaxViews('');
    setPasswordProtected(false);
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Create Shareable Link
          </DialogTitle>
        </DialogHeader>

        {!isCreated ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your shared content"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expires">Expires In</Label>
                <Select value={expiresIn} onValueChange={setExpiresIn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="1hour">1 Hour</SelectItem>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxViews">Max Views</Label>
                <Input
                  id="maxViews"
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="Unlimited"
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="font-medium">Password Protection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Require a password to access this link
                </p>
              </div>
              <Switch
                checked={passwordProtected}
                onCheckedChange={setPasswordProtected}
              />
            </div>

            {passwordProtected && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
                <CardDescription>
                  {linkType} • {contentType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(content, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={generateShareLink} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Share Link'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-green-600">
                  ✓ Share Link Created Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Share URL</Label>
                  <div className="flex gap-2">
                    <Input value={shareUrl} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {expiresIn === 'never' ? 'Never expires' : `Expires in ${expiresIn}`}
                  </Badge>
                  {maxViews && (
                    <Badge variant="outline" className="gap-1">
                      <Eye className="h-3 w-3" />
                      Max {maxViews} views
                    </Badge>
                  )}
                  {passwordProtected && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Password protected
                    </Badge>
                  )}
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Your link is now live at <code className="font-mono">share.sefgh.org</code>. 
                    Anyone with this link can access your shared content according to the settings above.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Create Another
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};