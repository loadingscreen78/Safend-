
import { UninformedLeave } from "@/pages/hr/components";

export const mockUninformedLeaves: UninformedLeave[] = [
  {
    id: "UL001",
    employeeId: "E001",
    employeeName: "John Smith",
    date: "2025-05-02",
    detectedBy: "system",
    timestamp: "2025-05-03T08:00:00Z",
    postId: "P001",
    branchId: "BR001"
  },
  {
    id: "UL002",
    employeeId: "E002",
    employeeName: "Sarah Johnson",
    date: "2025-05-04",
    detectedBy: "system",
    timestamp: "2025-05-05T08:00:00Z",
    postId: "P002",
    branchId: "BR001"
  },
  {
    id: "UL003",
    employeeId: "E002",
    employeeName: "Sarah Johnson",
    date: "2025-05-05",
    detectedBy: "system",
    timestamp: "2025-05-06T08:00:00Z",
    postId: "P002",
    branchId: "BR001"
  },
  {
    id: "UL004",
    employeeId: "E002",
    employeeName: "Sarah Johnson",
    date: "2025-05-06",
    detectedBy: "system",
    timestamp: "2025-05-07T08:00:00Z",
    postId: "P002",
    branchId: "BR001"
  },
  {
    id: "UL005",
    employeeId: "E003",
    employeeName: "Michael Brown",
    date: "2025-05-01",
    detectedBy: "system",
    resolvedBy: "HR Manager",
    resolution: "Regularized",
    timestamp: "2025-05-02T08:00:00Z",
    postId: "P003",
    branchId: "BR002"
  },
  {
    id: "UL006",
    employeeId: "E004",
    employeeName: "Emily Wilson",
    date: "2025-05-03",
    detectedBy: "system",
    resolvedBy: "HR Manager",
    resolution: "Converted",
    timestamp: "2025-05-04T08:00:00Z",
    postId: "P001",
    branchId: "BR001"
  }
];
