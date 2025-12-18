
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
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { Badge } from "@/components/ui/badge";
import { Clipboard } from "lucide-react";

interface PenaltyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function PenaltyForm({ isOpen, onClose, onSubmit, editData }: PenaltyFormProps) {
  const { toast } = useToastWithSound();
  const [formData, setFormData] = useState({
    id: "",
    staffName: "",
    post: "",
    date: "",
    violation: "Late Arrival",
    points: 1,
    description: "",
    status: "Open",
    relatedEntityId: "",
    relatedEntityType: "",
  });
  
  // Populate form if editing an existing record or creating from a related entity
  useEffect(() => {
    if (editData) {
      // Handle if it's an edit operation for an existing penalty
      if (editData.id) {
        setFormData({
          id: editData.id || "",
          staffName: editData.staffName || "",
          post: editData.post || "",
          date: editData.date || new Date().toISOString().split('T')[0],
          violation: editData.violation || "Late Arrival",
          points: editData.points || 1,
          description: editData.description || "",
          status: editData.status || "Open",
          relatedEntityId: editData.relatedEntityId || "",
          relatedEntityType: editData.relatedEntityType || "",
        });
      } 
      // Handle if it's creating from a patrol/related entity
      else if (editData.relatedEntityId) {
        setFormData({
          id: `PEN${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          staffName: "",
          post: "",
          date: new Date().toISOString().split('T')[0],
          violation: "Protocol Breach", // Default for patrol-related penalties
          points: 2,
          description: "",
          status: "Open",
          relatedEntityId: editData.relatedEntityId || "",
          relatedEntityType: editData.relatedEntityType || "",
        });
      }
    } else {
      // Reset form for new record
      setFormData({
        id: `PEN${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        staffName: "",
        post: "",
        date: new Date().toISOString().split('T')[0],
        violation: "Late Arrival",
        points: 1,
        description: "",
        status: "Open",
        relatedEntityId: "",
        relatedEntityType: "",
      });
    }
  }, [editData]);
  
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-assign points based on violation type
    if (field === 'violation') {
      let points = 1;
      switch (value) {
        case 'Unauthorized Absence':
          points = 3;
          break;
        case 'Protocol Breach':
          points = 2;
          break;
        case 'Improper Uniform':
        case 'Mobile Phone Usage':
        case 'Late Arrival':
          points = 1;
          break;
        default:
          points = 1;
      }
      setFormData(prev => ({
        ...prev,
        points
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.staffName || !formData.post || !formData.date || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
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
  
  const posts = [
    "Summit Tower - Main Entrance", "Metro Building - Reception",
    "Riverside Apartments - Concierge", "Northern Rail Station - Security",
    "SafeEnd Office - Reception"
  ];
  
  const violations = [
    "Late Arrival", "Unauthorized Absence", "Protocol Breach", 
    "Improper Uniform", "Mobile Phone Usage", "Other"
  ];
  
  const statusOptions = [
    "Open", "Resolved", "Appealed", "Dismissed"
  ];
  
  // Get title based on context
  const getFormTitle = () => {
    if (editData?.id) {
      return "Edit Penalty Record";
    } else if (formData.relatedEntityType === 'patrol') {
      return "Record Penalty from Patrol";
    } else {
      return "Record New Penalty";
    }
  };
  
  // Get description based on context
  const getFormDescription = () => {
    if (editData?.id) {
      return "Update the penalty record details below.";
    } else if (formData.relatedEntityType === 'patrol') {
      return "Document a violation found during patrol inspection.";
    } else {
      return "Document a new staff violation or penalty.";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          <DialogDescription>
            {getFormDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {editData?.id && (
            <div className="space-y-2">
              <Label htmlFor="id">Penalty ID</Label>
              <Input 
                id="id" 
                value={formData.id} 
                disabled 
              />
            </div>
          )}
          
          {formData.relatedEntityId && formData.relatedEntityType === 'patrol' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3 flex items-center gap-2">
              <Clipboard className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Related to Patrol</p>
                <p className="text-xs text-muted-foreground">This penalty is linked to patrol record {formData.relatedEntityId}</p>
              </div>
              <Badge className="ml-auto">Patrol</Badge>
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
              <Label htmlFor="post">Post Location*</Label>
              <Select 
                value={formData.post} 
                onValueChange={(value) => handleChange("post", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Post" />
                </SelectTrigger>
                <SelectContent>
                  {posts.map(post => (
                    <SelectItem key={post} value={post}>{post}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Violation*</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date} 
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="violation">Type of Violation*</Label>
              <Select 
                value={formData.violation} 
                onValueChange={(value) => handleChange("violation", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Violation" />
                </SelectTrigger>
                <SelectContent>
                  {violations.map(violation => (
                    <SelectItem key={violation} value={violation}>{violation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Penalty Points</Label>
              <Input 
                id="points" 
                type="number"
                min={1}
                max={5}
                value={formData.points}
                onChange={(e) => handleChange("points", parseInt(e.target.value))}
              />
            </div>
            
            {editData?.id && (
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Provide details of the violation"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData?.id ? "Update Record" : "Save Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
