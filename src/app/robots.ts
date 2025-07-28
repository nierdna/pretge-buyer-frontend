import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/test/', '/my-orders', '/profile', '/admin', '/private', '/*.json$'],
    },
    sitemap: 'https://app.pretgemarket.xyz/sitemap.xml',
    host: 'https://app.pretgemarket.xyz',
  };
}
