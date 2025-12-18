
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

interface AgreementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function AgreementForm({ isOpen, onClose, onSubmit, editData }: AgreementFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    id: editData?.id || `AGR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: editData?.clientName || "",
    contactPerson: editData?.contactPerson || "",
    clientEmail: editData?.clientEmail || "",
    clientPhone: editData?.clientPhone || "",
    quotationRef: editData?.quotationRef || "",
    signedOn: editData?.signedOn || "",
    validUntil: editData?.validUntil || "",
    status: editData?.status || "Draft",
    value: editData?.value?.replace("₹", "") || "",
    
    // Services scope
    serviceScope: {
      securityGuards: editData?.serviceScope?.securityGuards || true,
      armedGuards: editData?.serviceScope?.armedGuards || false,
      personalSecurityOfficers: editData?.serviceScope?.personalSecurityOfficers || false,
      supervisors: editData?.serviceScope?.supervisors || false,
      patrolServices: editData?.serviceScope?.patrolServices || false,
      eventSecurity: editData?.serviceScope?.eventSecurity || false,
    },
    
    // Service locations
    serviceLocations: editData?.serviceLocations || "",
    
    // Compliance
    complianceInfo: {
      psaraLicenseNumber: editData?.complianceInfo?.psaraLicenseNumber || "",
      psaraExpiryDate: editData?.complianceInfo?.psaraExpiryDate || "",
      gstNumber: editData?.complianceInfo?.gstNumber || "",
      workersCompensation: editData?.complianceInfo?.workersCompensation || true,
      epfCompliance: editData?.complianceInfo?.epfCompliance || true,
      esiCompliance: editData?.complianceInfo?.esiCompliance || true,
      minWageCompliance: editData?.complianceInfo?.minWageCompliance || true,
    },
    
    // Legal and payment terms
    legalTerms: {
      contractDuration: editData?.legalTerms?.contractDuration || "12", // in months
      terminationNotice: editData?.legalTerms?.terminationNotice || "30", // in days
      automaticRenewal: editData?.legalTerms?.automaticRenewal || false,
      nonDisclosure: editData?.legalTerms?.nonDisclosure || true,
      nonCompete: editData?.legalTerms?.nonCompete || false,
      governingLaw: editData?.legalTerms?.governingLaw || "Maharashtra",
      disputeResolution: editData?.legalTerms?.disputeResolution || "arbitration",
    },
    
    paymentTerms: {
      billingCycle: editData?.paymentTerms?.billingCycle || "monthly",
      paymentDue: editData?.paymentTerms?.paymentDue || "30", // days after invoice
      latePaymentFee: editData?.paymentTerms?.latePaymentFee || "18", // percentage per annum
      invoiceMethod: editData?.paymentTerms?.invoiceMethod || "email",
      paymentMethod: editData?.paymentTerms?.paymentMethod || "bankTransfer",
    },
    
    // Agreement signatories
    companySignatory: editData?.companySignatory || "",
    companySignatoryDesignation: editData?.companySignatoryDesignation || "",
    clientSignatory: editData?.clientSignatory || "",
    clientSignatoryDesignation: editData?.clientSignatoryDesignation || "",
    
    // Document uploads
    documentUrl: editData?.documentUrl || "",
    signedDocumentUrl: editData?.signedDocumentUrl || "",
    
    // Additional info
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

  // Calculate 1-year validity period from signed date
  const calculateValidUntil = (signedDate: string) => {
    if (!signedDate) return '';
    
    const date = new Date(signedDate);
    const contractDuration = parseInt(formData.legalTerms.contractDuration, 10) || 12;
    date.setMonth(date.getMonth() + contractDuration);
    return date.toISOString().split('T')[0];
  };

  // Handle date change and auto-calculate validity
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'signedOn') {
      const validUntil = calculateValidUntil(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        validUntil
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle file upload
  const handleFileUpload = (fieldName: string) => {
    toast({
      title: "Document Upload",
      description: "Document upload functionality would be integrated with server storage.",
    });
    
    // Simulate a successful upload
    setFormData(prev => ({
      ...prev,
      [fieldName]: `agreement_${fieldName === 'documentUrl' ? 'draft' : 'signed'}_${formData.id}.pdf`
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.clientName || !formData.quotationRef) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Format the value with rupee sign
    const formattedData = {
      ...formData,
      value: formData.value ? `₹${formData.value}` : "",
    };
    
    // Submit the form
    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Agreement" : "Create New Agreement"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="services">Services & Scope</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="terms">Terms & Signing</TabsTrigger>
            </TabsList>
            
            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Agreement ID</Label>
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
                      <SelectItem value="Signed">Signed</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input 
                    id="clientName" 
                    name="clientName" 
                    value={formData.clientName} 
                    onChange={handleChange} 
                    placeholder="Enter client name" 
                    required 
                  />
                </div>
                
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input 
                    id="clientPhone" 
                    name="clientPhone" 
                    value={formData.clientPhone} 
                    onChange={handleChange} 
                    placeholder="Enter client phone" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input 
                    id="clientEmail" 
                    name="clientEmail" 
                    type="email"
                    value={formData.clientEmail} 
                    onChange={handleChange} 
                    placeholder="Enter client email" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotationRef">Quotation Reference *</Label>
                  <Input 
                    id="quotationRef" 
                    name="quotationRef" 
                    value={formData.quotationRef} 
                    onChange={handleChange} 
                    placeholder="Enter quotation reference" 
                    required 
                  />
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signedOn">Signed On</Label>
                  <Input 
                    id="signedOn" 
                    name="signedOn" 
                    type="date" 
                    value={formData.signedOn} 
                    onChange={handleDateChange} 
                  />
                </div>
                
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
              </div>
            </TabsContent>
            
            {/* Services & Scope Tab */}
            <TabsContent value="services" className="space-y-4">
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Security Services Scope</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="securityGuards" 
                      checked={formData.serviceScope.securityGuards}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("serviceScope", "securityGuards", checked === true)
                      }
                    />
                    <Label htmlFor="securityGuards">Security Guards</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="armedGuards" 
                      checked={formData.serviceScope.armedGuards}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("serviceScope", "armedGuards", checked === true)
                      }
                    />
                    <Label htmlFor="armedGuards">Armed Guards</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="supervisors" 
                      checked={formData.serviceScope.supervisors}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("serviceScope", "supervisors", checked === true)
                      }
                    />
                    <Label htmlFor="supervisors">Supervisors</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="patrolServices" 
                      checked={formData.serviceScope.patrolServices}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("serviceScope", "patrolServices", checked === true)
                      }
                    />
                    <Label htmlFor="patrolServices">Patrol Services</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="personalSecurityOfficers" 
                      checked={formData.serviceScope.personalSecurityOfficers}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("serviceScope", "personalSecurityOfficers", checked === true)
                      }
                    />
                    <Label htmlFor="personalSecurityOfficers">Personal Security Officers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="eventSecurity" 
                      checked={formData.serviceScope.eventSecurity}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("serviceScope", "eventSecurity", checked === true)
                      }
                    />
                    <Label htmlFor="eventSecurity">Event Security</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceLocations">Service Locations</Label>
                <Textarea 
                  id="serviceLocations" 
                  name="serviceLocations" 
                  value={formData.serviceLocations} 
                  onChange={handleChange} 
                  placeholder="Specify service locations covered by this agreement" 
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleChange} 
                  placeholder="Additional notes" 
                  rows={2} 
                />
              </div>
            </TabsContent>
            
            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4">
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">PSARA Compliance</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="psaraLicenseNumber">PSARA License Number</Label>
                    <Input 
                      id="psaraLicenseNumber" 
                      value={formData.complianceInfo.psaraLicenseNumber} 
                      onChange={(e) => 
                        handleNestedChange("complianceInfo", "psaraLicenseNumber", e.target.value)
                      }
                      placeholder="Enter PSARA license number" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="psaraExpiryDate">PSARA License Expiry</Label>
                    <Input 
                      id="psaraExpiryDate" 
                      type="date"
                      value={formData.complianceInfo.psaraExpiryDate} 
                      onChange={(e) => 
                        handleNestedChange("complianceInfo", "psaraExpiryDate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-3">
                <h3 className="font-medium">Labour Law Compliance</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="minWageCompliance" 
                      checked={formData.complianceInfo.minWageCompliance}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("complianceInfo", "minWageCompliance", checked === true)
                      }
                    />
                    <Label htmlFor="minWageCompliance">Minimum Wages Act</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="workersCompensation" 
                      checked={formData.complianceInfo.workersCompensation}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("complianceInfo", "workersCompensation", checked === true)
                      }
                    />
                    <Label htmlFor="workersCompensation">Workers Compensation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="epfCompliance" 
                      checked={formData.complianceInfo.epfCompliance}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("complianceInfo", "epfCompliance", checked === true)
                      }
                    />
                    <Label htmlFor="epfCompliance">EPF Compliance</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="esiCompliance" 
                      checked={formData.complianceInfo.esiCompliance}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("complianceInfo", "esiCompliance", checked === true)
                      }
                    />
                    <Label htmlFor="esiCompliance">ESI Compliance</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gstNumber">Client GST Number</Label>
                <Input 
                  id="gstNumber" 
                  value={formData.complianceInfo.gstNumber} 
                  onChange={(e) => 
                    handleNestedChange("complianceInfo", "gstNumber", e.target.value)
                  }
                  placeholder="Enter client GST number" 
                />
              </div>
            </TabsContent>
            
            {/* Terms & Signing Tab */}
            <TabsContent value="terms" className="space-y-4">
              {/* Legal Terms */}
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Legal Terms</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractDuration">Contract Duration (months)</Label>
                    <Select 
                      value={formData.legalTerms.contractDuration} 
                      onValueChange={(value) => 
                        handleNestedChange("legalTerms", "contractDuration", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="terminationNotice">Termination Notice (days)</Label>
                    <Select 
                      value={formData.legalTerms.terminationNotice} 
                      onValueChange={(value) => 
                        handleNestedChange("legalTerms", "terminationNotice", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select notice period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="governingLaw">Governing Law (State)</Label>
                    <Input 
                      id="governingLaw" 
                      value={formData.legalTerms.governingLaw} 
                      onChange={(e) => 
                        handleNestedChange("legalTerms", "governingLaw", e.target.value)
                      }
                      placeholder="Enter governing state law" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="disputeResolution">Dispute Resolution</Label>
                    <Select 
                      value={formData.legalTerms.disputeResolution} 
                      onValueChange={(value) => 
                        handleNestedChange("legalTerms", "disputeResolution", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select resolution method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arbitration">Arbitration</SelectItem>
                        <SelectItem value="mediation">Mediation</SelectItem>
                        <SelectItem value="court">Court</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="automaticRenewal" 
                      checked={formData.legalTerms.automaticRenewal}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("legalTerms", "automaticRenewal", checked === true)
                      }
                    />
                    <Label htmlFor="automaticRenewal">Automatic Renewal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="nonCompete" 
                      checked={formData.legalTerms.nonCompete}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("legalTerms", "nonCompete", checked === true)
                      }
                    />
                    <Label htmlFor="nonCompete">Non-Compete Clause</Label>
                  </div>
                </div>
              </div>
              
              {/* Payment Terms */}
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Payment Terms</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <Select 
                      value={formData.paymentTerms.billingCycle} 
                      onValueChange={(value) => 
                        handleNestedChange("paymentTerms", "billingCycle", value)
                      }
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
                    <Label htmlFor="paymentDue">Payment Due (days)</Label>
                    <Select 
                      value={formData.paymentTerms.paymentDue} 
                      onValueChange={(value) => 
                        handleNestedChange("paymentTerms", "paymentDue", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment due period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="45">45 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
                  <Select 
                    value={formData.paymentTerms.paymentMethod} 
                    onValueChange={(value) => 
                      handleNestedChange("paymentTerms", "paymentMethod", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Document Signatories */}
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Agreement Signatories</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companySignatory">Company Signatory</Label>
                    <Input 
                      id="companySignatory" 
                      name="companySignatory" 
                      value={formData.companySignatory} 
                      onChange={handleChange} 
                      placeholder="Name of company signatory" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companySignatoryDesignation">Designation</Label>
                    <Input 
                      id="companySignatoryDesignation" 
                      name="companySignatoryDesignation" 
                      value={formData.companySignatoryDesignation} 
                      onChange={handleChange} 
                      placeholder="Designation of company signatory" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientSignatory">Client Signatory</Label>
                    <Input 
                      id="clientSignatory" 
                      name="clientSignatory" 
                      value={formData.clientSignatory} 
                      onChange={handleChange} 
                      placeholder="Name of client signatory" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientSignatoryDesignation">Designation</Label>
                    <Input 
                      id="clientSignatoryDesignation" 
                      name="clientSignatoryDesignation" 
                      value={formData.clientSignatoryDesignation} 
                      onChange={handleChange} 
                      placeholder="Designation of client signatory" 
                    />
                  </div>
                </div>
              </div>
              
              {/* Document Uploads */}
              <div className="space-y-2">
                <Label htmlFor="documentUpload">Draft Agreement Document</Label>
                <div className="flex gap-2">
                  <Input 
                    id="documentUpload" 
                    type="file" 
                    className="cursor-pointer flex-1" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleFileUpload('documentUrl')}
                  >
                    Upload
                  </Button>
                </div>
                {formData.documentUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    Document uploaded: {formData.documentUrl}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signedDocumentUpload">Signed Agreement</Label>
                <div className="flex gap-2">
                  <Input 
                    id="signedDocumentUpload" 
                    type="file" 
                    className="cursor-pointer flex-1" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleFileUpload('signedDocumentUrl')}
                  >
                    Upload
                  </Button>
                </div>
                {formData.signedDocumentUrl && (
                  <p className="text-xs text-green-600 mt-1">
                    Document uploaded: {formData.signedDocumentUrl}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-safend-red hover:bg-red-700">
              {editData ? "Update Agreement" : "Create Agreement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
