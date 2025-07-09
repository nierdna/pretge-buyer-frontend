export interface ChatMessage {
  id: string;
  orderId?: string;
  sellerId: string;
  buyerId: string;
  message: string;
  senderType: 'seller' | 'buyer' | 'system';
  attachmentUrl?: string;
  createdAt: Date;
}
