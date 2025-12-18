import { useState, useEffect, lazy, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedButton as Button } from "@/components/ui/enhanced-button";
import { Separator } from "@/components/ui/separator";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBranch } from "@/contexts/BranchContext";
import { 
  BarChart3, 
  Library, 
  FileCog, 
  Clock, 
  FileSearch, 
  Settings, 
  FileBarChart2, 
  FileSpreadsheet, 
  ShieldCheck,
  Building2, 
  Search, 
  Users, 
  Filter, 
  RefreshCw,
  Shield,
  Activity,
  Bell,
  Database,
  LayoutGrid
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SoundBus } from "@/services/SoundService";

// Lazy-loaded components for better performance
// Dashboard components
const ReportsDashboard = lazy(() => import('../../reports/components/ReportsDashboard').then(module => ({ default: module.ReportsDashboard })));
const ReportLibrary = lazy(() => import('../../reports/components/ReportLibrary').then(module => ({ default: module.ReportLibrary })));
const ReportBuilder = lazy(() => import('../../reports/components/ReportBuilder').then(module => ({ default: module.ReportBuilder })));
const ScheduledReports = lazy(() => import('../../reports/components/ScheduledReports').then(module => ({ default: module.ScheduledReports })));
const AdHocQuery = lazy(() => import('../../reports/components/AdHocQuery').then(module => ({ default: module.AdHocQuery })));
const ReportsSettings = lazy(() => import('../../reports/components/ReportsSettings').then(module => ({ default: module.ReportsSettings })));
const ComplianceReports = lazy(() => import('../../reports/components/ComplianceReports').then(module => ({ default: module.ComplianceReports })));
const ModuleSelector = lazy(() => import('../../reports/components/ModuleSelector').then(module => ({ default: module.ModuleSelector })));
const DataWarehouseStatus = lazy(() => import('../../reports/components/DataWarehouseStatus').then(module => ({ default: module.DataWarehouseStatus })));

// Control Centre components - Fixed import paths
const BranchManager = lazy(() => import('@/components/admin/control-centre/BranchManager').then(module => ({ default: module.BranchManager })));
const UserManager = lazy(() => import('@/components/admin/control-centre/UserManager').then(module => ({ default: module.UserManager })));
const RolePermissionManager = lazy(() => import('@/components/admin/control-centre/RolePermissionManager').then(module => ({ default: module.RolePermissionManager })));
const AdminSettings = lazy(() => import('@/components/admin/control-centre/AdminSettings').then(module => ({ default: module.AdminSettings })));
const ActivityAudit = lazy(() => import('@/components/admin/control-centre/ActivityAudit').then(module => ({ default: module.ActivityAudit })));
const HealthMetrics = lazy(() => import('@/components/admin/control-centre/HealthMetrics').then(module => ({ default: module.HealthMetrics })));
const ThirdPartyIntegrations = lazy(() => import('@/components/admin/control-centre/ThirdPartyIntegrations').then(module => ({ default: module.ThirdPartyIntegrations })));

// Loading fallback
const LoadingFallback = () => (
  <div className="p-4 w-full h-48 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Quick actions component
const QuickActions = ({ onAction }: { onAction: (action: string) => void }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <Button 
      variant="outline" 
      className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
      onClick={() => onAction('createReport')}
    >
      <FileBarChart2 className="h-6 w-6 text-red-600" />
      <span className="text-foreground">Create Report</span>
    </Button>
    <Button 
      variant="outline" 
      className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
      onClick={() => onAction('addUser')}
    >
      <Users className="h-6 w-6 text-red-600" />
      <span className="text-foreground">Add User</span>
    </Button>
    <Button 
      variant="outline" 
      className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
      onClick={() => onAction('systemHealth')}
    >
      <Activity className="h-6 w-6 text-red-600" />
      <span className="text-foreground">System Health</span>
    </Button>
    <Button 
      variant="outline" 
      className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
      onClick={() => onAction('configure')}
    >
      <Settings className="h-6 w-6 text-red-600" />
      <span className="text-foreground">Configure</span>
    </Button>
  </div>
);

// Main component
export function AdminDashboardModule() {
  const [activeMainTab, setActiveMainTab] = useState("overview");
  const [activeDashboardTab, setActiveDashboardTab] = useState("dashboard");
  const [activeControlTab, setActiveControlTab] = useState("branch-manager");
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { toast } = useToastWithSound();
  const { currentBranch, isMainBranch } = useBranch();
  
  // Play welcome sound when dashboard loads
  useEffect(() => {
    SoundBus.play('welcome');
    
    // Show toast on first load
    setTimeout(() => {
      toast.success({
        title: "Welcome to Unified Dashboard",
        description: "Administration and reporting in one place",
      });
    }, 1000);
  }, [toast]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    SoundBus.play('click');
    
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success({
        title: "Data refreshed",
        description: "Dashboard data has been refreshed",
      });
    }, 1000);
  };
  
  // Handle quick action
  const handleQuickAction = (action: string) => {
    SoundBus.play('click');
    switch (action) {
      case 'createReport':
        setActiveMainTab("reports");
        setActiveDashboardTab("builder");
        toast.success({
          title: "Report Builder",
          description: "Create a new custom report",
        });
        break;
      case 'addUser':
        setActiveMainTab("control");
        setActiveControlTab("user-manager");
        toast.success({
          title: "User Manager",
          description: "Add or manage system users",
        });
        break;
      case 'systemHealth':
        setActiveMainTab("control");
        setActiveControlTab("health-metrics");
        toast.success({
          title: "System Health",
          description: "Monitor system performance",
        });
        break;
      case 'configure':
        setActiveMainTab("control");
        setActiveControlTab("admin-settings");
        toast.success({
          title: "Admin Settings",
          description: "Configure system settings",
        });
        break;
      default:
        break;
    }
  };
  
  return (
    <Layout>
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutGrid className="h-8 w-8 text-red-600" />
              Administrative Dashboard
            </h1>
            <p className="text-muted-foreground">
              {currentBranch?.id === 'main' 
                ? 'Unified administration, reporting, and branch management system'
                : `Managing branch: ${currentBranch?.name} (${currentBranch?.code})`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Dashboard Controls</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Database className="mr-2 h-4 w-4" /> Database Status
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" /> Notification Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Main Tab Navigation */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart2 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Control Centre</span>
            </TabsTrigger>
          </TabsList>

          <Separator className="my-4" />
          
          {/* Overview Content */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used administrative functions</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActions onAction={handleQuickAction} />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingFallback />}>
                    <ReportsDashboard selectedModule={selectedModule} />
                  </Suspense>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Suspense fallback={<LoadingFallback />}>
                    <HealthMetrics />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<LoadingFallback />}>
                  <ActivityAudit />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Content */}
          <TabsContent value="reports" className="space-y-4 animate-in fade-in-50">
            <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-1 md:w-auto w-full">
                  <TabsTrigger value="dashboard" className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden md:inline">Overview</span>
                    <span className="md:hidden">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="library" className="flex items-center gap-1">
                    <Library className="h-4 w-4" />
                    <span className="hidden md:inline">Report Library</span>
                    <span className="md:hidden">Library</span>
                  </TabsTrigger>
                  <TabsTrigger value="compliance" className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden md:inline">Compliance</span>
                    <span className="md:hidden">Comply</span>
                  </TabsTrigger>
                  <TabsTrigger value="builder" className="flex items-center gap-1">
                    <FileCog className="h-4 w-4" />
                    <span className="hidden md:inline">Report Builder</span>
                    <span className="md:hidden">Builder</span>
                  </TabsTrigger>
                  <TabsTrigger value="scheduled" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="hidden md:inline">Scheduled</span>
                    <span className="md:hidden">Sched</span>
                  </TabsTrigger>
                  <TabsTrigger value="adhoc" className="flex items-center gap-1">
                    <FileSearch className="h-4 w-4" />
                    <span className="hidden md:inline">Ad-Hoc Query</span>
                    <span className="md:hidden">Query</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span className="hidden md:inline">Settings</span>
                    <span className="md:hidden">Settings</span>
                  </TabsTrigger>
                </TabsList>
                
                <Suspense fallback={<div className="h-10" />}>
                  <ModuleSelector onModuleChange={setSelectedModule} selectedModule={selectedModule} />
                </Suspense>
              </div>
              
              <div className="flex items-center gap-2 justify-end mb-4">
                <div>
                  {activeDashboardTab !== "dashboard" && <Button variant="outline" size="sm" className="flex items-center gap-1" soundEffect="download">
                    <FileBarChart2 className="h-4 w-4" />
                    Export PDF
                  </Button>}
                  {activeDashboardTab !== "dashboard" && <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2" soundEffect="download">
                    <FileSpreadsheet className="h-4 w-4" />
                    Export Excel
                  </Button>}
                </div>
              </div>

              <Suspense fallback={<LoadingFallback />}>
                <TabsContent value="dashboard" className="space-y-4 animate-in fade-in-50">
                  <ReportsDashboard selectedModule={selectedModule} />
                </TabsContent>

                <TabsContent value="library" className="space-y-4 animate-in fade-in-50">
                  <ReportLibrary moduleFilter={selectedModule} />
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4 animate-in fade-in-50">
                  <ComplianceReports moduleFilter={selectedModule} />
                </TabsContent>

                <TabsContent value="builder" className="space-y-4 animate-in fade-in-50">
                  <ReportBuilder />
                </TabsContent>

                <TabsContent value="scheduled" className="space-y-4 animate-in fade-in-50">
                  <ScheduledReports />
                </TabsContent>

                <TabsContent value="adhoc" className="space-y-4 animate-in fade-in-50">
                  <AdHocQuery />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 animate-in fade-in-50">
                  <ReportsSettings />
                </TabsContent>
              </Suspense>
            </Tabs>
          </TabsContent>
          
          {/* Control Centre Content */}
          <TabsContent value="control" className="space-y-4 animate-in fade-in-50">
            <Tabs value={activeControlTab} onValueChange={setActiveControlTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full">
                  <TabsTrigger value="branch-manager" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Branch Manager</span>
                    <span className="sm:hidden">Branch</span>
                  </TabsTrigger>
                  <TabsTrigger value="user-manager" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">User Manager</span>
                    <span className="sm:hidden">Users</span>
                  </TabsTrigger>
                  <TabsTrigger value="role-permission" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Roles & Permissions</span>
                    <span className="sm:hidden">Roles</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin-settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin Settings</span>
                    <span className="sm:hidden">Settings</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity-audit" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Activity & Audit</span>
                    <span className="sm:hidden">Audit</span>
                  </TabsTrigger>
                  <TabsTrigger value="health-metrics" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Health & Metrics</span>
                    <span className="sm:hidden">Health</span>
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden sm:inline">Integrations</span>
                    <span className="sm:hidden">API</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {activeControlTab === "branch-manager" && (
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search branches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              )}

              <Suspense fallback={<LoadingFallback />}>
                <TabsContent value="branch-manager" className="p-0 w-full">
                  <BranchManager searchTerm={searchTerm} />
                </TabsContent>

                <TabsContent value="user-manager" className="p-0 w-full">
                  <UserManager />
                </TabsContent>

                <TabsContent value="role-permission" className="p-0 w-full">
                  <RolePermissionManager />
                </TabsContent>

                <TabsContent value="admin-settings" className="p-0 w-full">
                  <AdminSettings />
                </TabsContent>
                
                <TabsContent value="activity-audit" className="p-0 w-full">
                  <ActivityAudit />
                </TabsContent>
                
                <TabsContent value="health-metrics" className="p-0 w-full">
                  <HealthMetrics />
                </TabsContent>
                
                <TabsContent value="integrations" className="p-0 w-full">
                  <ThirdPartyIntegrations />
                </TabsContent>
              </Suspense>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
