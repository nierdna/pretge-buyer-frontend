import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PreTGE Market - Pre-Market Token Trading Platform',
    short_name: 'PreTGE Market',
    description: 'Discover exclusive pre-market token opportunities and crypto deals',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/banner.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['finance', 'business'],
    lang: 'en',
    orientation: 'portrait-primary',
  };
}
