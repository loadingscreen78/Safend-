
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Building } from "lucide-react";

interface FacilityBookingFormProps {
  branchId: string;
  onSuccess: () => void;
}

export function FacilityBookingForm({ onSuccess }: FacilityBookingFormProps) {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-100 text-blue-800">
        <Building className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          Facility booking functionality is under development and will be available soon.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end">
        <Button onClick={onSuccess} variant="outline">Close</Button>
      </div>
    </div>
  );
}
