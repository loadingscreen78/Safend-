
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface LeaveFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function LeaveForm({ isOpen, onClose, onSubmit, editData }: LeaveFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: "",
    staffName: "",
    type: "Annual Leave",
    fromDate: "",
    toDate: "",
    days: 0,
    reason: "",
    status: "Pending",
    requestDate: "",
  });
  
  // Populate form if editing an existing record
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        staffName: editData.staffName || "",
        type: editData.type || "Annual Leave",
        fromDate: editData.fromDate || "",
        toDate: editData.toDate || "",
        days: editData.days || 0,
        reason: editData.reason || "",
        status: editData.status || "Pending",
        requestDate: editData.requestDate || new Date().toISOString().split('T')[0],
      });
    } else {
      // Reset form for new record
      setFormData({
        id: `LR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        staffName: "",
        type: "Annual Leave",
        fromDate: "",
        toDate: "",
        days: 0,
        reason: "",
        status: "Pending",
        requestDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editData]);
  
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Calculate days if both from and to dates are provided
    if (field === 'fromDate' || field === 'toDate') {
      const fromDate = field === 'fromDate' ? value as string : formData.fromDate;
      const toDate = field === 'toDate' ? value as string : formData.toDate;
      
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const diffTime = to.getTime() - from.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
        
        if (diffDays >= 0) {
          setFormData(prev => ({
            ...prev,
            days: diffDays
          }));
        }
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.staffName || !formData.type || !formData.fromDate || !formData.toDate || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if from date is before to date
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    if (fromDate > toDate) {
      toast({
        title: "Validation Error",
        description: "From date must be before or equal to To date",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form data
    onSubmit(formData);
  };

  // Mock data for dropdowns
  const staffMembers = [
    "John Smith", "Emma Wilson", "Michael Davis", 
    "Sarah Johnson", "James Thompson", "Lisa Brown"
  ];
  
  const leaveTypes = [
    "Annual Leave", "Sick Leave", "Emergency Leave", 
    "Compassionate Leave", "Study Leave", "Unpaid Leave"
  ];
  
  const statusOptions = [
    "Pending", "Approved", "Rejected"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Leave Request" : "New Leave Request"}</DialogTitle>
          <DialogDescription>
            {editData ? "Update the leave request details below." : "Submit a new leave request for approval."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {editData && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Request ID</Label>
                <Input 
                  id="id" 
                  value={formData.id} 
                  disabled 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date</Label>
                <Input 
                  id="requestDate" 
                  type="date"
                  value={formData.requestDate} 
                  disabled 
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staffName">Staff Member*</Label>
              <Select 
                value={formData.staffName} 
                onValueChange={(value) => handleChange("staffName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map(staff => (
                    <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Leave Type*</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date*</Label>
              <Input 
                id="fromDate" 
                type="date" 
                value={formData.fromDate} 
                onChange={(e) => handleChange("fromDate", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date*</Label>
              <Input 
                id="toDate" 
                type="date" 
                value={formData.toDate} 
                onChange={(e) => handleChange("toDate", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="days">Days</Label>
              <Input 
                id="days" 
                type="number"
                value={formData.days}
                onChange={(e) => handleChange("days", parseInt(e.target.value))}
                disabled
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason*</Label>
            <Textarea 
              id="reason" 
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              rows={3}
            />
          </div>
          
          {editData && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Request" : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
