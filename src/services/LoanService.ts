import { Loan, LoanInstallment } from "@/pages/hr/components";
import { HR_CONFIG } from "@/config";
import { mockLoans } from "@/data/mockLoans";
import { mockLoanInstallments } from "@/data/mockLoanInstallments";
import { emitEvent, EVENT_TYPES } from "./EventService";

// Add a new request status type
export type RequestStatus = 'DRAFT' | 'SENT_TO_ACCOUNTS' | 'APPROVED_BY_ACCOUNTS' | 'REJECTED_BY_ACCOUNTS' | 'PROCESSING' | 'COMPLETED';

// Store loans and installments in memory
let loans = [...mockLoans];
let installments = [...mockLoanInstallments];

// Create a new loan request
export const createLoanRequest = (loanData: Omit<Loan, 'id' | 'requestedOn' | 'status'>) => {
  // Validate loan against ceiling limits
  const isValid = validateLoanRequest(loanData);
  
  if (!isValid) {
    throw new Error("Loan exceeds allowed limits");
  }
  
  // Create new loan record
  const newLoan: Loan = {
    id: `LOAN${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    status: "REQUESTED",
    requestedOn: new Date().toISOString(),
    accountsRequestStatus: 'DRAFT', // Initialize accounts request status
    ...loanData
  };
  
  loans.push(newLoan);
  
  // Emit event for loan.requested
  emitEvent(EVENT_TYPES.LOAN_REQUESTED, newLoan);
  
  return newLoan;
};

// Validate loan request against Payment of Wages Act limits
export const validateLoanRequest = (loanData: Partial<Loan>) => {
  // Check if we have employee salary info - in a real app this would come from a service
  // For this mock, assume employee salary is stored elsewhere
  
  // Simple validation - ensure principal and emi months are valid
  if (!loanData.principal || loanData.principal <= 0) {
    return false;
  }
  
  if (!loanData.emiMonths || loanData.emiMonths <= 0) {
    return false;
  }
  
  // Calculate monthly deduction
  const monthlyDeduction = loanData.principal / loanData.emiMonths;
  
  // Get employee salary - in a real app, would fetch this from employee records
  // For this mock, assume a function exists
  const employeeSalary = getEmployeeSalary(loanData.employeeId);
  
  // Check against Payment of Wages Act limit (50% of wages)
  const maxAllowedDeduction = employeeSalary * (HR_CONFIG.LOANS.MAX_DEDUCTION_PCT / 100);
  
  if (monthlyDeduction > maxAllowedDeduction) {
    return false;
  }
  
  return true;
};

// Mock function to get employee salary
const getEmployeeSalary = (employeeId: string): number => {
  // Mock data - in a real app, this would fetch from employee records
  const mockSalaries: Record<string, number> = {
    "E001": 18000,
    "E002": 15000,
    "E003": 20000,
    "E004": 16000,
    "E005": 22000
  };
  
  return mockSalaries[employeeId] || 15000;
};

// Submit loan request to Accounts
export const submitLoanRequestToAccounts = (loanId: string) => {
  const loanIndex = loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1 || loans[loanIndex].status !== "REQUESTED") {
    return null;
  }
  
  // Update the loan with accounts request status
  loans[loanIndex] = {
    ...loans[loanIndex],
    accountsRequestStatus: 'SENT_TO_ACCOUNTS',
    sentToAccountsOn: new Date().toISOString()
  };
  
  // Emit event for loan request sent to accounts
  emitEvent(EVENT_TYPES.LOAN_REQUEST_TO_ACCOUNTS, loans[loanIndex]);
  
  return loans[loanIndex];
};

// Approve a loan request by Accounts
export const approveLoanByAccounts = (loanId: string, approver: string) => {
  const loanIndex = loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1 || loans[loanIndex].accountsRequestStatus !== "SENT_TO_ACCOUNTS") {
    return null;
  }
  
  const now = new Date();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + loans[loanIndex].emiMonths);
  
  loans[loanIndex] = {
    ...loans[loanIndex],
    status: "ACTIVE",
    approvedOn: now.toISOString(),
    approvedBy: approver,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    accountsRequestStatus: 'APPROVED_BY_ACCOUNTS',
    accountsApprovedOn: now.toISOString(),
    accountsApprovedBy: approver
  };
  
  // Emit event for loan.approved
  emitEvent(EVENT_TYPES.LOAN_APPROVED, loans[loanIndex]);
  
  // Schedule deductions
  scheduleLoanDeductions(loanId);
  
  return loans[loanIndex];
};

// Reject loan request by Accounts
export const rejectLoanByAccounts = (loanId: string, reason: string, rejectedBy: string) => {
  const loanIndex = loans.findIndex(loan => loan.id === loanId);
  
  if (loanIndex === -1 || loans[loanIndex].accountsRequestStatus !== "SENT_TO_ACCOUNTS") {
    return null;
  }
  
  loans[loanIndex] = {
    ...loans[loanIndex],
    status: "REJECTED",
    accountsRequestStatus: 'REJECTED_BY_ACCOUNTS',
    rejectionReason: reason,
    accountsRejectedOn: new Date().toISOString(),
    accountsRejectedBy: rejectedBy
  };
  
  // Emit event for loan.rejected
  emitEvent(EVENT_TYPES.LOAN_REJECTED, loans[loanIndex]);
  
  return loans[loanIndex];
};

// Legacy approve loan function - now deprecated in favor of accounts approval flow
export const approveLoan = (loanId: string, approver: string) => {
  console.warn('This function is deprecated. Use approveLoanByAccounts instead.');
  return null;
};

// Schedule loan deductions (installments)
export const scheduleLoanDeductions = (loanId: string) => {
  const loan = loans.find(l => l.id === loanId);
  
  if (!loan || loan.status !== "ACTIVE") {
    return [];
  }
  
  const newInstallments: LoanInstallment[] = [];
  const installmentAmount = Math.round(loan.principal / loan.emiMonths);
  
  // Create installment records for each month
  for (let i = 0; i < loan.emiMonths; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    const installment: LoanInstallment = {
      id: `INST${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      loanId: loan.id,
      amount: i === loan.emiMonths - 1 
        ? loan.principal - (installmentAmount * (loan.emiMonths - 1)) // Last payment adjusts for rounding
        : installmentAmount,
      dueDate: dueDate.toISOString().split('T')[0],
      status: "PENDING"
    };
    
    newInstallments.push(installment);
  }
  
  // Add installments to the list
  installments = [...installments, ...newInstallments];
  
  return newInstallments;
};

// Apply loan deductions to payslip
export const applyLoanDeductions = (payslipId: string, employeeId: string, payrollDate: string) => {
  // Find active loans for this employee
  const activeLoans = loans.filter(
    loan => loan.employeeId === employeeId && loan.status === "ACTIVE"
  );
  
  if (activeLoans.length === 0) {
    return { totalDeduction: 0, installments: [] };
  }
  
  // Find installments due for these loans
  const dueInstallments = installments.filter(inst => {
    const loan = activeLoans.find(l => l.id === inst.loanId);
    if (!loan) return false;
    
    // Check if installment is due in current month and pending
    const instDueDate = new Date(inst.dueDate);
    const payrollMonth = new Date(payrollDate);
    
    return inst.status === "PENDING" && 
           instDueDate.getMonth() === payrollMonth.getMonth() && 
           instDueDate.getFullYear() === payrollMonth.getFullYear();
  });
  
  // Calculate total deduction
  const totalDeduction = dueInstallments.reduce((sum, inst) => sum + inst.amount, 0);
  
  // Update installments to paid
  const updatedInstallments = dueInstallments.map(inst => ({
    ...inst,
    payslipId,
    paidOn: payrollDate,
    status: "PAID" as const
  }));
  
  // Update installments in memory
  installments = installments.map(inst => {
    const updated = updatedInstallments.find(u => u.id === inst.id);
    return updated || inst;
  });
  
  // Update loan balances
  activeLoans.forEach(loan => {
    const loanInstallments = updatedInstallments.filter(inst => inst.loanId === loan.id);
    const totalPaid = loanInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    
    const loanIndex = loans.findIndex(l => l.id === loan.id);
    if (loanIndex !== -1) {
      loans[loanIndex] = {
        ...loans[loanIndex],
        balance: Math.max(0, loans[loanIndex].balance - totalPaid)
      };
      
      // If balance is 0, mark as closed
      if (loans[loanIndex].balance === 0) {
        loans[loanIndex] = {
          ...loans[loanIndex],
          status: "CLOSED"
        };
      }
    }
  });
  
  // Emit event for loan deducted
  emitEvent(EVENT_TYPES.LOAN_DEDUCTED, {
    payslipId,
    employeeId,
    installments: updatedInstallments,
    totalDeduction
  });
  
  return { totalDeduction, installments: updatedInstallments };
};

// Reject a loan request - deprecated in favor of accounts rejection flow
export const rejectLoan = (loanId: string, reason: string) => {
  console.warn('This function is deprecated. Use rejectLoanByAccounts instead.');
  return null;
};

// Get loans for an employee
export const getEmployeeLoans = (employeeId: string) => {
  return loans.filter(loan => loan.employeeId === employeeId);
};

// Get all loans
export const getAllLoans = () => loans;

// Get loan installments
export const getLoanInstallments = (loanId?: string) => {
  if (loanId) {
    return installments.filter(inst => inst.loanId === loanId);
  }
  return installments;
};
