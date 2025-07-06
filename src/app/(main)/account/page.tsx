import AccountScreen from '@/screens/Account';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Pre-Market',
  description: 'Manage your account settings and profile',
};

export default function AccountPage() {
  return <AccountScreen />;
}
