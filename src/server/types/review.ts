export interface Review {
  id: string;
  orderId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  reply?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
