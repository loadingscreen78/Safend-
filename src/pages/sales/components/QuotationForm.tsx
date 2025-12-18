
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
import { addQuotation, updateQuotation } from "@/services/firebase/QuotationFirebaseService";

interface QuotationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function QuotationForm({ isOpen, onClose, onSubmit, editData }: QuotationFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Generate custom quotation ID
  const generateQuoteId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `QT-${year}-${randomNum}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    id: editData?.id || generateQuoteId(), // Generate custom ID for new quotations
    client: editData?.client || "",
    service: editData?.service || "",
    amount: editData?.amount?.replace("₹", "") || "",
    status: editData?.status || "Pending",
    date: getCurrentDate(),
    validUntil: editData?.validUntil || getDefaultValidUntil(),
    contactPerson: editData?.contactPerson || "",
    contactEmail: editData?.contactEmail || "",
    contactPhone: editData?.contactPhone || "",
    
    // Security service details
    securityServices: {
      unarmedGuards: {
        count: editData?.securityServices?.unarmedGuards?.count || 0,
        rate: editData?.securityServices?.unarmedGuards?.rate || 0,
      },
      armedGuards: {
        count: editData?.securityServices?.armedGuards?.count || 0,
        rate: editData?.securityServices?.armedGuards?.rate || 0,
      },
      supervisors: {
        count: editData?.securityServices?.supervisors?.count || 0,
        rate: editData?.securityServices?.supervisors?.rate || 0,
      },
      patrolOfficers: {
        count: editData?.securityServices?.patrolOfficers?.count || 0,
        rate: editData?.securityServices?.patrolOfficers?.rate || 0,
      },
    },
    
    // Shift details
    shiftType: editData?.shiftType || "8H", // 8-hour or 12-hour
    shiftCount: editData?.shiftCount || 3, // Number of shifts per day
    
    // Service locations
    locations: editData?.locations || [{
      name: "",
      address: "",
      guards: 0
    }],
    
    // Tax and compliance information
    gstPercentage: editData?.gstPercentage || 18,
    gstNumber: editData?.gstNumber || "",
    gstExempt: editData?.gstExempt || false,
    psaraCompliance: editData?.psaraCompliance || true,
    minWageCompliance: editData?.minWageCompliance || true,
    
    // Terms and notes
    paymentTerms: editData?.paymentTerms || "Payment within 30 days of invoice date",
    termsAndConditions: editData?.termsAndConditions || "Standard terms and conditions apply as per our service agreement.",
    notes: editData?.notes || "",
  });

  // Update form data when editData changes
  useEffect(() => {
    if (editData) {
      setFormData(prev => ({
        ...prev,
        id: editData?.id || generateQuoteId(), // Use existing ID or generate new one
        client: editData?.client || prev.client,
        service: editData?.service || prev.service,
        contactPerson: editData?.contactPerson || prev.contactPerson,
        contactEmail: editData?.contactEmail || prev.contactEmail,
        contactPhone: editData?.contactPhone || prev.contactPhone,
        status: editData?.status || prev.status,
      }));
    } else {
      // Reset form for new quotation
      setFormData(prev => ({
        ...prev,
        id: generateQuoteId(), // Generate new ID for new quotation
      }));
    }
  }, [editData, generateQuoteId]);
  
  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
  
  // Get default valid until date (30 days from now)
  function getDefaultValidUntil() {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    return now.toISOString().split('T')[0];
  }
  
  // Calculate total amount
  const calculateTotal = () => {
    let subtotal = 0;
    
    // Add up all security services
    Object.keys(formData.securityServices).forEach((service) => {
      const serviceData = formData.securityServices[service as keyof typeof formData.securityServices];
      subtotal += serviceData.count * serviceData.rate;
    });
    
    // Calculate GST if applicable
    const gstAmount = formData.gstExempt ? 0 : (subtotal * formData.gstPercentage / 100);
    
    // Return the total
    return subtotal + gstAmount;
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle numeric input changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : parseInt(value, 10) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle security service changes
  const handleServiceChange = (service: string, field: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10) || 0;
    
    setFormData(prev => ({
      ...prev,
      securityServices: {
        ...prev.securityServices,
        [service]: {
          ...prev.securityServices[service as keyof typeof prev.securityServices],
          [field]: numValue
        }
      }
    }));
  };
  
  // Handle location changes
  const handleLocationChange = (index: number, field: string, value: string) => {
    const updatedLocations = [...formData.locations];
    if (field === 'guards') {
      updatedLocations[index] = { 
        ...updatedLocations[index], 
        [field]: parseInt(value, 10) || 0 
      };
    } else {
      updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    }
    
    setFormData(prev => ({
      ...prev,
      locations: updatedLocations
    }));
  };
  
  // Add a new location
  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, { name: "", address: "", guards: 0 }]
    }));
  };
  
  // Remove a location
  const removeLocation = (index: number) => {
    if (formData.locations.length > 1) {
      const updatedLocations = [...formData.locations];
      updatedLocations.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        locations: updatedLocations
      }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.client || !formData.service) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate total
    const total = calculateTotal();
    
    // Format the amount with rupee sign
    const formattedData = {
      ...formData,
      amount: `₹${total}`,
    };
    
    // Save to Firebase
    try {
      let result;
      // Check if we're editing an existing document
      if (editData?.id) {
        // Update existing quotation
        result = await updateQuotation(editData.id, formattedData);
      } else {
        // Add new quotation with custom ID
        result = await addQuotation(formattedData);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: editData?.id ? "Quotation updated successfully" : "Quotation created successfully",
        });
        onSubmit(formattedData);
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save quotation",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Quotation" : "Create New Quotation"}</DialogTitle>
          <DialogDescription>
            {editData ? "Update quotation details and pricing" : "Create a new quotation for your client with detailed service breakdown"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="terms">Terms & Tax</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Quote ID *</Label>
                  <Input 
                    id="id" 
                    name="id" 
                    value={formData.id} 
                    onChange={handleChange}
                    placeholder="QT-2025-1234"
                    disabled={!!editData?.id}
                    className={editData?.id ? "bg-gray-100" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {editData?.id ? "ID cannot be changed after creation" : "Custom ID (e.g., QT-2025-1234)"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Quote Date</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date"
                    value={formData.date} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client Name *</Label>
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
                  placeholder="Describe services included in quote" 
                  required 
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input 
                    id="validUntil" 
                    name="validUntil" 
                    type="date"
                    value={formData.validUntil} 
                    onChange={handleChange} 
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
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Revised">Revised</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Security Services Tab */}
            <TabsContent value="services" className="space-y-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-lg font-medium">Security Service Details</Label>
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="shiftType" className="text-sm">Shift Type</Label>
                      <Select 
                        value={formData.shiftType} 
                        onValueChange={(value) => handleSelectChange(value, "shiftType")}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Shift type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8H">8-Hour</SelectItem>
                          <SelectItem value="12H">12-Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="shiftCount" className="text-sm">Shifts/Day</Label>
                      <Select 
                        value={formData.shiftCount.toString()} 
                        onValueChange={(value) => handleSelectChange(value, "shiftCount")}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Shifts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Shift</SelectItem>
                          <SelectItem value="2">2 Shifts</SelectItem>
                          {formData.shiftType === "8H" && <SelectItem value="3">3 Shifts</SelectItem>}
                        </SelectContent>
                      </Select>
                      {formData.shiftType === "12H" && (
                        <p className="text-xs text-muted-foreground">Max 2 shifts for 12-hour</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-12 gap-4 mb-3 font-medium">
                    <div className="col-span-4">Service Type</div>
                    <div className="col-span-3">Quantity</div>
                    <div className="col-span-3">Rate (₹)</div>
                    <div className="col-span-2">Total (₹)</div>
                  </div>
                  
                  {/* Unarmed Guards */}
                  <div className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-4">Unarmed Guards</div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.unarmedGuards.count} 
                        onChange={(e) => handleServiceChange('unarmedGuards', 'count', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.unarmedGuards.rate} 
                        onChange={(e) => handleServiceChange('unarmedGuards', 'rate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      ₹{formData.securityServices.unarmedGuards.count * formData.securityServices.unarmedGuards.rate}
                    </div>
                  </div>
                  
                  {/* Armed Guards */}
                  <div className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-4">Armed Guards</div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.armedGuards.count} 
                        onChange={(e) => handleServiceChange('armedGuards', 'count', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.armedGuards.rate} 
                        onChange={(e) => handleServiceChange('armedGuards', 'rate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      ₹{formData.securityServices.armedGuards.count * formData.securityServices.armedGuards.rate}
                    </div>
                  </div>
                  
                  {/* Supervisors */}
                  <div className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-4">Supervisors</div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.supervisors.count} 
                        onChange={(e) => handleServiceChange('supervisors', 'count', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.supervisors.rate} 
                        onChange={(e) => handleServiceChange('supervisors', 'rate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      ₹{formData.securityServices.supervisors.count * formData.securityServices.supervisors.rate}
                    </div>
                  </div>
                  
                  {/* Patrol Officers */}
                  <div className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-4">Patrol Officers</div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.patrolOfficers.count} 
                        onChange={(e) => handleServiceChange('patrolOfficers', 'count', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input 
                        type="number" 
                        min="0" 
                        value={formData.securityServices.patrolOfficers.rate} 
                        onChange={(e) => handleServiceChange('patrolOfficers', 'rate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      ₹{formData.securityServices.patrolOfficers.count * formData.securityServices.patrolOfficers.rate}
                    </div>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="grid grid-cols-12 gap-4 mt-4 pt-3 border-t items-center">
                    <div className="col-span-10 text-right font-medium">Subtotal</div>
                    <div className="col-span-2 text-right font-semibold">
                      ₹{Object.keys(formData.securityServices).reduce((total, service) => {
                        const serviceData = formData.securityServices[service as keyof typeof formData.securityServices];
                        return total + (serviceData.count * serviceData.rate);
                      }, 0)}
                    </div>
                  </div>
                  
                  {/* GST */}
                  {!formData.gstExempt && (
                    <div className="grid grid-cols-12 gap-4 mt-1 items-center">
                      <div className="col-span-10 text-right">GST ({formData.gstPercentage}%)</div>
                      <div className="col-span-2 text-right">
                        ₹{(Object.keys(formData.securityServices).reduce((total, service) => {
                          const serviceData = formData.securityServices[service as keyof typeof formData.securityServices];
                          return total + (serviceData.count * serviceData.rate);
                        }, 0) * formData.gstPercentage / 100).toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="grid grid-cols-12 gap-4 mt-2 pt-3 border-t items-center">
                    <div className="col-span-10 text-right font-semibold">Total</div>
                    <div className="col-span-2 text-right font-bold">
                      ₹{calculateTotal()}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Locations Tab */}
            <TabsContent value="locations" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Service Locations</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addLocation}
                >
                  Add Location
                </Button>
              </div>
              
              {formData.locations.map((location, index) => (
                <div key={index} className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Location {index + 1}</h4>
                    {formData.locations.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 h-8 hover:text-red-700"
                        onClick={() => removeLocation(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Site Name</Label>
                      <Input 
                        value={location.name} 
                        onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                        placeholder="Site name" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input 
                        value={location.address} 
                        onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                        placeholder="Site address" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Guards Required</Label>
                      <Input 
                        type="number" 
                        min="0"
                        value={location.guards} 
                        onChange={(e) => handleLocationChange(index, 'guards', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            {/* Terms & Tax Tab */}
            <TabsContent value="terms" className="space-y-4">
              <div className="border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-3">Tax Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input 
                      id="gstNumber" 
                      name="gstNumber" 
                      value={formData.gstNumber} 
                      onChange={handleChange} 
                      placeholder="Client GST Number" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gstPercentage">GST Percentage</Label>
                    <Input 
                      id="gstPercentage" 
                      name="gstPercentage" 
                      type="number"
                      min="0"
                      max="28"
                      value={formData.gstPercentage} 
                      onChange={handleNumericChange} 
                      disabled={formData.gstExempt}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <Checkbox 
                    id="gstExempt" 
                    checked={formData.gstExempt}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("gstExempt", checked === true)
                    }
                  />
                  <Label htmlFor="gstExempt">GST Exempt</Label>
                </div>
              </div>
              
              <div className="border rounded-md p-4 mb-4">
                <h3 className="font-medium mb-3">Compliance</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="psaraCompliance" 
                      checked={formData.psaraCompliance}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("psaraCompliance", checked === true)
                      }
                    />
                    <Label htmlFor="psaraCompliance">PSARA Compliance Statement Included</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="minWageCompliance" 
                      checked={formData.minWageCompliance}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("minWageCompliance", checked === true)
                      }
                    />
                    <Label htmlFor="minWageCompliance">Minimum Wage Compliance Statement</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input 
                  id="paymentTerms" 
                  name="paymentTerms" 
                  value={formData.paymentTerms} 
                  onChange={handleChange} 
                  placeholder="Enter payment terms" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                <Textarea 
                  id="termsAndConditions" 
                  name="termsAndConditions" 
                  value={formData.termsAndConditions} 
                  onChange={handleChange} 
                  rows={4} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  placeholder="Add any additional notes or terms" 
                  rows={3} 
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-safend-red hover:bg-red-700">
              {editData ? "Update Quotation" : "Create Quotation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
