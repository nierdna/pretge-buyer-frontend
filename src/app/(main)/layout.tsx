'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected, accessToken, loginWithWallet, handleLogin, handleLogout } =
    useAuth();

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
  return <div>{children}</div>;
};

export default MainLayout;
