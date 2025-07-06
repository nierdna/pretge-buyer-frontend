export interface Notification {
  id: string;
  sellerId: string;
  type: 'order' | 'promotion' | 'system' | 'review' | string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}
