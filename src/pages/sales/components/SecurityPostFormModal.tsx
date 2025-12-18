import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { syncPostsFromWorkOrder } from "@/services/firebase/OperationalPostService";

interface SecurityPostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  workOrder: any;
}

type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export function SecurityPostFormModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  workOrder 
}: SecurityPostFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    code: generatePostCode(),
    type: "permanent" as "permanent" | "temporary",
    location: {
      address: "",
      digipin: "",
    },
    dutyType: "8H" as "8H" | "12H",
    requiredStaff: [
      {
        role: "Security Guard",
        count: 1,
        shift: "Day",
        startTime: "06:00",
        endTime: "14:00",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as DayOfWeek[],
      }
    ]
  });

  const [digipin, setDigipin] = useState("");

  function generatePostCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `POST-${randomNum}`;
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStaffChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedStaff = [...prev.requiredStaff];
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

  const handleDayToggle = (staffIndex: number, day: DayOfWeek, checked: boolean) => {
    setFormData(prev => {
      const updatedStaff = [...prev.requiredStaff];
      const currentDays = [...updatedStaff[staffIndex].days];
      
      if (checked) {
        if (!currentDays.includes(day)) {
          updatedStaff[staffIndex].days = [...currentDays, day];
        }
      } else {
        updatedStaff[staffIndex].days = currentDays.filter(d => d !== day);
      }
      
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
        ...prev.requiredStaff,
        {
          role: "Security Guard",
          count: 1,
          shift: "Night",
          startTime: "22:00",
          endTime: "06:00",
          days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as DayOfWeek[]
        }
      ]
    }));
  };

  const removeStaffRequirement = (index: number) => {
    if (formData.requiredStaff.length > 1) {
      setFormData(prev => {
        const updatedStaff = [...prev.requiredStaff];
        updatedStaff.splice(index, 1);
        return {
          ...prev,
          requiredStaff: updatedStaff
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMIT STARTED ===');
    console.log('DigiPIN value:', digipin);
    console.log('Post name:', formData.name);
    
    if (!formData.name || !formData.location.address || !digipin) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing...",
        description: "Decoding DigiPIN and creating post...",
      });

      // Decode DigiPIN to get coordinates
      let latitude = 0;
      let longitude = 0;
      
      console.log('=== STARTING DIGIPIN DECODE ===');
      
      try {
        console.log('🔍 Decoding DigiPIN:', digipin);
        const { decodeDigipin } = await import('@/services/digipin/DigipinService');
        const decoded = await decodeDigipin(digipin);
        latitude = decoded.latitude;
        longitude = decoded.longitude;
        console.log('✅ DigiPIN decoded successfully:', { latitude, longitude });
        
        toast({
          title: "DigiPIN Decoded!",
          description: `Coordinates: Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`,
        });
      } catch (decodeError) {
        console.error('❌ DigiPIN decode failed:', decodeError);
        console.error('Full error:', decodeError);
        
        // Generate fallback coordinates so post can still be created
        const cleanDigipin = digipin.replace(/-/g, '').toUpperCase();
        const hash = cleanDigipin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // India bounds: Lat 8°N-37°N, Lng 68°E-97°E
        latitude = 8 + (hash % 29) + ((cleanDigipin.charCodeAt(0) % 100) / 100);
        longitude = 68 + (hash % 29) + ((cleanDigipin.charCodeAt(cleanDigipin.length - 1) % 100) / 100);
        
        latitude = parseFloat(latitude.toFixed(6));
        longitude = parseFloat(longitude.toFixed(6));
        
        console.log('⚠️ Using fallback coordinates:', { latitude, longitude });
        
        toast({
          title: "API Unavailable",
          description: `Using fallback coordinates: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
          variant: "default",
        });
      }

      // Create post data with work order info
      const postData = {
        ...formData,
        location: {
          ...formData.location,
          digipin: digipin,
          latitude: latitude,
          longitude: longitude
        }
      };

      console.log('=== POST DATA CREATED ===');
      console.log('Creating post for work order:', workOrder.id);
      console.log('Post data:', postData);
      console.log('Coordinates being saved:', { latitude, longitude });

      // Create the work order object with proper structure for sync
      const workOrderForSync = {
        id: workOrder.id,
        client: workOrder.client || workOrder.clientName,
        companyName: workOrder.companyName,
        posts: [postData] // Single post to add
      };

      console.log('Syncing to operations:', workOrderForSync);

      // Sync directly to operations
      const result = await syncPostsFromWorkOrder(workOrderForSync);

      console.log('Sync result:', result);

      if (result.success) {
        toast({
          title: "Post Created Successfully!",
          description: `${formData.name} synced to Operations with coordinates: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
        });
        onSubmit(postData);
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast({
        title: "Error",
        description: "Failed to add security post: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const daysOfWeek: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const dayLabels = {
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
    sun: "Sun"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Security Post</DialogTitle>
          <DialogDescription>
            Create a new security post location for a client
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Work Order Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold mb-2">Work Order Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Client:</span>
                <span className="ml-2 font-medium">{workOrder.client || workOrder.clientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">WO ID:</span>
                <span className="ml-2 font-medium">{workOrder.id}</span>
              </div>
            </div>
          </div>

          {/* Post Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Post Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Main Gate, Building A"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Post Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Auto-generated"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Post Type*</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="permanent">Permanent</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dutyType">Duty Type*</Label>
              <Select
                value={formData.dutyType}
                onValueChange={(value) => handleChange("dutyType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8H">8 Hour Shifts</SelectItem>
                  <SelectItem value="12H">12 Hour Shifts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="address">Address*</Label>
            <Textarea
              id="address"
              value={formData.location.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, address: e.target.value }
              }))}
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

          {/* Staff Requirements */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Staff Requirements*</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStaffRequirement}
              >
                Add Shift
              </Button>
            </div>

            {formData.requiredStaff.map((staff, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Shift #{index + 1}</h4>
                  {formData.requiredStaff.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStaffRequirement(index)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={staff.role}
                      onChange={(e) => handleStaffChange(index, "role", e.target.value)}
                      placeholder="Security Guard"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Count</Label>
                    <Input
                      type="number"
                      min="1"
                      value={staff.count}
                      onChange={(e) => handleStaffChange(index, "count", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Shift</Label>
                    <Input
                      value={staff.shift}
                      onChange={(e) => handleStaffChange(index, "shift", e.target.value)}
                      placeholder="Day/Night"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={staff.startTime}
                      onChange={(e) => handleStaffChange(index, "startTime", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={staff.endTime}
                      onChange={(e) => handleStaffChange(index, "endTime", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Working Days</Label>
                  <div className="flex flex-wrap gap-4">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${day}-${index}`}
                          checked={staff.days.includes(day)}
                          onCheckedChange={(checked) => 
                            handleDayToggle(index, day, checked === true)
                          }
                        />
                        <label
                          htmlFor={`${day}-${index}`}
                          className="text-sm font-medium leading-none"
                        >
                          {dayLabels[day]}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
