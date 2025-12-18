
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
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function LeadForm({ isOpen, onClose, onSubmit, editData }: LeadFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    id: editData?.id || "",
    name: editData?.name || "",
    companyName: editData?.companyName || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    address: editData?.address || "",
    city: editData?.city || "",
    state: editData?.state || "",
    pincode: editData?.pincode || "",
    source: editData?.source || "Website",
    status: editData?.status || "New Lead",
    assignedTo: editData?.assignedTo || "",
    
    // Security requirements
    securityNeeds: {
      armedGuards: editData?.securityNeeds?.armedGuards || false,
      unarmedGuards: editData?.securityNeeds?.unarmedGuards || true,
      supervisors: editData?.securityNeeds?.supervisors || false,
      patrolOfficers: editData?.securityNeeds?.patrolOfficers || false,
      eventSecurity: editData?.securityNeeds?.eventSecurity || false,
      personalSecurity: editData?.securityNeeds?.personalSecurity || false,
    },
    
    // Manpower requirements
    manpowerRequirements: {
      totalGuardsNeeded: editData?.manpowerRequirements?.totalGuardsNeeded || "",
      shiftType: editData?.manpowerRequirements?.shiftType || "8H",
      shiftCount: editData?.manpowerRequirements?.shiftCount || "3",
      femaleGuardsRequired: editData?.manpowerRequirements?.femaleGuardsRequired || false,
      exServicemenRequired: editData?.manpowerRequirements?.exServicemenRequired || false,
    },
    
    // Site information
    siteInformation: {
      siteCount: editData?.siteInformation?.siteCount || "1",
      primaryLocation: editData?.siteInformation?.primaryLocation || "",
      locationType: editData?.siteInformation?.locationType || "Commercial",
      siteArea: editData?.siteInformation?.siteArea || "",
      accessControlNeeded: editData?.siteInformation?.accessControlNeeded || false,
      cameraSystemNeeded: editData?.siteInformation?.cameraSystemNeeded || false,
    },
    
    // Budget and timeline
    budget: editData?.budget || "",
    targetStartDate: editData?.targetStartDate || "",
    urgency: editData?.urgency || "Medium",
    
    // Additional information
    notes: editData?.notes || "",
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle nested object changes
  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (section: string, field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: checked
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit the form
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="security">Security Needs</TabsTrigger>
              <TabsTrigger value="site">Site Details</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="Contact person name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={formData.companyName} 
                    onChange={handleChange}
                    placeholder="Company name" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="Contact phone number" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="Contact email" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Company address" 
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    placeholder="City" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    placeholder="State" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input 
                    id="pincode" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleChange}
                    placeholder="PIN code" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select 
                    value={formData.source} 
                    onValueChange={(value) => handleSelectChange(value, "source")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Phone Call">Phone Call</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Exhibition">Exhibition</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Lead Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange(value, "status")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Lead">New Lead</SelectItem>
                      <SelectItem value="Contacted">Contacted</SelectItem>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Won">Won</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Security Needs Tab */}
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-3 border p-4 rounded-md">
                <h3 className="font-medium">Security Service Requirements</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unarmedGuards" 
                      checked={formData.securityNeeds.unarmedGuards}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("securityNeeds", "unarmedGuards", checked === true)
                      }
                    />
                    <Label htmlFor="unarmedGuards">Unarmed Guards</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="armedGuards" 
                      checked={formData.securityNeeds.armedGuards}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("securityNeeds", "armedGuards", checked === true)
                      }
                    />
                    <Label htmlFor="armedGuards">Armed Guards</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="supervisors" 
                      checked={formData.securityNeeds.supervisors}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("securityNeeds", "supervisors", checked === true)
                      }
                    />
                    <Label htmlFor="supervisors">Supervisors</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="patrolOfficers" 
                      checked={formData.securityNeeds.patrolOfficers}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("securityNeeds", "patrolOfficers", checked === true)
                      }
                    />
                    <Label htmlFor="patrolOfficers">Patrol Officers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="eventSecurity" 
                      checked={formData.securityNeeds.eventSecurity}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("securityNeeds", "eventSecurity", checked === true)
                      }
                    />
                    <Label htmlFor="eventSecurity">Event Security</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="personalSecurity" 
                      checked={formData.securityNeeds.personalSecurity}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("securityNeeds", "personalSecurity", checked === true)
                      }
                    />
                    <Label htmlFor="personalSecurity">Personal Security</Label>
                  </div>
                </div>
              </div>
              
              {/* Separate Manpower Requirements box for each selected security service */}
              
              {formData.securityNeeds.unarmedGuards && (
                <div className="border p-4 rounded-md space-y-4 bg-blue-50/50 dark:bg-blue-900/10">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">Unarmed Guards - Manpower Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unarmedGuardsCount">Number of Unarmed Guards</Label>
                      <Input 
                        id="unarmedGuardsCount" 
                        value={formData.manpowerRequirements.unarmedGuardsCount || ''}
                        onChange={(e) => handleNestedChange("manpowerRequirements", "unarmedGuardsCount", e.target.value)}
                        placeholder="e.g., 10" 
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unarmedGuardsShiftType">Shift Type</Label>
                      <Select 
                        value={formData.manpowerRequirements.unarmedGuardsShiftType || '8H'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "unarmedGuardsShiftType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour Shift</SelectItem>
                          <SelectItem value="12H">12-Hour Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unarmedGuardsShiftCount">Shifts Per Day</Label>
                      <Select 
                        value={formData.manpowerRequirements.unarmedGuardsShiftCount || (formData.manpowerRequirements.unarmedGuardsShiftType === '12H' ? '2' : '3')}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "unarmedGuardsShiftCount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.manpowerRequirements.unarmedGuardsShiftType !== '12H' && (
                            <SelectItem value="3">3 Shifts</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="unarmedGuardsFemale" 
                        checked={formData.manpowerRequirements.unarmedGuardsFemale || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "unarmedGuardsFemale", checked === true)}
                      />
                      <Label htmlFor="unarmedGuardsFemale">Female Guards Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="unarmedGuardsExServicemen" 
                        checked={formData.manpowerRequirements.unarmedGuardsExServicemen || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "unarmedGuardsExServicemen", checked === true)}
                      />
                      <Label htmlFor="unarmedGuardsExServicemen">Ex-Servicemen Required</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.securityNeeds.armedGuards && (
                <div className="border p-4 rounded-md space-y-4 bg-red-50/50 dark:bg-red-900/10">
                  <h3 className="font-medium text-red-700 dark:text-red-300">Armed Guards - Manpower Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="armedGuardsCount">Number of Armed Guards</Label>
                      <Input 
                        id="armedGuardsCount" 
                        value={formData.manpowerRequirements.armedGuardsCount || ''}
                        onChange={(e) => handleNestedChange("manpowerRequirements", "armedGuardsCount", e.target.value)}
                        placeholder="e.g., 5" 
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="armedGuardsShiftType">Shift Type</Label>
                      <Select 
                        value={formData.manpowerRequirements.armedGuardsShiftType || '8H'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "armedGuardsShiftType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour Shift</SelectItem>
                          <SelectItem value="12H">12-Hour Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="armedGuardsShiftCount">Shifts Per Day</Label>
                      <Select 
                        value={formData.manpowerRequirements.armedGuardsShiftCount || (formData.manpowerRequirements.armedGuardsShiftType === '12H' ? '2' : '3')}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "armedGuardsShiftCount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.manpowerRequirements.armedGuardsShiftType !== '12H' && (
                            <SelectItem value="3">3 Shifts</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="armedGuardsFemale" 
                        checked={formData.manpowerRequirements.armedGuardsFemale || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "armedGuardsFemale", checked === true)}
                      />
                      <Label htmlFor="armedGuardsFemale">Female Guards Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="armedGuardsExServicemen" 
                        checked={formData.manpowerRequirements.armedGuardsExServicemen || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "armedGuardsExServicemen", checked === true)}
                      />
                      <Label htmlFor="armedGuardsExServicemen">Ex-Servicemen Required</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.securityNeeds.supervisors && (
                <div className="border p-4 rounded-md space-y-4 bg-green-50/50 dark:bg-green-900/10">
                  <h3 className="font-medium text-green-700 dark:text-green-300">Supervisors - Manpower Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supervisorsCount">Number of Supervisors</Label>
                      <Input 
                        id="supervisorsCount" 
                        value={formData.manpowerRequirements.supervisorsCount || ''}
                        onChange={(e) => handleNestedChange("manpowerRequirements", "supervisorsCount", e.target.value)}
                        placeholder="e.g., 2" 
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supervisorsShiftType">Shift Type</Label>
                      <Select 
                        value={formData.manpowerRequirements.supervisorsShiftType || '8H'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "supervisorsShiftType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour Shift</SelectItem>
                          <SelectItem value="12H">12-Hour Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supervisorsShiftCount">Shifts Per Day</Label>
                      <Select 
                        value={formData.manpowerRequirements.supervisorsShiftCount || (formData.manpowerRequirements.supervisorsShiftType === '12H' ? '2' : '3')}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "supervisorsShiftCount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.manpowerRequirements.supervisorsShiftType !== '12H' && (
                            <SelectItem value="3">3 Shifts</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="supervisorsFemale" 
                        checked={formData.manpowerRequirements.supervisorsFemale || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "supervisorsFemale", checked === true)}
                      />
                      <Label htmlFor="supervisorsFemale">Female Supervisors Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="supervisorsExServicemen" 
                        checked={formData.manpowerRequirements.supervisorsExServicemen || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "supervisorsExServicemen", checked === true)}
                      />
                      <Label htmlFor="supervisorsExServicemen">Ex-Servicemen Required</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.securityNeeds.patrolOfficers && (
                <div className="border p-4 rounded-md space-y-4 bg-purple-50/50 dark:bg-purple-900/10">
                  <h3 className="font-medium text-purple-700 dark:text-purple-300">Patrol Officers - Manpower Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patrolOfficersCount">Number of Patrol Officers</Label>
                      <Input 
                        id="patrolOfficersCount" 
                        value={formData.manpowerRequirements.patrolOfficersCount || ''}
                        onChange={(e) => handleNestedChange("manpowerRequirements", "patrolOfficersCount", e.target.value)}
                        placeholder="e.g., 3" 
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patrolOfficersShiftType">Shift Type</Label>
                      <Select 
                        value={formData.manpowerRequirements.patrolOfficersShiftType || '8H'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "patrolOfficersShiftType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour Shift</SelectItem>
                          <SelectItem value="12H">12-Hour Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patrolOfficersShiftCount">Shifts Per Day</Label>
                      <Select 
                        value={formData.manpowerRequirements.patrolOfficersShiftCount || (formData.manpowerRequirements.patrolOfficersShiftType === '12H' ? '2' : '3')}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "patrolOfficersShiftCount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.manpowerRequirements.patrolOfficersShiftType !== '12H' && (
                            <SelectItem value="3">3 Shifts</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="patrolOfficersFemale" 
                        checked={formData.manpowerRequirements.patrolOfficersFemale || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "patrolOfficersFemale", checked === true)}
                      />
                      <Label htmlFor="patrolOfficersFemale">Female Officers Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="patrolOfficersExServicemen" 
                        checked={formData.manpowerRequirements.patrolOfficersExServicemen || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "patrolOfficersExServicemen", checked === true)}
                      />
                      <Label htmlFor="patrolOfficersExServicemen">Ex-Servicemen Required</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.securityNeeds.eventSecurity && (
                <div className="border p-4 rounded-md space-y-4 bg-orange-50/50 dark:bg-orange-900/10">
                  <h3 className="font-medium text-orange-700 dark:text-orange-300">Event Security - Manpower Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventSecurityCount">Number of Event Security Personnel</Label>
                      <Input 
                        id="eventSecurityCount" 
                        value={formData.manpowerRequirements.eventSecurityCount || ''}
                        onChange={(e) => handleNestedChange("manpowerRequirements", "eventSecurityCount", e.target.value)}
                        placeholder="e.g., 15" 
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eventSecurityShiftType">Shift Type</Label>
                      <Select 
                        value={formData.manpowerRequirements.eventSecurityShiftType || '8H'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "eventSecurityShiftType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour Shift</SelectItem>
                          <SelectItem value="12H">12-Hour Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eventSecurityShiftCount">Shifts Per Day</Label>
                      <Select 
                        value={formData.manpowerRequirements.eventSecurityShiftCount || '1'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "eventSecurityShiftCount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.manpowerRequirements.eventSecurityShiftType !== '12H' && (
                            <SelectItem value="3">3 Shifts</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="eventSecurityFemale" 
                        checked={formData.manpowerRequirements.eventSecurityFemale || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "eventSecurityFemale", checked === true)}
                      />
                      <Label htmlFor="eventSecurityFemale">Female Personnel Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="eventSecurityExServicemen" 
                        checked={formData.manpowerRequirements.eventSecurityExServicemen || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "eventSecurityExServicemen", checked === true)}
                      />
                      <Label htmlFor="eventSecurityExServicemen">Ex-Servicemen Required</Label>
                    </div>
                  </div>
                </div>
              )}
              
              {formData.securityNeeds.personalSecurity && (
                <div className="border p-4 rounded-md space-y-4 bg-pink-50/50 dark:bg-pink-900/10">
                  <h3 className="font-medium text-pink-700 dark:text-pink-300">Personal Security - Manpower Requirements</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personalSecurityCount">Number of Personal Security Personnel</Label>
                      <Input 
                        id="personalSecurityCount" 
                        value={formData.manpowerRequirements.personalSecurityCount || ''}
                        onChange={(e) => handleNestedChange("manpowerRequirements", "personalSecurityCount", e.target.value)}
                        placeholder="e.g., 2" 
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="personalSecurityShiftType">Shift Type</Label>
                      <Select 
                        value={formData.manpowerRequirements.personalSecurityShiftType || '12H'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "personalSecurityShiftType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour Shift</SelectItem>
                          <SelectItem value="12H">12-Hour Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="personalSecurityShiftCount">Shifts Per Day</Label>
                      <Select 
                        value={formData.manpowerRequirements.personalSecurityShiftCount || '2'}
                        onValueChange={(value) => handleNestedChange("manpowerRequirements", "personalSecurityShiftCount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.manpowerRequirements.personalSecurityShiftType !== '12H' && (
                            <SelectItem value="3">3 Shifts</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="personalSecurityFemale" 
                        checked={formData.manpowerRequirements.personalSecurityFemale || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "personalSecurityFemale", checked === true)}
                      />
                      <Label htmlFor="personalSecurityFemale">Female Personnel Required</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="personalSecurityExServicemen" 
                        checked={formData.manpowerRequirements.personalSecurityExServicemen || false}
                        onCheckedChange={(checked) => handleCheckboxChange("manpowerRequirements", "personalSecurityExServicemen", checked === true)}
                      />
                      <Label htmlFor="personalSecurityExServicemen">Ex-Servicemen Required</Label>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Site Details Tab */}
            <TabsContent value="site" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteCount">Number of Sites</Label>
                  <Select 
                    value={formData.siteInformation.siteCount}
                    onValueChange={(value) => 
                      handleNestedChange("siteInformation", "siteCount", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sites count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Site</SelectItem>
                      <SelectItem value="2">2 Sites</SelectItem>
                      <SelectItem value="3">3 Sites</SelectItem>
                      <SelectItem value="4">4 Sites</SelectItem>
                      <SelectItem value="5+">5+ Sites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="locationType">Location Type</Label>
                  <Select 
                    value={formData.siteInformation.locationType}
                    onValueChange={(value) => 
                      handleNestedChange("siteInformation", "locationType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Event">Event Venue</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryLocation">Primary Location</Label>
                <Input 
                  id="primaryLocation" 
                  value={formData.siteInformation.primaryLocation}
                  onChange={(e) => 
                    handleNestedChange("siteInformation", "primaryLocation", e.target.value)
                  }
                  placeholder="Main site address/location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteArea">Site Area (sq. ft. approx)</Label>
                <Input 
                  id="siteArea" 
                  value={formData.siteInformation.siteArea}
                  onChange={(e) => 
                    handleNestedChange("siteInformation", "siteArea", e.target.value)
                  }
                  placeholder="Approximate site area" 
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Additional Security Systems</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accessControlNeeded" 
                      checked={formData.siteInformation.accessControlNeeded}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("siteInformation", "accessControlNeeded", checked === true)
                      }
                    />
                    <Label htmlFor="accessControlNeeded">Access Control System</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cameraSystemNeeded" 
                      checked={formData.siteInformation.cameraSystemNeeded}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("siteInformation", "cameraSystemNeeded", checked === true)
                      }
                    />
                    <Label htmlFor="cameraSystemNeeded">CCTV Camera System</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Additional Info Tab */}
            <TabsContent value="additional" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget (₹)</Label>
                  <Input 
                    id="budget" 
                    name="budget" 
                    value={formData.budget} 
                    onChange={handleChange}
                    placeholder="Estimated monthly budget" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select 
                    value={formData.urgency} 
                    onValueChange={(value) => handleSelectChange(value, "urgency")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low - Planning Phase</SelectItem>
                      <SelectItem value="Medium">Medium - Needed Soon</SelectItem>
                      <SelectItem value="High">High - Urgent Need</SelectItem>
                      <SelectItem value="Critical">Critical - Immediate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetStartDate">Target Start Date</Label>
                <Input 
                  id="targetStartDate" 
                  name="targetStartDate" 
                  type="date"
                  value={formData.targetStartDate} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange}
                  placeholder="Any other requirements or information" 
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-safend-red hover:bg-red-700">
              {editData ? "Update Lead" : "Save Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
