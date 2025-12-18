
export interface MaintenanceTicket {
  id: string;
  branchId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  category: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'equipment' | 'it' | 'other';
  reportedBy: string;
  assignedTo?: string;
  assetId?: string;
  locationDetails?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  costEstimate?: number;
  actualCost?: number;
  scheduledDate?: string;
  attachments?: string[];
  comments?: MaintenanceComment[];
}

export interface MaintenanceSchedule {
  id: string;
  branchId: string;
  title: string;
  description: string;
  assetId?: string;
  assetName?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
  nextDueDate: string;
  lastCompletedDate?: string;
  assignedTo?: string;
  status: 'upcoming' | 'overdue' | 'in-progress' | 'completed';
  procedures?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  attachments?: string[];
}
