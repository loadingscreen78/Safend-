
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileType, ChevronDown, ChevronLeft, ChevronRight, Calendar, Filter, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAuditLogs, getAuditLogsByModule, AuditLog } from "@/utils/auditLog";
import { useToast } from "@/components/ui/use-toast";

export function ActivityAudit() {
  const [dateFilter, setDateFilter] = useState("all-time");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [activities, setActivities] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Load audit logs from Firebase
  useEffect(() => {
    loadAuditLogs();
  }, [moduleFilter]);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      let logs: AuditLog[];
      if (moduleFilter === "all") {
        logs = await getAuditLogs(100);
      } else {
        logs = await getAuditLogsByModule(moduleFilter, 100);
      }
      setActivities(logs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="control-centre-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Activity & Audit Log</CardTitle>
            <CardDescription>
              Immutable record of all system activity and user actions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={loadAuditLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {moduleFilter === "all" ? "All Modules" : moduleFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setModuleFilter("all")}>All Modules</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("User Manager")}>User Manager</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("Role Manager")}>Role Manager</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModuleFilter("Authentication")}>Authentication</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FileType className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2">
                  <Download className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Download className="h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading audit logs...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No audit logs found. Activities will appear here as users interact with the system.
                      </TableCell>
                    </TableRow>
                  ) : (
                    activities.map(activity => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(activity.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.target}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-black text-white">
                            {activity.module}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{activity.ip}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {activities.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {activities.length} activities
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="control-centre-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Activity Analytics</CardTitle>
          <CardDescription>
            Visual representation of system activity over time
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="h-60 w-full bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">ApexCharts integration will appear here</p>
          </div>
          <div className="flex gap-3 mt-6">
            <Badge className="bg-black text-white">User Logins</Badge>
            <Badge className="bg-red-600 text-white">Role Changes</Badge>
            <Badge className="bg-gray-500 text-white">Branch Operations</Badge>
            <Badge className="bg-blue-500 text-white">System Events</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
