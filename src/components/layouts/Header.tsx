'use client';

import Link from 'next/link';
import { ButtonConnectWallet } from '../ButtonConnectWallet';

export default function Header() {
  return (
    <>
      {/* Top bar with seller links */}
      <div className="container px-4 lg:px-8">
        <div className="bg-primary">
          <div className="flex h-8 px-4 lg:px-8 items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link
                href="https://seller.pretgemarket.xyz"
                className="hover:text-foreground transition-colors underline"
                prefetch={false}
              >
                Seller Centre
              </Link>
              <Link
                href="https://seller.pretgemarket.xyz/auth/login"
                className="hover:text-foreground transition-colors underline"
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
      <header className="container sticky top-0 z-40 px-4 lg:px-8">
        <div className="flex h-16 px-4 lg:px-6 items-center justify-between rounded-2xl bg-primary border-line border rounded-t-none">
          <Link href="/" className="flex items-center gap-2 font-bold" prefetch={false}>
            <img src="/logo.png" alt="PretGe Market" className="w-auto h-10 md:block hidden" />
            <img src="/logo-mb.png" alt="PretGe Market" className="w-auto h-8 md:hidden block" />
          </Link>
          <ButtonConnectWallet />
        </div>
      </header>
    </>
  );
}
