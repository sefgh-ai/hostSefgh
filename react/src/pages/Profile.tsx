import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ExternalLink, Check, Link as LinkIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/PageTransition';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';
import { PublicProfileSection } from '@/components/PublicProfileSection';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  pronouns: z.string().optional(),
  email: z.string().email('Invalid email address'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  orcidId: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const pronounOptions = [
  'he/him',
  'she/her',
  'they/them',
  'he/they',
  'she/they',
  'other',
];

const socialPlatforms = [
  'GitHub',
  'LinkedIn',
  'Twitter',
  'Instagram',
  'Facebook',
  'YouTube',
  'TikTok',
  'Personal Website',
];

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, addEmail, removeEmail, connectOrcid, addSocialAccount, removeSocialAccount, loading } = useUser();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUsername, setNewSocialUsername] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Respect user's motion preferences
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const pageVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }
  };

  const cardVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
  };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio,
      pronouns: profile.pronouns,
      email: profile.email,
      url: profile.url,
      company: profile.company,
      location: profile.location,
      orcidId: profile.orcidId,
    },
  });

  const { watch } = form;
  const watchedValues = watch();

  React.useEffect(() => {
    const hasChanges = Object.keys(watchedValues).some((key) => {
      const typedKey = key as keyof ProfileFormData;
      return watchedValues[typedKey] !== profile[typedKey];
    });
    setIsDirty(hasChanges);
  }, [watchedValues, profile]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let url = data.url;
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      await updateProfile({
        ...data,
        url,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await addEmail(newEmail);
      setNewEmail('');
      setShowEmailInput(false);
      toast({
        title: "Email added",
        description: "Email address has been added to your account.",
      });
    } catch (error) {
      toast({
        title: "Failed to add email",
        description: error instanceof Error ? error.message : "Failed to add email",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEmail = async (email: string) => {
    if (profile.emails.length <= 1) {
      toast({
        title: "Cannot remove email",
        description: "You must have at least one email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      await removeEmail(email);
      toast({
        title: "Email removed",
        description: "Email address has been removed from your account.",
      });
    } catch (error) {
      toast({
        title: "Failed to remove email",
        description: error instanceof Error ? error.message : "Failed to remove email",
        variant: "destructive",
      });
    }
  };

  const handleConnectOrcid = async () => {
    try {
      await connectOrcid();
      toast({
        title: profile.orcidConnected ? "ORCID disconnected" : "ORCID connected",
        description: profile.orcidConnected 
          ? "Your ORCID account has been disconnected." 
          : "Your ORCID account has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "ORCID connection failed",
        description: error instanceof Error ? error.message : "Failed to connect ORCID",
        variant: "destructive",
      });
    }
  };

  const handleAddSocialAccount = async () => {
    if (!newSocialPlatform || !newSocialUsername) {
      toast({
        title: "Missing information",
        description: "Please select a platform and enter a username",
        variant: "destructive",
      });
      return;
    }

    const url = getSocialUrl(newSocialPlatform, newSocialUsername);

    try {
      await addSocialAccount({
        platform: newSocialPlatform,
        username: newSocialUsername,
        url,
      });
      
      setNewSocialPlatform('');
      setNewSocialUsername('');
      
      toast({
        title: "Social account added",
        description: `${newSocialPlatform} account has been added to your profile.`,
      });
    } catch (error) {
      toast({
        title: "Failed to add social account",
        description: error instanceof Error ? error.message : "Failed to add social account",
        variant: "destructive",
      });
    }
  };

  const getSocialUrl = (platform: string, username: string): string => {
    const urlMap: Record<string, string> = {
      'GitHub': `https://github.com/${username}`,
      'LinkedIn': `https://linkedin.com/in/${username}`,
      'Twitter': `https://twitter.com/${username}`,
      'Instagram': `https://instagram.com/${username}`,
      'Facebook': `https://facebook.com/${username}`,
      'YouTube': `https://youtube.com/@${username}`,
      'TikTok': `https://tiktok.com/@${username}`,
      'Personal Website': username.startsWith('http') ? username : `https://${username}`,
    };
    
    return urlMap[platform] || username;
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <PageTransition>
      <motion.div 
        className="min-h-screen bg-background"
        initial="initial"
        animate="animate"
        variants={pageVariants}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      >
      {/* Enhanced Header with gradient */}
      <motion.header 
        className="border-b bg-gradient-to-r from-primary/10 via-accent/5 to-transparent backdrop-blur-sm"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <AnimatedButton 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </AnimatedButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to dashboard</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your profile information and preferences</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={shouldReduceMotion ? {} : { opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Left Column - Profile Picture & Quick Actions */}
          <motion.div 
            className="lg:col-span-4 space-y-6"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          >
            <div className="bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-6">
              <ProfilePictureUpload
                avatar={profile.avatar}
                name={profile.name}
                onAvatarChange={(url) => updateProfile({ avatar: url })}
              />
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            className="lg:col-span-8"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.1 }}
          >
            <div className="space-y-6">
              {/* Public Profile Section */}
              <PublicProfileSection profileData={profile} />
              
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: shouldReduceMotion ? 0 : 0.2 }}
                >
                  <Card className="bg-card text-card-foreground border-border shadow-sm hover:shadow-md transition-shadow duration-200 relative">
                    {/* Active section indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/70 rounded-r-sm"></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Personal Information
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                      </CardTitle>
                      <CardDescription>Basic information about yourself</CardDescription>
                    </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your full name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell us about yourself..." 
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description about yourself (max 500 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pronouns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pronouns</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pronouns" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pronounOptions.map((pronoun) => (
                                <SelectItem key={pronoun} value={pronoun}>
                                  {pronoun}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  </Card>
                </motion.div>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How people can reach you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Email Addresses</Label>
                      <div className="space-y-2 mt-2">
                        {profile.emails.map((email, index) => (
                          <div key={email} className="flex items-center gap-2">
                            <Input value={email} readOnly className="flex-1" />
                            {index === 0 && <span className="text-xs text-muted-foreground">Primary</span>}
                            {profile.emails.length > 1 && index > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveEmail(email)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        {showEmailInput ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder="Enter email address"
                              type="email"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={handleAddEmail}
                              disabled={loading}
                              size="sm"
                            >
                              Add
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowEmailInput(false)}
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEmailInput(true)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Email Address
                          </Button>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://yourwebsite.com" />
                          </FormControl>
                          <FormDescription>
                            Your personal website or portfolio
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Your work and location details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your company name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Academic & Research */}
                <Card>
                  <CardHeader>
                    <CardTitle>Academic & Research</CardTitle>
                    <CardDescription>Connect your research identity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>ORCID iD</Label>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name="orcidId"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="0000-0000-0000-0000"
                                  disabled={profile.orcidConnected}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant={profile.orcidConnected ? "secondary" : "outline"}
                          onClick={handleConnectOrcid}
                          disabled={loading}
                        >
                          {profile.orcidConnected ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Connected
                            </>
                          ) : (
                            <>
                              <LinkIcon className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Connect your ORCID iD to link your research and publications
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>Connect your social media accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {profile.socialAccounts.map((account) => (
                        <div key={account.id} className="flex items-center gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="text-sm font-medium w-20">{account.platform}</span>
                            <Input value={account.username} readOnly className="flex-1" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(account.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSocialAccount(account.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-2">
                        <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {socialPlatforms.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={newSocialUsername}
                          onChange={(e) => setNewSocialUsername(e.target.value)}
                          placeholder="Username or URL"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddSocialAccount}
                          disabled={!newSocialPlatform || !newSocialUsername || loading}
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 sticky bottom-0 bg-background/95 backdrop-blur-sm py-4 border-t border-border shadow-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        disabled={loading || !isDirty}
                        className="flex-1 lg:flex-none bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{!isDirty ? 'No changes to save' : 'Save your profile changes'}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 lg:flex-none hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
    </PageTransition>
  );
}