
import { useState, useEffect } from "react";
import { Loan, LoanType } from "../index";
import { HR_CONFIG } from "@/config";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LoanRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loan: Omit<Loan, 'id' | 'requestedOn' | 'status'>) => void;
}

export function LoanRequestForm({ isOpen, onClose, onSubmit }: LoanRequestFormProps) {
  // Mock employee data - in a real app would come from API
  const employees = [
    { id: "E001", name: "John Smith", baseSalary: 18000 },
    { id: "E002", name: "Sarah Johnson", baseSalary: 15000 },
    { id: "E003", name: "Michael Brown", baseSalary: 20000 },
    { id: "E004", name: "Emily Wilson", baseSalary: 16000 },
    { id: "E005", name: "Daniel Lee", baseSalary: 22000 },
  ];

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    type: "ADVANCE_SALARY" as LoanType,
    principal: 0,
    emiMonths: 6,
    interestPct: 0,
    balance: 0
  });
  
  const [errors, setErrors] = useState({
    employeeId: false,
    principal: false,
    emiMonths: false
  });
  
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [employeeSalary, setEmployeeSalary] = useState(0);
  const [maxEmiMonths, setMaxEmiMonths] = useState(12);
  const [exceedsDeductionLimit, setExceedsDeductionLimit] = useState(false);
  
  // Reset form when opened/closed
  useEffect(() => {
    if (isOpen) {
      setFormData({
        employeeId: "",
        employeeName: "",
        type: "ADVANCE_SALARY",
        principal: 0,
        emiMonths: 6,
        interestPct: 0,
        balance: 0
      });
      setErrors({
        employeeId: false,
        principal: false,
        emiMonths: false
      });
    }
  }, [isOpen]);
  
  // Update max loan amount when employee or loan type changes
  useEffect(() => {
    if (formData.employeeId && formData.type) {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      if (employee) {
        setEmployeeSalary(employee.baseSalary);
        
        let max = 0;
        let maxMonths = 12;
        
        switch(formData.type) {
          case "ADVANCE_SALARY":
            max = employee.baseSalary * HR_CONFIG.LOANS.ADVANCE_SALARY.MAX_AMOUNT_MONTHS;
            maxMonths = HR_CONFIG.LOANS.ADVANCE_SALARY.MAX_EMI_MONTHS;
            break;
          case "UNIFORM_FEE":
          case "TRAINING_FEE":
            max = 15000; // Standard fee
            maxMonths = HR_CONFIG.LOANS.UNIFORM_TRAINING_FEE.DEFAULT_EMI_MONTHS;
            break;
          case "NEGATIVE_BALANCE":
            max = employee.baseSalary * 0.5; // Half month salary default
            maxMonths = 2; // Short term recovery
            break;
        }
        
        setMaxLoanAmount(max);
        setMaxEmiMonths(maxMonths);
        
        // Update principal if needed
        if (formData.principal > max) {
          setFormData(prev => ({ ...prev, principal: max }));
        }
        
        // Update EMI months if needed
        if (formData.emiMonths > maxMonths) {
          setFormData(prev => ({ ...prev, emiMonths: maxMonths }));
        }
      }
    }
  }, [formData.employeeId, formData.type]);
  
  // Check if monthly deduction exceeds legal limit (50% of wages)
  useEffect(() => {
    if (formData.principal > 0 && formData.emiMonths > 0 && employeeSalary > 0) {
      const monthlyDeduction = formData.principal / formData.emiMonths;
      const maxAllowedDeduction = employeeSalary * (HR_CONFIG.LOANS.MAX_DEDUCTION_PCT / 100);
      
      setExceedsDeductionLimit(monthlyDeduction > maxAllowedDeduction);
    } else {
      setExceedsDeductionLimit(false);
    }
  }, [formData.principal, formData.emiMonths, employeeSalary]);
  
  const handleSelectEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setFormData(prev => ({ 
        ...prev, 
        employeeId: id,
        employeeName: employee.name
      }));
      setErrors(prev => ({ ...prev, employeeId: false }));
    }
  };
  
  const handleTypeChange = (type: LoanType) => {
    setFormData(prev => ({ ...prev, type }));
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const clampedValue = Math.min(value, maxLoanAmount);
    
    setFormData(prev => ({ 
      ...prev, 
      principal: clampedValue,
      balance: clampedValue
    }));
    
    setErrors(prev => ({ ...prev, principal: false }));
  };
  
  const handleEmiMonthsChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, emiMonths: value[0] }));
    setErrors(prev => ({ ...prev, emiMonths: false }));
  };
  
  const handleSubmit = () => {
    // Validate form
    const newErrors = {
      employeeId: formData.employeeId === "",
      principal: formData.principal <= 0,
      emiMonths: formData.emiMonths <= 0
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error) || exceedsDeductionLimit) {
      return;
    }
    
    onSubmit({
      ...formData,
      balance: formData.principal
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request New Loan</DialogTitle>
          <DialogDescription>
            Create a new loan request for an employee.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={formData.employeeId}
              onValueChange={handleSelectEmployee}
            >
              <SelectTrigger id="employee" className={errors.employeeId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - ₹{employee.baseSalary.toLocaleString()}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-sm text-red-500">Please select an employee</p>
            )}
          </div>
          
          <div className="grid items-center gap-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange as (value: string) => void}
            >
              <SelectTrigger id="loanType">
                <SelectValue placeholder="Select Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADVANCE_SALARY">Salary Advance</SelectItem>
                <SelectItem value="UNIFORM_FEE">Uniform Fee</SelectItem>
                <SelectItem value="TRAINING_FEE">Training Fee</SelectItem>
                <SelectItem value="NEGATIVE_BALANCE">Negative Salary Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid items-center gap-2">
            <Label htmlFor="amount">
              Loan Amount (Max: ₹{maxLoanAmount.toLocaleString()})
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.principal || ''}
              onChange={handleAmountChange}
              className={errors.principal ? "border-red-500" : ""}
              max={maxLoanAmount}
              min={0}
            />
            {errors.principal && (
              <p className="text-sm text-red-500">Please enter a valid amount</p>
            )}
          </div>
          
          <div className="grid items-center gap-4">
            <div className="flex justify-between">
              <Label htmlFor="emiMonths">EMI Months: {formData.emiMonths}</Label>
              <span className="text-sm text-muted-foreground">
                Monthly: ₹{formData.principal > 0 ? Math.round(formData.principal / formData.emiMonths).toLocaleString() : 0}
              </span>
            </div>
            <Slider
              id="emiMonths"
              value={[formData.emiMonths]}
              min={1}
              max={maxEmiMonths}
              step={1}
              onValueChange={handleEmiMonthsChange}
            />
          </div>
          
          {exceedsDeductionLimit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Deduction Limit Exceeded</AlertTitle>
              <AlertDescription>
                Monthly deduction exceeds 50% of salary (Payment of Wages Act). Please reduce amount or increase EMI months.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={exceedsDeductionLimit}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
