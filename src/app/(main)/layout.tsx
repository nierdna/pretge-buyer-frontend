'use client';

import DialogHowToPlay from '@/components/DialogHowToPlay';
import { ReferralBanner } from '@/components/ReferralBanner';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useChainStore } from '@/store/chainStore';
import { useEffect, useRef } from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { fetchProfile } = useAuthStore();
  const { address, isConnected, accessToken, handleLogin, handleLogout } = useAuth();
  const { fetchChains } = useChainStore();
  const prevStateRef = useRef({ address, isConnected, accessToken });
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevStateRef.current = { address, isConnected, accessToken };
      return;
    }

    // Get previous states
    const {
      address: prevAddress,
      isConnected: prevIsConnected,
      accessToken: prevAccessToken,
    } = prevStateRef.current;

    // Update refs for next render
    prevStateRef.current = { address, isConnected, accessToken };

    // Case 1: Has address and isConnected but no accessToken -> Call login
    // Only call login if we didn't have address/connection before or we just lost the token
    if (
      address &&
      isConnected &&
      !accessToken &&
      (!prevAddress || !prevIsConnected || prevAccessToken)
    ) {
      handleLogin();
    }

    // Case 3: No address or isConnected is false, but has accessToken -> Logout
    // Only logout if we just disconnected or lost the address
    if (
      (!address || !isConnected) &&
      accessToken &&
      ((prevAddress && !address) || (prevIsConnected && !isConnected))
    ) {
      handleLogout();
    }
  }, [address, isConnected, accessToken]);

  useEffect(() => {
    fetchChains();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  return (
    <>
      <DialogHowToPlay />
      <ReferralBanner className="mx-4 mb-4" />
      {children}
    </>
  );
};

export default MainLayout;
