
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Search, 
  Users, 
  Filter, 
  RefreshCw, 
  Settings,
  Shield,
  Activity,
  Bell,
  Database
} from "lucide-react";
import { EnhancedButton as Button } from "@/components/ui/enhanced-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useBranch } from "@/contexts/BranchContext";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { BranchManager } from "@/components/admin/control-centre/BranchManager";
import { UserManager } from "@/components/admin/control-centre/UserManager";
import { RolePermissionManager } from "@/components/admin/control-centre/RolePermissionManager";
import { AdminSettings } from "@/components/admin/control-centre/AdminSettings";
import { ActivityAudit } from "@/components/admin/control-centre/ActivityAudit";
import { HealthMetrics } from "@/components/admin/control-centre/HealthMetrics";
import { ThirdPartyIntegrations } from "@/components/admin/control-centre/ThirdPartyIntegrations";
import { SoundBus } from "@/services/SoundService";

export function ControlCentreModule() {
  const [activeTab, setActiveTab] = useState("branch-manager");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { toast } = useToastWithSound();
  const { currentBranch, isMainBranch } = useBranch();
  
  // Play welcome sound when control center loads
  useEffect(() => {
    SoundBus.play('welcome');
  }, []);
  
  // Play sound when changing tabs
  const handleTabChange = (value: string) => {
    SoundBus.play('click');
    setActiveTab(value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    SoundBus.play('click');
    
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success({
        title: "Data refreshed",
        description: "Control Centre data has been refreshed",
      });
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-red-600" />
              Control Centre
            </h1>
            <p className="text-muted-foreground">
              {currentBranch?.id === 'main' 
                ? 'Unified administration and branch management system'
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
                <DropdownMenuLabel>Control Centre</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Database className="mr-2 h-4 w-4" /> Database Status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full">
            <TabsTrigger value="branch-manager" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Branch Manager</span>
            </TabsTrigger>
            <TabsTrigger value="user-manager" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User Manager</span>
            </TabsTrigger>
            <TabsTrigger value="role-permission" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Roles & Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="admin-settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Settings</span>
            </TabsTrigger>
            <TabsTrigger value="activity-audit" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity & Audit</span>
            </TabsTrigger>
            <TabsTrigger value="health-metrics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Health & Metrics</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 w-full">
            {activeTab === "branch-manager" && (
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
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
