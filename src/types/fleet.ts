
export interface Vehicle {
  id: string;
  branchId: string;
  model: string;
  type: 'car' | 'suv' | 'van' | 'truck' | 'bus' | 'motorcycle' | 'other';
  registrationNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-service';
  fuelType: 'petrol' | 'diesel' | 'cng' | 'electric' | 'hybrid';
  currentOdometer: number;
  purchaseDate: string;
  insuranceExpiryDate: string;
  pollutionCertExpiryDate: string;
  assignedDriver?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDue?: string;
  maintenanceInterval: number; // in kilometers
  createdAt: string;
  updatedAt: string;
}

export interface TripLog {
  id: string;
  vehicleId: string;
  branchId: string;
  startDate: string;
  endDate?: string;
  startOdometer: number;
  endOdometer?: number;
  purpose: string;
  driver: string;
  authorizedBy: string;
  status: 'planned' | 'in-progress' | 'completed';
  startLocation: string;
  destination: string;
  actualRoute?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  branchId: string;
  date: string;
  odometerReading: number;
  fuelAmount: number; // in liters
  fuelCost: number;
  fuelType: 'petrol' | 'diesel' | 'cng' | 'electric';
  filledBy: string;
  paymentMode: 'cash' | 'card' | 'account';
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
