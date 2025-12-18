
import { useAppData } from "@/contexts/AppDataContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Wrench, Building, FileText, Users, TicketIcon, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BranchDashboard() {
  const { 
    branches, 
    inventory, 
    assets, 
    vehicles, 
    facilities, 
    tickets, 
    activeBranch, 
    setActiveBranch, 
    isLoading 
  } = useAppData();

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter data for the active branch
  const branchInventory = inventory.filter(item => item.branch === activeBranch);
  const branchAssets = assets.filter(item => item.branch === activeBranch);
  const branchVehicles = vehicles.filter(item => item.branch === activeBranch);
  const branchFacilities = facilities.filter(item => item.branch === activeBranch);
  const branchTickets = tickets.filter(item => item.branch === activeBranch);
  
  // Calculate counts and percentages
  const lowStockItems = branchInventory.filter(item => item.currentStock <= item.reorderLevel).length;
  const assetsInMaintenance = branchAssets.filter(item => item.status === 'maintenance').length;
  const vehiclesAvailable = branchVehicles.filter(v => v.status === 'available').length;
  const facilitiesOccupied = branchFacilities.filter(f => f.status === 'occupied').length;
  const openTickets = branchTickets.filter(t => t.status !== 'closed').length;
  const criticalTickets = branchTickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length;

  const activeBranchName = branches.find(b => b.id === activeBranch)?.name || 'Unknown Branch';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Branch Dashboard</h2>
        
        <Select value={activeBranch} onValueChange={(value) => setActiveBranch(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <h3 className="text-xl font-semibold">{activeBranchName} - Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Inventory</span>
              <Package className="h-5 w-5 text-safend-red" />
            </CardTitle>
            <CardDescription>Stock management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branchInventory.length}</div>
            <div className="flex items-center mt-2">
              <Progress 
                value={(branchInventory.length - lowStockItems) / branchInventory.length * 100 || 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            {lowStockItems > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {lowStockItems} low stock
              </Badge>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Assets</span>
              <Wrench className="h-5 w-5 text-safend-red" />
            </CardTitle>
            <CardDescription>Equipment tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branchAssets.length}</div>
            <div className="flex items-center mt-2">
              <Progress 
                value={(branchAssets.length - assetsInMaintenance) / branchAssets.length * 100 || 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            {assetsInMaintenance > 0 && (
              <Badge variant="outline" className="ml-auto">
                {assetsInMaintenance} in maintenance
              </Badge>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Fleet</span>
              <Truck className="h-5 w-5 text-safend-red" />
            </CardTitle>
            <CardDescription>Vehicle status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branchVehicles.length}</div>
            <div className="flex items-center mt-2">
              <Progress 
                value={(vehiclesAvailable / branchVehicles.length) * 100 || 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Badge variant="secondary" className="ml-auto">
              {vehiclesAvailable} available
            </Badge>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Facilities</span>
              <Building className="h-5 w-5 text-safend-red" />
            </CardTitle>
            <CardDescription>Room bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{branchFacilities.length}</div>
            <div className="flex items-center mt-2">
              <Progress 
                value={((branchFacilities.length - facilitiesOccupied) / branchFacilities.length) * 100 || 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Badge variant="outline" className="ml-auto">
              {facilitiesOccupied} occupied
            </Badge>
          </CardFooter>
        </Card>
      </div>
      
      {/* Additional quick status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Documents</span>
              <FileText className="h-5 w-5 text-safend-red" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Branch policies</div>
              </div>
              <Badge variant="secondary">3 pending review</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Visitors</span>
              <Users className="h-5 w-5 text-safend-red" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Today's visitors</div>
              </div>
              <Badge variant="outline">5 active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Support</span>
              <TicketIcon className="h-5 w-5 text-safend-red" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{openTickets}</div>
                <div className="text-sm text-muted-foreground">Open tickets</div>
              </div>
              {criticalTickets > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {criticalTickets} critical
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-card rounded-lg p-4 space-y-4">
          {branchTickets.slice(0, 3).map((ticket) => (
            <div key={ticket.id} className="flex justify-between items-center p-3 border-b last:border-0">
              <div>
                <h4 className="font-medium">{ticket.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={ticket.status === 'open' ? 'destructive' : 
                           ticket.status === 'in-progress' ? 'default' : 
                           'outline'}>
                {ticket.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
