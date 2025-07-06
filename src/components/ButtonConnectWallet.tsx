'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { truncateAddress } from '@/utils/helpers/string';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ChevronDown, LogOut, User } from 'lucide-react';

export const ButtonConnectWallet = () => {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { isAuthenticated, handleLogin, handleLogout, isLoading } = useAuth();

  const handleConnectWallet = async () => {
    await open();
  };

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      await handleLogin();
    }
  };

  return (
    <>
      {isConnected ? (
        /* User Dropdown Menu */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={'sm'}>
              <User className="h-4 w-4" />
              {truncateAddress(address || '', 4)}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleAuthAction} disabled={isLoading}>
              {isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                'Login with Base'
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          size={'sm'}
          onClick={() => {
            handleConnectWallet();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};
