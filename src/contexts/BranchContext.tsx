
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '@/types/branch';

interface BranchContextType {
  currentBranch: Branch | null;
  allBranches: Branch[];
  setCurrentBranchById: (branchId: string) => void;
  updateBranches: (branches: Branch[]) => void;
  isMainBranch: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

export const BranchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  
  useEffect(() => {
    // Get branches from localStorage or use initial data
    const storedBranches = localStorage.getItem('branches');
    let initialBranches: Branch[] = [];
    
    if (storedBranches) {
      initialBranches = JSON.parse(storedBranches);
    } else {
      // Default initial data if not found
      initialBranches = [
        {
          id: "main",
          name: "Main Branch (HQ)",
          code: "HQ-001",
          address: "123 Main Street",
          city: "Delhi",
          state: "Delhi",
          country: "India",
          postalCode: "110001",
          phone: "+91 11-12345678",
          email: "hq@safend.com",
          managerName: "Rahul Sharma",
          managerId: "u1",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('branches', JSON.stringify(initialBranches));
    }
    
    setAllBranches(initialBranches);
    
    // Get selected branch from localStorage or use main branch
    const selectedBranchId = localStorage.getItem('selectedBranchId') || 'main';
    const selectedBranch = initialBranches.find(b => b.id === selectedBranchId) || initialBranches[0];
    setCurrentBranch(selectedBranch);
  }, []);
  
  // Listen for branch change events
  useEffect(() => {
    const handleBranchChange = (event: CustomEvent) => {
      const branchId = event.detail;
      setCurrentBranchById(branchId);
    };
    
    window.addEventListener('branch-changed', handleBranchChange as EventListener);
    return () => {
      window.removeEventListener('branch-changed', handleBranchChange as EventListener);
    };
  }, [allBranches]);
  
  const setCurrentBranchById = (branchId: string) => {
    const branch = allBranches.find(b => b.id === branchId) || null;
    setCurrentBranch(branch);
    if (branch) {
      localStorage.setItem('selectedBranchId', branch.id);
    }
  };
  
  const updateBranches = (branches: Branch[]) => {
    setAllBranches(branches);
    localStorage.setItem('branches', JSON.stringify(branches));
    
    // Update current branch if needed
    if (currentBranch) {
      const updatedCurrentBranch = branches.find(b => b.id === currentBranch.id) || null;
      setCurrentBranch(updatedCurrentBranch);
    }
  };
  
  const isMainBranch = currentBranch?.id === 'main';
  
  return (
    <BranchContext.Provider 
      value={{ 
        currentBranch, 
        allBranches, 
        setCurrentBranchById, 
        updateBranches,
        isMainBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};
