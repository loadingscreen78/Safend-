
import { AbscondCase } from "@/pages/hr/components";

export const mockAbscondCases: AbscondCase[] = [
  {
    id: "ABS001",
    employeeId: "E002",
    employeeName: "Sarah Johnson",
    startDate: "2025-05-04",
    lastContact: "2025-05-03",
    status: "PENDING",
    remarks: "No response to calls or messages.",
    createdAt: "2025-05-07T10:00:00Z",
    salaryCut: true
  },
  {
    id: "ABS002",
    employeeId: "E005",
    employeeName: "Daniel Lee",
    startDate: "2025-04-28",
    lastContact: "2025-04-27",
    status: "CLOSED",
    remarks: "Employee returned and regularized absence.",
    createdAt: "2025-05-01T10:00:00Z",
    closedAt: "2025-05-05T14:30:00Z",
    closedBy: "HR Manager",
    salaryCut: false
  },
  {
    id: "ABS003",
    employeeId: "E006",
    employeeName: "Lisa Chen",
    startDate: "2025-04-25",
    lastContact: "2025-04-24",
    status: "CLOSED",
    remarks: "Employee has resigned. Final settlement processed.",
    createdAt: "2025-04-28T10:00:00Z",
    closedAt: "2025-05-10T09:15:00Z",
    closedBy: "HR Director",
    salaryCut: true
  }
];
