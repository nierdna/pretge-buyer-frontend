import type {
  Product,
  ProductCreateInput,
  ProductFilter,
  ProductUpdateInput,
} from '@/types/product';

interface ProductResponse {
  data: Product;
  message?: string;
}

interface ProductsResponse {
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

// Mock product data for pre-market trading
export const mockProducts: Product[] = [
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
    sellerId: 'seller1',
    sellerName: 'Crypto Exchange Pro',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
    isFeatured: false,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
      symbol: 'ADA',
      address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
    },
    sellerInfo: {
      name: 'Crypto Exchange Pro',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=100',
    },
    startTime: '2024-01-28T14:00:00Z',
    endTime: '2024-02-02T22:00:00Z',
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
    inventory: 18000,
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
    sellerId: 'seller2',
    sellerName: 'DeFi Ventures',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
      symbol: 'DOT',
      address: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
    },
    sellerInfo: {
      name: 'DeFi Ventures',
      address: '0x8ba1f109551bD432803012645Hac136c22C177e9',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=100',
    },
    startTime: '2024-01-30T10:00:00Z',
    endTime: '2024-02-05T18:00:00Z',
    amount: 990000,
  },
  {
    id: '6',
    name: 'Chainlink Token',
    slug: 'chainlink-token',
    description: 'Decentralized oracle network token for smart contracts.',
    price: 0.75,
    compareAtPrice: 0.85,
    sku: 'LINK-006',
    inventory: 12000,
    images: [
      {
        id: '106',
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000',
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
    rating: 4.7,
    sellerId: 'seller3',
    sellerName: 'Blockchain Capital',
    createdAt: '2024-01-20T13:15:00Z',
    updatedAt: '2024-01-20T13:15:00Z',
    isFeatured: false,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
      symbol: 'LINK',
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    },
    sellerInfo: {
      name: 'Blockchain Capital',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.4,
      avatar: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=100',
    },
    startTime: '2024-02-01T12:00:00Z',
    endTime: '2024-02-07T20:00:00Z',
    amount: 900000,
  },
  {
    id: '7',
    name: 'Uniswap Token',
    slug: 'uniswap-token',
    description: 'Decentralized exchange token for automated trading.',
    price: 0.4,
    compareAtPrice: 0.48,
    sku: 'UNI-007',
    inventory: 20000,
    images: [
      {
        id: '107',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000',
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
    rating: 4.5,
    sellerId: 'seller1',
    sellerName: 'Crypto Exchange Pro',
    createdAt: '2024-01-21T10:10:00Z',
    updatedAt: '2024-01-21T10:10:00Z',
    isFeatured: true,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
      symbol: 'UNI',
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    },
    sellerInfo: {
      name: 'Crypto Exchange Pro',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=100',
    },
    startTime: '2024-02-03T08:00:00Z',
    endTime: '2024-02-09T16:00:00Z',
    amount: 800000,
  },
  {
    id: '8',
    name: 'Aave Token',
    slug: 'aave-token',
    description: 'DeFi lending protocol token for borrowing and lending.',
    price: 0.6,
    compareAtPrice: 0.7,
    sku: 'AAVE-008',
    inventory: 15000,
    images: [
      {
        id: '108',
        url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000',
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
    rating: 4.4,
    sellerId: 'seller2',
    sellerName: 'DeFi Ventures',
    createdAt: '2024-01-22T09:45:00Z',
    updatedAt: '2024-01-22T09:45:00Z',
    isFeatured: false,
    isPublished: true,
    tokenInfo: {
      icon: 'https://cryptologos.cc/logos/aave-aave-logo.png',
      symbol: 'AAVE',
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    },
    sellerInfo: {
      name: 'DeFi Ventures',
      address: '0x8ba1f109551bD432803012645Hac136c22C177e9',
      rating: 4.6,
      avatar: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=100',
    },
    startTime: '2024-02-05T14:00:00Z',
    endTime: '2024-02-11T22:00:00Z',
    amount: 900000,
  },
];

export class ProductService {
  /**
   * Get all products
   * @param filters Product filters
   * @returns Products response
   */
  static async getProducts(filters?: ProductFilter) {
    // Return mock data instead of API call
    return { data: mockProducts };
  }

  /**
   * Get product by id
   * @param id Product id
   * @returns Product response
   */
  static async getProductById(id: string) {
    // Return mock data for a single product
    const product = mockProducts.find((p) => p.id === id);
    return { data: product };
  }

  /**
   * Get featured products
   * @returns Featured products response
   */
  static async getFeaturedProducts() {
    // Return mock featured products
    const featured = mockProducts.filter((p) => p.isFeatured);
    return { data: featured };
  }

  /**
   * Get related products
   * @param productId Product id
   * @returns Related products response
   */
  static async getRelatedProducts(productId: string) {
    // For mock data, just return other products in the same category
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return { data: [] };

    const categoryIds = product.categories.map((c) => c.id);
    const related = mockProducts
      .filter((p) => p.id !== productId && p.categories.some((c) => categoryIds.includes(c.id)))
      .slice(0, 4);

    return { data: related };
  }

  /**
   * Create product
   * @param data Product data
   * @returns Product response
   */
  static async createProduct(data: ProductCreateInput) {
    // Mock create product
    const newProduct: Product = {
      id: `new-${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      sku: data.sku,
      inventory: data.inventory,
      images: data.images.map((img, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: img.url,
        alt: img.alt || '',
        isDefault: img.isDefault || false,
      })),
      categories: [],
      variants: [],
      options: data.options || [],
      reviews: [],
      rating: 0,
      sellerId: 'current-user',
      sellerName: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFeatured: data.isFeatured || false,
      isPublished: true,
    };

    mockProducts.push(newProduct);
    return { data: newProduct };
  }

  /**
   * Update product
   * @param id Product id
   * @param data Product data
   * @returns Product response
   */
  static async updateProduct(id: string, data: ProductUpdateInput) {
    // Mock update product
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    // Create a new product object with updated fields
    const currentProduct = mockProducts[index];
    const updatedProduct: Product = {
      ...currentProduct,
      name: data.name || currentProduct.name,
      description: data.description || currentProduct.description,
      price: data.price || currentProduct.price,
      compareAtPrice: data.compareAtPrice,
      sku: data.sku || currentProduct.sku,
      inventory: data.inventory !== undefined ? data.inventory : currentProduct.inventory,
      updatedAt: new Date().toISOString(),
      isFeatured: data.isFeatured !== undefined ? data.isFeatured : currentProduct.isFeatured,
    };

    // Only update images if provided
    if (data.images) {
      updatedProduct.images = data.images.map((img: any, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: img.url,
        alt: img.alt || '',
        isDefault: img.isDefault || false,
      }));
    }

    mockProducts[index] = updatedProduct;
    return { data: updatedProduct };
  }

  /**
   * Delete product
   * @param id Product id
   * @returns Product response
   */
  static async deleteProduct(id: string) {
    // Mock delete product
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const deletedProduct = mockProducts[index];
    mockProducts.splice(index, 1);
    return { data: deletedProduct, success: true, message: 'Product deleted successfully' };
  }
}

// Export simple functions for direct use
export const getProducts = ProductService.getProducts;
export const getProduct = ProductService.getProductById;
export const getFeaturedProducts = ProductService.getFeaturedProducts;
export const getProductsBySeller = async (sellerId: string) => {
  // Return mock products by seller
  const sellerProducts = mockProducts.filter((p) => p.sellerId === sellerId);
  return { data: sellerProducts };
};
