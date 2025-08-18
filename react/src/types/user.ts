/**
 * User Profile type definition
 * This matches the existing UserProfile interface but is centralized here for consistency
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  pronouns?: string;
  emails: string[];
  url?: string;
  company?: string;
  location?: string;
  orcidId?: string;
  orcidConnected: boolean;
  socialAccounts: SocialAccount[];
  // Optional fields for enhanced profile
  avatarUrl?: string; // For new uploads
  emailPublic?: string; // Public email different from primary
}

/**
 * Social Account type definition
 */
export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
}

/**
 * API request/response types
 */
export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  pronouns?: string;
  emailPublic?: string;
  url?: string;
  company?: string;
  location?: string;
  orcid?: string | null;
  socials?: Array<{ provider: string; url: string }>;
  avatarUrl?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
  message: string;
}

export interface OrcidConnectionResponse {
  orcidId: string;
  connected: boolean;
  message: string;
}

/**
 * Form validation types
 */
export interface ProfileFormData {
  name: string;
  bio?: string;
  pronouns?: string;
  email: string;
  url?: string;
  company?: string;
  location?: string;
  orcidId?: string;
}

/**
 * Component prop types
 */
export interface AvatarUploaderProps {
  avatar?: string;
  name: string;
  onAvatarChange: (url: string) => void;
  className?: string;
}

export interface ProfileFormProps {
  profile: UserProfile;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Provider context types
 */
export interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}