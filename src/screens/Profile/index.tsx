'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import BalanceSection from './components/BalanceSection';
import UserInfoSection from './components/UserInfoSection';

const ProfilePage = () => {
  const { accessToken, fetchProfile } = useAuthStore();
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr] max-w-screen-lg mx-auto">
      {/* User Info and Balance Sections */}
      {/* <div className="lg:col-span-1 grid gap-8"> */}
      <UserInfoSection />
      <BalanceSection />
      {/* </div> */}

      {/* Filled Orders List */}
      {/* <div className="lg:col-span-1">
        <FilledOrdersList />
      </div> */}
    </div>
  );
};

export default ProfilePage;
