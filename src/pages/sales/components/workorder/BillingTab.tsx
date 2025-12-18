
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BillingTabProps {
  formData: {
    billingCycle: string;
    billingRate: string;
    invoiceDueDay: string;
    gstInclusive: boolean;
  };
  handleSelectChange: (value: string, name: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export function BillingTab({ formData, handleSelectChange, handleCheckboxChange }: BillingTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="billingCycle">Billing Cycle</Label>
        <Select 
          value={formData.billingCycle} 
          onValueChange={(value) => handleSelectChange(value, "billingCycle")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing cycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="biannually">Bi-annually</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="billingRate">Billing Rate Structure</Label>
        <Select 
          value={formData.billingRate} 
          onValueChange={(value) => handleSelectChange(value, "billingRate")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing structure" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed Rate</SelectItem>
            <SelectItem value="hourly">Hourly Rate</SelectItem>
            <SelectItem value="headcount">Per Person</SelectItem>
            <SelectItem value="shift">Per Shift</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="invoiceDueDay">Payment Terms (Days)</Label>
        <Select 
          value={formData.invoiceDueDay} 
          onValueChange={(value) => handleSelectChange(value, "invoiceDueDay")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">Net 15 days</SelectItem>
            <SelectItem value="30">Net 30 days</SelectItem>
            <SelectItem value="45">Net 45 days</SelectItem>
            <SelectItem value="60">Net 60 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="gstInclusive" 
          checked={formData.gstInclusive}
          onCheckedChange={(checked) => 
            handleCheckboxChange("gstInclusive", checked === true)
          }
        />
        <div>
          <Label htmlFor="gstInclusive">GST Inclusive</Label>
          <p className="text-xs text-muted-foreground">
            When checked, the quoted price includes GST
          </p>
        </div>
      </div>
    </div>
  );
}
