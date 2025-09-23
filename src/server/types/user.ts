export interface User {
  id: string;
  name: string;
  avatar?: string | null;
  banner?: string | null;
  description?: string | null;
  socialMedia: {
    twitter: string;
    telegram: string;
    discord: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  kycStatus: 'pending' | 'verified' | 'rejected';
  status: 'active' | 'banned' | 'pending';
  // Referral fields
  inviteCode?: string;
  referredByUserId?: string;
  createdAt: Date;
  updatedAt: Date;
}
