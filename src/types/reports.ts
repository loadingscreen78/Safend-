// Define the ReportLibraryProps interface to include moduleFilter
export interface ReportLibraryProps {
  moduleFilter?: string | null;
}

// Dimension Tables
export interface DimBranch {
  id: string;
  name: string;
  code: string;
  region: string;
  status: 'active' | 'inactive';
}

export interface DimUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  branchId: string;
}

export interface DimClient {
  id: string;
  name: string;
  segment: string;
  industry: string;
  branchId: string;
}

export interface DimEmployee {
  id: string;
  employeeCode: string;
  fullName: string;
  department: string;
  designation: string;
  branchId: string;
}

export interface DimPost {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  branchId: string;
}

export interface DimTime {
  dateKey: string;
  date: string;
  day: number;
  month: number;
  year: number;
  quarter: number;
  dayOfWeek: number;
  isWeekend: boolean;
  isHoliday: boolean;
}

// Report Types
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  module: 'control-centre' | 'sales' | 'operations' | 'hr' | 'accounts' | 'office-admin';
  category: string;
  queryReference: string; // Reference to SQL query or dbt model
  defaultChartType: ChartType;
  parameterSchema: ReportParameter[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  visualOptions: VisualizationOptions;
  isBuiltIn: boolean;
}

export interface ReportParameter {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'daterange' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
}

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'area' 
  | 'pie' 
  | 'donut' 
  | 'radar' 
  | 'scatter' 
  | 'heatmap' 
  | 'table' 
  | 'pivotTable' 
  | 'kpi' 
  | 'funnel' 
  | 'gauge';

export interface VisualizationOptions {
  colors?: string[];
  showLegend?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  xAxisTitle?: string;
  yAxisTitle?: string;
  stacked?: boolean;
  fillOpacity?: number;
  decimals?: number;
  valueFormatter?: string;
}

export interface ReportResult {
  id: string;
  templateId: string;
  parameters: Record<string, any>;
  data: any[];
  metadata: {
    columns: Array<{
      name: string;
      type: string;
      label: string;
    }>;
    rowCount: number;
    executionTime: number;
  };
  generatedAt: string;
  generatedBy: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  filters: Record<string, any>;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  isDefault: boolean;
  isGlobal: boolean;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  reportTemplateId: string;
  title?: string;
  type: 'chart' | 'table' | 'kpi' | 'filter';
  chartType?: ChartType;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  parameters: Record<string, any>;
  visualOptions?: VisualizationOptions;
}

export interface ScheduledReport {
  id: string;
  name: string;
  reportTemplateId: string;
  parameters: Record<string, any>;
  format: 'pdf' | 'excel' | 'both';
  schedule: {
    type: 'once' | 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    time: string; // HH:MM in 24-hour format
    timezone: string;
    startDate: string;
    endDate?: string;
  };
  recipients: string[]; // Email addresses
  status: 'active' | 'paused';
  lastRun?: string;
  nextRun?: string;
  createdBy: string;
  createdAt: string;
}

// Module-specific report data interfaces
export interface ControlCentreReport {
  activityLogs?: {
    userId: string;
    username: string;
    action: string;
    module: string;
    timestamp: string;
    ipAddress: string;
    details: string;
  }[];
  roleChanges?: {
    userId: string;
    username: string;
    oldRole: string;
    newRole: string;
    changedBy: string;
    timestamp: string;
  }[];
}

export interface SalesReport {
  leads?: {
    id: string;
    clientName: string;
    status: string;
    value: number;
    source: string;
    createdAt: string;
    assignedTo: string;
  }[];
  quotations?: {
    id: string;
    clientName: string;
    status: string;
    value: number;
    createdAt: string;
    validUntil: string;
  }[];
  workOrders?: {
    id: string;
    clientName: string;
    status: string;
    value: number;
    startDate: string;
    endDate: string;
  }[];
  receivables?: {
    clientName: string;
    current: number;
    days30: number;
    days60: number;
    days90: number;
    days90Plus: number;
  }[];
}

export interface OperationsReport {
  attendance?: {
    date: string;
    presentCount: number;
    absentCount: number;
    leaveCount: number;
    lateCount: number;
  }[];
  rota?: {
    date: string;
    postName: string;
    plannedCount: number;
    actualCount: number;
    gapCount: number;
  }[];
  patrols?: {
    date: string;
    postName: string;
    plannedCount: number;
    completedCount: number;
    missedCount: number;
  }[];
  penalties?: {
    month: string;
    category: string;
    count: number;
    amount: number;
  }[];
}

export interface HRReport {
  headcount?: {
    date: string;
    department: string;
    count: number;
  }[];
  attrition?: {
    month: string;
    department: string;
    startCount: number;
    endCount: number;
    joinCount: number;
    exitCount: number;
    attritionRate: number;
  }[];
  leaves?: {
    month: string;
    leaveType: string;
    count: number;
    days: number;
  }[];
  payroll?: {
    month: string;
    department: string;
    employeeCount: number;
    basic: number;
    allowances: number;
    deductions: number;
    net: number;
  }[];
  compliance?: {
    month: string;
    complianceType: string;
    dueCount: number;
    pendingCount: number;
    completedCount: number;
  }[];
  loans?: {
    month: string;
    loanType: string;
    disbursedAmount: number;
    recoveredAmount: number;
    outstandingAmount: number;
  }[];
}

export interface AccountsReport {
  trialBalance?: {
    accountCode: string;
    accountName: string;
    openingDebit: number;
    openingCredit: number;
    debit: number;
    credit: number;
    closingDebit: number;
    closingCredit: number;
  }[];
  profitLoss?: {
    accountGroup: string;
    accountName: string;
    currentPeriod: number;
    previousPeriod: number;
    variance: number;
    percentChange: number;
  }[];
  balanceSheet?: {
    accountGroup: string;
    accountName: string;
    currentPeriod: number;
    previousPeriod: number;
  }[];
  cashFlow?: {
    category: string;
    item: string;
    amount: number;
  }[];
  gst?: {
    month: string;
    gstType: string;
    amount: number;
  }[];
  tds?: {
    quarter: string;
    section: string;
    amount: number;
    dueDate: string;
    status: string;
  }[];
}

export interface OfficeAdminReport {
  inventory?: {
    itemCode: string;
    itemName: string;
    category: string;
    quantity: number;
    value: number;
    lastMovement: string;
  }[];
  purchases?: {
    month: string;
    vendorName: string;
    category: string;
    amount: number;
  }[];
  maintenance?: {
    month: string,
    category: string,
    ticketCount: number,
    avgResolutionTime: number,
    cost: number,
  }[];
  fleet?: {
    vehicleId: string;
    vehicleRegNumber: string;
    trips: number;
    mileage: number;
    fuelCost: number;
    maintenanceCost: number;
  }[];
  visitors?: {
    date: string;
    visitorType: string;
    count: number;
  }[];
}
