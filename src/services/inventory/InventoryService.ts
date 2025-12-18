
import { emitEvent, EVENT_TYPES } from '../EventService';

export interface InventoryItem {
  id: string;
  branch: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unitOfMeasure: string;
  status: string;
  lastUpdated: string;
  location?: string;
  barcode?: string;
  purchasePrice?: number;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  type: 'stock-in' | 'stock-out' | 'return' | 'adjustment';
  quantity: number;
  branch: string;
  reference: string;
  notes?: string;
  performedBy: string;
  timestamp: string;
}

export interface InventoryDistribution {
  id: string;
  itemId: string;
  quantity: number;
  branch: string;
  destinationType: 'employee' | 'post' | 'vehicle' | 'branch';
  destinationId: string;
  notes?: string;
  issuedBy: string;
  issuedDate: string;
  status: 'issued' | 'returned' | 'lost';
}

// In-memory storage for inventory items
let inventoryItems: InventoryItem[] = [];
let stockTransactions: StockTransaction[] = [];
let inventoryDistributions: InventoryDistribution[] = [];

// Generate a unique inventory item ID
const generateInventoryId = () => {
  return `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Generate a unique transaction ID
const generateTransactionId = () => {
  return `TXN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Generate a unique distribution ID
const generateDistributionId = () => {
  return `DIST-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Create a new inventory item
export const createInventoryItem = (data: Omit<InventoryItem, 'id' | 'status' | 'lastUpdated'>) => {
  const newItem: InventoryItem = {
    id: generateInventoryId(),
    status: 'active',
    lastUpdated: new Date().toISOString(),
    ...data
  };
  
  inventoryItems.push(newItem);
  return newItem;
};

// Update an existing inventory item
export const updateInventoryItem = (id: string, data: Partial<InventoryItem>) => {
  const itemIndex = inventoryItems.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return null;
  }
  
  inventoryItems[itemIndex] = {
    ...inventoryItems[itemIndex],
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  return inventoryItems[itemIndex];
};

// Get all inventory items
export const getAllInventoryItems = (branch?: string) => {
  if (branch) {
    return inventoryItems.filter(item => item.branch === branch);
  }
  return inventoryItems;
};

// Get inventory item by ID
export const getInventoryItemById = (id: string) => {
  return inventoryItems.find(item => item.id === id) || null;
};

// Get low stock items
export const getLowStockItems = (branch?: string) => {
  let items = inventoryItems;
  
  if (branch) {
    items = items.filter(item => item.branch === branch);
  }
  
  return items.filter(item => item.currentStock <= item.reorderLevel);
};

// Process stock transaction
export const processStockTransaction = (transaction: Omit<StockTransaction, 'id' | 'timestamp'>) => {
  const newTransaction: StockTransaction = {
    id: generateTransactionId(),
    timestamp: new Date().toISOString(),
    ...transaction
  };
  
  // Update inventory item stock level
  const item = inventoryItems.find(i => i.id === transaction.itemId);
  
  if (!item) {
    throw new Error(`Inventory item with ID ${transaction.itemId} not found`);
  }
  
  // Calculate new stock level based on transaction type
  let stockChange = 0;
  if (transaction.type === 'stock-in' || transaction.type === 'return') {
    stockChange = transaction.quantity;
  } else if (transaction.type === 'stock-out') {
    stockChange = -transaction.quantity;
    
    if (item.currentStock < transaction.quantity) {
      throw new Error(`Insufficient stock for item ${item.name}`);
    }
  } else if (transaction.type === 'adjustment') {
    stockChange = transaction.quantity; // Can be positive or negative
  }
  
  // Update stock level
  updateInventoryItem(item.id, { currentStock: item.currentStock + stockChange });
  
  // Add transaction to log
  stockTransactions.push(newTransaction);
  
  return newTransaction;
};

// Create inventory distribution
export const createInventoryDistribution = (data: Omit<InventoryDistribution, 'id' | 'status'>) => {
  const newDistribution: InventoryDistribution = {
    id: generateDistributionId(),
    status: 'issued',
    ...data
  };
  
  // Process as stock-out transaction
  try {
    processStockTransaction({
      itemId: data.itemId,
      type: 'stock-out',
      quantity: data.quantity,
      branch: data.branch,
      reference: newDistribution.id,
      notes: `Issued to ${data.destinationType} ${data.destinationId}`,
      performedBy: data.issuedBy
    });
    
    // Add to distributions
    inventoryDistributions.push(newDistribution);
    
    // Emit inventory issued event
    emitEvent(EVENT_TYPES.INVENTORY_ISSUED || 'inventory.issued', newDistribution);
    
    return newDistribution;
  } catch (error) {
    console.error('Error creating inventory distribution:', error);
    throw error;
  }
};

// Get distributions
export const getInventoryDistributions = (branch?: string) => {
  if (branch) {
    return inventoryDistributions.filter(dist => dist.branch === branch);
  }
  return inventoryDistributions;
};

// Get stock transactions
export const getStockTransactions = (params: { 
  branch?: string, 
  itemId?: string, 
  type?: string,
  startDate?: string,
  endDate?: string
} = {}) => {
  let filteredTransactions = stockTransactions;
  
  if (params.branch) {
    filteredTransactions = filteredTransactions.filter(t => t.branch === params.branch);
  }
  
  if (params.itemId) {
    filteredTransactions = filteredTransactions.filter(t => t.itemId === params.itemId);
  }
  
  if (params.type) {
    filteredTransactions = filteredTransactions.filter(t => t.type === params.type);
  }
  
  if (params.startDate) {
    filteredTransactions = filteredTransactions.filter(
      t => new Date(t.timestamp) >= new Date(params.startDate!)
    );
  }
  
  if (params.endDate) {
    filteredTransactions = filteredTransactions.filter(
      t => new Date(t.timestamp) <= new Date(params.endDate!)
    );
  }
  
  return filteredTransactions;
};

// Calculate reorder level based on usage patterns
export const calculateReorderLevel = (itemId: string) => {
  const item = getInventoryItemById(itemId);
  
  if (!item) {
    throw new Error(`Inventory item with ID ${itemId} not found`);
  }
  
  // This would implement a more sophisticated algorithm in a real app
  // For now, just return the current reorder level
  return item.reorderLevel;
};
