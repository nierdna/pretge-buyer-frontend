import { Footer, Header } from '@/components/layouts';
import Separator from '@/components/ui/separator';
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
        <Provider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <Separator />
            <main className="flex-grow">
              <div className="container mx-auto px-4 lg:px-6 py-8">{children}</div>
            </main>
            <Separator />
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
