'use client';

import Link from 'next/link';
import { ButtonConnectWallet } from '../ButtonConnectWallet';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-300 bg-white/95 backdrop-blur-lg shadow-md">
      {' '}
      {/* White translucent background, increased blur and shadow */}
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
          <img src="/logo.png" alt="PretGe Market" className="w-auto h-10 md:block hidden" />
          <img src="/logo-mb.png" alt="PretGe Market" className="w-auto h-8 md:hidden block" />
        </Link>
        {/* <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#" className="hover:text-primary" prefetch={false}>
            Browse Offers
          </Link>
          <Link href="#" className="hover:text-primary" prefetch={false}>
            Sell Token
          </Link>
          <Link href="#" className="hover:text-primary" prefetch={false}>
            My Offers
          </Link>
          <Link href="#" className="hover:text-primary" prefetch={false}>
            How it Works
          </Link>
        </nav> */}
        {/* <Button
          variant="outline"
          className="hidden md:inline-flex bg-transparent border-gray-300 hover:bg-gray-100"
        >
          Connect Wallet
        </Button> */}
        <ButtonConnectWallet />
      </div>
    </header>
  );
}
