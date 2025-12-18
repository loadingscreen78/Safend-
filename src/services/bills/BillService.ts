
import { emitEvent, EVENT_TYPES } from '../EventService';

export interface Bill {
  id: string;
  name: string;
  category: 'rent' | 'utility' | 'subscription' | 'equipment' | 'service' | 'other';
  branchId: string;
  vendorId: string;
  vendorName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'yearly';
  amount: number;
  currency: string;
  nextDueDate: string;
  status: 'active' | 'suspended' | 'expired';
  startDate: string;
  endDate?: string | null;
  notes?: string;
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DueBill {
  id: string;
  billId: string;
  name: string;
  category: 'rent' | 'utility' | 'subscription' | 'equipment' | 'service' | 'other';
  branchId: string;
  vendorId: string;
  vendorName: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'upcoming' | 'paid' | 'processing' | 'overdue';
  paymentReference?: string | null;
  paymentDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
let bills: Bill[] = [];
let dueBills: DueBill[] = [];

// Generate IDs
const generateBillId = () => {
  return `BILL-${String(bills.length + 1).padStart(3, '0')}`;
};

const generateDueBillId = () => {
  return `DUE-${String(dueBills.length + 1).padStart(3, '0')}`;
};

// Bill CRUD operations
export const createBill = (data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const newBill: Bill = {
    id: generateBillId(),
    createdAt: now,
    updatedAt: now,
    ...data
  };
  
  bills.push(newBill);
  
  // Create first due bill
  scheduleBillDue(newBill.id);
  
  return newBill;
};

export const updateBill = (id: string, data: Partial<Omit<Bill, 'id' | 'createdAt'>>) => {
  const billIndex = bills.findIndex(b => b.id === id);
  
  if (billIndex === -1) {
    return null;
  }
  
  bills[billIndex] = {
    ...bills[billIndex],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return bills[billIndex];
};

export const getBillById = (id: string) => {
  return bills.find(b => b.id === id) || null;
};

export const getAllBills = (params: {
  status?: string;
  category?: string;
  branchId?: string;
  search?: string;
} = {}) => {
  let result = [...bills];
  
  if (params.status) {
    result = result.filter(b => b.status === params.status);
  }
  
  if (params.category) {
    result = result.filter(b => b.category === params.category);
  }
  
  if (params.branchId) {
    result = result.filter(b => b.branchId === params.branchId);
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    result = result.filter(
      b => b.name.toLowerCase().includes(searchLower) || 
           b.vendorName.toLowerCase().includes(searchLower) ||
           b.id.toLowerCase().includes(searchLower)
    );
  }
  
  return result;
};

// Due bill operations
export const createDueBill = (data: Omit<DueBill, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const newDueBill: DueBill = {
    id: generateDueBillId(),
    status: 'upcoming',
    createdAt: now,
    updatedAt: now,
    ...data
  };
  
  dueBills.push(newDueBill);
  
  // Emit event
  emitEvent(EVENT_TYPES.BILL_DUE, newDueBill);
  
  return newDueBill;
};

export const updateDueBillStatus = (
  id: string, 
  status: 'paid' | 'processing' | 'overdue',
  metadata: {
    paymentReference?: string;
    paymentDate?: string;
  } = {}
) => {
  const dueBillIndex = dueBills.findIndex(db => db.id === id);
  
  if (dueBillIndex === -1) {
    return null;
  }
  
  dueBills[dueBillIndex] = {
    ...dueBills[dueBillIndex],
    status,
    ...metadata,
    updatedAt: new Date().toISOString()
  };
  
  // Emit event if paid
  if (status === 'paid') {
    emitEvent(EVENT_TYPES.BILL_PAID, dueBills[dueBillIndex]);
  }
  
  return dueBills[dueBillIndex];
};

export const getDueBillById = (id: string) => {
  return dueBills.find(db => db.id === id) || null;
};

export const getDueBills = (params: {
  status?: string;
  category?: string;
  branchId?: string;
  vendorId?: string;
  isPast?: boolean;
  search?: string;
} = {}) => {
  let result = [...dueBills];
  
  if (params.status) {
    result = result.filter(db => db.status === params.status);
  }
  
  if (params.category) {
    result = result.filter(db => db.category === params.category);
  }
  
  if (params.branchId) {
    result = result.filter(db => db.branchId === params.branchId);
  }
  
  if (params.vendorId) {
    result = result.filter(db => db.vendorId === params.vendorId);
  }
  
  if (params.isPast !== undefined) {
    const now = new Date();
    if (params.isPast) {
      result = result.filter(db => new Date(db.dueDate) < now);
    } else {
      result = result.filter(db => new Date(db.dueDate) >= now);
    }
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    result = result.filter(
      db => db.name.toLowerCase().includes(searchLower) || 
           db.vendorName.toLowerCase().includes(searchLower) ||
           db.id.toLowerCase().includes(searchLower)
    );
  }
  
  return result;
};

// Schedule due bills
export const scheduleBillDue = (billId: string) => {
  const bill = getBillById(billId);
  
  if (!bill || bill.status !== 'active') {
    return null;
  }
  
  // Add months based on frequency to calculate next due date
  const getNextDueDate = (date: Date, frequency: string) => {
    const newDate = new Date(date);
    
    switch (frequency) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'quarterly':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
      case 'biannual':
        newDate.setMonth(newDate.getMonth() + 6);
        break;
      case 'yearly':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      default:
        newDate.setMonth(newDate.getMonth() + 1); // Default to monthly
    }
    
    return newDate;
  };
  
  const nextDueDate = new Date(bill.nextDueDate);
  const now = new Date();
  
  // If next due date is in the past, set it to now + frequency
  if (nextDueDate < now) {
    nextDueDate.setTime(now.getTime());
  }
  
  // Generate name for the due bill
  const getMonthYear = (date: Date) => {
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };
  
  const getQuarter = (date: Date) => {
    return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
  };
  
  let billName = bill.name;
  switch (bill.frequency) {
    case 'monthly':
      billName += ` - ${getMonthYear(nextDueDate)}`;
      break;
    case 'quarterly':
      billName += ` - ${getQuarter(nextDueDate)}`;
      break;
    case 'yearly':
      billName += ` - ${nextDueDate.getFullYear()}`;
      break;
    default:
      billName += ` - ${nextDueDate.toLocaleDateString()}`;
  }
  
  // Create due bill
  const dueBill = createDueBill({
    billId: bill.id,
    name: billName,
    category: bill.category,
    branchId: bill.branchId,
    vendorId: bill.vendorId,
    vendorName: bill.vendorName,
    dueDate: nextDueDate.toISOString(),
    amount: bill.amount,
    currency: bill.currency,
    status: 'upcoming'
  });
  
  // Update bill with new next due date
  const updatedBill = updateBill(bill.id, {
    nextDueDate: getNextDueDate(nextDueDate, bill.frequency).toISOString()
  });
  
  return { dueBill, updatedBill };
};

// Batch schedule function - to be called by a scheduler like Celery
export const scheduleBillDueForAll = () => {
  const activeBills = getAllBills({ status: 'active' });
  const now = new Date();
  const results = [];
  
  for (const bill of activeBills) {
    const nextDueDate = new Date(bill.nextDueDate);
    
    // Only create due bills that are within 30 days of current date
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    if (nextDueDate <= thirtyDaysFromNow) {
      const result = scheduleBillDue(bill.id);
      if (result) {
        results.push(result);
      }
    }
  }
  
  return results;
};
