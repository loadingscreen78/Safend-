import { create } from 'zustand';

// Core entity types
export type Employee = {
  id: string;
  name: string;
  designation: string;
  baseSalary: number;
  experience: string;
  joinDate: string;
  documentStatus: 'Complete' | 'Incomplete' | 'Pending';
  trainingStatus: 'Trained' | 'Untrained' | 'In Progress';
  contactDetails: {
    phone: string;
    email: string;
    address: string;
  };
  status: 'Active' | 'Inactive' | 'On Leave';
};

export type SecurityPost = {
  id: string;
  name: string;
  location: string;
  client: string;
  status: 'Active' | 'Inactive';
  requirements: ManpowerRequirement[];
  rate?: number;       // Added rate property
  monthlyRate?: number; // Added monthlyRate property
};

export type ManpowerRequirement = {
  id: string;
  postId: string;
  shift: 'Day' | 'Noon' | 'Night';
  role: string; // e.g., 'Security Guard', 'Gunman', 'Bouncer'
  count: number;
  monthlySalary: number;
  hours: number;
};

// Note: This type is moved to the Operations module conceptually but kept here for data structure consistency
export type DutyAssignment = {
  id: string;
  employeeId: string;
  postId: string;
  requirementId: string; // Links to specific ManpowerRequirement
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
};

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  postId: string;
  requirementId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
};

export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  contractStartDate: string;
  contractEndDate: string;
  status: 'Active' | 'Inactive' | 'Prospect';
};

// Adding necessary type for salary adjustments
export interface SalaryAdjustment {
  id: string;
  employeeId: string;
  type: "Allowance" | "Deduction";
  description: string;
  amount: number;
  appliedDate: string;
}

// Store interface
interface DataStoreState {
  employees: Employee[];
  securityPosts: SecurityPost[];
  manpowerRequirements: ManpowerRequirement[];
  dutyAssignments: DutyAssignment[];  // Kept for data structure consistency, but will be managed by Operations
  attendanceRecords: AttendanceRecord[];
  clients: Client[];
  salaryAdjustments: SalaryAdjustment[];
  
  // Action methods
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  addSecurityPost: (post: SecurityPost) => void;
  updateSecurityPost: (post: SecurityPost) => void;
  addManpowerRequirement: (requirement: ManpowerRequirement) => void;
  updateManpowerRequirement: (requirement: ManpowerRequirement) => void;
  addDutyAssignment: (assignment: DutyAssignment) => void;
  updateDutyAssignment: (assignment: DutyAssignment) => void;
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (record: AttendanceRecord) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  addSalaryAdjustment: (adjustment: SalaryAdjustment) => void;
  updateSalaryAdjustment: (adjustment: SalaryAdjustment) => void;
  removeSalaryAdjustment: (id: string) => void;
}

// Mock data (to be replaced with API calls in production)
import { securityStaff } from '@/data/mockEmployees';
import { securityPosts as mockPosts } from '@/data/mockPosts';
// import { mockAssignments } from '@/data/mockAssignments'; // Comment out if we're defining inline
import { mockClients } from '@/data/mockClients';
import { mockSalaryAdjustments } from '@/data/mockAdjustments';

// Generate mock manpower requirements based on security posts
const mockManpowerRequirements: ManpowerRequirement[] = [
  // For Summit Tower
  { 
    id: "MPR001", 
    postId: "P001",
    shift: "Day", 
    role: "Security Guard", 
    count: 1, 
    monthlySalary: 10000, 
    hours: 8 
  },
  { 
    id: "MPR002", 
    postId: "P001",
    shift: "Noon", 
    role: "Gunman", 
    count: 2, 
    monthlySalary: 18000, 
    hours: 8 
  },
  { 
    id: "MPR003", 
    postId: "P001",
    shift: "Night", 
    role: "Security Guard", 
    count: 1, 
    monthlySalary: 10000, 
    hours: 8 
  },
  { 
    id: "MPR004", 
    postId: "P001",
    shift: "Night", 
    role: "Bouncer", 
    count: 2, 
    monthlySalary: 21000, 
    hours: 8 
  },
  // For Metro Building
  { 
    id: "MPR005", 
    postId: "P002",
    shift: "Day", 
    role: "Security Guard", 
    count: 2, 
    monthlySalary: 10000, 
    hours: 8 
  },
  { 
    id: "MPR006", 
    postId: "P002",
    shift: "Night", 
    role: "Security Guard", 
    count: 1, 
    monthlySalary: 12000, 
    hours: 8 
  },
  // For Riverside Apartments
  { 
    id: "MPR007", 
    postId: "P003",
    shift: "Day", 
    role: "Security Guard", 
    count: 1, 
    monthlySalary: 10000, 
    hours: 8 
  },
  { 
    id: "MPR008", 
    postId: "P003",
    shift: "Noon", 
    role: "Security Guard", 
    count: 1, 
    monthlySalary: 10000, 
    hours: 8 
  },
  { 
    id: "MPR009", 
    postId: "P003",
    shift: "Night", 
    role: "Gunman", 
    count: 1, 
    monthlySalary: 15000, 
    hours: 8 
  }
];

// Mock attendance records
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "E001",
    postId: "P001",
    requirementId: "MPR001",
    date: "2025-05-03",
    status: "Present",
    checkInTime: "08:00",
    checkOutTime: "16:00"
  },
  {
    id: "ATT002",
    employeeId: "E002",
    postId: "P001",
    requirementId: "MPR002",
    date: "2025-05-03",
    status: "Half Day",
    checkInTime: "12:00",
    checkOutTime: "16:00"
  },
  {
    id: "ATT003",
    employeeId: "E003",
    postId: "P002",
    requirementId: "MPR005",
    date: "2025-05-03",
    status: "Absent"
  },
  {
    id: "ATT004",
    employeeId: "E004",
    postId: "P003",
    requirementId: "MPR007",
    date: "2025-05-03",
    status: "Present",
    checkInTime: "08:00",
    checkOutTime: "16:00"
  }
];

// Create the store
export const useDataStore = create<DataStoreState>((set) => ({
  employees: securityStaff,
  securityPosts: mockPosts,
  manpowerRequirements: mockManpowerRequirements,
  dutyAssignments: [
    {
      id: "DA001",
      employeeId: "E001",
      postId: "P001",
      requirementId: "MPR001", // Added requirementId
      date: "2025-05-05",
      status: "Confirmed"
    },
    {
      id: "DA002",
      employeeId: "E002",
      postId: "P001",
      requirementId: "MPR002", // Added requirementId
      date: "2025-05-05",
      status: "Confirmed"
    },
    {
      id: "DA003",
      employeeId: "E003",
      postId: "P002",
      requirementId: "MPR005", // Added requirementId
      date: "2025-05-05",
      status: "Confirmed"
    },
    {
      id: "DA004",
      employeeId: "E004",
      postId: "P003",
      requirementId: "MPR007", // Added requirementId
      date: "2025-05-05",
      status: "Confirmed"
    }
  ],
  attendanceRecords: mockAttendanceRecords,
  clients: mockClients,
  salaryAdjustments: mockSalaryAdjustments,
  
  // Employee actions
  addEmployee: (employee) => set((state) => ({ 
    employees: [...state.employees, employee] 
  })),
  
  updateEmployee: (updatedEmployee) => set((state) => ({ 
    employees: state.employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ) 
  })),
  
  // Security post actions
  addSecurityPost: (post) => set((state) => ({ 
    securityPosts: [...state.securityPosts, post] 
  })),
  
  updateSecurityPost: (updatedPost) => set((state) => ({ 
    securityPosts: state.securityPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ) 
  })),
  
  // Manpower requirement actions
  addManpowerRequirement: (requirement) => set((state) => ({ 
    manpowerRequirements: [...state.manpowerRequirements, requirement] 
  })),
  
  updateManpowerRequirement: (updatedRequirement) => set((state) => ({ 
    manpowerRequirements: state.manpowerRequirements.map(req => 
      req.id === updatedRequirement.id ? updatedRequirement : req
    ) 
  })),
  
  // Duty assignment actions - these will be used by Operations module
  addDutyAssignment: (assignment) => set((state) => ({ 
    dutyAssignments: [...state.dutyAssignments, assignment] 
  })),
  
  updateDutyAssignment: (updatedAssignment) => set((state) => ({ 
    dutyAssignments: state.dutyAssignments.map(assignment => 
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    ) 
  })),
  
  // Attendance record actions
  addAttendanceRecord: (record) => set((state) => ({ 
    attendanceRecords: [...state.attendanceRecords, record] 
  })),
  
  updateAttendanceRecord: (updatedRecord) => set((state) => ({ 
    attendanceRecords: state.attendanceRecords.map(record => 
      record.id === updatedRecord.id ? updatedRecord : record
    ) 
  })),
  
  // Client actions
  addClient: (client) => set((state) => ({ 
    clients: [...state.clients, client] 
  })),
  
  updateClient: (updatedClient) => set((state) => ({ 
    clients: state.clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ) 
  })),
  
  // Salary adjustment actions
  addSalaryAdjustment: (adjustment) => set((state) => ({ 
    salaryAdjustments: [...state.salaryAdjustments, adjustment] 
  })),
  
  updateSalaryAdjustment: (updatedAdjustment) => set((state) => ({ 
    salaryAdjustments: state.salaryAdjustments.map(adjustment => 
      adjustment.id === updatedAdjustment.id ? updatedAdjustment : adjustment
    ) 
  })),
  
  // Add new function to remove a salary adjustment
  removeSalaryAdjustment: (id) => set((state) => ({
    salaryAdjustments: state.salaryAdjustments.filter(adjustment => 
      adjustment.id !== id
    )
  }))
}));
