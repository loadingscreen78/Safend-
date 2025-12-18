
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Vehicle } from "@/types/fleet";

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onVehicleUpdate: (vehicle: Vehicle) => void;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{vehicle.model}</h3>
        {getStatusBadge(vehicle.status)}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Registration Number:</span>
            <span className="font-medium">{vehicle.registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Type:</span>
            <span>{vehicle.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Fuel Type:</span>
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Current Odometer:</span>
            <span>{vehicle.currentOdometer} km</span>
          </div>
          {vehicle.assignedDriver && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Assigned Driver:</span>
              <span>{vehicle.assignedDriver}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Purchase Date:</span>
            <span>{formatDate(vehicle.purchaseDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Insurance Expiry:</span>
            <span className={`${new Date(vehicle.insuranceExpiryDate) < new Date() ? 'text-red-600 font-bold' : ''}`}>
              {formatDate(vehicle.insuranceExpiryDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Pollution Cert Expiry:</span>
            <span className={`${new Date(vehicle.pollutionCertExpiryDate) < new Date() ? 'text-red-600 font-bold' : ''}`}>
              {formatDate(vehicle.pollutionCertExpiryDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Maintenance Interval:</span>
            <span>{vehicle.maintenanceInterval} km</span>
          </div>
          {vehicle.lastMaintenanceDate && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Last Maintenance:</span>
              <span>{formatDate(vehicle.lastMaintenanceDate)}</span>
            </div>
          )}
          {vehicle.nextMaintenanceDue && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Next Maintenance Due:</span>
              <span className={`${new Date(vehicle.nextMaintenanceDue) < new Date() ? 'text-red-600 font-bold' : ''}`}>
                {formatDate(vehicle.nextMaintenanceDue)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Service History</Button>
        <Button variant="outline">Trip Logs</Button>
        <Button variant="outline">Fuel Logs</Button>
      </div>
    </div>
  );
}
