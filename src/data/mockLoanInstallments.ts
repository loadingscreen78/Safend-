
import { LoanInstallment } from "@/pages/hr/components";

export const mockLoanInstallments: LoanInstallment[] = [
  // Loan 001 - John Smith
  {
    id: "INST001",
    loanId: "LOAN001",
    amount: 5000,
    dueDate: "2025-04-30",
    paidOn: "2025-04-30",
    status: "PAID"
  },
  {
    id: "INST002",
    loanId: "LOAN001",
    amount: 5000,
    dueDate: "2025-05-31",
    status: "PENDING"
  },
  {
    id: "INST003",
    loanId: "LOAN001",
    amount: 5000,
    dueDate: "2025-06-30",
    status: "PENDING"
  },
  {
    id: "INST004",
    loanId: "LOAN001",
    amount: 5000,
    dueDate: "2025-07-31",
    status: "PENDING"
  },
  {
    id: "INST005",
    loanId: "LOAN001",
    amount: 5000,
    dueDate: "2025-08-31",
    status: "PENDING"
  },
  {
    id: "INST006",
    loanId: "LOAN001",
    amount: 5000,
    dueDate: "2025-09-30",
    status: "PENDING"
  },
  
  // Loan 002 - Michael Brown
  {
    id: "INST007",
    loanId: "LOAN002",
    amount: 1000,
    dueDate: "2025-03-31",
    paidOn: "2025-03-31",
    status: "PAID"
  },
  {
    id: "INST008",
    loanId: "LOAN002",
    amount: 1000,
    dueDate: "2025-04-30",
    paidOn: "2025-04-30",
    status: "PAID"
  },
  {
    id: "INST009",
    loanId: "LOAN002",
    amount: 1000,
    dueDate: "2025-05-31",
    status: "PENDING"
  },
  {
    id: "INST010",
    loanId: "LOAN002",
    amount: 1000,
    dueDate: "2025-06-30",
    status: "PENDING"
  },
  {
    id: "INST011",
    loanId: "LOAN002",
    amount: 1000,
    dueDate: "2025-07-31",
    status: "PENDING"
  },
  
  // Loan 005 - Daniel Lee
  {
    id: "INST012",
    loanId: "LOAN005",
    amount: 1600,
    dueDate: "2025-04-30",
    paidOn: "2025-04-30",
    status: "PAID"
  },
  {
    id: "INST013",
    loanId: "LOAN005",
    amount: 1600,
    dueDate: "2025-05-31",
    status: "PENDING"
  }
];
