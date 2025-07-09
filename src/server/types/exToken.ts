export interface ExToken {
  id: string;
  name: string;
  symbol: string;
  logo?: string | null;
  address: string;
  networkId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
