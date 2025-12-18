
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
import { useToast } from "@/hooks/use-toast";
import { useDataStore, SecurityPost, ManpowerRequirement, Employee } from "@/services/DataService";
import { Check, X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editData: any | null;
}

export function AttendanceForm({ isOpen, onClose, onSubmit, editData }: AttendanceFormProps) {
  const { toast } = useToast();
  const securityPosts = useDataStore(state => state.securityPosts);
  const manpowerRequirements = useDataStore(state => state.manpowerRequirements);
  const employees = useDataStore(state => state.employees);
  
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    postId: "",
    shift: "",
    requirementId: "",
    selectedEmployees: [] as {
      employeeId: string;
      employeeName: string;
      status: 'Present' | 'Absent' | 'Half Day';
      checkInTime: string;
      checkOutTime: string;
      remarks: string;
    }[]
  });
  
  // Populate form if editing an existing record
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        date: editData.date || new Date().toISOString().split('T')[0],
        postId: editData.postId || "",
        shift: editData.shift || "",
        requirementId: editData.requirementId || "",
        selectedEmployees: editData.selectedEmployees || []
      });
    } else {
      // Reset form for new record
      setFormData({
        id: `ATT${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        postId: "",
        shift: "",
        requirementId: "",
        selectedEmployees: []
      });
    }
  }, [editData]);
  
  // Get filtered requirements based on selected post and shift
  const getFilteredRequirements = () => {
    return manpowerRequirements.filter(
      req => req.postId === formData.postId && 
      (formData.shift ? req.shift === formData.shift : true)
    );
  };
  
  // Get shifts available for the selected post
  const getAvailableShifts = () => {
    if (!formData.postId) return [];
    
    const shifts = manpowerRequirements
      .filter(req => req.postId === formData.postId)
      .map(req => req.shift);
      
    return [...new Set(shifts)];
  };
  
  // Get requirement details
  const getRequirementDetails = () => {
    if (!formData.requirementId) return null;
    return manpowerRequirements.find(req => req.id === formData.requirementId);
  };
  
  // Get post details
  const getPostDetails = () => {
    if (!formData.postId) return null;
    return securityPosts.find(post => post.id === formData.postId);
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      
      // Reset dependent fields if necessary
      if (field === 'postId') {
        newState.shift = '';
        newState.requirementId = '';
        newState.selectedEmployees = [];
      } else if (field === 'shift') {
        newState.requirementId = '';
        newState.selectedEmployees = [];
      } else if (field === 'requirementId') {
        newState.selectedEmployees = [];
      }
      
      return newState;
    });
  };
  
  // Add employee to the selected employees list
  const handleAddEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;
    
    if (formData.selectedEmployees.some(emp => emp.employeeId === employeeId)) {
      toast({
        title: "Employee already added",
        description: "This employee is already added to the attendance record.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      selectedEmployees: [
        ...prev.selectedEmployees,
        {
          employeeId,
          employeeName: employee.name,
          status: 'Present',
          checkInTime: '',
          checkOutTime: '',
          remarks: ''
        }
      ]
    }));
  };
  
  // Remove employee from the selected list
  const handleRemoveEmployee = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.filter(emp => emp.employeeId !== employeeId)
    }));
  };
  
  // Update employee attendance status
  const handleEmployeeStatusChange = (employeeId: string, status: 'Present' | 'Absent' | 'Half Day') => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.map(emp => {
        if (emp.employeeId === employeeId) {
          return { 
            ...emp, 
            status,
            checkInTime: status === 'Absent' ? '' : emp.checkInTime,
            checkOutTime: status === 'Absent' ? '' : emp.checkOutTime
          };
        }
        return emp;
      })
    }));
  };
  
  // Update employee check in/out times
  const handleEmployeeTimeChange = (employeeId: string, field: 'checkInTime' | 'checkOutTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.map(emp => {
        if (emp.employeeId === employeeId) {
          return { ...emp, [field]: value };
        }
        return emp;
      })
    }));
  };
  
  // Update employee remarks
  const handleEmployeeRemarksChange = (employeeId: string, remarks: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.map(emp => {
        if (emp.employeeId === employeeId) {
          return { ...emp, remarks };
        }
        return emp;
      })
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.date || !formData.postId || !formData.requirementId || formData.selectedEmployees.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and add at least one employee",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare data for submission
    const requirement = getRequirementDetails();
    const post = getPostDetails();
    
    if (!requirement || !post) {
      toast({
        title: "Error",
        description: "Invalid post or requirement selected",
        variant: "destructive",
      });
      return;
    }
    
    // Submit attendance records for each employee
    const attendanceRecords = formData.selectedEmployees.map((emp, index) => ({
      id: `${formData.id}-${index + 1}`,
      employeeId: emp.employeeId,
      postId: formData.postId,
      requirementId: formData.requirementId,
      date: formData.date,
      status: emp.status,
      checkInTime: emp.checkInTime,
      checkOutTime: emp.checkOutTime,
      remarks: emp.remarks
    }));
    
    // Submit the form
    onSubmit({
      id: formData.id,
      date: formData.date,
      postId: formData.postId,
      postName: post.name,
      shift: requirement.shift,
      role: requirement.role,
      attendanceRecords
    });
  };

  // Get status badge for employee
  const getStatusBadge = (status: 'Present' | 'Absent' | 'Half Day') => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'Absent':
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      case 'Half Day':
        return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Attendance Record" : "Record New Attendance"}</DialogTitle>
          <DialogDescription>
            {editData ? "Update the attendance details below." : "Enter staff attendance details for tracking."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date*</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date} 
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postId">Security Post*</Label>
              <Select 
                value={formData.postId} 
                onValueChange={(value) => handleChange("postId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Post" />
                </SelectTrigger>
                <SelectContent>
                  {securityPosts.map(post => (
                    <SelectItem key={post.id} value={post.id}>{post.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {formData.postId && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift">Shift*</Label>
                <Select 
                  value={formData.shift} 
                  onValueChange={(value) => handleChange("shift", value)}
                  disabled={!formData.postId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableShifts().map(shift => (
                      <SelectItem key={shift} value={shift}>{shift} Shift</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.shift && (
                <div className="space-y-2">
                  <Label htmlFor="requirementId">Staff Requirement*</Label>
                  <Select 
                    value={formData.requirementId} 
                    onValueChange={(value) => handleChange("requirementId", value)}
                    disabled={!formData.shift}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredRequirements().map(req => (
                        <SelectItem key={req.id} value={req.id}>
                          {req.count} x {req.role} ({req.hours} hrs)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          {formData.requirementId && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Employees</Label>
                <Select 
                  onValueChange={handleAddEmployee}
                  disabled={!formData.requirementId}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border rounded-md p-2 space-y-4">
                {formData.selectedEmployees.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-gray-500">
                    <Users className="h-5 w-5 mr-2" /> No employees added yet
                  </div>
                ) : (
                  formData.selectedEmployees.map((emp, index) => (
                    <div key={emp.employeeId} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{emp.employeeName}</div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(emp.status)}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-red-500"
                            onClick={() => handleRemoveEmployee(emp.employeeId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <Button 
                          type="button"
                          variant={emp.status === 'Present' ? 'default' : 'outline'} 
                          size="sm"
                          className={emp.status === 'Present' ? 'bg-green-500 hover:bg-green-600' : ''}
                          onClick={() => handleEmployeeStatusChange(emp.employeeId, 'Present')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Present
                        </Button>
                        <Button 
                          type="button"
                          variant={emp.status === 'Absent' ? 'default' : 'outline'}
                          size="sm"
                          className={emp.status === 'Absent' ? 'bg-red-500 hover:bg-red-600' : ''}
                          onClick={() => handleEmployeeStatusChange(emp.employeeId, 'Absent')}
                        >
                          <X className="h-4 w-4 mr-1" /> Absent
                        </Button>
                        <Button 
                          type="button"
                          variant={emp.status === 'Half Day' ? 'default' : 'outline'}
                          size="sm"
                          className={emp.status === 'Half Day' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                          onClick={() => handleEmployeeStatusChange(emp.employeeId, 'Half Day')}
                        >
                          Half Day
                        </Button>
                      </div>
                      
                      {emp.status !== 'Absent' && (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <Label htmlFor={`checkIn-${emp.employeeId}`} className="text-xs">Check In</Label>
                            <Input 
                              id={`checkIn-${emp.employeeId}`}
                              type="time"
                              value={emp.checkInTime}
                              onChange={(e) => handleEmployeeTimeChange(emp.employeeId, 'checkInTime', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`checkOut-${emp.employeeId}`} className="text-xs">Check Out</Label>
                            <Input 
                              id={`checkOut-${emp.employeeId}`}
                              type="time"
                              value={emp.checkOutTime}
                              onChange={(e) => handleEmployeeTimeChange(emp.employeeId, 'checkOutTime', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor={`remarks-${emp.employeeId}`} className="text-xs">Remarks</Label>
                        <Textarea 
                          id={`remarks-${emp.employeeId}`}
                          placeholder="Add any remarks"
                          value={emp.remarks}
                          onChange={(e) => handleEmployeeRemarksChange(emp.employeeId, e.target.value)}
                          className="h-10 resize-none"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editData ? "Update Attendance" : "Submit Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
