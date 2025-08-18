import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  pronouns: string;
  emails: string[];
  url: string;
  company: string;
  location: string;
  orcidId: string;
  orcidConnected: boolean;
  socialAccounts: SocialAccount[];
}

export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  addEmail: (email: string) => Promise<void>;
  removeEmail: (email: string) => Promise<void>;
  connectOrcid: () => Promise<void>;
  addSocialAccount: (account: Omit<SocialAccount, 'id'>) => Promise<void>;
  removeSocialAccount: (id: string) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/lovable-uploads/1bcfb047-f873-4470-9f3a-9c04a86e4787.png',
  bio: 'Passionate researcher and developer working on AI and machine learning projects.',
  pronouns: 'he/him',
  emails: ['john.doe@example.com', 'j.doe@university.edu'],
  url: 'https://johndoe.dev',
  company: 'SEFGH Research',
  location: 'San Francisco, CA',
  orcidId: '0000-0002-1825-0097',
  orcidConnected: false,
  socialAccounts: [
    { id: '1', platform: 'GitHub', username: 'johndoe', url: 'https://github.com/johndoe' },
    { id: '2', platform: 'LinkedIn', username: 'john-doe', url: 'https://linkedin.com/in/john-doe' },
  ],
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Failed to parse saved profile:', error);
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({ ...prev, ...updates }));
      
      // Mock API call would go here
      console.log('Profile updated:', updates);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    setLoading(true);
    try {
      // Validate file
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        throw new Error('Please upload a JPG, PNG, or GIF image');
      }
      if (file.size > 1024 * 1024) {
        throw new Error('Image must be less than 1MB');
      }

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create blob URL for preview (in real app, this would be the uploaded URL)
      const avatarUrl = URL.createObjectURL(file);
      
      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      
      return avatarUrl;
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async (email: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfile(prev => ({
        ...prev,
        emails: [...prev.emails, email]
      }));
    } catch (error) {
      console.error('Failed to add email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeEmail = async (email: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfile(prev => ({
        ...prev,
        emails: prev.emails.filter(e => e !== email)
      }));
    } catch (error) {
      console.error('Failed to remove email:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const connectOrcid = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({
        ...prev,
        orcidConnected: !prev.orcidConnected
      }));
    } catch (error) {
      console.error('Failed to connect ORCID:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSocialAccount = async (account: Omit<SocialAccount, 'id'>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAccount: SocialAccount = {
        ...account,
        id: Date.now().toString(),
      };
      
      setProfile(prev => ({
        ...prev,
        socialAccounts: [...prev.socialAccounts, newAccount]
      }));
    } catch (error) {
      console.error('Failed to add social account:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeSocialAccount = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfile(prev => ({
        ...prev,
        socialAccounts: prev.socialAccounts.filter(acc => acc.id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove social account:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      profile,
      updateProfile,
      uploadAvatar,
      addEmail,
      removeEmail,
      connectOrcid,
      addSocialAccount,
      removeSocialAccount,
      loading,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};