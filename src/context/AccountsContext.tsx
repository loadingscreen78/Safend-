import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useEvent, EVENT_TYPES } from '@/hooks/useEvent';

// Define section types for the Accounts module
export type AccountsSection = 
  | 'dashboard' 
  | 'payables' 
  | 'receivables' 
  | 'compliance' 
  | 'assets-liabilities'
  | 'banking';

// Define filter types for various sections
export type FilterType = {
  [key in AccountsSection]?: string[];
};

// Extended context interface with additional properties
interface AccountsContextProps {
  selectedBranch: string | null;
  setSelectedBranch: (branchId: string | null) => void;
  activeSection: AccountsSection;
  setActiveSection: (section: AccountsSection) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  isDataLoading: boolean;
  setIsDataLoading: (loading: boolean) => void;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  dateRange: { startDate: Date; endDate: Date } | null;
  setDateRange: (range: { startDate: Date; endDate: Date } | null) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  filters: FilterType;
  branchName: string | null;
  setBranchName: (name: string | null) => void;
}

const AccountsContext = createContext<AccountsContextProps | undefined>(undefined);

interface AccountsProviderProps {
  children: ReactNode;
}

// Default filters for each section
const defaultFilters: FilterType = {
  dashboard: ['Overview', 'Cash Flow', 'Payables', 'Receivables', 'Compliance', 'Assets'],
  payables: ['All Payables', 'Pending', 'Approved', 'Paid', 'Vendor Bills', 'Salary', 'Expenses', 'Credit Notes'],
  receivables: ['All Receivables', 'Draft', 'Sent', 'Overdue', 'Paid', 'Invoices', 'Debit Notes', 'Other Income'],
  compliance: ['GST', 'TDS', 'Ledger Book', 'Audit Trail', 'e-Invoicing'],
  'assets-liabilities': ['Assets', 'Liabilities', 'Depreciation', 'Capital Work', 'Loans'],
  banking: ['Accounts', 'Transactions', 'Reconciliation', 'Cheques', 'Cash Register']
};

// Get the current date and calculate the first day of the month
const getCurrentMonthDateRange = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return { startDate: firstDay, endDate: today };
};

export function AccountsProvider({ children }: AccountsProviderProps) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AccountsSection>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<string>("Overview");
  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date } | null>(getCurrentMonthDateRange());
  const [error, setError] = useState<Error | null>(null);
  const [filters] = useState<FilterType>(defaultFilters);

  const triggerRefresh = useCallback(() => {
    console.log('Triggering refresh in AccountsContext');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Subscribe to branch change events
  useEvent(EVENT_TYPES.BRANCH_CHANGED, (payload) => {
    if (payload?.branchId) {
      setSelectedBranch(payload.branchId);
      setBranchName(payload.branchName || null);
      // Trigger data refresh when branch changes
      triggerRefresh();
    }
  }, [triggerRefresh]);

  // Subscribe to relevant accounts module events
  useEvent([
    EVENT_TYPES.ACCOUNTS_TRANSACTION_CREATED,
    EVENT_TYPES.ACCOUNTS_EXPENSE_CREATED,
    EVENT_TYPES.ACCOUNTS_INVOICE_CREATED
  ], () => {
    // When any accounts-related data changes, refresh the data
    triggerRefresh();
  }, [triggerRefresh]);

  return (
    <AccountsContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        activeSection,
        setActiveSection,
        refreshTrigger,
        triggerRefresh,
        isDataLoading,
        setIsDataLoading,
        currentFilter,
        setCurrentFilter,
        dateRange,
        setDateRange,
        error,
        setError,
        clearError,
        filters,
        branchName,
        setBranchName
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccountsContext() {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error('useAccountsContext must be used within an AccountsProvider');
  }
  return context;
}
