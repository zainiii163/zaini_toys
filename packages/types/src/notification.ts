export type NotificationType =
  | 'order'
  | 'promotion'
  | 'system'
  | 'price_drop'
  | 'back_in_stock';

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app';
  createdAt: string;
}

export type TicketCategory =
  | 'order'
  | 'refund'
  | 'product'
  | 'shipping'
  | 'other';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketMessage {
  _id: string;
  sender: string;
  message: string;
  attachments?: { url: string; publicId: string }[];
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  user: string;
  order?: string;
  subject: string;
  message: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}
