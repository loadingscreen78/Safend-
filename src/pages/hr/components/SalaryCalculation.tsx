import { useState, useEffect } from "react";
import { 
  SalaryCalculationProps, Employee, SalaryStructure, SalaryData, 
  SalaryAdjustment, EmployeeSalaryDetailUI, SalaryDeductionUI 
} from "./index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SalaryHeader } from "./salary/SalaryHeader";
import { SalaryTabContent } from "./salary/SalaryTabContent";
import { StatutoryTabContent } from "./salary/StatutoryTabContent";
import { AdjustmentsTabContent } from "./salary/AdjustmentsTabContent";
import { AdjustmentDialog } from "./salary/AdjustmentDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockAssignments } from "@/data/mockAssignments";
import { createSalaryPaymentRequest, calculateSalary } from "@/services/PayrollService";
import { AlertCircle, Calendar, CheckCircle, FileText, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock employees data
const employees = [
  {
    id: "EMP0001",
    name: "John Smith",
    email: "john.smith@safend.com",
    department: "Operations",
    designation: "Security Supervisor",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0002",
    name: "Sarah Johnson",
    email: "sarah.johnson@safend.com",
    department: "Operations",
    designation: "Security Officer",
    status: "Active",
    joinDate: "2023-03-10",
    avatar: "/placeholder.svg",
  },
  // ... other employees
];

// Mock salary data with statutory calculations
const mockSalaryData = [
  {
    id: "EMP0001",
    name: "John Smith",
    designation: "Security Supervisor",
    shifts: 26,
    dutyEarnings: 25000,
    baseSalary: 18000,
    basic: 10800, // 60% of base
    hra: 5400, // 30% of base
    otherAllowances: 1800, // 10% of base
    totalAllowances: 2000, // Additional allowances
    pfDeduction: 1800, // 12% of basic + DA
    esiDeduction: 585, // 3.25% of gross
    professionalTax: 200,
    tdsDeduction: 0,
    loanDeduction: 500,
    messCharges: 1200,
    grossSalary: 20000,
    totalDeduction: 4285,
    netSalary: 15715,
    attendedShifts: 24,
    totalShifts: 26,
    status: 'READY_TO_PAY'
  },
  {
    id: "EMP0002",
    name: "Sarah Johnson",
    designation: "Security Officer",
    shifts: 26,
    dutyEarnings: 20000,
    baseSalary: 15000,
    basic: 9000, // 60% of base
    hra: 4500, // 30% of base
    otherAllowances: 1500, // 10% of base
    totalAllowances: 1000, // Additional allowances
    pfDeduction: 1080, // 12% of basic + DA
    esiDeduction: 487, // 3.25% of gross
    professionalTax: 200,
    tdsDeduction: 0,
    loanDeduction: 0,
    messCharges: 1000,
    grossSalary: 16000,
    totalDeduction: 2767,
    netSalary: 13233,
    attendedShifts: 22,
    totalShifts: 26,
    status: 'READY_TO_PAY'
  },
  // ... other salary data
];

// Mock salary adjustments
const mockAdjustments: SalaryAdjustment[] = [
  {
    id: "ADJ001",
    employeeId: "EMP0001",
    type: "Allowance",
    description: "Night Shift Allowance",
    amount: 1000,
    appliedDate: "2025-05-01"
  },
  {
    id: "ADJ002",
    employeeId: "EMP0002",
    type: "Deduction",
    description: "Advance Recovery",
    amount: -2000,
    appliedDate: "2025-05-01"
  },
];

export function SalaryCalculation({ filter }: SalaryCalculationProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [salaryData, setSalaryData] = useState(mockSalaryData);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("salaries");
  const [adjustments, setAdjustments] = useState<SalaryAdjustment[]>(mockAdjustments);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [isHoldSalaryDialogOpen, setIsHoldSalaryDialogOpen] = useState(false);
  const [isPaymentRequestDialogOpen, setIsPaymentRequestDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [holdReason, setHoldReason] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [requestDescription, setRequestDescription] = useState("");
  
  const [adjustmentFormData, setAdjustmentFormData] = useState<{
    employeeId: string;
    type: "Allowance" | "Deduction";
    description: string;
    amount: number;
  }>({
    employeeId: "",
    type: "Allowance",
    description: "",
    amount: 0
  });
  
  const { toast } = useToast();
  
  // Filter salary data based on filter prop
  const filteredSalaryData = filter === "All Salaries" 
    ? salaryData 
    : salaryData.filter(item => {
        if (filter === "Pending") return !item.status || item.status === 'READY_TO_PAY';
        if (filter === "Processed") return item.status === 'PAID';
        if (filter === "Held") return item.status === 'HELD';
        return true;
      });
  
  // Calculate attendance statistics from mock assignments
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // For demo purposes, use mock assignments to calculate attendance
    const attendanceMap = new Map();
    
    // Group assignments by employee
    mockAssignments.forEach(assignment => {
      const empId = assignment.employeeId;
      if (!attendanceMap.has(empId)) {
        attendanceMap.set(empId, { total: 0, present: 0 });
      }
      
      const stats = attendanceMap.get(empId);
      stats.total += 1;
      
      if (assignment.attendanceStatus === 'Present') {
        stats.present += 1;
      }
    });
    
    // Update salary data with attendance info
    const updatedSalaryData = salaryData.map(salary => {
      const attendance = attendanceMap.get(salary.id) || { total: salary.shifts, present: salary.shifts };
      
      return {
        ...salary,
        attendedShifts: attendance.present,
        totalShifts: attendance.total
      };
    });
    
    setSalaryData(updatedSalaryData);
  }, []);
  
  const handleCalculateSalaries = () => {
    setIsCalculating(true);
    
    // Simulate recalculating salaries based on attendance and deductions
    setTimeout(() => {
      const recalculatedSalaries = salaryData.map(salary => {
        // Calculate pro-rated salary based on attendance
        const attendanceRatio = salary.attendedShifts! / salary.totalShifts!;
        const proRatedBaseSalary = salary.baseSalary * attendanceRatio;
        
        // Apply all deductions
        const totalDeduction = 
          salary.pfDeduction + 
          salary.esiDeduction + 
          salary.professionalTax + 
          salary.tdsDeduction + 
          (salary.loanDeduction || 0) + 
          (salary.messCharges || 0);
          
        // Calculate net salary
        const netSalary = Math.max(0, proRatedBaseSalary - totalDeduction);
        
        return {
          ...salary,
          grossSalary: Math.round(proRatedBaseSalary),
          totalDeduction,
          netSalary: Math.round(netSalary)
        };
      });
      
      setSalaryData(recalculatedSalaries);
      setIsCalculating(false);
      
      toast({
        title: "Salary Calculation Complete",
        description: `Processed ${recalculatedSalaries.length} employees for ${selectedMonth}`,
      });
    }, 1000);
  };
  
  const handleGeneratePayslip = (employeeId: string) => {
    toast({
      title: "Generating Payslip",
      description: `Payslip for ${employeeId} is being generated`,
    });
    // In a real app, this would trigger a PDF generation and download
  };
  
  const handleAddAdjustment = () => {
    setIsAdjustmentDialogOpen(true);
  };
  
  const handleSaveAdjustment = (adjustment: any) => {
    const newAdjustment: SalaryAdjustment = {
      id: `ADJ${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      employeeId: adjustment.employeeId,
      type: adjustment.type,
      description: adjustment.description,
      amount: adjustment.type === "Deduction" ? -Math.abs(adjustment.amount) : adjustment.amount,
      appliedDate: new Date().toISOString().split("T")[0]
    };
    
    setAdjustments([...adjustments, newAdjustment]);
    
    toast({
      title: "Adjustment Added",
      description: `${adjustment.type} of ₹${Math.abs(adjustment.amount)} has been added`,
    });
    setIsAdjustmentDialogOpen(false);
    setAdjustmentFormData({
      employeeId: "",
      type: "Allowance",
      description: "",
      amount: 0
    });
  };
  
  const handleRemoveAdjustment = (id: string) => {
    setAdjustments(adjustments.filter(adj => adj.id !== id));
    toast({
      title: "Adjustment Removed",
      description: "The adjustment has been removed",
    });
  };

  const handleHoldSalary = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setHoldReason("");
    setIsHoldSalaryDialogOpen(true);
  };
  
  const handleConfirmHoldSalary = () => {
    if (!holdReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for holding the salary",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSalaryData = salaryData.map(salary => {
      if (salary.id === selectedEmployeeId) {
        return {
          ...salary,
          status: 'HELD',
          holdReason
        };
      }
      return salary;
    });
    
    setSalaryData(updatedSalaryData);
    setIsHoldSalaryDialogOpen(false);
    
    toast({
      title: "Salary Hold Applied",
      description: `Salary for employee ${selectedEmployeeId} has been held`,
    });
  };
  
  const handleReleaseSalary = (employeeId: string) => {
    const updatedSalaryData = salaryData.map(salary => {
      if (salary.id === employeeId) {
        return {
          ...salary,
          status: 'READY_TO_PAY',
          holdReason: undefined
        };
      }
      return salary;
    });
    
    setSalaryData(updatedSalaryData);
    
    toast({
      title: "Salary Hold Released",
      description: `Salary for employee ${employeeId} has been released for payment`,
    });
  };
  
  const handleCreatePaymentRequest = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one employee",
        variant: "destructive"
      });
      return;
    }
    
    setIsPaymentRequestDialogOpen(true);
  };
  
  const handleSubmitPaymentRequest = () => {
    if (!requestDescription) {
      toast({
        title: "Error",
        description: "Please provide a description for the payment request",
        variant: "destructive"
      });
      return;
    }
    
    const selectedSalaries = salaryData.filter(salary => selectedEmployees.includes(salary.id));
    const totalAmount = selectedSalaries.reduce((sum, salary) => sum + salary.netSalary, 0);
    
    // Create employee salary details for the request
    const employeeDetails = selectedSalaries.map(salary => ({
      employeeId: salary.id,
      employeeName: salary.name,
      attendedShifts: salary.attendedShifts || 0,
      totalShifts: salary.totalShifts || 0,
      amount: salary.netSalary,
      status: salary.status || 'READY_TO_PAY',
      netSalary: salary.netSalary,
      deductions: [
        { type: 'PF', description: 'Provident Fund', amount: salary.pfDeduction } as SalaryDeductionUI,
        { type: 'ESI', description: 'ESI Contribution', amount: salary.esiDeduction } as SalaryDeductionUI,
        { type: 'PT', description: 'Professional Tax', amount: salary.professionalTax } as SalaryDeductionUI
      ]
    }));
    
    // If there are loan deductions, add them
    selectedSalaries.forEach((salary, index) => {
      if (salary.loanDeduction && salary.loanDeduction > 0) {
        employeeDetails[index].deductions.push({
          type: 'LOAN',
          description: 'Loan EMI',
          amount: salary.loanDeduction
        });
      }
      
      if (salary.messCharges && salary.messCharges > 0) {
        employeeDetails[index].deductions.push({
          type: 'MESS',
          description: 'Mess Charges',
          amount: salary.messCharges
        });
      }
    });
    
    // In a real app, this would call the actual API service
    // createSalaryPaymentRequest({...})
    
    // Mark selected salaries as being processed
    const updatedSalaryData = salaryData.map(salary => {
      if (selectedEmployees.includes(salary.id)) {
        return {
          ...salary,
          status: salary.status === 'HELD' ? 'HELD' : 'PAID'
        };
      }
      return salary;
    });
    
    setSalaryData(updatedSalaryData);
    setSelectedEmployees([]);
    setIsPaymentRequestDialogOpen(false);
    
    toast({
      title: "Payment Request Created",
      description: `Created payment request for ${selectedEmployees.length} employees`,
    });
  };
  
  const handleToggleSelectAllEmployees = (checked: boolean) => {
    if (checked) {
      // Only select employees that are READY_TO_PAY
      const eligibleEmployees = filteredSalaryData
        .filter(salary => salary.status === 'READY_TO_PAY' || !salary.status)
        .map(salary => salary.id);
      setSelectedEmployees(eligibleEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };
  
  const handleToggleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  return (
    <div className="space-y-6">
      <SalaryHeader
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onCalculate={handleCalculateSalaries}
        onShowAdjustmentDialog={handleAddAdjustment}
      />
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Salary calculation incorporates attendance data, loan deductions, and mess charges. 
          Select employees to create payment requests for accounts department approval.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Employee Salaries</h2>
          <p className="text-sm text-muted-foreground">
            Based on {selectedMonth} attendance and deductions
          </p>
        </div>
        
        {selectedEmployees.length > 0 && (
          <Button onClick={handleCreatePaymentRequest}>
            Create Payment Request ({selectedEmployees.length})
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="salaries">Salaries</TabsTrigger>
          <TabsTrigger value="statutory">Statutory Compliance</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="salaries" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Employee Salaries - {selectedMonth}</CardTitle>
                  <CardDescription>
                    Based on attendance data and applicable deductions
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="selectAll" 
                    onCheckedChange={handleToggleSelectAllEmployees}
                    checked={selectedEmployees.length === filteredSalaryData.filter(s => s.status !== 'HELD').length && filteredSalaryData.length > 0}
                  />
                  <Label htmlFor="selectAll">Select All</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Base Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalaryData.length > 0 ? (
                    filteredSalaryData.map((salary) => (
                      <TableRow key={salary.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedEmployees.includes(salary.id)}
                            disabled={salary.status === 'HELD'}
                            onCheckedChange={(checked) => 
                              handleToggleSelectEmployee(salary.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>{salary.id}</TableCell>
                        <TableCell>{salary.name}</TableCell>
                        <TableCell>{salary.designation}</TableCell>
                        <TableCell>
                          {salary.attendedShifts}/{salary.totalShifts} 
                          <span className="text-xs text-muted-foreground ml-2">
                            ({Math.round((salary.attendedShifts! / salary.totalShifts!) * 100)}%)
                          </span>
                        </TableCell>
                        <TableCell>₹{salary.baseSalary.toLocaleString()}</TableCell>
                        <TableCell>₹{salary.totalDeduction.toLocaleString()}</TableCell>
                        <TableCell className="font-bold">₹{salary.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          {salary.status === 'HELD' ? (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                              Held
                            </Badge>
                          ) : salary.status === 'PAID' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              Ready
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleGeneratePayslip(salary.id)}
                            >
                              <FileText className="h-4 w-4 mr-1" /> Slip
                            </Button>
                            
                            {(!salary.status || salary.status === 'READY_TO_PAY') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => handleHoldSalary(salary.id)}
                              >
                                Hold
                              </Button>
                            )}
                            
                            {salary.status === 'HELD' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-500 border-green-200 hover:bg-green-50"
                                onClick={() => handleReleaseSalary(salary.id)}
                              >
                                Release
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6">
                        No salary data available for the selected filter
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statutory" className="mt-4">
          <StatutoryTabContent 
            salaryData={filteredSalaryData} 
          />
        </TabsContent>
        
        <TabsContent value="adjustments" className="mt-4">
          <AdjustmentsTabContent 
            adjustments={adjustments}
            employees={employees}
            onRemoveAdjustment={handleRemoveAdjustment}
          />
        </TabsContent>
      </Tabs>
      
      <AdjustmentDialog
        isOpen={isAdjustmentDialogOpen}
        onClose={() => setIsAdjustmentDialogOpen(false)}
        onAdd={handleSaveAdjustment}
        employees={employees}
        formData={adjustmentFormData}
        setFormData={setAdjustmentFormData}
      />
      
      {/* Hold Salary Dialog */}
      <Dialog open={isHoldSalaryDialogOpen} onOpenChange={setIsHoldSalaryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hold Salary Payment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="holdReason">Reason for holding salary</Label>
                <Input 
                  id="holdReason" 
                  value={holdReason} 
                  onChange={(e) => setHoldReason(e.target.value)}
                  placeholder="Enter reason"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHoldSalaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmHoldSalary}
              disabled={!holdReason.trim()}
            >
              Confirm Hold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Request Dialog */}
      <Dialog open={isPaymentRequestDialogOpen} onOpenChange={setIsPaymentRequestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Salary Payment Request</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="requestDescription">Payment Request Description</Label>
              <Input 
                id="requestDescription" 
                value={requestDescription} 
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Enter payment request description"
                className="mt-1"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Selected Employees</h3>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                  {selectedEmployees.map(employeeId => {
                    const employee = salaryData.find(s => s.id === employeeId);
                    return (
                      <div key={employeeId} className="flex justify-between items-center p-2 border-b">
                        <div>
                          <p className="font-medium">{employee?.name}</p>
                          <p className="text-xs text-muted-foreground">{employee?.id} - {employee?.designation}</p>
                        </div>
                        <span className="font-bold">₹{employee?.netSalary.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Employees</p>
                  <p className="text-2xl font-bold">{selectedEmployees.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-2xl font-bold">
                    ₹{selectedEmployees.reduce((sum, id) => {
                      const salary = salaryData.find(s => s.id === id);
                      return sum + (salary?.netSalary || 0);
                    }, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleSubmitPaymentRequest}
              disabled={!requestDescription.trim()}
            >
              Create Payment Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
