import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, User, CalendarDays, PackageCheck, Coins } from "lucide-react";
import { DashboardWidget, RotaGap, InventoryItem, MessMeal, SalaryAdvance } from "@/types/operations";
import { dashboardApi } from "@/services/operations/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useQuery } from "@tanstack/react-query";

import RotaGapsWidget from "./dashboard/RotaGapsWidget";
import InventoryWidget from "./dashboard/InventoryWidget";
import MessWidget from "./dashboard/MessWidget";
import SalaryAdvancesWidget from "./dashboard/SalaryAdvancesWidget";
import ReportsSummaryWidget from "./dashboard/ReportsSummaryWidget";

export function OperationsDashboard({ lastMessage }: { lastMessage?: any }) {
  const [activePosts, setActivePosts] = useState<any[]>([]);
  const [rotaGapsData, setRotaGapsData] = useState<{ date: string; gaps: RotaGap[] }>({ date: '', gaps: [] });
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [messData, setMessData] = useState<MessMeal[]>([]);
  const [salaryAdvanceData, setSalaryAdvanceData] = useState<SalaryAdvance[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Disabled API call - using Firebase instead
  const widgetsLoading = false;
  
  // Set empty widgets to prevent errors
  useEffect(() => {
    setWidgets([]);
  }, []);

  useEffect(() => {
    // API calls disabled - using Firebase instead
    // These endpoints don't exist yet, causing console errors
    
    // TODO: Implement Firebase-based dashboard data fetching
    // For now, using empty data to prevent errors
    
    setActivePosts([]);
    setRotaGapsData({ date: new Date().toISOString().split('T')[0], gaps: [] });
    setInventoryData([]);
    setMessData([]);
    setSalaryAdvanceData([]);
  }, []);

  const handleViewAllReports = () => {
    // This would typically involve navigation to the Reports tab
    // For now we'll just log to the console
    console.log('Navigate to Reports section');
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const handleToggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, active: !widget.active } : widget
    ));
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    
    try {
      await Promise.all(widgets.map((widget, index) => {
        const updatedWidget = { ...widget, position: index };
        return dashboardApi.saveWidgetConfiguration(widget.id, {
          position: index,
          active: widget.active,
        });
      }));
      
      toast({
        title: "Configuration Saved",
        description: "Your dashboard configuration has been saved.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving widget configuration:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Operations Dashboard</h3>
          <p className="text-muted-foreground">
            Real-time insights and operational overview
          </p>
        </div>
      </div>
      
      {/* Map View */}
      <div>
        <h3 className="text-sm font-medium mb-2">Active Posts</h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Active Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center space-x-4 border rounded-lg p-3"
                >
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{post.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Rota Gaps Widget */}
        <div>
          <h3 className="text-sm font-medium mb-2">Rota Gap Analysis</h3>
          <RotaGapsWidget data={rotaGapsData.gaps} config={{ daysToShow: 2 }} />
        </div>
        
        {/* Inventory Summary Widget */}
        <div>
          <h3 className="text-sm font-medium mb-2">Recent Inventory Movements</h3>
          <InventoryWidget data={inventoryData} />
        </div>
        
        {/* Reports Summary Widget */}
        <div>
          <h3 className="text-sm font-medium mb-2">Reports</h3>
          <ReportsSummaryWidget onViewAllReports={handleViewAllReports} />
        </div>
        
        {/* Mess Update Widget */}
        <div>
          <h3 className="text-sm font-medium mb-2">Mess Updates</h3>
          <MessWidget data={messData} />
        </div>
        
        {/* Salary Advances Widget */}
        <div>
          <h3 className="text-sm font-medium mb-2">Recent Salary Advances</h3>
          <SalaryAdvancesWidget data={salaryAdvanceData} />
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Customize Dashboard</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Customize Dashboard</DialogTitle>
            <DialogDescription>
              Arrange and toggle the visibility of your dashboard widgets.
            </DialogDescription>
          </DialogHeader>
          
          {widgetsLoading ? (
            <div className="flex items-center justify-center h-40">
              <LoadingAnimation size="md" color="primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {widgets.map((widget, index) => (
                <div
                  key={widget.id}
                  className="bg-gray-50 dark:bg-gray-800 border rounded-md p-4 flex items-center justify-between"
                >
                  <Label htmlFor={`widget-${widget.id}`}>{widget.title}</Label>
                  <Switch
                    id={`widget-${widget.id}`}
                    checked={widget.active}
                    onCheckedChange={() => handleToggleWidget(widget.id)}
                  />
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveConfiguration} disabled={isSaving}>
              {isSaving ? (
                <>
                  <LoadingAnimation size="sm" color="white" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
