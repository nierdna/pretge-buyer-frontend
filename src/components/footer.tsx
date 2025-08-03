'use client';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';

const SOCIAL_LINKS = {
  twitter: 'https://x.com/pretgemarket',
  gitbook: 'https://pretgemarket.gitbook.io/pre-tge-market/',
};

export default function Footer() {
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <footer id="footer-section" className="border-t border-gray-200 bg-white px-3 py-4 font-sans">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Image
            height={32}
            width={120}
            alt="PreTGE Logo"
            className="h-8 w-auto object-contain transition-all group-hover:brightness-110"
            src="/logo.png"
          />
          <div className="text-sm text-gray-500">
            Copyright © 2025 Pre-TGE. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSocialClick(SOCIAL_LINKS.gitbook)}
              className="cursor-pointer rounded p-1 transition-colors duration-200 hover:bg-gray-100"
              aria-label="View our documentation on GitBook"
            >
              <BookOpen className="h-[18px] w-[18px] text-gray-900" />
            </button>
            <button
              onClick={() => handleSocialClick(SOCIAL_LINKS.twitter)}
              className="cursor-pointer rounded p-1 transition-colors duration-200 hover:bg-gray-100"
              aria-label="Follow us on X (Twitter)"
            >
              <Image
                src="https://pretgemarket.xyz/images/X_logo.svg"
                alt="X Logo"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
