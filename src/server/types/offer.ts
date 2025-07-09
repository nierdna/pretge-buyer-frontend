export interface Offer {
  id: string;
  tokenId?: string | null;
  sellerWalletId?: string | null;
  exTokenId?: string | null;
  price: number;
  quantity: number;
  filled: number;
  status: 'open' | 'closed';
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
