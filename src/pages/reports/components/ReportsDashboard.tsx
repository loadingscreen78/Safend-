import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useFirebase } from "@/contexts/FirebaseContext";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  ChevronRight,
  Activity,
  Users,
  Clock,
  AlarmClock,
  FileText
} from "lucide-react";
import { DashboardWidget } from "./widgets/DashboardWidget";
import { KpiCard } from "./widgets/KpiCard";

interface ReportsDashboardProps {
  selectedModule: string | null;
}

export function ReportsDashboard({ selectedModule }: ReportsDashboardProps) {
  const [dashboardType, setDashboardType] = useState("executive");
  const [dateRange, setDateRange] = useState("last30days");
  const [isLoading, setIsLoading] = useState(true);
  const { isInitialized: firebaseInitialized } = useFirebase();
  
  // Different data for different dashboard types
  const [executiveData, setExecutiveData] = useState<any>(null);
  const [operationalData, setOperationalData] = useState<any>(null);
  const [financialData, setFinancialData] = useState<any>(null);
  const [customData, setCustomData] = useState<any>(null);
  
  useEffect(() => {
    // Simulate loading dashboard data
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Generate different data for each dashboard type
      setExecutiveData({
        kpis: [
          { title: "Total Revenue", value: "₹2,452,430", change: 12.5, trend: "up", metric: "vs last period", icon: <LineChart className="h-4 w-4 text-muted-foreground" /> },
          { title: "Active Posts", value: "147", change: 2.8, trend: "up", metric: "vs last month", icon: <BarChart3 className="h-4 w-4 text-muted-foreground" /> },
          { title: "Headcount", value: "1,283", change: -3.2, trend: "down", metric: "vs last quarter", icon: <PieChart className="h-4 w-4 text-muted-foreground" /> },
          { title: "Receivable Days", value: "42", change: -5.5, trend: "up", metric: "vs target (45)", icon: <Calendar className="h-4 w-4 text-muted-foreground" /> }
        ]
      });
      
      setOperationalData({
        kpis: [
          { title: "Post Coverage", value: "94%", change: 3.2, trend: "up", metric: "vs target (90%)", icon: <Activity className="h-4 w-4 text-muted-foreground" /> },
          { title: "Attendance Rate", value: "96.7%", change: 1.4, trend: "up", metric: "vs last month", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
          { title: "Response Time", value: "18 min", change: -12.0, trend: "up", metric: "vs target (30 min)", icon: <Clock className="h-4 w-4 text-muted-foreground" /> },
          { title: "Incident Rate", value: "0.8%", change: -0.3, trend: "up", metric: "vs industry avg", icon: <AlarmClock className="h-4 w-4 text-muted-foreground" /> }
        ]
      });
      
      setFinancialData({
        kpis: [
          { title: "EBITDA", value: "₹4.28M", change: 8.7, trend: "up", metric: "vs last year", icon: <LineChart className="h-4 w-4 text-muted-foreground" /> },
          { title: "Cash Flow", value: "₹1.92M", change: 15.3, trend: "up", metric: "vs forecast", icon: <BarChart3 className="h-4 w-4 text-muted-foreground" /> },
          { title: "Debt Ratio", value: "0.32", change: -0.05, trend: "up", metric: "vs last quarter", icon: <PieChart className="h-4 w-4 text-muted-foreground" /> },
          { title: "Payment Cycle", value: "37 days", change: -3, trend: "up", metric: "vs target (45)", icon: <Calendar className="h-4 w-4 text-muted-foreground" /> }
        ]
      });
      
      setCustomData({
        kpis: [
          { title: "Key Metric 1", value: "Custom", change: 0, trend: "neutral", metric: "user defined", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
          { title: "Key Metric 2", value: "Custom", change: 0, trend: "neutral", metric: "user defined", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
          { title: "Key Metric 3", value: "Custom", change: 0, trend: "neutral", metric: "user defined", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
          { title: "Key Metric 4", value: "Custom", change: 0, trend: "neutral", metric: "user defined", icon: <FileText className="h-4 w-4 text-muted-foreground" /> }
        ]
      });
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedModule, dashboardType, dateRange]);
  
  // Get current data based on selected dashboard type
  const currentDashboardData = () => {
    switch(dashboardType) {
      case 'executive': return executiveData;
      case 'operational': return operationalData;
      case 'financial': return financialData;
      case 'custom': return customData;
      default: return executiveData;
    }
  };
  
  const data = currentDashboardData();
  
  // Handle real-time data updates from Firebase if available
  useEffect(() => {
    if (firebaseInitialized) {
      console.log('Firebase initialized, could fetch real-time data here');
      // In a real implementation, we would set up Firebase listeners here
    }
  }, [firebaseInitialized]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Tabs 
          defaultValue="executive" 
          value={dashboardType} 
          onValueChange={setDashboardType} 
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="executive">Executive</TabsTrigger>
            <TabsTrigger value="operational">Operational</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="custom">My Dashboards</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="w-full h-24 animate-pulse">
              <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </Card>
          ))}
          
          <Card className="w-full col-span-1 md:col-span-2 h-80 animate-pulse">
            <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </Card>

          <Card className="w-full col-span-1 md:col-span-2 h-80 animate-pulse">
            <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Summary Row - Different data for each dashboard type */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.kpis?.map((kpi: any, index: number) => (
              <KpiCard 
                key={`${dashboardType}-kpi-${index}`}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                metric={kpi.metric}
                icon={kpi.icon}
              />
            ))}
          </div>
          
          {/* Primary Charts Row with different content per dashboard type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardWidget 
              title={dashboardType === "executive" ? "Revenue by Branch" : 
                     dashboardType === "operational" ? "Post Performance" :
                     dashboardType === "financial" ? "Cash Flow Trend" : "Custom Chart 1"}
              description={dashboardType === "executive" ? "Monthly revenue across top 5 branches" :
                          dashboardType === "operational" ? "Efficiency metrics by location" :
                          dashboardType === "financial" ? "Monthly cash inflow vs outflow" : "User defined visualization"}
              type={dashboardType === "executive" ? "bar" : 
                    dashboardType === "operational" ? "line" :
                    dashboardType === "financial" ? "area" : "bar"}
            />
            <DashboardWidget 
              title={dashboardType === "executive" ? "Headcount Trend" :
                    dashboardType === "operational" ? "Incident Reports" :
                    dashboardType === "financial" ? "Expense Categories" : "Custom Chart 2"}
              description={dashboardType === "executive" ? "Monthly employee count by department" :
                          dashboardType === "operational" ? "Weekly incident types and resolution" :
                          dashboardType === "financial" ? "Breakdown of major expense categories" : "User defined visualization"}
              type={dashboardType === "executive" ? "line" :
                    dashboardType === "operational" ? "bar" :
                    dashboardType === "financial" ? "donut" : "line"}
            />
          </div>
          
          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardWidget 
              title={dashboardType === "executive" ? "Attendance Rate" :
                    dashboardType === "operational" ? "Training Compliance" :
                    dashboardType === "financial" ? "Revenue Streams" : "Custom Chart 3"}
              description={dashboardType === "executive" ? "Weekly attendance percentage" :
                          dashboardType === "operational" ? "Staff certification status" :
                          dashboardType === "financial" ? "Revenue distribution by service" : "User defined visualization"}
              type={dashboardType === "executive" ? "line" :
                    dashboardType === "operational" ? "donut" :
                    dashboardType === "financial" ? "bar" : "donut"}
            />
            <DashboardWidget 
              title={dashboardType === "executive" ? "Receivables Aging" :
                    dashboardType === "operational" ? "Response Times" :
                    dashboardType === "financial" ? "Budget Variance" : "Custom Chart 4"}
              description={dashboardType === "executive" ? "Outstanding invoices by age bucket" :
                          dashboardType === "operational" ? "Average resolution time by issue type" :
                          dashboardType === "financial" ? "Actual vs planned expense analysis" : "User defined visualization"}
              type="donut"
            />
            <DashboardWidget 
              title={dashboardType === "executive" ? "Post Coverage" :
                    dashboardType === "operational" ? "Staff Utilization" :
                    dashboardType === "financial" ? "Profit Margins" : "Custom Chart 5"}
              description={dashboardType === "executive" ? "Planned vs actual deployment" :
                          dashboardType === "operational" ? "Team efficiency metrics" :
                          dashboardType === "financial" ? "Gross and net margin trends" : "User defined visualization"}
              type="bar"
            />
          </div>
          
          <div className="flex justify-center pt-4">
            <Button variant="outline" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Widget
            </Button>
          </div>
          
          <Separator />
          
          {/* Module-specific Reports - Filtered by both module and dashboard type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Reports</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Monthly P&L Statement",
                  module: "accounts",
                  dashboardType: ["executive", "financial"],
                  date: "May 8, 2025",
                  status: "Generated"
                },
                {
                  title: "Post Attendance Summary",
                  module: "operations",
                  dashboardType: ["executive", "operational"],
                  date: "May 7, 2025",
                  status: "Generated"
                },
                {
                  title: "Sales Pipeline Analysis",
                  module: "sales",
                  dashboardType: ["executive", "financial"],
                  date: "May 6, 2025",
                  status: "Generated"
                },
                {
                  title: "Inventory Valuation Report",
                  module: "office-admin",
                  dashboardType: ["operational", "financial"],
                  date: "May 5, 2025",
                  status: "Generated"
                },
                {
                  title: "Statutory Compliance Status",
                  module: "hr",
                  dashboardType: ["executive", "operational"],
                  date: "May 4, 2025",
                  status: "Generated"
                },
                {
                  title: "User Activity Audit",
                  module: "control-centre",
                  dashboardType: ["executive", "operational"],
                  date: "May 3, 2025",
                  status: "Generated"
                },
                {
                  title: "Cash Flow Forecast",
                  module: "accounts",
                  dashboardType: ["financial"],
                  date: "May 2, 2025",
                  status: "Generated"
                },
                {
                  title: "Branch Performance Dashboard",
                  module: "operations",
                  dashboardType: ["operational"],
                  date: "May 1, 2025",
                  status: "Generated"
                },
                {
                  title: "Custom Report 1",
                  module: "custom",
                  dashboardType: ["custom"],
                  date: "Apr 30, 2025",
                  status: "Generated"
                }
              ]
                .filter(report => (!selectedModule || report.module === selectedModule) && 
                                  (!dashboardType || report.dashboardType.includes(dashboardType)))
                .map((report, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-accent/5">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{report.title}</CardTitle>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription className="flex justify-between">
                        <span>
                          {report.module.charAt(0).toUpperCase() + report.module.slice(1).replace('-', ' ')}
                        </span>
                        <span>{report.date}</span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
