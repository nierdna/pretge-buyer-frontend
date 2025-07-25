import Header from '@/components/layouts/Header';
import Separator from '@/components/ui/separator';
import Provider from '@/providers';
import '@/styles/global.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: {
    default: 'PretGe Market - Pre-Market Token Trading Platform | Early Access Crypto Deals',
    template: '%s | PretGe Market',
  },
  description:
    'Discover exclusive pre-market token opportunities on PretGe Market. Access early-stage crypto projects, flash sales, and premium token deals before they hit mainstream exchanges. Connect with trusted sellers and secure the best pre-market prices.',
  keywords: [
    'pre-market tokens',
    'cryptocurrency trading',
    'token presale',
    'crypto marketplace',
    'blockchain trading',
    'DeFi tokens',
    'early stage crypto',
    'token launch platform',
    'crypto investment',
    'digital assets trading',
    'Web3 marketplace',
    'solana tokens',
    'ethereum tokens',
    'base network tokens',
  ],
  authors: [{ name: 'PretGe Market Team' }],
  creator: 'PretGe Market',
  publisher: 'PretGe Market',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pretgemarket.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pretgemarket.xyz',
    title: 'PretGe Market - Pre-Market Token Trading Platform',
    description:
      'Discover exclusive pre-market token opportunities. Access early-stage crypto projects, flash sales, and premium token deals before they hit mainstream exchanges.',
    siteName: 'PretGe Market',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'PretGe Market - Pre-Market Token Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PretGe Market - Pre-Market Token Trading Platform',
    description:
      'Discover exclusive pre-market token opportunities. Access early-stage crypto projects and premium deals.',
    images: ['/banner.png'],
    creator: '@pretgemarket',
    site: '@pretgemarket',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'cryptocurrency',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PretGe Market" />
        <meta name="application-name" content="PretGe Market" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-0D3EX5J8SD`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0D3EX5J8SD', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `,
          }}
        />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PretGe Market',
              url: 'https://pretgemarket.xyz',
              logo: 'https://pretgemarket.xyz/banner.png',
              description: 'Pre-market token trading platform for exclusive cryptocurrency deals',
              sameAs: [
                // 'https://twitter.com/pretgemarket',
                // 'https://telegram.me/pretgemarket',
                // 'https://discord.gg/pretgemarket'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['English', 'Vietnamese'],
              },
            }),
          }}
        />
      </head>
      <body className={`min-h-screen flex flex-col bg-gradient-page-bg`}>
        <Provider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">{children}</div>
            </main>
            <Separator />
            {/* <Footer /> */}
          </div>
        </Provider>
      </body>
    </html>
  );
}
