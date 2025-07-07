import Link from 'next/link';
import ButtonConnect from '../connect-wallet/ButtonConnect';

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
            <Link href="/offers" className="text-white hover:text-opensea-blue transition-colors">
              Offers
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
            <ButtonConnect />
          </div>
        </div>
      </div>
    </header>
  );
}
