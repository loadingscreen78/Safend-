
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
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RotaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

// Mock data for security posts
const securityPosts = [
  { id: "P001", name: "Summit Tower - Main Entrance" },
  { id: "P002", name: "Metro Building - Reception" },
  { id: "P003", name: "Riverside Apartments - Concierge" },
  { id: "P004", name: "Northern Rail Station - Security" },
  { id: "P005", name: "SafeEnd Office - Reception" },
];

// Mock data for staff members
const securityStaff = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Emma Wilson" },
  { id: 3, name: "Michael Davis" },
  { id: 4, name: "Sarah Johnson" },
  { id: 5, name: "James Thompson" },
  { id: 6, name: "Lisa Brown" },
  { id: 7, name: "Robert Green" },
  { id: 8, name: "Anna Williams" },
  { id: 9, name: "David Jones" },
  { id: 10, name: "Laura Taylor" },
];

export function RotaForm({ isOpen, onClose, onSubmit, editData }: RotaFormProps) {
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    id: editData?.id || generateRotaId(),
    postId: editData?.postId || "",
    postName: editData?.postName || "",
    week: editData?.week || getCurrentWeek(),
    staff: editData?.staff || [],
    status: editData?.status || "Draft",
    notes: editData?.notes || "",
  });
  
  const [selectedStaffMember, setSelectedStaffMember] = useState<string>("");
  
  // Generate rota ID
  function generateRotaId() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `R${year}-${randomNum.toString().slice(0, 3)}`;
  }
  
  // Get current week in a readable format
  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formatDate = (date: Date) => {
      const month = date.toLocaleString('default', { month: 'short' });
      return `${month} ${date.getDate()}`;
    };
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}, ${now.getFullYear()}`;
  }
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    if (name === "postId") {
      const selectedPost = securityPosts.find(post => post.id === value);
      setFormData(prev => ({ 
        ...prev, 
        postId: value,
        postName: selectedPost ? selectedPost.name : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle staff selection
  const handleAddStaffMember = () => {
    if (!selectedStaffMember) return;
    
    const staffName = securityStaff.find(staff => staff.id.toString() === selectedStaffMember)?.name;
    if (staffName && !formData.staff.includes(staffName)) {
      setFormData(prev => ({
        ...prev,
        staff: [...prev.staff, staffName]
      }));
      setSelectedStaffMember("");
    }
  };
  
  // Handle staff removal
  const handleRemoveStaffMember = (staffName: string) => {
    setFormData(prev => ({
      ...prev,
      staff: prev.staff.filter(name => name !== staffName)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.postId || !formData.week || formData.staff.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one staff member.",
        duration: 3000,
      });
      return;
    }
    
    // Submit the form
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Rota" : "Create New Rota"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Rota ID</Label>
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
                name="status" 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange(value, "status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postId">Security Post *</Label>
            <Select 
              name="postId" 
              value={formData.postId} 
              onValueChange={(value) => handleSelectChange(value, "postId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select security post" />
              </SelectTrigger>
              <SelectContent>
                {securityPosts.map(post => (
                  <SelectItem key={post.id} value={post.id}>{post.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="week">Week *</Label>
            <Input 
              id="week" 
              name="week" 
              value={formData.week} 
              onChange={handleChange} 
              placeholder="Enter week period" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Staff Members *</Label>
            <div className="flex gap-2">
              <Select 
                value={selectedStaffMember}
                onValueChange={setSelectedStaffMember}
              >
                <SelectTrigger className="flex-grow">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {securityStaff.map(staff => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button"
                onClick={handleAddStaffMember}
                disabled={!selectedStaffMember}
              >
                Add
              </Button>
            </div>
            
            <div className="mt-2 border rounded-md p-2 min-h-24 max-h-48 overflow-y-auto">
              {formData.staff.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.staff.map((staffName, index) => (
                    <Badge key={index} className="px-2 py-1 flex items-center gap-1 bg-blue-500 hover:bg-blue-600">
                      {staffName}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveStaffMember(staffName)}
                      />
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-2">
                  No staff members added
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Enter any additional notes" 
              rows={3} 
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-safend-red hover:bg-safend-red/90">
              {editData ? "Update Rota" : "Create Rota"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
