import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  X, 
  Upload, 
  Trash2, 
  Settings, 
  User, 
  Share2, 
  Globe, 
  Eye, 
  EyeOff,
  Users,
  Mail,
  QrCode,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccountSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettingsPanel = ({ isOpen, onClose }: AccountSettingsPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isPrivate, setIsPrivate] = useState(true);
  const [publishManually, setPublishManually] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Mock data
  const [userProfile, setUserProfile] = useState({
    firstName: 'Florence',
    lastName: 'Shaw',
    email: 'florence@sefgh.ai',
    username: 'florence_shaw',
    bio: "Hello Planet! I'm a product designer base in India. I'm a professional UI/UX Designer with more than 5+ years of experience focused on web and mobile application design, wireframing, and prototyping with delivering high-quality designs.",
    timezone: 'UTC-8:00',
    avatar: '/lovable-uploads/c3ec3d15-1cdd-4327-bbc4-aa01c63a89e0.png'
  });

  const [invitedUsers] = useState([
    { id: 1, name: 'Esther Howard', email: 'esther@gmail.com', avatar: '', status: 'Invited' },
    { id: 2, name: 'Kristin Watson', email: 'kristin@gmail.com', avatar: '', status: 'Invited' },
    { id: 3, name: 'Kathryn Murphy', email: 'kathryn@gmail.com', avatar: '', status: 'Invited' }
  ]);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully.",
      duration: 3000,
    });
  };

  const handleInviteUser = () => {
    if (inviteEmail) {
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
        duration: 3000,
      });
      setInviteEmail('');
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText('https://websitename.com/invite/abc123');
    toast({
      title: "Link copied",
      description: "Private invite link copied to clipboard",
      duration: 2000,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-background border-l z-50 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-semibold">Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Update your photo & personal details here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="flex h-full">
              {/* Sidebar Navigation */}
              <div className="w-64 border-r bg-muted/30 p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeTab === 'general' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    General Details
                  </button>
                  <button
                    onClick={() => setActiveTab('permissions')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeTab === 'permissions' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    User Permission
                  </button>
                  <button
                    onClick={() => setActiveTab('sharing')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeTab === 'sharing' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    Share & Privacy
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    Billing
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    Payments
                  </button>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    Plans
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    Notification
                  </button>
                  <button
                    onClick={() => setActiveTab('domain')}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    Domain
                  </button>
                  <button
                    onClick={() => setActiveTab('language')}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    Language
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal information</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">Full name</Label>
                              <Input
                                id="firstName"
                                placeholder="Enter first name"
                                value={userProfile.firstName}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="sr-only">Last name</Label>
                              <Input
                                id="lastName"
                                placeholder="Enter last name"
                                value={userProfile.lastName}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userProfile.email}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="username">Username</Label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                                Workstation.com/
                              </span>
                              <Input
                                id="username"
                                className="rounded-l-none"
                                value={userProfile.username}
                                onChange={(e) => setUserProfile(prev => ({ ...prev, username: e.target.value }))}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="bio">Bio (Write a short introduction)</Label>
                            <Textarea
                              id="bio"
                              className="min-h-[120px]"
                              value={userProfile.bio}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="timezone">Time zone</Label>
                            <Select value={userProfile.timezone} onValueChange={(value) => setUserProfile(prev => ({ ...prev, timezone: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UTC-8:00">Pacific Standard Time (PST) UTC-8:00</SelectItem>
                                <SelectItem value="UTC-5:00">Eastern Standard Time (EST) UTC-5:00</SelectItem>
                                <SelectItem value="UTC+0:00">Greenwich Mean Time (GMT) UTC+0:00</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Personal information</Label>
                            <div className="mt-2">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={userProfile.avatar} alt={userProfile.firstName} />
                                  <AvatarFallback>
                                    {userProfile.firstName[0]}{userProfile.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Edit your photo</p>
                                  <div className="flex gap-2 mt-2">
                                    <Button variant="outline" size="sm">Delete</Button>
                                    <Button variant="outline" size="sm">Update</Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 p-4 border-2 border-dashed border-muted rounded-lg text-center">
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  <button className="text-primary underline">Click to upload</button> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  SVG, PNG, JPG or GIF (Max. 800x400px)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sharing' && (
                  <div className="space-y-6">
                    <Tabs defaultValue="share" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="share">Share</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        <TabsTrigger value="publishing">Publishing</TabsTrigger>
                        <TabsTrigger value="domain">Domain</TabsTrigger>
                      </TabsList>

                      <TabsContent value="share" className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 border-2 border-dashed rounded-lg">
                            <QrCode className="h-16 w-16" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="h-4 w-4" />
                              <span className="text-sm text-muted-foreground">websitename.com</span>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium">Custom Domain</h4>
                                <p className="text-sm text-muted-foreground">Available on paid team plans</p>
                                <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-4">Invite users</h4>
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Enter email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                            />
                            <Button onClick={handleInviteUser}>Send invite</Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            We'll email team instructions and a magic link to sign in.
                          </p>

                          <div className="space-y-2">
                            {invitedUsers.map((user) => (
                              <div key={user.id} className="flex items-center gap-3 p-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <Badge variant="secondary">{user.status}</Badge>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4" />

                          <Button 
                            variant="outline" 
                            onClick={copyInviteLink}
                            className="w-full justify-start gap-2"
                          >
                            <Share2 className="h-4 w-4" />
                            Get private invite link
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="privacy" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium">Private</p>
                                <p className="text-sm text-muted-foreground">Only users you choose can access</p>
                              </div>
                            </div>
                            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium">Public</p>
                                <p className="text-sm text-muted-foreground">Anyone with the link can access</p>
                              </div>
                            </div>
                            <Switch checked={!isPrivate} onCheckedChange={(checked) => setIsPrivate(!checked)} />
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-3">Users</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium">Users in the users table</p>
                                  <p className="text-sm text-muted-foreground">Only users in the users table can sign in</p>
                                </div>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                  <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                  <p className="font-medium">Your team</p>
                                  <p className="text-sm text-muted-foreground">Only members of your team can sign in</p>
                                </div>
                              </div>
                              <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="font-medium">Anyone from domain(s)</p>
                                  <p className="text-sm text-muted-foreground">Only users with your email domain</p>
                                </div>
                              </div>
                              <Switch />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                                  <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <p className="font-medium">Any email in table</p>
                                  <p className="text-sm text-muted-foreground">Anyone with email included in a table</p>
                                </div>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="publishing" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Settings className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Publish manually</p>
                              <p className="text-sm text-muted-foreground">
                                Choose when changes are published to your app. 
                                Unpublished changes are not shown to your users and can be discarded.
                              </p>
                            </div>
                          </div>
                          <Switch checked={publishManually} onCheckedChange={setPublishManually} />
                        </div>

                        {publishManually && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Your project is published</span>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Automatically published 6 minutes ago
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">Unpublish</Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="domain" className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="h-4 w-4" />
                              <span className="text-sm">websitename.com</span>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={copyInviteLink}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button variant="outline" size="sm">Copy app link</Button>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-2">Custom Domain</h4>
                          <p className="text-sm text-muted-foreground mb-4">Available on paid team plans</p>
                          <Button variant="outline">Configure</Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {activeTab === 'permissions' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">User Permissions</h3>
                      <p className="text-muted-foreground mb-6">
                        Manage user access and permissions for your application.
                      </p>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">
                              User permission management is under development.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};