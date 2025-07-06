import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { ButtonConnectWallet } from '../ButtonConnectWallet';

export default function Header() {
  return (
    <header className="bg-opensea-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link href="/" className="mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-opensea-blue">Pre-Market</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-opensea-blue transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-white hover:text-opensea-blue transition-colors">
              Products
            </Link>
            <Link
              href="/flash-sale"
              className="text-white hover:text-opensea-blue transition-colors"
            >
              Flash Sale
            </Link>
            <Link href="/sellers" className="text-white hover:text-opensea-blue transition-colors">
              Sellers
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <ButtonConnectWallet />
            <Link
              href="/cart"
              className="text-opensea-lightGray hover:text-opensea-blue transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
