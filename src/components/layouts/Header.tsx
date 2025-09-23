'use client';

import { UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ButtonConnectWallet } from '../ButtonConnectWallet';
import { Button } from '../ui/button';

export default function Header() {
  const router = useRouter();
  return (
    <>
      {/* Top bar with seller links */}
      <div className="container mt-[26px] px-4 lg:px-8">
        <div className="bg-primary">
          <div className="text-muted-foreground flex h-8 items-center justify-between px-4 text-xs lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href="https://seller.pretgemarket.xyz"
                className="underline transition-colors hover:text-head"
                prefetch={false}
              >
                Seller Centre
              </Link>
              <Link
                href="https://seller.pretgemarket.xyz/auth/login"
                className="underline transition-colors hover:text-head"
                prefetch={false}
              >
                Start Selling
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Right side can be used for additional links if needed */}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="container sticky top-[26px] z-50 px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between rounded-2xl rounded-t-none border border-line bg-primary px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold" prefetch={false}>
            <img src="/logo.png" alt="PreTGE Market" className="hidden h-10 w-auto md:block" />
            <img src="/logo-mb.png" alt="PreTGE Market" className="block h-8 w-auto md:hidden" />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                router.push('/referral');
              }}
              variant="outline"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <UserCheck className="h-4 w-4" />
              <p className="text-sm font-medium leading-none">Referral</p>
            </Button>
            <ButtonConnectWallet />
          </div>
        </div>
      </header>
    </>
  );
}
