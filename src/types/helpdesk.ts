
export interface SupportTicket {
  id: string;
  branchId: string;
  title: string;
  description: string;
  category: 'it' | 'facilities' | 'hr' | 'accounts' | 'operations' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'assigned' | 'in-progress' | 'on-hold' | 'resolved' | 'closed';
  createdBy: string;
  createdAt: string;
  assignedTo?: string;
  dueDate?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  attachments?: string[];
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  attachments?: string[];
}

export interface KnowledgeBaseArticle {
  id: string;
  branchId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
}
