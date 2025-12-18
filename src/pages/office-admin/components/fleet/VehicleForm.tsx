
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createVehicle } from "@/services/fleet/FleetService";
import { Vehicle } from "@/types/fleet";

interface VehicleFormProps {
  branchId: string;
  onSuccess: () => void;
}

export function VehicleForm({ branchId, onSuccess }: VehicleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    type: "car" as Vehicle["type"],
    registrationNumber: "",
    fuelType: "petrol" as Vehicle["fuelType"],
    currentOdometer: 0,
    purchaseDate: "",
    insuranceExpiryDate: "",
    pollutionCertExpiryDate: "",
    assignedDriver: "",
    maintenanceInterval: 5000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.model || !formData.registrationNumber || !formData.purchaseDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await createVehicle({
        ...formData,
        branchId,
        status: 'available',
      });
      
      toast({
        title: "Success",
        description: "Vehicle has been registered successfully"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error registering vehicle:", error);
      toast({
        title: "Error",
        description: "Failed to register vehicle",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
          <Input
            id="model"
            name="model"
            placeholder="e.g. Toyota Innova"
            value={formData.model}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Vehicle Type <span className="text-red-500">*</span></Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Registration Number <span className="text-red-500">*</span></Label>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            placeholder="e.g. DL01AB1234"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type <span className="text-red-500">*</span></Label>
          <Select
            value={formData.fuelType}
            onValueChange={(value) => handleSelectChange("fuelType", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="cng">CNG</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentOdometer">Current Odometer (km)</Label>
          <Input
            id="currentOdometer"
            name="currentOdometer"
            type="number"
            min="0"
            value={formData.currentOdometer}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maintenanceInterval">Service Interval (km)</Label>
          <Input
            id="maintenanceInterval"
            name="maintenanceInterval"
            type="number"
            min="1000"
            value={formData.maintenanceInterval}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date <span className="text-red-500">*</span></Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignedDriver">Assigned Driver</Label>
          <Input
            id="assignedDriver"
            name="assignedDriver"
            value={formData.assignedDriver}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="insuranceExpiryDate">Insurance Expiry Date <span className="text-red-500">*</span></Label>
          <Input
            id="insuranceExpiryDate"
            name="insuranceExpiryDate"
            type="date"
            value={formData.insuranceExpiryDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pollutionCertExpiryDate">Pollution Certificate Expiry <span className="text-red-500">*</span></Label>
          <Input
            id="pollutionCertExpiryDate"
            name="pollutionCertExpiryDate"
            type="date"
            value={formData.pollutionCertExpiryDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register Vehicle"}
        </Button>
      </div>
    </form>
  );
}
