import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://app.pretgemarket.xyz';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/my-orders`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // In a real app, you would fetch these dynamically from your API
  const mockOffers = Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    lastModified: new Date(),
  }));

  const mockSellers = Array.from({ length: 20 }, (_, i) => ({
    id: `seller-${i + 1}`,
    lastModified: new Date(),
  }));

  const mockTokens = ['BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'BNB', 'ADA', 'DOT'];

  // Dynamic offer pages
  const offerPages = mockOffers.map((offer) => ({
    url: `${baseUrl}/offers/${offer.id}`,
    lastModified: offer.lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic seller pages
  const sellerPages = mockSellers.map((seller) => ({
    url: `${baseUrl}/sellers/${seller.id}`,
    lastModified: seller.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic token pages
  const tokenPages = mockTokens.map((symbol) => ({
    url: `${baseUrl}/token/${symbol.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...offerPages, ...sellerPages, ...tokenPages];
}
