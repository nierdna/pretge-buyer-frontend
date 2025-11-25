'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCopy } from '@/hooks/use-copy';
import { useAuth } from '@/hooks/useAuth';
import { truncateAddress } from '@/utils/helpers/string';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ChevronDown, Copy, LogOut } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import UserAvatar from './UserAvatar';

export const ButtonConnectWallet = () => {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const { isAuthenticated, handleLogout } = useAuth();

  const { isCopied, handleCopy } = useCopy();

  const handleCopyAddress = () => {
    handleCopy(address || '');
    toast.success('Copied to clipboard');
  };

  const handleConnectWallet = async () => {
    await open();
  };

  const handleAuthAction = async () => {
    await handleLogout();
  };

  return (
    <>
      {isAuthenticated ? (
        /* User Dropdown Menu */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className="group">
              <UserAvatar walletAddress={address} />
              {truncateAddress(address || '', 4)}
              <ChevronDown className="h-4 w-4 text-icon-tertiary group-hover:text-icon-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link className="w-full" href="/profile">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="w-full" href="/my-orders">
                My Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleConnectWallet}>Switch Wallet</DropdownMenuItem>
            <DropdownMenuItem
              className="justify-between"
              onClick={() => {
                handleCopyAddress();
              }}
            >
              Copy Address
              <Copy className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem className="justify-between" onClick={handleAuthAction}>
              Logout
              <LogOut className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
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
