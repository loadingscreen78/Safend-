
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createFuelLog } from "@/services/fleet/FleetService";
import { Vehicle, FuelLog } from "@/types/fleet";

interface FuelLogFormProps {
  branchId: string;
  vehicle: Vehicle;
  onSuccess: () => void;
}

export function FuelLogForm({ branchId, vehicle, onSuccess }: FuelLogFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    odometerReading: vehicle.currentOdometer,
    fuelAmount: 0,
    fuelCost: 0,
    fuelType: vehicle.fuelType as FuelLog["fuelType"],
    filledBy: "",
    paymentMode: "cash" as FuelLog["paymentMode"],
    receiptNumber: "",
    notes: ""
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
    
    if (formData.odometerReading < vehicle.currentOdometer) {
      toast({
        title: "Validation Error",
        description: "Odometer reading cannot be less than the current vehicle odometer reading",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.fuelAmount || !formData.fuelCost || !formData.filledBy) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await createFuelLog({
        ...formData,
        vehicleId: vehicle.id,
        branchId,
        date: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: "Fuel log has been recorded successfully"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error recording fuel log:", error);
      toast({
        title: "Error",
        description: "Failed to record fuel log",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gray-100 rounded-lg flex-1">
          <h4 className="font-medium">{vehicle.model} - {vehicle.registrationNumber}</h4>
          <p className="text-sm text-gray-500">Current Odometer: {vehicle.currentOdometer} km</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="odometerReading">Odometer Reading (km) <span className="text-red-500">*</span></Label>
          <Input
            id="odometerReading"
            name="odometerReading"
            type="number"
            min={vehicle.currentOdometer}
            value={formData.odometerReading}
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
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelAmount">Fuel Amount (liters) <span className="text-red-500">*</span></Label>
          <Input
            id="fuelAmount"
            name="fuelAmount"
            type="number"
            min="0.1"
            step="0.1"
            value={formData.fuelAmount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelCost">Fuel Cost <span className="text-red-500">*</span></Label>
          <Input
            id="fuelCost"
            name="fuelCost"
            type="number"
            min="1"
            value={formData.fuelCost}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="filledBy">Filled By <span className="text-red-500">*</span></Label>
          <Input
            id="filledBy"
            name="filledBy"
            value={formData.filledBy}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentMode">Payment Mode <span className="text-red-500">*</span></Label>
          <Select
            value={formData.paymentMode}
            onValueChange={(value) => handleSelectChange("paymentMode", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="account">Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="receiptNumber">Receipt Number</Label>
          <Input
            id="receiptNumber"
            name="receiptNumber"
            value={formData.receiptNumber}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record Fuel Fill-Up"}
        </Button>
      </div>
    </form>
  );
}
