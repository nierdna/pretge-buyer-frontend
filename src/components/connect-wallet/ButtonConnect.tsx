'use client';

import { useCopy } from '@/hooks/use-copy';
import { truncateAddress } from '@/utils/helpers/string';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { Check, ChevronDown, Copy, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function ButtonConnect() {
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { isCopied, handleCopy } = useCopy();
  const { open } = useAppKit();

  const handleConnectWallet = async () => {
    await open();
  };

  const handleDisconnectWallet = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await disconnect();
  };

  return (
    <>
      {isConnected ? (
        /* User Popover - Replaced DropdownMenu */
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'sm'}>
                <User className="h-4 w-4" />
                {truncateAddress(address, 4)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>
                <button
                  className="w-full flex items-center justify-between p-2 text-muted hover:text-primary transition-colors"
                  onClick={handleConnectWallet}
                >
                  Switch Network
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="w-full flex items-center justify-between p-2 text-muted hover:text-primary transition-colors"
                  onClick={() => handleCopy(address || '')}
                >
                  Copy Address
                  {isCopied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="w-full flex items-center justify-between p-2 text-muted hover:text-primary transition-colors"
                  onClick={(e) => {
                    handleDisconnectWallet(e);
                  }}
                >
                  Disconnect
                  <LogOut className="h-4 w-4" />
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          size={'sm'}
          variant={'default'}
          onClick={() => {
            handleConnectWallet();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
