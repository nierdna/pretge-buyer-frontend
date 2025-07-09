export interface Token {
  id: string;
  name: string;
  symbol: string;
  logo?: string | null;
  tokenContract?: string | null;
  networkId?: string | null;
  startTime: Date;
  endTime: Date;
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
