
import { Loan } from "@/pages/hr/components";

export const mockLoans: Loan[] = [
  {
    id: "LOAN001",
    employeeId: "E001",
    employeeName: "John Smith",
    type: "ADVANCE_SALARY",
    principal: 30000,
    emiMonths: 6,
    interestPct: 0,
    balance: 20000,
    status: "ACTIVE",
    requestedOn: "2025-04-10T09:30:00Z",
    approvedOn: "2025-04-11T14:20:00Z",
    approvedBy: "Finance Manager",
    startDate: "2025-04-15",
    endDate: "2025-10-15"
  },
  {
    id: "LOAN002",
    employeeId: "E003",
    employeeName: "Michael Brown",
    type: "UNIFORM_FEE",
    principal: 5000,
    emiMonths: 5,
    interestPct: 0,
    balance: 3000,
    status: "ACTIVE",
    requestedOn: "2025-03-05T11:15:00Z",
    approvedOn: "2025-03-06T10:00:00Z",
    approvedBy: "Finance Manager",
    startDate: "2025-03-15",
    endDate: "2025-08-15"
  },
  {
    id: "LOAN003",
    employeeId: "E004",
    employeeName: "Emily Wilson",
    type: "ADVANCE_SALARY",
    principal: 15000,
    emiMonths: 3,
    interestPct: 0,
    balance: 15000,
    status: "REQUESTED",
    requestedOn: "2025-05-06T16:45:00Z"
  },
  {
    id: "LOAN004",
    employeeId: "E007",
    employeeName: "Robert Taylor",
    type: "TRAINING_FEE",
    principal: 8000,
    emiMonths: 4,
    interestPct: 0,
    balance: 0,
    status: "CLOSED",
    requestedOn: "2025-01-12T13:20:00Z",
    approvedOn: "2025-01-13T11:30:00Z",
    approvedBy: "Finance Manager",
    startDate: "2025-01-15",
    endDate: "2025-05-15"
  },
  {
    id: "LOAN005",
    employeeId: "E005",
    employeeName: "Daniel Lee",
    type: "NEGATIVE_BALANCE",
    principal: 3200,
    emiMonths: 2,
    interestPct: 0,
    balance: 1600,
    status: "ACTIVE",
    requestedOn: "2025-04-20T08:50:00Z",
    approvedOn: "2025-04-20T14:15:00Z",
    approvedBy: "System",
    startDate: "2025-04-30",
    endDate: "2025-06-30"
  }
];
