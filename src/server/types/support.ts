export interface SupportTicket {
  id: string;
  sellerId: string;
  subject: string;
  content: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  adminId?: string;
  createdAt: Date;
  updatedAt: Date;
}
