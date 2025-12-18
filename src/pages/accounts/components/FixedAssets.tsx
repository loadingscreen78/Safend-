import { useState } from 'react';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { useAccountsContext } from '@/context/AccountsContext';
import { AccountsService, FixedAsset } from '@/services/accounts/AccountsService';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { formatIndianCurrency, formatIndianDate } from '@/utils/errorHandler';
import { 
  Search, Plus, Filter, Download, 
  Briefcase, Laptop, Building, Camera, Car,
  MoreHorizontal
} from 'lucide-react';

export interface FixedAssetsProps {
  filter: string;
}

export function FixedAssets({ filter }: FixedAssetsProps) {
  const { selectedBranch } = useAccountsContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('assets');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch fixed assets data
  const { 
    data: fixedAssets, 
    isLoading: isLoadingAssets,
    refetch: refetchAssets
  } = useAccountsData(
    () => AccountsService.getFixedAssets({ 
      branchId: selectedBranch || undefined,
      category: filter.toLowerCase()
    }),
    [selectedBranch, filter],
    [],
    "Failed to load fixed assets data"
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchAssets();
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
    
    switch(status) {
      case 'active': variant = "default"; break;
      case 'under_maintenance': variant = "secondary"; break;
      case 'sold': variant = "outline"; break;
      case 'scrapped': variant = "destructive"; break;
    }
    
    return (
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    );
  };

  // Render assets table
  const renderAssets = () => {
    if (isLoadingAssets) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading assets data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!fixedAssets || fixedAssets.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No assets found for the selected filter.
          </TableCell>
        </TableRow>
      );
    }
    
    return fixedAssets.map((asset) => (
      <TableRow key={asset.id}>
        <TableCell className="font-medium">
          <div className="flex items-center">
            {asset.category === 'laptop' && <Laptop className="h-4 w-4 mr-2 text-blue-500" />}
            {asset.category === 'building' && <Building className="h-4 w-4 mr-2 text-green-500" />}
            {asset.category === 'camera' && <Camera className="h-4 w-4 mr-2 text-orange-500" />}
            {asset.category === 'car' && <Car className="h-4 w-4 mr-2 text-purple-500" />}
            <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
            <span>{asset.name}</span>
          </div>
        </TableCell>
        <TableCell>{asset.location}</TableCell>
        <TableCell>{formatIndianDate(asset.purchaseDate)}</TableCell>
        <TableCell>{formatIndianCurrency(asset.purchasePrice)}</TableCell>
        <TableCell>{formatIndianCurrency(asset.netBookValue)}</TableCell>
        <TableCell>
          <StatusBadge status={asset.status} />
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fixed Assets</h2>
          <p className="text-muted-foreground">
            Manage company assets and track depreciation
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            placeholder="Search assets..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="default">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Asset
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="assets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Asset List</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Net Book Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderAssets()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Asset Reports</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-6">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Briefcase className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-1">No reports available</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Generate detailed reports on asset depreciation, value, and maintenance
                </p>
                <Button className="mt-4">Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Asset Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-6">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Briefcase className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-1">No maintenance records</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Track maintenance schedules, costs, and repairs for your assets
                </p>
                <Button className="mt-4">Add Maintenance Record</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
