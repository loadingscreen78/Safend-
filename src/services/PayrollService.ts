
import { emitEvent, EVENT_TYPES } from "./EventService";
import { RequestStatus } from "./LoanService";

// Interface for salary payment request
export interface SalaryPaymentRequest {
  id: string;
  employeeIds: string[];
  department?: string;
  totalAmount: number;
  requestDate: string;
  requestedBy: string;
  description: string;
  month: string;
  year: string;
  status: RequestStatus;
  sentToAccountsOn?: string;
  accountsApprovedOn?: string;
  accountsApprovedBy?: string;
  accountsRejectedOn?: string;
  accountsRejectedBy?: string;
  rejectionReason?: string;
  processedOn?: string;
  paymentReference?: string;
  // New fields for individual employee requests
  employeeDetails?: EmployeeSalaryDetail[];
  heldSalaries?: HeldSalaryRecord[];
}

// Interface for individual employee salary details
export interface EmployeeSalaryDetail {
  employeeId: string;
  employeeName: string;
  amount: number;
  attendedShifts: number;
  totalShifts: number;
  deductions: SalaryDeduction[];
  netSalary: number;
  status: 'READY_TO_PAY' | 'HELD' | 'PAID';
  holdReason?: string;
}

// Interface for salary deductions
export interface SalaryDeduction {
  type: 'PF' | 'ESI' | 'PT' | 'TDS' | 'LOAN' | 'MESS' | 'OTHER';
  description: string;
  amount: number;
  reference?: string; // For example, loan ID or mess bill ID
}

// Interface for held salary records
export interface HeldSalaryRecord {
  employeeId: string;
  employeeName: string;
  amount: number;
  reason: string;
  heldBy: string;
  heldOn: string;
  resolved?: boolean;
  resolvedOn?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

// Store payment requests in memory
let salaryPaymentRequests: SalaryPaymentRequest[] = [];

// Generate a unique request ID
const generateRequestId = () => {
  return `SALARY-REQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Create a new salary payment request
export const createSalaryPaymentRequest = (requestData: Omit<SalaryPaymentRequest, 'id' | 'status' | 'requestDate'>) => {
  const newRequest: SalaryPaymentRequest = {
    id: generateRequestId(),
    status: 'DRAFT',
    requestDate: new Date().toISOString(),
    ...requestData
  };
  
  salaryPaymentRequests.push(newRequest);
  
  // Emit event for salary payment requested
  emitEvent(EVENT_TYPES.SALARY_PAYMENT_REQUESTED, newRequest);
  
  return newRequest;
};

// Submit salary payment request to accounts
export const submitSalaryRequestToAccounts = (requestId: string) => {
  const requestIndex = salaryPaymentRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1 || salaryPaymentRequests[requestIndex].status !== 'DRAFT') {
    return null;
  }
  
  // Update status to sent to accounts
  salaryPaymentRequests[requestIndex] = {
    ...salaryPaymentRequests[requestIndex],
    status: 'SENT_TO_ACCOUNTS',
    sentToAccountsOn: new Date().toISOString()
  };
  
  return salaryPaymentRequests[requestIndex];
};

// Approve salary payment request by accounts
export const approveSalaryRequestByAccounts = (requestId: string, approver: string) => {
  const requestIndex = salaryPaymentRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1 || salaryPaymentRequests[requestIndex].status !== 'SENT_TO_ACCOUNTS') {
    return null;
  }
  
  // Update status to approved by accounts
  salaryPaymentRequests[requestIndex] = {
    ...salaryPaymentRequests[requestIndex],
    status: 'APPROVED_BY_ACCOUNTS',
    accountsApprovedOn: new Date().toISOString(),
    accountsApprovedBy: approver
  };
  
  // Emit event for salary payment approved
  emitEvent(EVENT_TYPES.SALARY_PAYMENT_APPROVED, salaryPaymentRequests[requestIndex]);
  
  return salaryPaymentRequests[requestIndex];
};

// Reject salary payment request by accounts
export const rejectSalaryRequestByAccounts = (requestId: string, reason: string, rejectedBy: string) => {
  const requestIndex = salaryPaymentRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1 || salaryPaymentRequests[requestIndex].status !== 'SENT_TO_ACCOUNTS') {
    return null;
  }
  
  // Update status to rejected by accounts
  salaryPaymentRequests[requestIndex] = {
    ...salaryPaymentRequests[requestIndex],
    status: 'REJECTED_BY_ACCOUNTS',
    accountsRejectedOn: new Date().toISOString(),
    accountsRejectedBy: rejectedBy,
    rejectionReason: reason
  };
  
  // Emit event for salary payment rejected
  emitEvent(EVENT_TYPES.SALARY_PAYMENT_REJECTED, salaryPaymentRequests[requestIndex]);
  
  return salaryPaymentRequests[requestIndex];
};

// Mark salary payment as processed
export const markSalaryPaymentAsProcessed = (requestId: string, paymentReference: string) => {
  const requestIndex = salaryPaymentRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1 || salaryPaymentRequests[requestIndex].status !== 'APPROVED_BY_ACCOUNTS') {
    return null;
  }
  
  // Update status to completed
  salaryPaymentRequests[requestIndex] = {
    ...salaryPaymentRequests[requestIndex],
    status: 'COMPLETED',
    processedOn: new Date().toISOString(),
    paymentReference
  };
  
  return salaryPaymentRequests[requestIndex];
};

// Hold an employee's salary
export const holdEmployeeSalary = (requestId: string, employeeId: string, reason: string, heldBy: string) => {
  const requestIndex = salaryPaymentRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    return null;
  }
  
  const request = salaryPaymentRequests[requestIndex];
  if (!request.employeeDetails) {
    return null;
  }
  
  // Find the employee in the salary details
  const employeeIndex = request.employeeDetails.findIndex(emp => emp.employeeId === employeeId);
  if (employeeIndex === -1) {
    return null;
  }
  
  // Create held salary record
  const heldRecord: HeldSalaryRecord = {
    employeeId,
    employeeName: request.employeeDetails[employeeIndex].employeeName,
    amount: request.employeeDetails[employeeIndex].netSalary,
    reason,
    heldBy,
    heldOn: new Date().toISOString(),
    resolved: false
  };
  
  // Update employee status
  request.employeeDetails[employeeIndex].status = 'HELD';
  request.employeeDetails[employeeIndex].holdReason = reason;
  
  // Add to held salaries
  if (!request.heldSalaries) {
    request.heldSalaries = [];
  }
  
  request.heldSalaries.push(heldRecord);
  
  // Update the request in the array
  salaryPaymentRequests[requestIndex] = request;
  
  return request;
};

// Resolve a held salary
export const resolveHeldSalary = (requestId: string, employeeId: string, resolutionNotes: string, resolvedBy: string) => {
  const requestIndex = salaryPaymentRequests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) {
    return null;
  }
  
  const request = salaryPaymentRequests[requestIndex];
  if (!request.heldSalaries || !request.employeeDetails) {
    return null;
  }
  
  // Find the held salary record
  const heldIndex = request.heldSalaries.findIndex(held => held.employeeId === employeeId && !held.resolved);
  if (heldIndex === -1) {
    return null;
  }
  
  // Update held salary record
  request.heldSalaries[heldIndex].resolved = true;
  request.heldSalaries[heldIndex].resolvedOn = new Date().toISOString();
  request.heldSalaries[heldIndex].resolvedBy = resolvedBy;
  request.heldSalaries[heldIndex].resolutionNotes = resolutionNotes;
  
  // Find the employee in the salary details and update status
  const employeeIndex = request.employeeDetails.findIndex(emp => emp.employeeId === employeeId);
  if (employeeIndex !== -1) {
    request.employeeDetails[employeeIndex].status = 'READY_TO_PAY';
    request.employeeDetails[employeeIndex].holdReason = undefined;
  }
  
  // Update the request in the array
  salaryPaymentRequests[requestIndex] = request;
  
  return request;
};

// Calculate salary with attendance and deductions
export const calculateSalary = (
  employeeId: string, 
  baseSalary: number, 
  attendedShifts: number, 
  totalShifts: number,
  deductions: SalaryDeduction[]
) => {
  // Calculate attendance-based salary
  const attendanceMultiplier = attendedShifts / totalShifts;
  const salaryAfterAttendance = baseSalary * attendanceMultiplier;
  
  // Calculate total deductions
  const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  
  // Calculate net salary
  const netSalary = Math.max(0, salaryAfterAttendance - totalDeductions);
  
  return {
    baseSalary,
    attendedShifts,
    totalShifts,
    attendanceMultiplier,
    salaryAfterAttendance,
    deductions,
    totalDeductions,
    netSalary
  };
};

// Get all salary payment requests
export const getAllSalaryPaymentRequests = () => {
  return salaryPaymentRequests;
};

// Get salary payment request by ID
export const getSalaryPaymentRequestById = (id: string) => {
  return salaryPaymentRequests.find(req => req.id === id) || null;
};

// Get salary payment requests by status
export const getSalaryPaymentRequestsByStatus = (status: RequestStatus) => {
  return salaryPaymentRequests.filter(req => req.status === status);
};

// Get held salaries across all requests
export const getAllHeldSalaries = () => {
  const heldSalaries: HeldSalaryRecord[] = [];
  
  salaryPaymentRequests.forEach(request => {
    if (request.heldSalaries && request.heldSalaries.length > 0) {
      heldSalaries.push(...request.heldSalaries.filter(held => !held.resolved));
    }
  });
  
  return heldSalaries;
};
