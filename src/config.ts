// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.safend.com/v1';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://api.safend.com/ws';

// Feature flags
export const FEATURES = {
  REAL_TIME_NOTIFICATIONS: true,
  OFFLINE_MODE: true,  // Enable offline mode by default
  MAPBOX_ENABLED: true,
  TEMPORAL_WORKFLOWS_ENABLED: true,
};

// Mapbox configuration
export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

// Role-based permissions
export const PERMISSIONS = {
  POST_MANAGEMENT: ['admin', 'manager', 'branch_manager'],
  ROTA_MANAGEMENT: ['admin', 'manager', 'branch_manager', 'supervisor'],
  ATTENDANCE_MANAGEMENT: ['admin', 'manager', 'branch_manager', 'supervisor'],
  LEAVE_MANAGEMENT: ['admin', 'manager', 'branch_manager', 'hr'],
  PATROL_MANAGEMENT: ['admin', 'manager', 'branch_manager', 'supervisor'],
  PENALTY_MANAGEMENT: ['admin', 'manager', 'branch_manager'],
  MESS_MANAGEMENT: ['admin', 'manager', 'branch_manager', 'supervisor'], // Added this permission
  REPORTS_ACCESS: ['admin', 'manager', 'branch_manager', 'accounts'],
  DASHBOARD_CUSTOMIZATION: ['admin', 'manager', 'branch_manager'],
  LOAN_MANAGEMENT: ['admin', 'manager', 'hr'],
  ABSCOND_MANAGEMENT: ['admin', 'manager', 'hr'],
};

// HR Module Configuration
export const HR_CONFIG = {
  // PF Configuration
  PF: {
    EMPLOYEE_CONTRIBUTION_RATE: 12, // 12% of (Basic + DA)
    EMPLOYER_CONTRIBUTION_RATE: 13, // 13% (12% + 1% admin charges)
    WAGE_CEILING: 15000, // Maximum wage ceiling for PF calculation
    UAN_PREFIX: "10000" // Universal Account Number prefix
  },
  
  // ESIC Configuration
  ESIC: {
    EMPLOYEE_CONTRIBUTION_RATE: 1.75, // 1.75% of gross
    EMPLOYER_CONTRIBUTION_RATE: 4.75, // 4.75% of gross
    WAGE_CEILING: 21000, // Maximum wage ceiling for ESIC
    COVERAGE_THRESHOLD: 10 // Minimum number of employees for coverage
  },
  
  // Professional Tax Configuration (varies by state)
  PT: {
    "Maharashtra": {
      SLABS: [
        { min: 0, max: 10000, amount: 0 },
        { min: 10001, max: 15000, amount: 175 },
        { min: 15001, max: Infinity, amount: 200 }
      ]
    },
    "Karnataka": {
      SLABS: [
        { min: 0, max: 15000, amount: 0 },
        { min: 15001, max: Infinity, amount: 200 }
      ]
    },
    // Default for other states
    "DEFAULT": {
      SLABS: [
        { min: 0, max: Infinity, amount: 200 }
      ]
    }
  },
  
  // Leave Configuration
  LEAVE: {
    CASUAL_LEAVE: 12,
    SICK_LEAVE: 12,
    EARNED_LEAVE: 15,
    ENCASHABLE_LEAVE_TYPES: ["earned"],
    MAX_CONSECUTIVE_DAYS: 3,
    UNINFORMED_THRESHOLD: 3 // Days before escalating to abscond case
  },

  // Loan Configuration
  LOANS: {
    ADVANCE_SALARY: {
      MAX_AMOUNT_MONTHS: 3,  // Max 3 months salary as advance
      MAX_EMI_MONTHS: 12,    // Repay over max 12 months
      INTEREST_RATE: 0       // No interest on salary advance
    },
    UNIFORM_TRAINING_FEE: {
      INTEREST_RATE: 0,      // No interest on fee recoveries
      DEFAULT_EMI_MONTHS: 6  // Default repayment period
    },
    MAX_DEDUCTION_PCT: 50    // Max 50% of salary as per Payment of Wages Act
  }
};
