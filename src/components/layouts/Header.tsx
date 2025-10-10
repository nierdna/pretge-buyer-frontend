'use client';

import Link from 'next/link';
import { ButtonConnectWallet } from '../ButtonConnectWallet';

export default function Header() {
  return (
    <header className="sticky top-[26px] z-10 w-full border-b border-solid border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="shrink-0" prefetch={false}>
          <img src="/logo-full.png" alt="PreTGE Market" className="h-6 w-auto" />
        </Link>

        {/* Navigation - Centered */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          <Link
            href="/trade"
            className="whitespace-nowrap text-sm font-medium leading-5 text-white transition-colors hover:text-primary"
            prefetch={false}
          >
            Trade
          </Link>
          <Link
            href="/list-token"
            className="whitespace-nowrap text-sm font-medium leading-5 text-white transition-colors hover:text-primary"
            prefetch={false}
          >
            List Token
          </Link>
          <Link
            href="/analysis"
            className="whitespace-nowrap text-sm font-medium leading-5 text-white transition-colors hover:text-primary"
            prefetch={false}
          >
            Analysis
          </Link>
        </nav>

        {/* Connect Wallet Button */}
        <div className="shrink-0">
          <ButtonConnectWallet />
        </div>
      </div>
    </header>
  );
}
