import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Briefcase, 
  CalendarRange,
  BookUser
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Employee } from "../EmployeeDirectory";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: any) => void;
  employee: Employee | null;
}

export function EmployeeForm({ isOpen, onClose, onSave, employee }: EmployeeFormProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    // Personal details
    name: "",
    email: "",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    maritalStatus: "single",
    bloodGroup: "",
    nationality: "Indian",
    
    // Employment details  
    employeeId: "",
    department: "Operations",
    designation: "Security Officer",
    joinDate: "",
    employmentType: "Full-Time",
    reportingManager: "",
    workLocation: "",
    status: "Active",
    
    // Address details
    currentAddress: "",
    permanentAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    
    // Bank details
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    panNumber: "",
    aadharNumber: "",
    
    // Physical attributes
    height: "",
    weight: "",
    identificationMarks: "",
    
    // Emergency contact
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: ""
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        ...formData,
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phoneNumber || "",
        employeeId: employee.id || "",
        department: employee.department || "Operations",
        designation: employee.designation || "Security Officer",
        joinDate: employee.joinDate || "",
        status: employee.status || "Active",
      });
    } else {
      // Generate a new employee ID for new employees
      const newEmployeeId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        ...formData,
        employeeId: newEmployeeId,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [employee]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-red-600" />
            {employee ? "Edit Employee" : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {employee ? "Update employee information in the system" : "Create a new employee record with complete details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-1">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6 border-b">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <TabsTrigger value="personal" className="flex gap-2 items-center">
                    <User className="h-4 w-4" />
                    <span>Personal</span>
                  </TabsTrigger>
                  <TabsTrigger value="employment" className="flex gap-2 items-center">
                    <Briefcase className="h-4 w-4" />
                    <span>Employment</span>
                  </TabsTrigger>
                  <TabsTrigger value="address" className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4" />
                    <span>Address</span>
                  </TabsTrigger>
                  <TabsTrigger value="banking" className="flex gap-2 items-center">
                    <CreditCard className="h-4 w-4" />
                    <span>Banking</span>
                  </TabsTrigger>
                  <TabsTrigger value="other" className="flex gap-2 items-center">
                    <BookUser className="h-4 w-4" />
                    <span>Other</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[500px]">
                <div className="p-6">
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="example@company.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select 
                          value={formData.bloodGroup} 
                          onValueChange={(value) => handleChange("bloodGroup", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select 
                          value={formData.maritalStatus} 
                          onValueChange={(value) => handleChange("maritalStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => handleChange("nationality", e.target.value)}
                          placeholder="Enter nationality"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Employment Details Tab */}
                  <TabsContent value="employment" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID *</Label>
                        <Input
                          id="employeeId"
                          value={formData.employeeId}
                          onChange={(e) => handleChange("employeeId", e.target.value)}
                          placeholder="e.g., EMP0001"
                          required
                          disabled={!!employee}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="joinDate">Date of Joining *</Label>
                        <Input
                          id="joinDate"
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => handleChange("joinDate", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select 
                          value={formData.department} 
                          onValueChange={(value) => handleChange("department", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="HR">Human Resources</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation *</Label>
                        <Select 
                          value={formData.designation} 
                          onValueChange={(value) => handleChange("designation", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Security Officer">Security Officer</SelectItem>
                            <SelectItem value="Security Supervisor">Security Supervisor</SelectItem>
                            <SelectItem value="HR Manager">HR Manager</SelectItem>
                            <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                            <SelectItem value="Branch Manager">Branch Manager</SelectItem>
                            <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employmentType">Employment Type</Label>
                        <Select 
                          value={formData.employmentType} 
                          onValueChange={(value) => handleChange("employmentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-Time">Full-Time</SelectItem>
                            <SelectItem value="Part-Time">Part-Time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Temporary">Temporary</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reportingManager">Reporting Manager</Label>
                        <Input
                          id="reportingManager"
                          value={formData.reportingManager}
                          onChange={(e) => handleChange("reportingManager", e.target.value)}
                          placeholder="Enter manager name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="workLocation">Work Location</Label>
                        <Input
                          id="workLocation"
                          value={formData.workLocation}
                          onChange={(e) => handleChange("workLocation", e.target.value)}
                          placeholder="Enter work location"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => handleChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Address Tab */}
                  <TabsContent value="address" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentAddress">Current Address</Label>
                        <Textarea
                          id="currentAddress"
                          value={formData.currentAddress}
                          onChange={(e) => handleChange("currentAddress", e.target.value)}
                          placeholder="Enter current address"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="permanentAddress">Permanent Address</Label>
                        <Textarea
                          id="permanentAddress"
                          value={formData.permanentAddress}
                          onChange={(e) => handleChange("permanentAddress", e.target.value)}
                          placeholder="Enter permanent address"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Enter city"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleChange("state", e.target.value)}
                            placeholder="Enter state"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => handleChange("postalCode", e.target.value)}
                            placeholder="Enter postal code"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Banking & Finance Tab */}
                  <TabsContent value="banking" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Holder Name</Label>
                        <Input
                          id="accountName"
                          value={formData.accountName}
                          onChange={(e) => handleChange("accountName", e.target.value)}
                          placeholder="Enter account holder name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleChange("accountNumber", e.target.value)}
                          placeholder="Enter account number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={formData.bankName}
                          onChange={(e) => handleChange("bankName", e.target.value)}
                          placeholder="Enter bank name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branchName">Branch Name</Label>
                        <Input
                          id="branchName"
                          value={formData.branchName}
                          onChange={(e) => handleChange("branchName", e.target.value)}
                          placeholder="Enter branch name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          value={formData.ifscCode}
                          onChange={(e) => handleChange("ifscCode", e.target.value)}
                          placeholder="Enter IFSC code"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input
                          id="panNumber"
                          value={formData.panNumber}
                          onChange={(e) => handleChange("panNumber", e.target.value)}
                          placeholder="Enter PAN number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aadharNumber">Aadhar Number</Label>
                        <Input
                          id="aadharNumber"
                          value={formData.aadharNumber}
                          onChange={(e) => handleChange("aadharNumber", e.target.value)}
                          placeholder="Enter Aadhar number"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Other Details Tab */}
                  <TabsContent value="other" className="space-y-4 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Physical Attributes */}
                      <div className="space-y-3 col-span-2">
                        <h3 className="font-semibold text-sm">Physical Attributes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                              id="height"
                              value={formData.height}
                              onChange={(e) => handleChange("height", e.target.value)}
                              placeholder="Enter height in cm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              value={formData.weight}
                              onChange={(e) => handleChange("weight", e.target.value)}
                              placeholder="Enter weight in kg"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="identificationMarks">Identification Marks</Label>
                          <Textarea
                            id="identificationMarks"
                            value={formData.identificationMarks}
                            onChange={(e) => handleChange("identificationMarks", e.target.value)}
                            placeholder="Enter any identification marks"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-3 col-span-2">
                        <h3 className="font-semibold text-sm">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Name</Label>
                            <Input
                              id="emergencyContactName"
                              value={formData.emergencyContactName}
                              onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                              placeholder="Enter contact name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactRelation">Relation</Label>
                            <Input
                              id="emergencyContactRelation"
                              value={formData.emergencyContactRelation}
                              onChange={(e) => handleChange("emergencyContactRelation", e.target.value)}
                              placeholder="Enter relation"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone">Phone</Label>
                            <Input
                              id="emergencyContactPhone"
                              value={formData.emergencyContactPhone}
                              onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                              placeholder="Enter contact number"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
              
              <DialogFooter className="px-6 py-4 border-t">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900"
                >
                  {employee ? "Update Employee" : "Add Employee"}
                </Button>
              </DialogFooter>
            </Tabs>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
