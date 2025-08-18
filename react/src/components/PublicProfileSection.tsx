import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Share2, Copy, QrCode, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ShareModal } from './ShareModal';

interface PublicProfileSectionProps {
  profileData: {
    name: string;
    bio: string;
    email: string;
    location: string;
    [key: string]: any;
  };
}

export const PublicProfileSection: React.FC<PublicProfileSectionProps> = ({ profileData }) => {
  const [publicProfileEnabled, setPublicProfileEnabled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const generateProfileSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const profileSlug = generateProfileSlug(profileData.name);
  const publicProfileUrl = `https://share.sefgh.org/profile-${profileSlug}`;

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy profile link');
    }
  };

  const generateQRCode = () => {
    setShowShareModal(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Public Profile Sharing
          </CardTitle>
          <CardDescription>
            Share your profile with others using a public link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Enable Public Profile</div>
              <div className="text-sm text-muted-foreground">
                Allow others to view your profile via a shareable link
              </div>
            </div>
            <Switch
              checked={publicProfileEnabled}
              onCheckedChange={setPublicProfileEnabled}
            />
          </div>

          {publicProfileEnabled && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="font-medium text-sm">Your Public Profile Link</div>
                <div className="flex gap-2">
                  <Input 
                    value={publicProfileUrl}
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={copyProfileLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateQRCode}>
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1">
                  <Eye className="h-3 w-3" />
                  0 views
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Never expires
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                This link will show a read-only version of your profile information including your name, bio, and public contact details.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        content={{
          name: profileData.name,
          bio: profileData.bio,
          email: profileData.email,
          location: profileData.location,
          avatar: profileData.avatar || null,
          public: true,
        }}
        contentType="application/json"
        linkType="profile"
        title={`${profileData.name}'s Profile`}
        description="Public profile information"
      />
    </>
  );
};