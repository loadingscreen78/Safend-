
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import the necessary interfaces
import { 
  DashboardWidget, Payable, Receivable, BankAccount, 
  ComplianceReturn, LedgerEntry, PaymentRequest, Asset,
  Liability, Expense
} from './accounts/AccountsService';
import { addDays, subDays } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Updated interceptor with the correct type for config and fixed the headers assignment
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('authToken');
    if (token) {
      // Fix headers assignment to use the set method for AxiosHeaders
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      const errorResponse = error.response.data as ErrorResponse;
      errorMessage = errorResponse.message || errorMessage;

      if (errorResponse.errors) {
        Object.keys(errorResponse.errors).forEach(field => {
          errorResponse.errors![field].forEach(msg => {
            toast.error(`${field}: ${msg}`);
          });
        });
      } else {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      errorMessage = 'No response received from the server';
      toast.error(errorMessage);
    } else {
      errorMessage = error.message;
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

// Modified to handle API request failures by returning mock data
export const apiRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  params: Record<string, any> = {},
  data: any = null,
  headers: Record<string, string> = {}
): Promise<any> => {
  try {
    const config: {
      method: string;
      url: string;
      params?: Record<string, any>;
      data?: any;
      headers?: Record<string, string>;
    } = {
      method,
      url,
      params,
      data,
      headers,
    };
    const response = await api(config);
    return response.data;
  } catch (error: any) {
    console.error('API request failed:', error);
    
    // Check if it's a network error and use mock data instead
    if (error.code === 'ERR_NETWORK') {
      console.log('Using mock data for:', url);
      return getMockDataForEndpoint(url, params);
    }
    
    throw error;
  }
};

// Helper function to retrieve mock data based on endpoint
function getMockDataForEndpoint(url: string, params: Record<string, any> = {}): any {
  // Dashboard widgets
  if (url.includes('/dashboard/widgets')) {
    return { data: mockDashboardWidgets };
  }
  
  // Payables
  if (url.includes('/payables')) {
    if (url.includes('/payables/') && url.length > 9) {
      const id = url.split('/').pop();
      return { data: mockPayables.find(item => item.id === id) || null };
    }
    return { data: handleMockDataRequests('payables', mockPayables, params.status) };
  }
  
  // Receivables
  if (url.includes('/receivables')) {
    if (url.includes('/receivables/') && url.length > 12) {
      const id = url.split('/').pop();
      return { data: mockReceivables.find(item => item.id === id) || null };
    }
    return { data: handleMockDataRequests('receivables', mockReceivables, params.status) };
  }
  
  // Bank accounts
  if (url.includes('/bank-accounts')) {
    return { data: mockBankAccounts };
  }
  
  // Compliance returns
  if (url.includes('/compliance/')) {
    return { data: mockComplianceReturns };
  }
  
  // Ledger entries
  if (url.includes('/ledger')) {
    return { data: mockLedgerEntries };
  }
  
  // Payment requests
  if (url.includes('/payment-requests')) {
    return { data: mockPaymentRequests };
  }
  
  // Assets
  if (url.includes('/assets')) {
    return { data: mockAssets };
  }
  
  // Liabilities
  if (url.includes('/liabilities')) {
    return { data: mockLiabilities };
  }
  
  // Expenses
  if (url.includes('/expenses')) {
    return { data: mockExpenses };
  }
  
  // Reports
  if (url.includes('/reports/')) {
    if (url.includes('/profit-loss')) {
      return getMockProfitLossReport(params);
    }
    if (url.includes('/cash-flow')) {
      return getMockCashFlowReport(params);
    }
    if (url.includes('/income')) {
      return getMockIncomeReport(params);
    }
    if (url.includes('/expense')) {
      return getMockExpenseReport(params);
    }
  }
  
  // Admin roles and permissions
  if (url.includes('/admin/roles')) {
    return { data: mockRoles };
  }
  if (url.includes('/admin/permissions')) {
    return { data: mockPermissions };
  }
  if (url.includes('/admin/user-roles')) {
    return { data: { success: true } };
  }
  if (url.includes('/admin/users/')) {
    if (url.includes('/roles')) {
      return { data: mockUserRoles };
    }
  }
  
  // Default empty response
  console.warn('No mock data available for endpoint:', url);
  return { data: [] };
}

// Mock data for reports
function getMockProfitLossReport(params: any) {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        name: 'Income',
        data: [45000, 52000, 49000, 61000, 58000, 63000],
        color: '#10B981'
      },
      {
        name: 'Expenses',
        data: [32000, 35000, 31000, 42000, 45000, 41000],
        color: '#EF4444'
      },
      {
        name: 'Profit',
        data: [13000, 17000, 18000, 19000, 13000, 22000],
        color: '#3B82F6'
      }
    ],
    summary: {
      total: 102000,
      average: 17000,
      growth: 8.5,
      ytd: 102000
    }
  };
}

function getMockCashFlowReport(params: any) {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        name: 'Cash In',
        data: [42000, 48000, 46000, 57000, 55000, 60000],
        color: '#10B981'
      },
      {
        name: 'Cash Out',
        data: [30000, 32000, 28000, 40000, 42000, 38000],
        color: '#EF4444'
      },
      {
        name: 'Net Flow',
        data: [12000, 16000, 18000, 17000, 13000, 22000],
        color: '#3B82F6'
      }
    ],
    summary: {
      totalCashIn: 308000,
      totalCashOut: 210000,
      netFlow: 98000
    }
  };
}

function getMockIncomeReport(params: any) {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        name: 'Services',
        data: [35000, 40000, 37000, 45000, 42000, 48000],
        color: '#10B981'
      },
      {
        name: 'Products',
        data: [7000, 8000, 9000, 12000, 13000, 12000],
        color: '#3B82F6'
      }
    ],
    summary: {
      total: 308000,
      average: 51333,
      growth: 12.5,
      ytd: 308000
    }
  };
}

function getMockExpenseReport(params: any) {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        name: 'Rent',
        data: [10000, 10000, 10000, 10000, 10000, 10000],
        color: '#EF4444'
      },
      {
        name: 'Utilities',
        data: [5000, 5500, 4800, 6000, 6500, 5800],
        color: '#F59E0B'
      },
      {
        name: 'Salaries',
        data: [15000, 17000, 14000, 22000, 25000, 20000],
        color: '#3B82F6'
      }
    ],
    summary: {
      total: 210000,
      average: 35000,
      growth: 6.8,
      ytd: 210000
    }
  };
}

// Helper function for handling mock data requests
function handleMockDataRequests<T>(
  entityType: string,
  mockData: T[],
  filter?: string
): T[] {
  console.log(`Retrieving mock ${entityType} data with filter:`, filter);
  
  if (!mockData || !Array.isArray(mockData)) {
    console.warn(`No mock ${entityType} data available`);
    return [];
  }
  
  // Return filtered data if filter is provided
  if (filter && filter !== 'All') {
    return mockData.filter((item: any) => {
      // Handle common status filters
      if (item.status && item.status.toLowerCase() === filter.toLowerCase()) {
        return true;
      }
      
      // Handle specialized filters
      if (entityType === 'receivables' && filter === 'Overdue') {
        const dueDate = new Date(item.dueDate);
        return dueDate < new Date() && item.status !== 'paid';
      }
      
      if (entityType === 'compliance' && filter === 'Due') {
        const dueDate = new Date(item.dueDate);
        return dueDate >= new Date() && (item.status === 'pending' || item.status === 'prepared');
      }
      
      return false;
    });
  }
  
  return mockData;
}

// Add RoleAPI for the RoleAssignmentForm
export const RoleAPI = {
  getAllRoles: async () => {
    try {
      return await apiRequest('GET', '/admin/roles');
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  assignRoleToUser: async (userId: string, roleId: string) => {
    try {
      return await apiRequest('POST', '/admin/user-roles', {}, { userId, roleId });
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  },
  
  removeRoleFromUser: async (userId: string, roleId: string) => {
    try {
      return await apiRequest('DELETE', `/admin/user-roles/${userId}/${roleId}`);
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  }
};

// Mock data for roles and permissions
export const mockRoles = [
  {
    id: 'role-1',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['all'],
    isDefault: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'role-2',
    name: 'Manager',
    description: 'Management access',
    permissions: ['view', 'create', 'update'],
    isDefault: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'role-3',
    name: 'Employee',
    description: 'Basic access',
    permissions: ['view'],
    isDefault: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export const mockPermissions = [
  {
    id: 'perm-1',
    name: 'view_dashboard',
    description: 'View dashboard',
    module: 'dashboard',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'perm-2',
    name: 'manage_users',
    description: 'Manage users',
    module: 'admin',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'perm-3',
    name: 'view_reports',
    description: 'View reports',
    module: 'reports',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export const mockUserRoles = [
  {
    userId: 'user-1',
    roleId: 'role-1',
    assignedBy: 'system',
    assignedAt: '2023-01-01T00:00:00Z'
  },
  {
    userId: 'user-1',
    roleId: 'role-2',
    assignedBy: 'system',
    assignedAt: '2023-01-01T00:00:00Z'
  }
];

// Mock data for various entities
export const mockDashboardWidgets: DashboardWidget[] = [
  {
    id: '1',
    title: 'Total Revenue',
    type: 'amount',
    data: 750000,
    icon: 'dollar-sign',
    color: 'green',
    trend: 12,
    status: 'up',
  },
  {
    id: '2',
    title: 'New Customers',
    type: 'number',
    data: 45,
    icon: 'user-plus',
    color: 'blue',
    trend: -5,
    status: 'down',
  },
  {
    id: '3',
    title: 'Open Invoices',
    type: 'amount',
    data: 32000,
    icon: 'file-text',
    color: 'orange',
    trend: 0,
    status: 'stable',
  },
  {
    id: '4',
    title: 'Conversion Rate',
    type: 'percentage',
    data: 18,
    icon: 'trending-up',
    color: 'purple',
    trend: 8,
    status: 'up',
  },
];

export const mockPayables: Payable[] = [
  {
    id: 'payable-1',
    description: 'Office Supplies',
    vendorName: 'Staples',
    dueDate: addDays(new Date(), 7).toISOString(),
    totalAmount: 500,
    status: 'pending',
    type: 'vendor_bill',
    amount: 500,
  },
  {
    id: 'payable-2',
    description: 'Marketing Expenses',
    vendorName: 'Ad Agency Inc.',
    dueDate: subDays(new Date(), 3).toISOString(),
    totalAmount: 1200,
    status: 'overdue',
    type: 'vendor_bill',
    amount: 1200,
  },
  {
    id: 'payable-3',
    description: 'Salaries for June',
    employeeName: 'All Employees',
    dueDate: new Date().toISOString(),
    totalAmount: 150000,
    status: 'approved',
    type: 'salary',
    amount: 150000,
  },
];

export const mockReceivables: Receivable[] = [
  {
    id: 'receivable-1',
    invoiceNumber: 'INV-2023-001',
    clientName: 'Acme Corp',
    issueDate: subDays(new Date(), 10).toISOString(),
    dueDate: addDays(new Date(), 20).toISOString(),
    totalAmount: 10000,
    status: 'sent',
    type: 'invoice',
    amount: 10000,
    gstApplicable: true,
    description: 'Monthly Services',
    eInvoiceApplicable: false
  },
  {
    id: 'receivable-2',
    invoiceNumber: 'INV-2023-002',
    clientName: 'Beta Co',
    issueDate: subDays(new Date(), 5).toISOString(),
    dueDate: subDays(new Date(), 2).toISOString(),
    totalAmount: 5500,
    status: 'overdue',
    type: 'invoice',
    amount: 5500,
    gstApplicable: true,
    description: 'Consulting Services',
    eInvoiceApplicable: false
  },
  {
    id: 'receivable-3',
    invoiceNumber: 'DN-2023-001',
    clientName: 'Gamma Ltd',
    issueDate: subDays(new Date(), 15).toISOString(),
    dueDate: addDays(new Date(), 15).toISOString(),
    totalAmount: 2800,
    status: 'draft',
    type: 'debit_note',
    amount: 2800,
    gstApplicable: false,
    description: 'Additional Services',
    eInvoiceApplicable: false
  },
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: 'bank-1',
    accountName: 'Operating Account',
    accountNumber: '1234567890',
    bankName: 'City Bank',
    branchName: 'Main Street',
    ifscCode: 'CITI0000001',
    balance: 250000,
    status: 'active',
    accountType: 'current',
    lastTransactionDate: subDays(new Date(), 1).toISOString(),
    branchId: 'branch-1',
  },
  {
    id: 'bank-2',
    accountName: 'Savings Account',
    accountNumber: '0987654321',
    bankName: 'National Bank',
    branchName: 'Park Avenue',
    ifscCode: 'NATB0000002',
    balance: 120000,
    status: 'active',
    accountType: 'savings',
    lastTransactionDate: subDays(new Date(), 5).toISOString(),
    branchId: 'branch-2',
  },
];

export const mockComplianceReturns: ComplianceReturn[] = [
  {
    id: 'gst-1',
    returnType: 'GSTR-3B',
    period: 'June 2023',
    dueDate: addDays(new Date(), 10).toISOString(),
    amount: 45000,
    status: 'pending',
  },
  {
    id: 'tds-1',
    returnType: 'TDS Return',
    period: 'Q1 2023',
    dueDate: addDays(new Date(), 20).toISOString(),
    amount: 18000,
    status: 'filed',
  },
];

export const mockLedgerEntries: LedgerEntry[] = [
  {
    id: 'ledger-1',
    date: subDays(new Date(), 2).toISOString(),
    description: 'Invoice Payment',
    account: 'Accounts Receivable',
    accountCode: '1200',
    debit: 0,
    credit: 5000,
    balance: 75000,
    referenceType: 'invoice',
    branchId: 'branch-1',
  },
  {
    id: 'ledger-2',
    date: subDays(new Date(), 5).toISOString(),
    description: 'Rent Expense',
    account: 'Rent Expense',
    accountCode: '6200',
    debit: 2500,
    credit: 0,
    balance: 72500,
    referenceType: 'expense',
    branchId: 'branch-1',
  },
];

export const mockPaymentRequests: PaymentRequest[] = [
  {
    id: 'pr-1',
    department: 'Marketing',
    purpose: 'Advertising Campaign',
    amount: 10000,
    requestedDate: subDays(new Date(), 3).toISOString(),
    status: 'pending',
    remarks: 'Funds needed for online ads',
    branchId: 'branch-1',
  },
  {
    id: 'pr-2',
    department: 'IT',
    purpose: 'Software License Renewal',
    amount: 7500,
    requestedDate: subDays(new Date(), 7).toISOString(),
    status: 'approved',
    remarks: 'Annual license fee',
    branchId: 'branch-2',
  },
];

export const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Office Laptop',
    category: 'Electronics',
    value: 2000,
    purchaseDate: subDays(new Date(), 365).toISOString(),
    description: 'Dell XPS 15',
    status: 'active',
    branchId: 'branch-1',
    purchasePrice: 2000,
    currentValue: 1500,
    depreciationRate: 20,
    depreciationMethod: 'straight-line'
  },
  {
    id: 'asset-2',
    name: 'Company Car',
    category: 'Vehicles',
    value: 25000,
    purchaseDate: subDays(new Date(), 730).toISOString(),
    description: 'Toyota Camry',
    status: 'active',
    branchId: 'branch-2',
    purchasePrice: 25000,
    currentValue: 18000,
    depreciationRate: 15,
    depreciationMethod: 'straight-line'
  },
];

export const mockLiabilities: Liability[] = [
  {
    id: 'liability-1',
    name: 'Bank Loan',
    type: 'Long Term Debt',
    amount: 100000,
    dueDate: addDays(new Date(), 180).toISOString(),
    description: 'Business Expansion Loan',
    status: 'active',
    branchId: 'branch-1',
    startDate: subDays(new Date(), 365).toISOString(),
    remainingAmount: 85000
  },
  {
    id: 'liability-2',
    name: 'Credit Card Debt',
    type: 'Short Term Debt',
    amount: 5000,
    dueDate: addDays(new Date(), 30).toISOString(),
    description: 'Operating Expenses',
    status: 'active',
    branchId: 'branch-2',
    startDate: subDays(new Date(), 30).toISOString(),
    remainingAmount: 5000
  },
];

export const mockExpenses: Expense[] = [
  {
    id: 'expense-1',
    category: 'Rent',
    amount: 2500,
    date: subDays(new Date(), 5).toISOString(),
    paymentMethod: 'Bank Transfer',
    description: 'Office Rent for June',
    status: 'paid',
    branchId: 'branch-1',
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: 'expense-2',
    category: 'Utilities',
    amount: 800,
    date: subDays(new Date(), 10).toISOString(),
    paymentMethod: 'Credit Card',
    description: 'Electricity Bill',
    status: 'paid',
    branchId: 'branch-2',
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 10).toISOString(),
  },
];
