'use client';

import Link from 'next/link';
import { ButtonConnectWallet } from '../ButtonConnectWallet';

export default function Header() {
  return (
    <header className="sticky top-[26px] z-20 w-full border-b border-solid border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="shrink-0" prefetch={false}>
          <img src="/logo-full.png" alt="PreTGE Market" className="h-6 w-auto" />
        </Link>

        {/* Navigation - Centered */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          {/* <Link
            href="/trade"
            className="whitespace-nowrap text-sm font-medium leading-5 text-white transition-colors hover:text-primary"
            prefetch={false}
          >
            Trade
          </Link> */}
          <Link
            href="https://point.pretgemarket.xyz/"
            className="whitespace-nowrap text-sm font-medium leading-5 text-white transition-colors hover:text-primary"
            prefetch={false}
            target="_blank"
          >
            Points Market
          </Link>
          <Link
            href="#"
            className="whitespace-nowrap text-sm font-medium leading-5 text-white transition-colors hover:text-primary"
            prefetch={false}
          >
            Analysis
          </Link>
        </nav>

        {/* Connect Wallet Button */}
        <div className="flex shrink-0 items-center">
          <ButtonConnectWallet />
        </div>
      </div>
    </header>
  );
}
