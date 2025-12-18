// Core Operation Module Types
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  managerName: string;
  managerId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  branchId: string;
  name: string;
  code: string;
  type: 'permanent' | 'temporary';
  clientId: string;
  clientName: string;
  workOrderId?: string;
  location: PostLocation;
  address: string;
  startDate: string;
  endDate?: string;
  dutyType: '8H' | '12H';
  requiredStaff: RequiredStaff[];
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface PostLocation {
  latitude: number;
  longitude: number;
  geofenceRadius?: number; // in meters
  polygonCoordinates?: [number, number][]; // For custom geofence shapes
}

export interface RequiredStaff {
  role: string;
  count: number;
  shift: string;
  startTime: string;
  endTime: string;
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
}

export interface TempPost extends Omit<Post, 'type'> {
  type: 'temporary';
  eventName: string;
  expiry: string;
}

export interface Rota {
  id: string;
  postId: string;
  branchId: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'locked';
  shifts: RotaShift[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RotaShift {
  id: string;
  rotaId: string;
  date: string;
  shift: string;
  role: string;
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  rotaShiftId: string;
  employeeId: string;
  employeeName: string;
  status: 'assigned' | 'notified' | 'confirmed' | 'rejected';
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  assignmentId: string;
  employeeId: string;
  postId: string;
  branchId: string;
  date: string;
  shift: string;
  status: 'present' | 'absent' | 'half_day' | 'leave' | 'replacement';
  checkInTime?: string;
  checkOutTime?: string;
  replacementId?: string;
  remarks?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  branchId: string;
  type: 'annual' | 'sick' | 'emergency' | 'unpaid' | 'other';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  hrReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatrolVisit {
  id: string;
  postId: string;
  branchId: string;
  visitedBy: string;
  visitDate: string;
  visitTime: string;
  gpsLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  photos: string[];
  clientRating: 1 | 2 | 3 | 4 | 5;
  clientFeedback?: string;
  issues?: string[];
  actionTaken?: string;
  followUpRequired: boolean;
  signatureImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Penalty {
  id: string;
  employeeId: string;
  branchId: string;
  reason: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  approvedBy?: string;
  approvedAt?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'attendance' | 'patrol' | 'other';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  branchId: string;
  clientId?: string;
  postId?: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  // Added missing fields
  role?: string;
  type?: string;
  company?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  branchId: string;
  userId: string;
  type: 'posts_map' | 'rota_gaps' | 'inventory' | 'mess' | 'salary_advances' | 'custom';
  title: string;
  config: Record<string, any>;
  position: number;
  size: 'small' | 'medium' | 'large';
  active: boolean;
}

export interface ActivityLog {
  id: string;
  branchId: string;
  entityType: 'post' | 'rota' | 'attendance' | 'leave' | 'patrol' | 'penalty' | 'contact';
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  userId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface InventoryTxnRef {
  id: string;
  inventoryId: string;
  referenceId: string;
  referenceType: 'post' | 'employee';
  quantity: number;
  txnType: 'issue' | 'return' | 'damage';
  txnDate: string;
}

export interface MessTxnRef {
  id: string;
  messId: string;
  employeeId: string;
  postId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  quantity: number;
  txnDate: string;
}

export interface SalaryAdvanceRef {
  id: string;
  advanceId: string;
  employeeId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed';
  txnDate: string;
}

// Add missing types needed for OperationsDashboard
export interface RotaGap {
  date: string;
  post: {
    id: string;
    name: string;
    location: {
      latitude: number;
      longitude: number;
    }
  };
  shift: string;
  role: string;
  gap: number;
  filled: number;
  required: number; // Added this missing property
  status: 'vacant' | 'partial' | 'filled';
}

export interface InventoryItem {
  id: string;
  itemName: string;
  quantity: number;
  txnType: 'issue' | 'return' | 'damage';
  employeeName: string;
  txnDate: string;
}

export interface MessMeal {
  id: string;
  employeeName: string;
  postName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  quantity: number;
  txnDate: string;
  cost?: number;
  employeeId?: string;
  postId?: string;
}

export interface MessCharge {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: string;
  mealCount: number;
  totalAmount: number;
  status: 'pending' | 'processed' | 'cancelled';
  processedAt?: string;
  createdAt?: string;
}

export interface MessSummary {
  postId: string;
  postName: string;
  totalMeals: number;
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  snacksCount?: number;
  totalCost: number;
  avgDaily: number;
}

export interface SalaryAdvance {
  id: string;
  employeeName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed';
  txnDate: string;
}

// Define permission types for use in the OperationsModule
export type PermissionType = 
  | 'POST_MANAGEMENT'
  | 'ROTA_MANAGEMENT'
  | 'ATTENDANCE_MANAGEMENT'
  | 'LEAVE_MANAGEMENT'
  | 'PATROL_MANAGEMENT'
  | 'PENALTY_MANAGEMENT'
  | 'MESS_MANAGEMENT'   // Added this permission type
  | 'REPORTS_ACCESS'
  | 'DASHBOARD_CUSTOMIZATION';
