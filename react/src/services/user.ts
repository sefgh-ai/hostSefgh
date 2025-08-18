import { UserProfile } from '@/types/user';

// Mock API baseURL - in a real app this would come from environment variables
const API_BASE_URL = '/api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserProfile> => {
  await delay(500);
  
  // In a real app, this would make an authenticated API call
  // For now, return mock data that matches the UserContext default
  return {
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
};

/**
 * Update user profile
 */
export const updateUserProfile = async (body: Partial<UserProfile>): Promise<UserProfile> => {
  await delay(1000);
  
  // In a real app, this would make an authenticated PATCH/PUT request
  // For now, simulate success and return updated data
  
  // Simulate potential API errors
  if (body.email === 'invalid@test.com') {
    throw new Error('This email is already taken');
  }
  
  const currentUser = await getCurrentUser();
  const updatedUser = { ...currentUser, ...body };
  
  console.log('API call: updateUserProfile', body);
  
  return updatedUser;
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  await delay(2000);
  
  // Validate file size and type
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 5MB');
  }
  
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // In a real app, this would upload to a storage service (S3, Cloudinary, etc.)
  // For now, create a local blob URL
  const avatarUrl = URL.createObjectURL(file);
  
  console.log('API call: uploadAvatar', file.name);
  
  return avatarUrl;
};

/**
 * Connect ORCID account
 */
export const connectOrcid = async (): Promise<{ orcidId: string; connected: boolean }> => {
  await delay(1500);
  
  // In a real app, this would initiate OAuth flow with ORCID
  // For now, simulate successful connection
  const orcidId = '0000-0002-1825-0097';
  
  console.log('API call: connectOrcid');
  
  return { orcidId, connected: true };
};

/**
 * Disconnect ORCID account
 */
export const disconnectOrcid = async (): Promise<{ connected: boolean }> => {
  await delay(500);
  
  console.log('API call: disconnectOrcid');
  
  return { connected: false };
};