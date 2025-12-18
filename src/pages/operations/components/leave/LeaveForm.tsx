
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Calendar } from "lucide-react";
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
    id: editData?.id || generateLeaveId(),
    staffName: editData?.staffName || "",
    type: editData?.type || "Annual Leave",
    fromDate: editData?.fromDate || getCurrentDate(),
    toDate: editData?.toDate || getCurrentDate(),
    days: editData?.days || 1,
    reason: editData?.reason || "",
    status: editData?.status || "Pending",
    requestDate: editData?.requestDate || getCurrentDate(),
    approvedBy: editData?.approvedBy || "",
    approvedDate: editData?.approvedDate || "",
    notes: editData?.notes || "",
    remainingDays: editData?.remainingDays || 20,
  });
  
  function generateLeaveId() {
    return `LR${Math.floor(1000 + Math.random() * 9000)}`;
  }
  
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  // Calculate days between dates
  const calculateDays = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
    return diffDays;
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Recalculate days if dates change
    if (name === "fromDate" || name === "toDate") {
      const days = calculateDays(
        name === "fromDate" ? value : formData.fromDate,
        name === "toDate" ? value : formData.toDate
      );
      setFormData(prev => ({ ...prev, days }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Mock staff data (in a real app, would be fetched from API)
  const staffMembers = [
    "John Smith",
    "Emma Wilson",
    "Michael Davis",
    "Sarah Johnson",
    "James Thompson",
    "Lisa Brown"
  ];
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.staffName || !formData.type || !formData.fromDate || !formData.toDate || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Check if from date is after to date
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    if (fromDate > toDate) {
      toast({
        title: "Date Error",
        description: "From date cannot be after to date.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Check remaining leave days
    if (formData.type === "Annual Leave" && formData.days > formData.remainingDays) {
      toast({
        title: "Leave Days Error",
        description: `Requested days (${formData.days}) exceed remaining annual leave balance (${formData.remainingDays}).`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Leave Request" : "New Leave Request"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Member*</Label>
            <Select 
              name="staffName" 
              value={formData.staffName || "John Smith"} // Provide a default value to avoid empty string
              onValueChange={(value) => handleSelectChange("staffName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff} value={staff}>
                    {staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Leave Type*</Label>
              <Select 
                name="type" 
                value={formData.type} 
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                  <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.type === "Annual Leave" && (
              <div className="space-y-2">
                <Label htmlFor="remainingDays">Remaining Days</Label>
                <Input 
                  id="remainingDays" 
                  name="remainingDays" 
                  value={formData.remainingDays} 
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date*</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="fromDate" 
                  name="fromDate" 
                  type="date" 
                  value={formData.fromDate} 
                  onChange={handleChange} 
                  className="pl-8"
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date*</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  id="toDate" 
                  name="toDate" 
                  type="date" 
                  value={formData.toDate} 
                  onChange={handleChange} 
                  className="pl-8"
                  required 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input 
                id="days" 
                name="days"
                type="number"
                value={formData.days}
                onChange={(e) => handleChange(e)}
                readOnly
                className="bg-gray-50"
              />
            </div>
            
            {editData && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || "Pending"} // Provide a default value
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason*</Label>
            <Textarea 
              id="reason" 
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Please provide a reason for your leave request"
              rows={3}
              required
            />
          </div>
          
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
