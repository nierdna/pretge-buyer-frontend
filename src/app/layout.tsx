import Provider from '@/providers';
import '@/styles/global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pre-Market',
  description: 'Pre-market exclusive offers marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-page-bg`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
