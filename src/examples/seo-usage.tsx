// Example usage of SEO components and constants
// This file demonstrates how to implement SEO in new pages

import React from 'react';
import { Metadata } from 'next';
import {
  SEO_CONSTANTS,
  generatePageTitle,
  generatePageDescription,
  generateOpenGraphImage,
  generateStructuredData,
} from '@/constants/seo';
import { StructuredData } from '@/components/SEOHead';

// Example 1: Static page metadata
export const staticPageMetadata: Metadata = {
  title: generatePageTitle('Flash Sale Offers'),
  description: generatePageDescription(
    'Discover limited-time flash sale offers on pre-market tokens. Grab exclusive deals before they expire!'
  ),
  keywords: [
    'flash sale',
    'limited time offers',
    'crypto deals',
    'token discounts',
    ...SEO_CONSTANTS.SITE_KEYWORDS,
  ],
  openGraph: {
    title: 'Flash Sale Offers - PretGe Market',
    description: 'Discover limited-time flash sale offers on pre-market tokens.',
    url: `${SEO_CONSTANTS.SITE_URL}/flash-sale`,
    images: [generateOpenGraphImage('Flash Sale Offers')],
  },
  alternates: {
    canonical: `${SEO_CONSTANTS.SITE_URL}/flash-sale`,
  },
};

// Example 2: Dynamic metadata generation function
export async function generateOfferMetadata(offerId: string, offerData: any): Promise<Metadata> {
  return {
    title: generatePageTitle(`${offerData.name} - Exclusive Offer`),
    description: generatePageDescription(offerData.description),
    keywords: [
      offerData.tokenSymbol,
      'token offer',
      'pre-market deal',
      offerData.category,
      ...SEO_CONSTANTS.SITE_KEYWORDS,
    ],
    openGraph: {
      title: `${offerData.name} - PretGe Market`,
      description: offerData.description,
      url: `${SEO_CONSTANTS.SITE_URL}/offers/${offerId}`,
      type: 'website',
      images: [
        {
          url: offerData.image || SEO_CONSTANTS.DEFAULT_IMAGE,
          width: SEO_CONSTANTS.DEFAULT_IMAGE_WIDTH,
          height: SEO_CONSTANTS.DEFAULT_IMAGE_HEIGHT,
          alt: offerData.name,
        },
      ],
    },
    twitter: {
      title: `${offerData.name} - PretGe Market`,
      description: offerData.description,
      images: [offerData.image || SEO_CONSTANTS.DEFAULT_IMAGE],
    },
    alternates: {
      canonical: `${SEO_CONSTANTS.SITE_URL}/offers/${offerId}`,
    },
  };
}

// Example 3: Component with structured data
interface ExamplePageProps {
  offerId: string;
  offerData: {
    id: string;
    name: string;
    description: string;
    price: number;
    seller: string;
  };
}

export default function ExampleOfferPage({ offerId, offerData }: ExamplePageProps) {
  // Generate structured data
  const productSchema = generateStructuredData.product(
    offerData.id,
    offerData.name,
    offerData.description,
    offerData.price
  );

  return (
    <>
      {/* Inject structured data */}
      <StructuredData data={productSchema} />

      {/* Page content */}
      <div>
        <h1>{offerData.name}</h1>
        <p>{offerData.description}</p>
        <p>Price: ${offerData.price}</p>
        <p>Seller: {offerData.seller}</p>
      </div>
    </>
  );
}

// Example 4: SEO-optimized component for token listings
interface TokenListPageProps {
  tokens: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
  }>;
}

export function TokenListPage({ tokens }: TokenListPageProps) {
  // Generate ItemList structured data
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trending Tokens',
    description: 'List of trending pre-market tokens available for trading',
    numberOfItems: tokens.length,
    itemListElement: tokens.map((token, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialProduct',
        name: token.name,
        description: `${token.symbol} token trading at $${token.price}`,
        category: 'Cryptocurrency',
        url: `${SEO_CONSTANTS.SITE_URL}/token/${token.symbol.toLowerCase()}`,
      },
    })),
  };

  return (
    <>
      <StructuredData data={itemListSchema} />

      <div>
        <h1>Trending Tokens</h1>
        {tokens.map((token) => (
          <div key={token.symbol}>
            <h2>
              {token.name} ({token.symbol})
            </h2>
            <p>Price: ${token.price}</p>
            <p>24h Change: {token.change24h}%</p>
          </div>
        ))}
      </div>
    </>
  );
}

// Example 5: SEO utilities usage
export const seoUtils = {
  // Generate breadcrumb structured data
  generateBreadcrumbs: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // Generate FAQ structured data
  generateFAQ: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  // Generate review structured data
  generateReview: (review: {
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  }),
};

// Example 6: Page with multiple structured data types
export function ComprehensiveExamplePage() {
  const organizationSchema = generateStructuredData.organization();
  const websiteSchema = generateStructuredData.website();

  const breadcrumbSchema = seoUtils.generateBreadcrumbs([
    { name: 'Home', url: SEO_CONSTANTS.SITE_URL },
    { name: 'Offers', url: `${SEO_CONSTANTS.SITE_URL}/offers` },
    { name: 'Current Offer', url: `${SEO_CONSTANTS.SITE_URL}/offers/123` },
  ]);

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <StructuredData data={breadcrumbSchema} />

      <div>
        <h1>Comprehensive SEO Example</h1>
        <p>This page demonstrates multiple structured data implementations.</p>
      </div>
    </>
  );
}

/*
Usage Notes:

1. Import the constants and utilities:
   import { SEO_CONSTANTS, generatePageTitle } from '@/constants/seo';

2. Use generateMetadata for dynamic pages:
   export async function generateMetadata({ params }) {
     return await generateOfferMetadata(params.id, offerData);
   }

3. Add structured data to components:
   <StructuredData data={generateStructuredData.product(...)} />

4. Keep metadata consistent across pages:
   - Use the template pattern for titles
   - Follow description length guidelines
   - Include relevant keywords

5. Test your structured data:
   - Use Google's Rich Results Test
   - Validate with Schema.org validator
   - Monitor in Google Search Console
*/
