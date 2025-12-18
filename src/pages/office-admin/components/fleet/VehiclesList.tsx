import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Calendar, Fuel, Wrench, Car } from "lucide-react";
import { Vehicle } from "@/types/fleet";
import { getVehicles } from "@/services/fleet/FleetService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleDetails } from "./VehicleDetails";
import { FuelLogForm } from "./FuelLogForm";

interface VehiclesListProps {
  branchId: string;
  searchQuery: string;
  onLogTripClick: () => void;
}

export function VehiclesList({ branchId, searchQuery, onLogTripClick }: VehiclesListProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFuelLogOpen, setIsFuelLogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch vehicles
  useEffect(() => {
    if (branchId) {
      try {
        const fetchedVehicles = getVehicles(branchId);
        setVehicles(fetchedVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast({
          title: "Error",
          description: "Failed to load vehicles.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [branchId, toast]);

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vehicle.assignedDriver && vehicle.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'in-use':
        return <Badge className="bg-blue-500">In Use</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Maintenance</Badge>;
      case 'out-of-service':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Out of Service</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsOpen(true);
  };

  const handleLogFuel = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFuelLogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!filteredVehicles.length) {
    return (
      <Alert className="bg-blue-50 border-blue-100 text-blue-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No vehicles found matching your criteria.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {filteredVehicles.map((vehicle) => (
          <div 
            key={vehicle.id} 
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium">
                    {vehicle.model} - {vehicle.registrationNumber}
                  </h3>
                  {getStatusBadge(vehicle.status)}
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 mb-2">
                  <span>Type: {vehicle.type}</span>
                  <span>Fuel: {vehicle.fuelType}</span>
                  <span>Odometer: {vehicle.currentOdometer} km</span>
                  {vehicle.assignedDriver && <span>Driver: {vehicle.assignedDriver}</span>}
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="bg-gray-50">
                    Insurance: {new Date(vehicle.insuranceExpiryDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    Pollution: {new Date(vehicle.pollutionCertExpiryDate).toLocaleDateString()}
                  </Badge>
                  {vehicle.nextMaintenanceDue && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      Service due: {new Date(vehicle.nextMaintenanceDue).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 md:flex-none h-8" 
                  onClick={() => handleViewDetails(vehicle)}
                >
                  <span>Details</span>
                </Button>
                
                <div className="flex gap-2">
                  {vehicle.status === 'available' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8" 
                      onClick={onLogTripClick}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Trip</span>
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8" 
                    onClick={() => handleLogFuel(vehicle)}
                  >
                    <Fuel className="h-3 w-3 mr-1" />
                    <span>Fuel</span>
                  </Button>
                  
                  {(vehicle.status === 'available' || vehicle.status === 'in-use') && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-amber-600 border-amber-600"
                    >
                      <Wrench className="h-3 w-3 mr-1" />
                      <span>Service</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <VehicleDetails 
              vehicle={selectedVehicle} 
              onVehicleUpdate={(updatedVehicle) => {
                setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
                setSelectedVehicle(updatedVehicle);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Fuel Log Dialog */}
      <Dialog open={isFuelLogOpen} onOpenChange={setIsFuelLogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Log Fuel Fill-Up</DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <FuelLogForm 
              branchId={branchId} 
              vehicle={selectedVehicle} 
              onSuccess={() => setIsFuelLogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
