export interface Order {
  id: string;
  offerId?: string | null;
  buyerWalletId?: string | null;
  amount: number;
  status: 'pending' | 'settled' | 'cancelled';
  txHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
