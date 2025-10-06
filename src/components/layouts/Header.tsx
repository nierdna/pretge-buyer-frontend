'use client';

import { useAuth } from '@/hooks/useAuth';
import { ChevronRight, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ButtonConnectWallet } from '../ButtonConnectWallet';
import { AuroraText } from '../magicui/aura-text';
import { SparklesText } from '../magicui/sparkles-text';
import { Button } from '../ui/button';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
              <Link href="/lighter" className="block lg:hidden">
                <SparklesText className="group flex flex-1 cursor-pointer items-center justify-center text-sm uppercase">
                  <div className="flex w-full items-center justify-center gap-0.5">
                    <AuroraText>lighter points</AuroraText>
                    <ChevronRight className="h-5 w-5 text-content transition-all duration-300 group-hover:translate-x-2 group-hover:text-head" />
                  </div>
                </SparklesText>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="container sticky top-[26px] z-50 px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 rounded-2xl rounded-t-none border border-line bg-primary px-4 lg:px-6">
          <Link href="/" className="flex flex-1 items-center gap-2 font-bold" prefetch={false}>
            <img src="/logo-full.png" alt="PreTGE Market" className="hidden h-6 w-auto md:block" />
            <img src="/logo-mb.png" alt="PreTGE Market" className="block h-6 w-auto md:hidden" />
          </Link>
          <Link href="/lighter" className="hidden lg:block">
            <SparklesText className="group flex flex-1 cursor-pointer items-center justify-center text-2xl uppercase">
              <div className="flex w-full items-center justify-center gap-0.5">
                <AuroraText>lighter points otc</AuroraText>
                <ChevronRight className="h-5 w-5 text-content transition-all duration-300 group-hover:translate-x-2 group-hover:text-head" />
              </div>
            </SparklesText>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2">
            {isAuthenticated && (
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
            )}
            <ButtonConnectWallet />
          </div>
        </div>
      </header>
    </>
  );
}
