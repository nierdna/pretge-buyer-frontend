export interface Offer {
  id: string;
  tokenId?: string | null;
  sellerWalletId?: string | null;
  exTokenId?: string | null;
  price: number;
  quantity: number;
  filled: number;
  collateralPercent: number;
  settleDuration: number;
  status: 'open' | 'closed';
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
