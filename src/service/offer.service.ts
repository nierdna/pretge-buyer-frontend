import type { IOffer, Offer, OfferCreateInput, OfferFilter, OfferUpdateInput } from '@/types/offer';
import axiosInstance from './axios';

interface OfferResponse {
  data: Offer | null;
  message?: string;
}

interface OffersResponse {
  data: Offer[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}
interface OffersResponseV2 {
  data: {
    data: IOffer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

// Mock offer data for pre-market trading
export const mockOffers: Offer[] = [
  {
    id: '1',
    name: 'Bitcoin Token',
    slug: 'bitcoin-token',
    description: 'Early access to Bitcoin token with premium features and benefits.',
    price: 0.85,
    compareAtPrice: 1.0,
    sku: 'BTC-001',
    inventory: 10000,
    images: [
      {
        id: '101',
        url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000',
        alt: 'Bitcoin Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [
      {
        id: 'rev1',
        userId: 'user1',
        userName: 'Crypto Trader',
        rating: 4.8,
        comment: 'Excellent token with great potential. Highly recommended!',
        createdAt: '2024-01-16T10:30:00Z',
      },
    ],
    rating: 4.8,
    sellerId: 'seller1',
    sellerName: 'Crypto Exchange Pro',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      symbol: 'BTC',
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    },
    sellerInfo: {
      name: 'Crypto Exchange Pro',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=100',
    },
    startTime: '2024-01-20T10:00:00Z',
    endTime: '2024-01-25T18:00:00Z',
    amount: 850000,
  },
  {
    id: '2',
    name: 'Ethereum Token',
    slug: 'ethereum-token',
    description: 'Pre-market access to Ethereum token with smart contract capabilities.',
    price: 0.65,
    compareAtPrice: 0.75,
    sku: 'ETH-002',
    inventory: 15000,
    images: [
      {
        id: '102',
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000',
        alt: 'Ethereum Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.7,
    sellerId: 'seller2',
    sellerName: 'DeFi Ventures',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-16T09:30:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      symbol: 'ETH',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
    sellerInfo: {
      name: 'DeFi Ventures',
      address: '0x8ba1f109551bD432803012645Hac136c22C177e9',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=100',
    },
    startTime: '2024-01-22T12:00:00Z',
    endTime: '2024-01-28T20:00:00Z',
    amount: 975000,
  },
  {
    id: '3',
    name: 'Solana Token',
    slug: 'solana-token',
    description: 'High-performance blockchain token with fast transaction speeds.',
    price: 0.45,
    compareAtPrice: 0.55,
    sku: 'SOL-003',
    inventory: 25000,
    images: [
      {
        id: '103',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
        alt: 'Solana Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.5,
    sellerId: 'seller3',
    sellerName: 'Blockchain Capital',
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T14:20:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
      symbol: 'SOL',
      address: '0xd31a59c85ae9d8edefec411d448f90841571b89c',
    },
    sellerInfo: {
      name: 'Blockchain Capital',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.4,
      avatar: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=100',
    },
    startTime: '2024-01-25T08:00:00Z',
    endTime: '2024-01-30T16:00:00Z',
    amount: 1125000,
  },
  {
    id: '4',
    name: 'Cardano Token',
    slug: 'cardano-token',
    description: 'Research-driven blockchain token with peer-reviewed technology.',
    price: 0.35,
    compareAtPrice: 0.42,
    sku: 'ADA-004',
    inventory: 30000,
    images: [
      {
        id: '104',
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000',
        alt: 'Cardano Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.3,
    sellerId: 'seller4',
    sellerName: 'Research Labs',
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-18T11:15:00Z',
    isFeatured: false,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
      symbol: 'ADA',
      address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    },
    sellerInfo: {
      name: 'Research Labs',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.2,
      avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=100',
    },
    startTime: '2024-01-28T09:00:00Z',
    endTime: '2024-02-02T17:00:00Z',
    amount: 1050000,
  },
  {
    id: '5',
    name: 'Polkadot Token',
    slug: 'polkadot-token',
    description: 'Interoperable blockchain token connecting multiple networks.',
    price: 0.55,
    compareAtPrice: 0.65,
    sku: 'DOT-005',
    inventory: 20000,
    images: [
      {
        id: '105',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
        alt: 'Polkadot Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.6,
    sellerId: 'seller5',
    sellerName: 'Interop Solutions',
    createdAt: '2024-01-19T16:45:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
      symbol: 'DOT',
      address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    },
    sellerInfo: {
      name: 'Interop Solutions',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=100',
    },
    startTime: '2024-01-30T10:30:00Z',
    endTime: '2024-02-05T18:30:00Z',
    amount: 1100000,
  },
  {
    id: '6',
    name: 'Chainlink Token',
    slug: 'chainlink-token',
    description: 'Oracle network token providing real-world data to smart contracts.',
    price: 0.75,
    compareAtPrice: 0.85,
    sku: 'LINK-006',
    inventory: 12000,
    images: [
      {
        id: '106',
        url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000',
        alt: 'Chainlink Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.4,
    sellerId: 'seller6',
    sellerName: 'Oracle Network',
    createdAt: '2024-01-20T13:20:00Z',
    updatedAt: '2024-01-20T13:20:00Z',
    isFeatured: false,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
      symbol: 'LINK',
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    },
    sellerInfo: {
      name: 'Oracle Network',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.3,
      avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=100',
    },
    startTime: '2024-02-01T11:00:00Z',
    endTime: '2024-02-07T19:00:00Z',
    amount: 900000,
  },
  {
    id: '7',
    name: 'Uniswap Token',
    slug: 'uniswap-token',
    description: 'Decentralized exchange token for automated trading.',
    price: 0.6,
    compareAtPrice: 0.7,
    sku: 'UNI-007',
    inventory: 18000,
    images: [
      {
        id: '107',
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000',
        alt: 'Uniswap Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.7,
    sellerId: 'seller7',
    sellerName: 'DeFi Exchange',
    createdAt: '2024-01-21T15:30:00Z',
    updatedAt: '2024-01-21T15:30:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
      symbol: 'UNI',
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    },
    sellerInfo: {
      name: 'DeFi Exchange',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=100',
    },
    startTime: '2024-02-03T12:30:00Z',
    endTime: '2024-02-09T20:30:00Z',
    amount: 1080000,
  },
  {
    id: '8',
    name: 'Aave Token',
    slug: 'aave-token',
    description: 'Lending protocol token for decentralized borrowing and lending.',
    price: 0.4,
    compareAtPrice: 0.48,
    sku: 'AAVE-008',
    inventory: 22000,
    images: [
      {
        id: '108',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
        alt: 'Aave Token',
        isDefault: true,
      },
    ],
    categories: [
      {
        id: 'cat1',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      },
    ],
    variants: [],
    options: [],
    reviews: [],
    rating: 4.2,
    sellerId: 'seller8',
    sellerName: 'Lending Protocol',
    createdAt: '2024-01-22T10:15:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    isFeatured: false,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/aave-aave-logo.png',
      symbol: 'AAVE',
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    },
    sellerInfo: {
      name: 'Lending Protocol',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.1,
      avatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=100',
    },
    startTime: '2024-02-05T08:45:00Z',
    endTime: '2024-02-11T16:45:00Z',
    amount: 880000,
  },
];

export class OfferService {
  /**
   * Get all offers
   * @param filters Offer filters
   * @returns Offers response
   */
  async getOffers(filters?: OfferFilter): Promise<OffersResponse> {
    // For now, just return mock data
    return { data: mockOffers };
  }

  /**
   * Get offer by id
   * @param id Offer id
   * @returns Offer response
   */
  async getOfferById(id: string): Promise<OfferResponse> {
    // Return mock data for a single offer
    const offer = mockOffers.find((p) => p.id === id) || null;
    return { data: offer };
  }

  /**
   * Get featured offers
   * @returns Featured offers response
   */
  async getFeaturedOffers(): Promise<OffersResponse> {
    // Return mock featured offers
    const featured = mockOffers.filter((p) => p.isFeatured);
    return { data: featured };
  }

  /**
   * Get related offers
   * @param offerId Offer id
   * @returns Related offers response
   */
  async getRelatedOffers(offerId: string): Promise<OffersResponse> {
    // For mock data, just return other offers in the same category
    const offer = mockOffers.find((p) => p.id === offerId);
    if (!offer) return { data: [] };

    const categoryIds = offer.categories.map((c) => c.id);
    const related = mockOffers
      .filter((p) => p.id !== offerId && p.categories.some((c) => categoryIds.includes(c.id)))
      .slice(0, 4);

    return { data: related };
  }

  /**
   * Create offer
   * @param data Offer data
   * @returns Offer response
   */
  async createOffer(data: OfferCreateInput): Promise<OfferResponse> {
    // Mock create offer
    const newOffer: Offer = {
      id: (mockOffers.length + 1).toString(),
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      sku: data.sku,
      inventory: data.inventory,
      images: data.images.map((img, index) => ({
        id: (mockOffers.length * 100 + index + 1).toString(),
        ...img,
      })),
      categories: data.categoryIds.map((id) => ({
        id,
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency tokens',
      })),
      variants:
        data.variants?.map((v, index) => ({
          id: (mockOffers.length * 10 + index + 1).toString(),
          ...v,
        })) || [],
      options: data.options || [],
      reviews: [],
      rating: 0,
      sellerId: 'seller1',
      sellerName: 'Default Seller',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFeatured: data.isFeatured || false,
      isPublished: true,
    };

    mockOffers.push(newOffer);
    return { data: newOffer };
  }

  /**
   * Update offer
   * @param id Offer id
   * @param data Offer data
   * @returns Offer response
   */
  async updateOffer(id: string, data: OfferUpdateInput): Promise<OfferResponse> {
    // Mock update offer
    const index = mockOffers.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Offer not found');

    // Create a new offer object with updated fields
    const currentOffer = mockOffers[index];

    // Handle images separately to ensure they have proper id fields
    const updatedImages = data.images
      ? data.images.map((img, index) => ({
          id: `${currentOffer.id}-img-${index}`,
          ...img,
        }))
      : currentOffer.images;

    // Handle variants separately to ensure they have proper id fields
    const updatedVariants = data.variants
      ? data.variants.map((variant, index) => ({
          id: `${currentOffer.id}-variant-${index}`,
          ...variant,
        }))
      : currentOffer.variants;

    const updatedOffer: Offer = {
      ...currentOffer,
      ...data,
      images: updatedImages,
      variants: updatedVariants,
      updatedAt: new Date().toISOString(),
    };

    mockOffers[index] = updatedOffer;
    return { data: updatedOffer };
  }

  /**
   * Delete offer
   * @param id Offer id
   * @returns Success response
   */
  async deleteOffer(id: string): Promise<{ success: boolean; message?: string }> {
    // Mock delete offer
    const index = mockOffers.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Offer not found');

    mockOffers.splice(index, 1);
    return { success: true, message: 'Offer deleted successfully' };
  }
  //new

  async getOffersV2(filters?: OfferFilter): Promise<OffersResponseV2> {
    const response = await axiosInstance.get('/offers', { params: filters });
    console.log('response', response.data);
    return response.data;
  }
  async getOfferByIdV2(id: string): Promise<any> {
    const response = await axiosInstance.get(`/offers/${id}`);
    return response.data;
  }
}
