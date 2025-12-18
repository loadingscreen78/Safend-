
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/types/operations";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Building, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Post>) => void;
  editData: Post | null;
}

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export function PostForm({ isOpen, onClose, onSubmit, editData }: PostFormProps) {
  const { toast } = useToast();
  const [formTab, setFormTab] = useState("basic");
  const [formData, setFormData] = useState<Partial<Post>>({
    type: 'permanent',
    status: 'active',
    location: { latitude: 0, longitude: 0, geofenceRadius: 100 },
    requiredStaff: []
  });
  const [digipin, setDigipin] = useState("");
  
  // Populate form if editing an existing post
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      // Reset form for new post
      setFormData({
        type: 'permanent',
        status: 'active',
        location: { latitude: 0, longitude: 0 },
        requiredStaff: []
      });
    }
  }, [editData]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location!,
        [field]: value
      }
    }));
  };

  const handleStaffChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedStaff = [...(prev.requiredStaff || [])];
      updatedStaff[index] = {
        ...updatedStaff[index],
        [field]: value
      };
      return {
        ...prev,
        requiredStaff: updatedStaff
      };
    });
  };

  const addStaffRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requiredStaff: [
        ...(prev.requiredStaff || []),
        {
          role: "",
          count: 1,
          shift: "",
          startTime: "",
          endTime: "",
          days: []
        }
      ]
    }));
  };

  const removeStaffRequirement = (index: number) => {
    setFormData(prev => {
      const updatedStaff = [...(prev.requiredStaff || [])];
      updatedStaff.splice(index, 1);
      return {
        ...prev,
        requiredStaff: updatedStaff
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.clientName || !formData.address || !formData.startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate location
    if (!formData.location || formData.location.latitude === 0 || formData.location.longitude === 0) {
      toast({
        title: "Validation Error",
        description: "Please set a valid location.",
        variant: "destructive",
      });
      return;
    }
    
    // For temporary posts, ensure end date is specified
    if (formData.type === 'temporary' && !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Temporary posts must have an end date.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form data
    onSubmit(formData);
  };

  // Days of the week array for type safety
  const daysOfWeek: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Post" : "Create New Post"}</DialogTitle>
          <DialogDescription>
            {editData 
              ? "Update the security post details below." 
              : "Enter the details for the new security post."}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={formTab} onValueChange={setFormTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Staff</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="max-h-[60vh]">
            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Post Type*</Label>
                    <Select
                      value={formData.type || "permanent"} // Set a default if empty
                      onValueChange={(value) => handleChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status*</Label>
                    <Select
                      value={formData.status || "active"} // Set a default if empty
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Post Name*</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter post name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Post Code*</Label>
                    <Input
                      id="code"
                      value={formData.code || ""}
                      onChange={(e) => handleChange("code", e.target.value)}
                      placeholder="Enter post code"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dutyType">Duty Type*</Label>
                    <Select
                      value={formData.dutyType || "8H"} // Set a default if empty
                      onValueChange={(value) => handleChange("dutyType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Duty Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8H">8 Hour Shifts</SelectItem>
                        <SelectItem value="12H">12 Hour Shifts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name*</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName || ""}
                    onChange={(e) => handleChange("clientName", e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    value={formData.clientId || ""}
                    onChange={(e) => handleChange("clientId", e.target.value)}
                    placeholder="Enter client ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workOrderId">Work Order Reference</Label>
                  <Input
                    id="workOrderId"
                    value={formData.workOrderId || ""}
                    onChange={(e) => handleChange("workOrderId", e.target.value)}
                    placeholder="Enter work order reference"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date*</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ""}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date {formData.type === 'temporary' ? '*' : ''}</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate || ""}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
                
                {formData.type === 'temporary' && (
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name*</Label>
                    <Input
                      id="eventName"
                      value={(formData as any).eventName || ""}
                      onChange={(e) => handleChange("eventName", e.target.value)}
                      placeholder="Enter event name"
                    />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address*</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="digipin">DigiPIN*</Label>
                  <Input
                    id="digipin"
                    value={digipin}
                    onChange={(e) => {
                      let value = e.target.value.toUpperCase();
                      value = value.replace(/[^A-Z0-9-]/g, '');
                      if (value.length > 3 && value[3] !== '-') {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                      }
                      if (value.length > 7 && value[7] !== '-') {
                        value = value.slice(0, 7) + '-' + value.slice(7);
                      }
                      value = value.slice(0, 13);
                      setDigipin(value);
                    }}
                    placeholder="e.g., 5C8-8J9-7FT7"
                    maxLength={13}
                  />
                  <p className="text-xs text-muted-foreground">Format: XXX-XXX-XXXX</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="geofenceRadius">Geofence Radius (meters)</Label>
                  <Input
                    id="geofenceRadius"
                    type="number"
                    value={formData.location?.geofenceRadius || 100}
                    onChange={(e) => handleLocationChange("geofenceRadius", parseInt(e.target.value))}
                    placeholder="Enter geofence radius"
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>Note:</strong> Posts are automatically synced from Sales Work Orders. 
                    Manual post creation is for special cases only. DigiPIN will be decoded to get coordinates automatically.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="staff" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Staff Requirements</h4>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addStaffRequirement}
                  >
                    Add Requirement
                  </Button>
                </div>
                
                {formData.requiredStaff && formData.requiredStaff.length > 0 ? (
                  formData.requiredStaff.map((staff, index) => (
                    <div key={index} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Requirement #{index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeStaffRequirement(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`role-${index}`}>Role*</Label>
                          <Input
                            id={`role-${index}`}
                            value={staff.role || ""}
                            onChange={(e) => handleStaffChange(index, "role", e.target.value)}
                            placeholder="Security Guard, Supervisor, etc."
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`count-${index}`}>Number of Staff*</Label>
                          <Input
                            id={`count-${index}`}
                            type="number"
                            min="1"
                            value={staff.count || 1}
                            onChange={(e) => handleStaffChange(index, "count", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`shift-${index}`}>Shift*</Label>
                          <Input
                            id={`shift-${index}`}
                            value={staff.shift || ""}
                            onChange={(e) => handleStaffChange(index, "shift", e.target.value)}
                            placeholder="Morning, Evening, Night"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`startTime-${index}`}>Start Time*</Label>
                          <Input
                            id={`startTime-${index}`}
                            type="time"
                            value={staff.startTime || ""}
                            onChange={(e) => handleStaffChange(index, "startTime", e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`endTime-${index}`}>End Time*</Label>
                          <Input
                            id={`endTime-${index}`}
                            type="time"
                            value={staff.endTime || ""}
                            onChange={(e) => handleStaffChange(index, "endTime", e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Days of the Week*</Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${day}-${index}`}
                                checked={(staff.days || []).includes(day)}
                                onCheckedChange={(checked) => {
                                  const days = [...(staff.days || [])];
                                  if (checked) {
                                    if (!days.includes(day)) {
                                      days.push(day);
                                    }
                                  } else {
                                    const dayIndex = days.indexOf(day);
                                    if (dayIndex !== -1) {
                                      days.splice(dayIndex, 1);
                                    }
                                  }
                                  handleStaffChange(index, "days", days);
                                }}
                              />
                              <label
                                htmlFor={`${day}-${index}`}
                                className="text-sm font-medium leading-none capitalize"
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border rounded-md p-6 text-center text-muted-foreground">
                    No staff requirements added yet. Click "Add Requirement" to add staff.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-4">
                <div className="h-[300px] bg-gray-100 rounded-md flex flex-col items-center justify-center">
                  <Calendar className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-gray-500">
                    Scheduling options will be implemented here
                  </span>
                  <p className="text-sm text-gray-400 mt-2 max-w-md text-center">
                    This will include calendar views, auto-generation of rotas,
                    and staff assignment options.
                  </p>
                </div>
              </TabsContent>
            </form>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editData ? "Update Post" : "Create Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
