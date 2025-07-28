export const SEO_CONSTANTS = {
  SITE_NAME: 'PretGe Market',
  SITE_URL: 'https://app.pretgemarket.xyz',
  SITE_DESCRIPTION:
    'Discover exclusive pre-market token opportunities on PretGe Market. Access early-stage crypto projects, flash sales, and premium token deals before they hit mainstream exchanges.',
  SITE_KEYWORDS: [
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
  DEFAULT_IMAGE: '/banner.png',
  DEFAULT_IMAGE_WIDTH: 1200,
  DEFAULT_IMAGE_HEIGHT: 630,
  TWITTER_HANDLE: '@pretgemarket',
  ORGANIZATION: {
    name: 'PretGe Market',
    url: 'https://app.pretgemarket.xyz',
    logo: 'https://app.pretgemarket.xyz/banner.png',
    description: 'Pre-market token trading platform for exclusive cryptocurrency deals',
    contactPoint: {
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Vietnamese'],
    },
  },
};

export const generatePageTitle = (title: string): string => {
  return `${title} | ${SEO_CONSTANTS.SITE_NAME}`;
};

export const generatePageDescription = (description: string): string => {
  return description.length > 160 ? `${description.substring(0, 157)}...` : description;
};

export const generateOpenGraphImage = (title: string, description?: string) => {
  return {
    url: SEO_CONSTANTS.DEFAULT_IMAGE,
    width: SEO_CONSTANTS.DEFAULT_IMAGE_WIDTH,
    height: SEO_CONSTANTS.DEFAULT_IMAGE_HEIGHT,
    alt: title,
  };
};

export const generateStructuredData = {
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...SEO_CONSTANTS.ORGANIZATION,
    sameAs: [
      // Add social media links when available
    ],
  }),

  website: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONSTANTS.SITE_NAME,
    url: SEO_CONSTANTS.SITE_URL,
    description: SEO_CONSTANTS.SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SEO_CONSTANTS.SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  product: (id: string, name: string, description: string, price?: number) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    category: 'Cryptocurrency',
    brand: {
      '@type': 'Brand',
      name: SEO_CONSTANTS.SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: price || 0,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Verified Seller',
      },
      url: `${SEO_CONSTANTS.SITE_URL}/offers/${id}`,
    },
  }),

  person: (id: string, name: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    url: `${SEO_CONSTANTS.SITE_URL}/sellers/${id}`,
    image: SEO_CONSTANTS.DEFAULT_IMAGE,
    jobTitle: 'Cryptocurrency Seller',
    worksFor: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.SITE_NAME,
    },
  }),

  financialProduct: (symbol: string, name: string, description: string) => ({
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name,
    description,
    category: 'Cryptocurrency',
    url: `${SEO_CONSTANTS.SITE_URL}/token/${symbol.toLowerCase()}`,
    provider: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.SITE_NAME,
    },
  }),
};

export const PAGE_TYPES = {
  HOME: 'home',
  OFFERS: 'offers',
  OFFER_DETAIL: 'offer-detail',
  SELLERS: 'sellers',
  SELLER_DETAIL: 'seller-detail',
  TOKEN_DETAIL: 'token-detail',
  PROFILE: 'profile',
  ORDERS: 'orders',
} as const;

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];
