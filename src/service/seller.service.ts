import type { Product } from '@/types/product';
import type { Seller, SellerCreateInput, SellerFilter, SellerUpdateInput } from '@/types/seller';
import { apiRequest } from './axios';

interface SellerResponse {
  data: Seller;
  message: string;
}

interface SellersResponse {
  data: Seller[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

interface SellerProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

// Mock seller data for pre-market trading
const mockSellers: Seller[] = [
  {
    id: 'seller1',
    name: 'Crypto Exchange Pro',
    slug: 'crypto-exchange-pro',
    description:
      'Leading cryptocurrency exchange with advanced trading features and secure infrastructure.',
    email: 'contact@cryptoexchangepro.com',
    phone: '+1 (555) 123-4567',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000',
    coverImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2072',
    address: {
      address1: '123 Crypto Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
    },
    social: {
      website: 'https://cryptoexchangepro.com',
      facebook: 'cryptoexchangepro',
      twitter: 'cryptoexchangepro',
      instagram: 'cryptoexchangepro',
    },
    verification: {
      isVerified: true,
      verifiedAt: '2024-01-20T10:30:00Z',
    },
    productsCount: 45,
    rating: 4.9,
    reviews: [],
    joinedAt: '2024-01-15T08:30:00Z',
    status: 'active',
  },
  {
    id: 'seller2',
    name: 'DeFi Ventures',
    slug: 'defi-ventures',
    description:
      'Innovative DeFi platform specializing in decentralized finance solutions and token trading.',
    email: 'info@defiventures.com',
    phone: '+1 (555) 987-6543',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000',
    coverImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070',
    address: {
      address1: '456 DeFi Avenue',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'USA',
    },
    social: {
      website: 'https://defiventures.com',
      facebook: 'defiventures',
      twitter: 'defiventures',
      instagram: 'defiventures',
    },
    verification: {
      isVerified: true,
      verifiedAt: '2024-02-25T14:45:00Z',
    },
    productsCount: 32,
    rating: 4.6,
    reviews: [],
    joinedAt: '2024-02-20T10:45:00Z',
    status: 'active',
  },
  {
    id: 'seller3',
    name: 'Blockchain Capital',
    slug: 'blockchain-capital',
    description:
      'Professional blockchain investment firm with expertise in token trading and portfolio management.',
    email: 'support@blockchaincapital.com',
    phone: '+1 (555) 456-7890',
    logo: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=1000',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2020',
    address: {
      address1: '789 Blockchain Drive',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA',
    },
    social: {
      website: 'https://blockchaincapital.com',
      facebook: 'blockchaincapital',
      twitter: 'blockchaincapital',
      instagram: 'blockchaincapital',
    },
    verification: {
      isVerified: true,
      verifiedAt: '2024-03-15T11:20:00Z',
    },
    productsCount: 18,
    rating: 4.4,
    reviews: [],
    joinedAt: '2024-03-10T09:15:00Z',
    status: 'active',
  },
];

export class SellerService {
  /**
   * Get a list of sellers with optional filtering
   */
  static async getSellers(filters?: SellerFilter) {
    // Return mock data instead of API call
    return { data: mockSellers };
  }

  /**
   * Get a single seller by ID
   */
  static async getSellerById(id: string) {
    // Return mock data for a single seller
    const seller = mockSellers.find((s) => s.id === id);
    return { data: seller };
  }

  /**
   * Get products from a specific seller
   */
  static async getSellerProducts(
    sellerId: string,
    params?: { page?: number; limit?: number; sortBy?: string }
  ) {
    return apiRequest<SellerProductsResponse>({
      method: 'GET',
      params,
    });
  }

  /**
   * Get reviews for a specific seller
   */
  static async getSellerReviews(
    sellerId: string,
    params?: { page?: number; limit?: number; sortBy?: string }
  ) {
    // Mock reviews for the seller
    const reviews = [
      {
        id: 'rev1',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent service and fast shipping!',
        createdAt: '2023-10-15T14:30:00Z',
      },
      {
        id: 'rev2',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Good products but shipping was a bit slow.',
        createdAt: '2023-09-22T11:15:00Z',
      },
      {
        id: 'rev3',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Great customer service and high-quality items!',
        createdAt: '2023-11-05T09:45:00Z',
      },
    ];

    return { data: reviews };
  }

  /**
   * Create a new seller (admin only)
   */
  static async createSeller(data: SellerCreateInput) {
    return apiRequest<SellerResponse>({
      method: 'POST',
      data,
    });
  }

  /**
   * Update an existing seller (admin/seller only)
   */
  static async updateSeller(id: string, data: SellerUpdateInput) {
    return apiRequest<SellerResponse>({
      method: 'PUT',
      data,
    });
  }

  /**
   * Delete a seller (admin only)
   */
  static async deleteSeller(id: string) {
    return apiRequest<{ success: boolean; message: string }>({
      method: 'DELETE',
    });
  }
}
