import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleHeader } from "@/components/ui/module-header";
import { ModuleCard } from "@/components/ui/module-card";
import { usePermissions } from "@/hooks/operations/usePermissions";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useWebSocket } from "@/hooks/operations/useWebSocket";
import { WS_BASE_URL } from "@/config";
import { OperationsDashboard } from "./components/OperationsDashboard";
import { PostManagement } from "./components/PostManagement";
import { RotaPlanner } from "./components/RotaPlanner";
import { AttendanceManagement } from "./components/AttendanceManagement";
import { LeaveManagement } from "./components/LeaveManagement";
import { PatrolManagement } from "./components/PatrolManagement";
import { PenaltyManagement } from "./components/PenaltyManagement";
import { MessManagement } from "./components/MessManagement";
import { ReportsCenter } from "./components/ReportsCenter";
import { motion } from "framer-motion";
import { AlertCircle, Bell, Calendar, FileText, Map, Users, Clipboard, BarChart3, Utensils } from "lucide-react";
import { PermissionType } from "@/types/operations";

// Operation module tabs
const operationsTabs = [
  { id: "dashboard", label: "Dashboard & CRM", icon: BarChart3, permission: null }, // All users can see dashboard
  { id: "posts", label: "Posts", icon: Map, permission: "POST_MANAGEMENT" as PermissionType },
  { id: "rota", label: "Rota Planner", icon: Calendar, permission: "ROTA_MANAGEMENT" as PermissionType },
  { id: "attendance", label: "Attendance", icon: Users, permission: "ATTENDANCE_MANAGEMENT" as PermissionType },
  { id: "leave", label: "Leave", icon: Calendar, permission: "LEAVE_MANAGEMENT" as PermissionType },
  { id: "patrol", label: "Patrol", icon: Clipboard, permission: "PATROL_MANAGEMENT" as PermissionType },
  { id: "penalty", label: "Penalty", icon: AlertCircle, permission: "PENALTY_MANAGEMENT" as PermissionType },
  { id: "mess", label: "Mess", icon: Utensils, permission: "MESS_MANAGEMENT" as PermissionType },
  { id: "reports", label: "Reports", icon: FileText, permission: "REPORTS_ACCESS" as PermissionType },
];

export function OperationsModule() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  
  // Connect to WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket(`${WS_BASE_URL}/operations`);
  
  // Filter tabs based on user permissions
  const filteredTabs = operationsTabs.filter(tab => 
    tab.permission === null || hasPermission(tab.permission)
  );

  const handleTabChange = (value: string) => {
    if (value === activeTab) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    setActiveTab(value);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + Math.floor(Math.random() * 20);
        return newValue >= 100 ? 100 : newValue;
      });
    }, 200);
    
    // Simulate loading delay with completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      // Small delay to show 100% before hiding
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(0);
      }, 300);
    }, 800);
  };

  if (permissionsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingAnimation size="lg" color="red" showPercentage={true} percentageValue={50} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        className="space-y-6 page-transition"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ModuleHeader 
          title="Operations Management"
          description="Comprehensive field operations management for security services"
          actionLabel={
            isConnected 
              ? "Connected to Real-time Updates" 
              : "Connecting to Real-time Updates..."
          }
          actionIcon={
            <Bell className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-yellow-500"}`} />
          }
        />
        
        <ModuleCard>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <ScrollArea className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-9 gap-1 w-full md:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg min-w-max">
                  {filteredTabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id} 
                      className="flex gap-2 items-center transition-all duration-200"
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <LoadingAnimation 
                  size="lg" 
                  color="red" 
                  showPercentage={true}
                  percentageValue={loadingProgress}
                />
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="p-6">
                  <TabsContent value="dashboard" className="animate-in fade-in-50 mt-0">
                    <OperationsDashboard lastMessage={lastMessage} />
                  </TabsContent>
                  
                  <TabsContent value="posts" className="animate-in fade-in-50 mt-0">
                    <PostManagement />
                  </TabsContent>
                  
                  <TabsContent value="rota" className="animate-in fade-in-50 mt-0">
                    <RotaPlanner />
                  </TabsContent>
                  
                  <TabsContent value="attendance" className="animate-in fade-in-50 mt-0">
                    <AttendanceManagement />
                  </TabsContent>
                  
                  <TabsContent value="leave" className="animate-in fade-in-50 mt-0">
                    <LeaveManagement />
                  </TabsContent>
                  
                  <TabsContent value="patrol" className="animate-in fade-in-50 mt-0">
                    <PatrolManagement />
                  </TabsContent>
                  
                  <TabsContent value="penalty" className="animate-in fade-in-50 mt-0">
                    <PenaltyManagement />
                  </TabsContent>
                  
                  <TabsContent value="mess" className="animate-in fade-in-50 mt-0">
                    <MessManagement />
                  </TabsContent>
                  
                  <TabsContent value="reports" className="animate-in fade-in-50 mt-0">
                    <ReportsCenter />
                  </TabsContent>
                </div>
              </ScrollArea>
            )}
          </Tabs>
        </ModuleCard>
      </motion.div>
    </Layout>
  );
}
