import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context type
interface AppDataContextType {
  branches: Branch[];
  inventory: any[];
  assets: any[];
  vehicles: any[];
  facilities: any[];
  tickets: any[];
  activeBranch: string;
  setActiveBranch: (branchId: string) => void;
  isLoading: boolean;
  user: any; // Added user property to fix DocumentPolicy and HelpdeskSupport components
}

interface Branch {
  id: string;
  name: string;
  city: string;
  status: string;
}

// Create the context
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Provider component
export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeBranch, setActiveBranch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin"
  }); // Add mock user data

  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBranches = [
        { id: "branch-001", name: "Delhi HQ", city: "Delhi", status: "active" },
        { id: "branch-002", name: "Mumbai Office", city: "Mumbai", status: "active" },
        { id: "branch-003", name: "Bangalore Office", city: "Bangalore", status: "active" }
      ];

      const mockInventory = [
        { 
          id: "INV-0001", 
          branch: "branch-001", 
          name: "Security Badge", 
          category: "Security Equipment", 
          currentStock: 45, 
          reorderLevel: 50, 
          unitOfMeasure: "units",
          status: "active",
          lastUpdated: "2025-04-28T10:30:00Z"
        },
        { 
          id: "INV-0002", 
          branch: "branch-001", 
          name: "Radio Sets", 
          category: "Communication", 
          currentStock: 15, 
          reorderLevel: 20, 
          unitOfMeasure: "units",
          status: "active",
          lastUpdated: "2025-04-29T11:15:00Z"
        },
        { 
          id: "INV-0003", 
          branch: "branch-001", 
          name: "Flashlights", 
          category: "Security Equipment", 
          currentStock: 8, 
          reorderLevel: 10, 
          unitOfMeasure: "units",
          status: "active",
          lastUpdated: "2025-04-30T14:45:00Z"
        },
        { 
          id: "INV-0004", 
          branch: "branch-002", 
          name: "Uniforms", 
          category: "Apparel", 
          currentStock: 25, 
          reorderLevel: 30, 
          unitOfMeasure: "sets",
          status: "active",
          lastUpdated: "2025-05-01T09:20:00Z"
        },
        { 
          id: "INV-0005", 
          branch: "branch-002", 
          name: "Visitor Badges", 
          category: "Security Equipment", 
          currentStock: 100, 
          reorderLevel: 50, 
          unitOfMeasure: "units",
          status: "active",
          lastUpdated: "2025-05-02T15:30:00Z"
        },
        { 
          id: "INV-0006", 
          branch: "branch-003", 
          name: "Safety Vests", 
          category: "Safety Equipment", 
          currentStock: 12, 
          reorderLevel: 15, 
          unitOfMeasure: "units",
          status: "active",
          lastUpdated: "2025-05-03T12:15:00Z"
        }
      ];

      const mockAssets = [
        {
          id: "ASSET-001",
          branch: "branch-001",
          name: "Security Camera System",
          category: "Electronics",
          status: "active",
          assignedTo: "John Doe"
        },
        {
          id: "ASSET-002",
          branch: "branch-001",
          name: "Generator",
          category: "Equipment",
          status: "maintenance",
          assignedTo: null
        },
        {
          id: "ASSET-003",
          branch: "branch-002",
          name: "Access Control System",
          category: "Electronics",
          status: "active",
          assignedTo: null
        }
      ];

      const mockVehicles = [
        {
          id: "VEH-001",
          branch: "branch-001",
          model: "Toyota Innova",
          type: "SUV",
          registrationNumber: "DL1234",
          status: "available"
        },
        {
          id: "VEH-002",
          branch: "branch-001",
          model: "Honda City",
          type: "Sedan",
          registrationNumber: "DL5678",
          status: "in-use"
        },
        {
          id: "VEH-003",
          branch: "branch-002",
          model: "Maruti Eeco",
          type: "Van",
          registrationNumber: "MH1234",
          status: "maintenance"
        }
      ];

      const mockFacilities = [
        {
          id: "FAC-001",
          branch: "branch-001",
          name: "Conference Room A",
          type: "Meeting Room",
          capacity: 20,
          status: "available"
        },
        {
          id: "FAC-002",
          branch: "branch-001",
          name: "Training Room",
          type: "Training",
          capacity: 30,
          status: "occupied"
        },
        {
          id: "FAC-003",
          branch: "branch-002",
          name: "Meeting Room 1",
          type: "Meeting Room",
          capacity: 10,
          status: "available"
        }
      ];

      const mockTickets = [
        {
          id: "TKT-001",
          branch: "branch-001",
          title: "AC Not Working",
          description: "AC in conference room is not cooling properly",
          priority: "high",
          status: "open",
          createdBy: "Alice Smith",
          createdAt: "2025-05-01T10:30:00Z"
        },
        {
          id: "TKT-002",
          branch: "branch-001",
          title: "Printer Out of Toner",
          description: "Main office printer needs new toner cartridge",
          priority: "medium",
          status: "in-progress",
          createdBy: "Bob Johnson",
          createdAt: "2025-05-02T11:15:00Z"
        },
        {
          id: "TKT-003",
          branch: "branch-002",
          title: "Broken Window",
          description: "Window in reception area has a crack",
          priority: "critical",
          status: "open",
          createdBy: "Charlie Brown",
          createdAt: "2025-05-03T09:45:00Z"
        }
      ];

      // Set the data
      setBranches(mockBranches);
      setInventory(mockInventory);
      setAssets(mockAssets);
      setVehicles(mockVehicles);
      setFacilities(mockFacilities);
      setTickets(mockTickets);
      setActiveBranch(mockBranches[0].id);
      setIsLoading(false);
    }, 1000);
  }, []);

  const value = {
    branches,
    inventory,
    assets,
    vehicles,
    facilities,
    tickets,
    activeBranch,
    setActiveBranch,
    isLoading,
    user // Include user in the context value
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

// Custom hook for using the context
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};
