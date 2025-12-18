
export const mockSalaryAdjustments = [
  { 
    id: "ADJ001", 
    employeeId: "E001", 
    type: "Allowance" as const, 
    description: "Overtime", 
    amount: 1200,
    appliedDate: "2025-05-01"
  },
  { 
    id: "ADJ002", 
    employeeId: "E001", 
    type: "Deduction" as const, 
    description: "Advance", 
    amount: -2000,
    appliedDate: "2025-05-01" 
  },
  { 
    id: "ADJ003", 
    employeeId: "E002", 
    type: "Allowance" as const, 
    description: "Transport", 
    amount: 800,
    appliedDate: "2025-05-01" 
  },
  { 
    id: "ADJ004", 
    employeeId: "E003", 
    type: "Allowance" as const, 
    description: "Hardship", 
    amount: 1500,
    appliedDate: "2025-05-01" 
  },
  { 
    id: "ADJ005", 
    employeeId: "E004", 
    type: "Deduction" as const, 
    description: "Canteen", 
    amount: -500,
    appliedDate: "2025-05-01" 
  },
];
