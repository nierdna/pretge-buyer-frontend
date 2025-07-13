export interface Review {
  id: string;
  offerId: string;
  buyerId: string;
  rating: number; // 1-5
  comment: string;
  reply?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
