
import { Vehicle, TripLog, FuelLog } from "@/types/fleet";
import { emitEvent, EVENT_TYPES } from "@/services/EventService";

// Mock data for vehicles
const mockVehicles: Vehicle[] = [
  {
    id: "VEH001",
    branchId: "branch-001",
    model: "Toyota Innova",
    type: "suv",
    registrationNumber: "DL01AB1234",
    status: "available",
    fuelType: "diesel",
    currentOdometer: 45678,
    purchaseDate: "2023-06-15T00:00:00Z",
    insuranceExpiryDate: "2025-06-14T00:00:00Z",
    pollutionCertExpiryDate: "2025-12-14T00:00:00Z",
    lastMaintenanceDate: "2025-04-10T00:00:00Z",
    nextMaintenanceDue: "2025-07-10T00:00:00Z",
    maintenanceInterval: 5000,
    createdAt: "2023-06-15T12:30:00Z",
    updatedAt: "2025-04-10T15:45:00Z"
  },
  {
    id: "VEH002",
    branchId: "branch-001",
    model: "Maruti Swift",
    type: "car",
    registrationNumber: "DL01CD5678",
    status: "in-use",
    fuelType: "petrol",
    currentOdometer: 32456,
    assignedDriver: "Rajesh Kumar",
    purchaseDate: "2024-01-20T00:00:00Z",
    insuranceExpiryDate: "2026-01-19T00:00:00Z",
    pollutionCertExpiryDate: "2025-07-19T00:00:00Z",
    lastMaintenanceDate: "2025-03-25T00:00:00Z",
    nextMaintenanceDue: "2025-06-25T00:00:00Z",
    maintenanceInterval: 3000,
    createdAt: "2024-01-20T10:15:00Z",
    updatedAt: "2025-03-25T14:20:00Z"
  },
  {
    id: "VEH003",
    branchId: "branch-002",
    model: "Tata Winger",
    type: "van",
    registrationNumber: "MH02EF9012",
    status: "maintenance",
    fuelType: "diesel",
    currentOdometer: 78901,
    purchaseDate: "2022-11-05T00:00:00Z",
    insuranceExpiryDate: "2025-11-04T00:00:00Z",
    pollutionCertExpiryDate: "2025-05-04T00:00:00Z",
    lastMaintenanceDate: "2025-05-01T00:00:00Z",
    nextMaintenanceDue: "2025-08-01T00:00:00Z",
    maintenanceInterval: 5000,
    createdAt: "2022-11-05T09:30:00Z",
    updatedAt: "2025-05-01T11:45:00Z"
  }
];

// Mock data for trip logs
const mockTripLogs: TripLog[] = [
  {
    id: "TRP001",
    vehicleId: "VEH001",
    branchId: "branch-001",
    startDate: "2025-05-01T09:00:00Z",
    endDate: "2025-05-01T14:30:00Z",
    startOdometer: 45500,
    endOdometer: 45678,
    purpose: "Client Meeting",
    driver: "Anil Sharma",
    authorizedBy: "Branch Manager",
    status: "completed",
    startLocation: "Delhi Office",
    destination: "Client Site, Gurugram",
    notes: "Successful meeting with client",
    createdAt: "2025-05-01T08:45:00Z",
    updatedAt: "2025-05-01T14:45:00Z"
  },
  {
    id: "TRP002",
    vehicleId: "VEH002",
    branchId: "branch-001",
    startDate: "2025-05-05T10:00:00Z",
    status: "in-progress",
    startOdometer: 32456,
    purpose: "Site Inspection",
    driver: "Rajesh Kumar",
    authorizedBy: "Operations Manager",
    startLocation: "Delhi Office",
    destination: "Construction Site, Noida",
    createdAt: "2025-05-05T09:30:00Z",
    updatedAt: "2025-05-05T10:05:00Z"
  },
  {
    id: "TRP003",
    vehicleId: "VEH001",
    branchId: "branch-001",
    startDate: "2025-05-07T08:00:00Z",
    status: "planned",
    startOdometer: 45678,
    purpose: "Airport Pickup",
    driver: "Anil Sharma",
    authorizedBy: "HR Manager",
    startLocation: "Delhi Office",
    destination: "Delhi International Airport",
    notes: "Pickup new consultant arriving from Mumbai",
    createdAt: "2025-05-06T16:30:00Z",
    updatedAt: "2025-05-06T16:30:00Z"
  }
];

// Mock data for fuel logs
const mockFuelLogs: FuelLog[] = [
  {
    id: "FUEL001",
    vehicleId: "VEH001",
    branchId: "branch-001",
    date: "2025-04-28T11:15:00Z",
    odometerReading: 45300,
    fuelAmount: 45.5,
    fuelCost: 4550,
    fuelType: "diesel",
    filledBy: "Anil Sharma",
    paymentMode: "card",
    receiptNumber: "IN78901234",
    createdAt: "2025-04-28T11:20:00Z",
    updatedAt: "2025-04-28T11:20:00Z"
  },
  {
    id: "FUEL002",
    vehicleId: "VEH002",
    branchId: "branch-001",
    date: "2025-05-02T18:30:00Z",
    odometerReading: 32300,
    fuelAmount: 35,
    fuelCost: 3850,
    fuelType: "petrol",
    filledBy: "Rajesh Kumar",
    paymentMode: "cash",
    createdAt: "2025-05-02T18:35:00Z",
    updatedAt: "2025-05-02T18:35:00Z"
  },
  {
    id: "FUEL003",
    vehicleId: "VEH003",
    branchId: "branch-002",
    date: "2025-04-25T16:45:00Z",
    odometerReading: 78700,
    fuelAmount: 60,
    fuelCost: 6000,
    fuelType: "diesel",
    filledBy: "Maintenance Team",
    paymentMode: "account",
    receiptNumber: "AC12345",
    notes: "Full tank before scheduled maintenance",
    createdAt: "2025-04-25T16:50:00Z",
    updatedAt: "2025-04-25T16:50:00Z"
  }
];

// Fleet Service functions
export const getVehicles = (branchId: string): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.branchId === branchId);
};

export const getVehicleById = (vehicleId: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === vehicleId);
};

export const createVehicle = (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Vehicle => {
  const newVehicle: Vehicle = {
    ...vehicle,
    id: `VEH${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockVehicles.push(newVehicle);
  return newVehicle;
};

export const updateVehicle = (vehicle: Vehicle): Vehicle => {
  const index = mockVehicles.findIndex(v => v.id === vehicle.id);
  
  if (index !== -1) {
    const updatedVehicle = {
      ...vehicle,
      updatedAt: new Date().toISOString(),
    };
    
    mockVehicles[index] = updatedVehicle;
    return updatedVehicle;
  }
  
  throw new Error(`Vehicle with ID ${vehicle.id} not found`);
};

export const getTripLogs = (branchId: string, vehicleId?: string): TripLog[] => {
  return mockTripLogs.filter(
    log => log.branchId === branchId && (vehicleId ? log.vehicleId === vehicleId : true)
  );
};

export const createTripLog = (tripLog: Omit<TripLog, 'id' | 'createdAt' | 'updatedAt'>): TripLog => {
  const newTripLog: TripLog = {
    ...tripLog,
    id: `TRP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockTripLogs.push(newTripLog);
  
  emitEvent(EVENT_TYPES.FLEET_TRIP_LOGGED, {
    tripId: newTripLog.id,
    vehicleId: newTripLog.vehicleId,
    purpose: newTripLog.purpose,
  });
  
  return newTripLog;
};

export const updateTripLog = (tripLog: TripLog): TripLog => {
  const index = mockTripLogs.findIndex(t => t.id === tripLog.id);
  
  if (index !== -1) {
    const updatedTripLog = {
      ...tripLog,
      updatedAt: new Date().toISOString(),
    };
    
    mockTripLogs[index] = updatedTripLog;
    
    // If trip is completed, update vehicle odometer
    if (updatedTripLog.status === 'completed' && updatedTripLog.endOdometer) {
      const vehicleIndex = mockVehicles.findIndex(v => v.id === updatedTripLog.vehicleId);
      if (vehicleIndex !== -1) {
        mockVehicles[vehicleIndex] = {
          ...mockVehicles[vehicleIndex],
          currentOdometer: updatedTripLog.endOdometer,
          updatedAt: new Date().toISOString(),
        };
        
        // Check if maintenance is due
        const vehicle = mockVehicles[vehicleIndex];
        const lastMaintenance = vehicle.lastMaintenanceDate ? new Date(vehicle.lastMaintenanceDate) : null;
        const nextMaintenanceDue = vehicle.nextMaintenanceDue ? new Date(vehicle.nextMaintenanceDue) : null;
        
        if (nextMaintenanceDue && new Date() >= nextMaintenanceDue) {
          emitEvent(EVENT_TYPES.FLEET_MAINTENANCE_DUE, {
            vehicleId: vehicle.id,
            vehicle: vehicle.model,
            registrationNumber: vehicle.registrationNumber,
          });
        }
      }
    }
    
    return updatedTripLog;
  }
  
  throw new Error(`Trip log with ID ${tripLog.id} not found`);
};

export const getFuelLogs = (branchId: string, vehicleId?: string): FuelLog[] => {
  return mockFuelLogs.filter(
    log => log.branchId === branchId && (vehicleId ? log.vehicleId === vehicleId : true)
  );
};

export const createFuelLog = (fuelLog: Omit<FuelLog, 'id' | 'createdAt' | 'updatedAt'>): FuelLog => {
  const newFuelLog: FuelLog = {
    ...fuelLog,
    id: `FUEL${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockFuelLogs.push(newFuelLog);
  return newFuelLog;
};

export const updateFuelLog = (fuelLog: FuelLog): FuelLog => {
  const index = mockFuelLogs.findIndex(f => f.id === fuelLog.id);
  
  if (index !== -1) {
    const updatedFuelLog = {
      ...fuelLog,
      updatedAt: new Date().toISOString(),
    };
    
    mockFuelLogs[index] = updatedFuelLog;
    return updatedFuelLog;
  }
  
  throw new Error(`Fuel log with ID ${fuelLog.id} not found`);
};

export const checkMaintenanceDue = (vehicleId: string): boolean => {
  const vehicle = mockVehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    throw new Error(`Vehicle with ID ${vehicleId} not found`);
  }
  
  if (!vehicle.nextMaintenanceDue) {
    return false;
  }
  
  return new Date() >= new Date(vehicle.nextMaintenanceDue);
};

export const scheduleMaintenance = (
  vehicleId: string, 
  maintenanceDate: string,
  details: string
): void => {
  const vehicle = mockVehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    throw new Error(`Vehicle with ID ${vehicleId} not found`);
  }
  
  // Update vehicle status to maintenance on the scheduled date
  const index = mockVehicles.findIndex(v => v.id === vehicleId);
  mockVehicles[index] = {
    ...vehicle,
    status: 'maintenance',
    updatedAt: new Date().toISOString(),
  };
  
  // Create maintenance ticket
  createMaintenanceTicket(vehicleId, maintenanceDate, details);
};

const createMaintenanceTicket = (
  vehicleId: string,
  maintenanceDate: string,
  details: string
): void => {
  const vehicle = mockVehicles.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    throw new Error(`Vehicle with ID ${vehicleId} not found`);
  }
  
  // In a real implementation, this would create an entry in a maintenance system
  console.log(`Maintenance scheduled for ${vehicle.model} (${vehicle.registrationNumber}) on ${maintenanceDate}: ${details}`);
};
