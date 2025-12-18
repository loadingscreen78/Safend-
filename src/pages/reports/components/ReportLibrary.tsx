import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReportTemplate } from "@/types/reports";
import { Search, FileBarChart2, FileSpreadsheet, Clock, Calendar, Star, StarOff } from "lucide-react";

interface ReportLibraryProps {
  moduleFilter: string | null;
}

export function ReportLibrary({ moduleFilter }: ReportLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [reportCategory, setReportCategory] = useState("all");
  const [favoriteReports, setFavoriteReports] = useState<string[]>([]);
  
  const toggleFavorite = (id: string) => {
    setFavoriteReports(prev => 
      prev.includes(id) 
        ? prev.filter(reportId => reportId !== id)
        : [...prev, id]
    );
  };
  
  // Mock templates based on the data warehouse schema
  const reportTemplates: ReportTemplate[] = [
    // Control Centre Reports
    {
      id: "cc-activity-log",
      name: "User Activity Audit",
      description: "Detailed log of user actions across all modules",
      module: "control-centre",
      category: "audit",
      queryReference: "fct_activity_log",
      defaultChartType: "table",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    {
      id: "cc-role-changes",
      name: "Role Permission Matrix",
      description: "Comprehensive mapping of roles and their permissions",
      module: "control-centre",
      category: "security",
      queryReference: "fct_role_change",
      defaultChartType: "heatmap",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    
    // Sales Reports
    {
      id: "sales-pipeline",
      name: "Sales Pipeline Analysis",
      description: "Visualize lead to conversion funnel with value distribution",
      module: "sales",
      category: "pipeline",
      queryReference: "fct_lead",
      defaultChartType: "funnel",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    {
      id: "sales-receivables",
      name: "Receivables Aging Analysis",
      description: "Outstanding invoices by age buckets with client breakout",
      module: "sales",
      category: "financial",
      queryReference: "fct_receivable_ageing",
      defaultChartType: "bar",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    
    // Operations Reports
    {
      id: "ops-attendance",
      name: "Attendance Summary Report",
      description: "Daily attendance tracking with absence categorization",
      module: "operations",
      category: "attendance",
      queryReference: "fct_attendance",
      defaultChartType: "line",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    {
      id: "ops-rota-coverage",
      name: "Rota Coverage Analysis",
      description: "Planned vs actual deployment with gap analysis",
      module: "operations",
      category: "rota",
      queryReference: "fct_rota",
      defaultChartType: "bar",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    
    // HR Reports
    {
      id: "hr-headcount",
      name: "Headcount Analysis",
      description: "Employee distribution by department, designation and branch",
      module: "hr",
      category: "personnel",
      queryReference: "fct_headcount",
      defaultChartType: "bar",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    {
      id: "hr-compliance",
      name: "Statutory Compliance Status",
      description: "Tracking of mandatory statutory filings and their deadlines",
      module: "hr",
      category: "compliance",
      queryReference: "fct_compliance_due",
      defaultChartType: "table",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    
    // Accounts Reports
    {
      id: "acc-pl",
      name: "Profit & Loss Statement",
      description: "Comprehensive P&L by branch with variance analysis",
      module: "accounts",
      category: "financial",
      queryReference: "fct_pl",
      defaultChartType: "table",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    {
      id: "acc-trial-balance",
      name: "Trial Balance",
      description: "Complete trial balance with drilldown capabilities",
      module: "accounts",
      category: "financial",
      queryReference: "fct_trial_balance",
      defaultChartType: "table",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    
    // Office Admin Reports
    {
      id: "admin-inventory",
      name: "Inventory Valuation Report",
      description: "Item-wise inventory valuation with movement analysis",
      module: "office-admin",
      category: "inventory",
      queryReference: "fct_inventory_move",
      defaultChartType: "table",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    },
    {
      id: "admin-fleet",
      name: "Fleet Performance Analysis",
      description: "Vehicle utilization, mileage and cost metrics",
      module: "office-admin",
      category: "fleet",
      queryReference: "fct_fleet_trip",
      defaultChartType: "bar",
      parameterSchema: [],
      createdBy: "System",
      createdAt: "2025-01-01T00:00:00Z",
      visualOptions: {},
      isBuiltIn: true
    }
  ];
  
  // Filter reports based on search, module, and category
  const filteredReports = reportTemplates.filter(report => {
    const matchesSearch = 
      searchQuery === "" || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModule = 
      !moduleFilter || 
      report.module === moduleFilter;
    
    const matchesCategory = 
      reportCategory === "all" || 
      reportCategory === "favorites" && favoriteReports.includes(report.id) ||
      report.category === reportCategory;
    
    return matchesSearch && matchesModule && matchesCategory;
  });
  
  // Get unique categories for the tab list
  const categories = ["all", "favorites", ...new Set(reportTemplates.map(r => r.category))];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="default">
          <FileBarChart2 className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      
      <div className="space-y-4">
        <Tabs 
          defaultValue="all" 
          value={reportCategory} 
          onValueChange={setReportCategory}
          className="w-full"
        >
          <div className="border-b">
            <TabsList className="overflow-auto px-0 bg-transparent h-auto flex flex-nowrap">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent px-4 py-2 rounded-none capitalize"
                >
                  {category === "all" ? "All Reports" : 
                   category === "favorites" ? "Favorites" : 
                   category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.length === 0 ? (
            <div className="col-span-full p-8 text-center">
              <FileBarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No reports found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            filteredReports.map(report => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base font-medium">{report.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {report.module.charAt(0).toUpperCase() + report.module.slice(1).replace('-', ' ')}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFavorite(report.id)}
                  >
                    {favoriteReports.includes(report.id) ? (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {report.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {report.defaultChartType}
                    </Badge>
                    {report.isBuiltIn && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </CardContent>
                
                <Separator />
                
                <CardFooter className="p-4 flex justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last run: 4h ago</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8">
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
                      Export
                    </Button>
                    <Button variant="default" size="sm" className="h-8">
                      Run
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
