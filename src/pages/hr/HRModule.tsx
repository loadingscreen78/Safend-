
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModuleHeader } from "@/components/ui/module-header";
import { ModuleCard } from "@/components/ui/module-card";
import { StatCard } from "@/components/ui/stat-card";
import { 
  Users, Calendar, BookOpen, DollarSign, 
  BarChart2, ClipboardCheck, LayoutDashboard, CircleDollarSign,
  FileUp
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Import HR components
import { EmployeeDirectory } from "./components/EmployeeDirectory";
import { LeaveManagement } from "./components/LeaveManagement";
import { TrainingModule } from "./components/TrainingModule";
import { PayrollManagement } from "./components/PayrollManagement";
import { SalaryCalculation } from "./components/SalaryCalculation";
import { ComplianceDashboard } from "./components/ComplianceDashboard";
import { HRReports } from "./components/HRReports";
import { LoanCentre } from "./components/loans/LoanCentre";
import { 
  EmployeeDirectoryProps, LeaveManagementProps,
  TrainingModuleProps, PayrollManagementProps,
  SalaryCalculationProps, ComplianceDashboardProps, HRReportsProps,
  LoanCentreProps
} from "./components";

// Define hrTabs with consolidated tabs (removed leave-dashboard)
const hrTabs = [
  { id: "employees", label: "Employees", icon: Users },
  { id: "leave", label: "Leave", icon: Calendar },
  { id: "training", label: "Training", icon: BookOpen },
  { id: "payroll", label: "Payroll", icon: DollarSign },
  { id: "compliance", label: "Compliance", icon: ClipboardCheck },
  { id: "loans", label: "Loans", icon: CircleDollarSign },
  { id: "salary", label: "Salary", icon: DollarSign },
  { id: "reports", label: "Reports", icon: BarChart2 }
];

// Filter options for each tab - merged leave and leave-dashboard filters
const filterOptions = {
  "employees": ["All Employees", "Active", "On Leave", "Terminated", "Contractors"],
  "leave": ["All", "Pending", "Approved", "Rejected", "Uninformed", "Abscond", "Resolved"],
  "training": ["All Training", "Upcoming", "Ongoing", "Completed", "Mandatory"],
  "payroll": ["All Payroll", "Processing", "Completed", "Holds", "Advances"],
  "salary": ["All Salaries", "Pending", "Processed", "Adjustments"],
  "compliance": ["All Compliance", "Due", "Completed", "Overdue", "At Risk"],
  "loans": ["All Loans", "Active", "Requested", "Closed"],
  "reports": ["Performance", "Attendance", "Turnover", "Cost Analysis", "Demographics"]
};

export function HRModule() {
  const [activeTab, setActiveTab] = useState("employees");
  const [activeFilter, setActiveFilter] = useState("All Employees");
  const { toast } = useToast();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveFilter(filterOptions[value as keyof typeof filterOptions][0]);
    
    toast({
      title: `Viewing ${value.charAt(0).toUpperCase() + value.slice(1)}`,
      description: `Switched to ${value} tab`,
      duration: 2000,
    });
  };
  
  const getActionButton = () => {
    switch (activeTab) {
      case "employees":
        return {
          label: "Add Employee",
          icon: <Users className="mr-2 h-4 w-4" />,
          action: () => console.log("Add employee")
        };
      case "loans":
        return {
          label: "New Loan",
          icon: <CircleDollarSign className="mr-2 h-4 w-4" />,
          action: () => console.log("Request loan")
        };
      case "compliance":
        return {
          label: "Add Filing",
          icon: <FileUp className="mr-2 h-4 w-4" />,
          action: () => console.log("Add compliance filing")
        };
      default:
        return null;
    }
  };

  const actionButton = getActionButton();

  return (
    <Layout>
      <motion.div
        className="space-y-6 page-transition"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ModuleHeader 
          title="Human Resources"
          description="Manage employees, training, payroll and compliance"
          actionLabel={actionButton?.label}
          actionIcon={actionButton?.icon}
          onAction={actionButton?.action}
        />
        
        <ModuleCard>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="overflow-x-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-1 w-full md:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {hrTabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id} 
                      className={`flex gap-2 items-center transition-all duration-200 ${
                        activeTab === tab.id 
                          ? "bg-gradient-to-r from-red-600 to-black text-white" 
                          : ""
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
            
            <div className="p-6">
              {/* Employee Directory Tab */}
              <TabsContent value="employees" className="space-y-6 animate-in fade-in-50">
                <div className="module-info-banner">
                  <h3 className="text-lg font-medium mb-2">Employee Directory</h3>
                  <p className="text-muted-foreground">
                    Manage your complete employee database and personnel information.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 stagger-children">
                  <StatCard 
                    title="Total Employees" 
                    value="138" 
                    borderColor="stat-border-black" 
                    textColor="stat-text-black"
                  />
                  <StatCard 
                    title="Full-Time" 
                    value="112" 
                    borderColor="stat-border-gray" 
                    textColor="stat-text-gray"
                  />
                  <StatCard 
                    title="Part-Time" 
                    value="16" 
                    borderColor="stat-border-gray" 
                    textColor="stat-text-gray"
                  />
                  <StatCard 
                    title="Contractors" 
                    value="10" 
                    borderColor="stat-border-red" 
                    textColor="stat-text-red"
                  />
                </div>
                
                <EmployeeDirectory filter={activeFilter} />
              </TabsContent>
              
              {/* Leave Management Tab - Enhanced with Leave Dashboard functionality */}
              <TabsContent value="leave" className="space-y-6 animate-in fade-in-50">
                <LeaveManagement filter={activeFilter} />
              </TabsContent>
              
              {/* Training Tab */}
              <TabsContent value="training" className="space-y-6 animate-in fade-in-50">
                <TrainingModule filter={activeFilter} />
              </TabsContent>
              
              {/* Payroll Tab */}
              <TabsContent value="payroll" className="space-y-6 animate-in fade-in-50">
                <PayrollManagement filter={activeFilter} />
              </TabsContent>
              
              {/* Compliance Tab - Enhanced with new functionality */}
              <TabsContent value="compliance" className="space-y-6 animate-in fade-in-50">
                <ComplianceDashboard filter={activeFilter} />
              </TabsContent>
              
              {/* Loans Tab */}
              <TabsContent value="loans" className="space-y-6 animate-in fade-in-50">
                <LoanCentre filter={activeFilter} />
              </TabsContent>
              
              {/* Salary Tab */}
              <TabsContent value="salary" className="space-y-6 animate-in fade-in-50">
                <SalaryCalculation filter={activeFilter} />
              </TabsContent>
              
              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6 animate-in fade-in-50">
                <HRReports filter={activeFilter} />
              </TabsContent>
            </div>
          </Tabs>
        </ModuleCard>
      </motion.div>
    </Layout>
  );
}
