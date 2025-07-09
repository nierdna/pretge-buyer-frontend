import { z } from 'zod';

// User/Seller validation schemas
export const createSellerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  socialMedia: z
    .object({
      twitter: z.string().url().optional(),
      telegram: z.string().url().optional(),
      discord: z.string().url().optional(),
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      youtube: z.string().url().optional(),
    })
    .optional(),
  kycStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
  status: z.enum(['active', 'banned', 'pending']).optional(),
});

export const updateSellerSchema = createSellerSchema.partial();

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  avatar: z.string().url().optional().nullable(),
  banner: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  socialMedia: z
    .object({
      twitter: z.string().default(''),
      telegram: z.string().default(''),
      discord: z.string().default(''),
      instagram: z.string().default(''),
      facebook: z.string().default(''),
      youtube: z.string().default(''),
    })
    .optional(),
  kycStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  status: z.enum(['active', 'banned', 'pending']).default('pending'),
});

export const updateUserSchema = createUserSchema.partial();

// Wallet validation schemas
export const createWalletSchema = z.object({
  userId: z.string().uuid(),
  chainType: z.enum(['evm', 'sol', 'sui']),
  address: z.string().min(1, 'Address is required'),
  isPrimary: z.boolean().default(false),
});

export const updateWalletSchema = createWalletSchema.partial();

// Network validation schemas
export const createNetworkSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  chainType: z.enum(['evm', 'sol', 'sui']),
  rpcUrl: z.string().url('Invalid RPC URL'),
  explorerUrl: z.string().url('Invalid explorer URL'),
});

export const updateNetworkSchema = createNetworkSchema.partial();

// ExToken validation schemas
export const createExTokenSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  symbol: z.string().min(1, 'Symbol is required').max(50),
  logo: z.string().url().optional().nullable(),
  address: z.string().min(1, 'Address is required'),
  networkId: z.string().uuid().optional().nullable(),
});

export const updateExTokenSchema = createExTokenSchema.partial();

// WalletExToken validation schemas
export const createWalletExTokenSchema = z.object({
  chainType: z.enum(['evm', 'sol', 'sui']),
  address: z.string().min(1, 'Address is required'),
  walletId: z.string().uuid(),
  exTokenId: z.string().uuid(),
  balance: z.number().min(0, 'Balance must be non-negative'),
});

export const updateWalletExTokenSchema = createWalletExTokenSchema.partial();

// Token validation schemas
export const createTokenSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  symbol: z.string().min(1, 'Symbol is required').max(50),
  logo: z.string().url().optional().nullable(),
  tokenContract: z.string().optional().nullable(),
  networkId: z.string().uuid().optional().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: z.enum(['draft', 'active', 'ended', 'cancelled']).default('draft'),
});

export const updateTokenSchema = createTokenSchema.partial();

// Offer validation schemas
export const createOfferSchema = z.object({
  tokenId: z.string().uuid().optional().nullable(),
  sellerWalletId: z.string().uuid().optional().nullable(),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  filled: z.number().min(0, 'Filled must be non-negative').default(0),
  status: z.enum(['open', 'closed']).default('open'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const updateOfferSchema = createOfferSchema.partial();

// Order validation schemas
export const createOrderSchema = z.object({
  offerId: z.string().uuid().optional().nullable(),
  buyerWalletId: z.string().uuid().optional().nullable(),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['pending', 'settled', 'cancelled']).default('pending'),
  txHash: z.string().optional().nullable(),
});

export const updateOrderSchema = createOrderSchema.partial();

// Review validation schemas
export const createReviewSchema = z.object({
  offerId: z.string().uuid().optional().nullable(),
  buyerId: z.string().min(1, 'Buyer ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required'),
  reply: z.string().optional().nullable(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

export const updateReviewSchema = createReviewSchema.partial();

// Notification validation schemas
export const createNotificationSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  type: z.string().min(1, 'Type is required').max(50),
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  isRead: z.boolean().default(false),
});

export const updateNotificationSchema = createNotificationSchema.partial();

// Support ticket validation schemas
export const createSupportTicketSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  subject: z.string().min(1, 'Subject is required').max(255),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).default('open'),
  adminId: z.string().optional().nullable(),
});

export const updateSupportTicketSchema = createSupportTicketSchema.partial();

// Chat message validation schemas
export const createChatMessageSchema = z.object({
  orderId: z.string().uuid().optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
  message: z.string().min(1, 'Message is required'),
  attachmentUrl: z.string().url().optional().nullable(),
});

export const updateChatMessageSchema = createChatMessageSchema.partial();

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').optional(),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit too high').optional(),
});

// Search validation
export const searchSchema = z.object({
  search: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
});

// Common validation functions
export function validatePagination(page?: string, limit?: string) {
  const parsedPage = page ? parseInt(page) : 1;
  const parsedLimit = limit ? parseInt(limit) : 10;

  if (parsedPage < 1) throw new Error('Page must be at least 1');
  if (parsedLimit < 1 || parsedLimit > 100) throw new Error('Limit must be between 1 and 100');

  return { page: parsedPage, limit: parsedLimit };
}

export function validateId(id: string) {
  if (!id || id.trim().length === 0) {
    throw new Error('ID is required');
  }
  return id.trim();
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase();
}

export function validateWalletAddress(address: string) {
  // Basic Ethereum address validation
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(address)) {
    throw new Error('Invalid wallet address format');
  }
  return address.toLowerCase();
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength);
}

export function validateDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }

  if (start >= end) {
    throw new Error('Start date must be before end date');
  }

  return { start, end };
}
