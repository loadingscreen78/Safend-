
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoTabProps {
  formData: {
    id: string;
    client: string;
    quotationRef: string;
    agreementRef: string;
    service: string;
    startDate: string;
    endDate: string;
    value: string;
    status: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
}

export function BasicInfoTab({ formData, handleChange, handleSelectChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">Work Order ID</Label>
          <Input 
            id="id" 
            name="id" 
            value={formData.id} 
            readOnly
            className="bg-gray-100"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange(value, "status")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="client">Client *</Label>
        <Input 
          id="client" 
          name="client" 
          value={formData.client} 
          onChange={handleChange} 
          placeholder="Enter client name" 
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quotationRef">Quotation Reference</Label>
          <Input 
            id="quotationRef" 
            name="quotationRef" 
            value={formData.quotationRef} 
            onChange={handleChange} 
            placeholder="Quotation ID" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="agreementRef">Agreement Reference</Label>
          <Input 
            id="agreementRef" 
            name="agreementRef" 
            value={formData.agreementRef} 
            onChange={handleChange} 
            placeholder="Agreement ID" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input 
            id="contactPerson" 
            name="contactPerson" 
            value={formData.contactPerson} 
            onChange={handleChange} 
            placeholder="Enter contact person" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input 
            id="contactPhone" 
            name="contactPhone" 
            value={formData.contactPhone} 
            onChange={handleChange} 
            placeholder="Enter contact phone" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input 
          id="contactEmail" 
          name="contactEmail" 
          type="email"
          value={formData.contactEmail} 
          onChange={handleChange} 
          placeholder="Enter contact email" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="service">Service Description *</Label>
        <Textarea 
          id="service" 
          name="service" 
          value={formData.service} 
          onChange={handleChange} 
          placeholder="Describe services to be provided" 
          required 
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input 
            id="startDate" 
            name="startDate" 
            type="date"
            value={formData.startDate} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input 
            id="endDate" 
            name="endDate" 
            type="date"
            value={formData.endDate} 
            onChange={handleChange} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="value">Contract Value (₹)</Label>
        <Input 
          id="value" 
          name="value" 
          value={formData.value} 
          onChange={handleChange} 
          placeholder="Enter contract value" 
        />
      </div>
    </div>
  );
}
