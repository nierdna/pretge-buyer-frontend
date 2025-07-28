import ProfileScreen from '@/screens/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - Account Settings & Wallet Management',
  description:
    'Manage your PreTGE Market profile, wallet connections, account settings, and trading preferences. Update your information and secure your cryptocurrency trading account.',
  keywords: [
    'user profile',
    'account settings',
    'wallet management',
    'profile settings',
    'account information',
    'trading preferences',
    'crypto profile',
    'user dashboard',
  ],
  openGraph: {
    title: 'My Profile - PreTGE Market',
    description: 'Manage your PreTGE Market profile, wallet connections, and account settings.',
    url: 'https://app.pretgemarket.xyz/profile',
    type: 'website',
  },
  twitter: {
    title: 'My Profile - PreTGE Market',
    description: 'Manage your PreTGE Market profile, wallet connections, and account settings.',
  },
  alternates: {
    canonical: 'https://app.pretgemarket.xyz/profile',
  },
  robots: {
    index: false, // Private user data should not be indexed
    follow: true,
  },
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
