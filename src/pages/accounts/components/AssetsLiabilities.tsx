
import { useState } from 'react';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { useAccountsContext } from '@/context/AccountsContext';
import { AccountsService, Asset, Liability } from '@/services/accounts/AccountsService';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Search, Plus, ClipboardEdit, Briefcase, IndianRupee, 
  Landmark, TrendingDown, MoreHorizontal, FileInput, 
  ArrowDownCircle, BarChart2
} from 'lucide-react';
import { formatIndianCurrency, formatIndianDate } from '@/utils/errorHandler';
import { ChartComponent } from '@/components/accounts/ChartComponent';

export interface AssetsLiabilitiesProps {
  filter: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  
  switch(status) {
    case 'active': variant = "default"; break;
    case 'under_maintenance': variant = "secondary"; break;
    case 'sold': variant = "outline"; break;
    case 'scrapped': variant = "destructive"; break;
    case 'defaulted': variant = "destructive"; break;
    case 'closed': variant = "outline"; break;
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace('_', ' ')}
    </Badge>
  );
};

export function AssetsLiabilities({ filter }: AssetsLiabilitiesProps) {
  const { selectedBranch } = useAccountsContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(filter.toLowerCase().includes('asset') ? 'assets' : 'liabilities');
  
  // Fetch assets data
  const { 
    data: assets, 
    isLoading: isLoadingAssets 
  } = useAccountsData(
    () => AccountsService.getAssets({
      branchId: selectedBranch || undefined,
      search: searchQuery || undefined,
      category: filter.toLowerCase() !== 'assets' ? filter.toLowerCase() : undefined
    }),
    [selectedBranch, searchQuery, filter, activeTab],
    [],
    "Failed to load assets data"
  );
  
  // Fetch liabilities data
  const { 
    data: liabilities, 
    isLoading: isLoadingLiabilities 
  } = useAccountsData(
    () => activeTab === 'liabilities' ? AccountsService.getLiabilities({
      branchId: selectedBranch || undefined,
      search: searchQuery || undefined,
      type: filter.toLowerCase() !== 'liabilities' ? filter.toLowerCase() : undefined
    }) : Promise.resolve([]),
    [selectedBranch, searchQuery, filter, activeTab],
    [],
    "Failed to load liabilities data"
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Refetch based on active tab
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Calculate total asset value
  const totalAssetValue = assets?.reduce((sum, asset) => sum + asset.currentValue, 0) || 0;
  
  // Calculate total liability value
  const totalLiabilityValue = liabilities?.reduce((sum, liability) => sum + liability.remainingAmount, 0) || 0;
  
  // Prepare asset categories data for chart
  const assetCategoriesData = {
    labels: ['Building', 'Equipment', 'Vehicle', 'IT Assets', 'Furniture', 'Other'],
    datasets: [{
      name: 'Current Value',
      data: [
        assets?.filter(a => a.category === 'building').reduce((sum, a) => sum + a.currentValue, 0) || 0,
        assets?.filter(a => a.category === 'equipment').reduce((sum, a) => sum + a.currentValue, 0) || 0,
        assets?.filter(a => a.category === 'vehicle').reduce((sum, a) => sum + a.currentValue, 0) || 0,
        assets?.filter(a => a.category === 'it_asset').reduce((sum, a) => sum + a.currentValue, 0) || 0,
        assets?.filter(a => a.category === 'furniture').reduce((sum, a) => sum + a.currentValue, 0) || 0,
        assets?.filter(a => a.category === 'other').reduce((sum, a) => sum + a.currentValue, 0) || 0
      ]
    }]
  };
  
  // Prepare liability types data for chart
  const liabilityTypesData = {
    labels: ['Loans', 'Security Deposits', 'Inter Branch', 'Advances', 'Other'],
    datasets: [{
      name: 'Remaining Amount',
      data: [
        liabilities?.filter(l => l.type === 'loan').reduce((sum, l) => sum + l.remainingAmount, 0) || 0,
        liabilities?.filter(l => l.type === 'security_deposit').reduce((sum, l) => sum + l.remainingAmount, 0) || 0,
        liabilities?.filter(l => l.type === 'inter_branch').reduce((sum, l) => sum + l.remainingAmount, 0) || 0,
        liabilities?.filter(l => l.type === 'advance').reduce((sum, l) => sum + l.remainingAmount, 0) || 0,
        liabilities?.filter(l => l.type === 'other').reduce((sum, l) => sum + l.remainingAmount, 0) || 0
      ]
    }]
  };

  const renderAssetsList = () => {
    if (isLoadingAssets) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading assets data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!assets || assets.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No assets found.
          </TableCell>
        </TableRow>
      );
    }
    
    return assets.map((asset) => (
      <TableRow 
        key={asset.id}
        className="hover:bg-muted/50"
      >
        <TableCell className="font-medium">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
            <span className="truncate max-w-[200px]">{asset.name}</span>
          </div>
        </TableCell>
        <TableCell className="capitalize">{asset.category.replace('_', ' ')}</TableCell>
        <TableCell>{formatIndianDate(asset.purchaseDate)}</TableCell>
        <TableCell>{formatIndianCurrency(asset.purchasePrice)}</TableCell>
        <TableCell>{formatIndianCurrency(asset.currentValue)}</TableCell>
        <TableCell>{asset.depreciationRate}% ({asset.depreciationMethod})</TableCell>
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
  
  const renderLiabilitiesList = () => {
    if (isLoadingLiabilities) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading liabilities data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!liabilities || liabilities.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No liabilities found.
          </TableCell>
        </TableRow>
      );
    }
    
    return liabilities.map((liability) => (
      <TableRow 
        key={liability.id}
        className="hover:bg-muted/50"
      >
        <TableCell className="font-medium">
          <div className="flex items-center">
            <ArrowDownCircle className="h-4 w-4 mr-2 text-red-500" />
            <span className="truncate max-w-[200px]">{liability.name}</span>
          </div>
        </TableCell>
        <TableCell className="capitalize">{liability.type.replace('_', ' ')}</TableCell>
        <TableCell>{liability.creditorName || '-'}</TableCell>
        <TableCell>{formatIndianDate(liability.startDate)}</TableCell>
        <TableCell>{formatIndianCurrency(liability.amount)}</TableCell>
        <TableCell>{formatIndianCurrency(liability.remainingAmount)}</TableCell>
        <TableCell>
          <StatusBadge status={liability.status} />
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
          <h2 className="text-3xl font-bold tracking-tight">Assets & Liabilities</h2>
          <p className="text-muted-foreground">
            Manage fixed assets, loans, securities and liabilities
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Asset Value Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Asset Value</p>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-2xl font-bold">{formatIndianCurrency(totalAssetValue)}</span>
                    </div>
                  </div>
                  
                  <ChartComponent 
                    type="pie"
                    data={assetCategoriesData}
                    currency={true}
                    height={200}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Asset Depreciation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Purchase Value</p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        <span className="text-xl font-bold">
                          {formatIndianCurrency(assets?.reduce((sum, asset) => sum + asset.purchasePrice, 0) || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Total Depreciation</p>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-xl font-bold">
                          {formatIndianCurrency((assets?.reduce((sum, asset) => sum + asset.purchasePrice, 0) || 0) - totalAssetValue)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-green-500" />
                        <span className="text-xl font-bold">{formatIndianCurrency(totalAssetValue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button>
                      <ClipboardEdit className="h-4 w-4 mr-2" />
                      Run Depreciation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg">Assets Register</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Depreciation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderAssetsList()}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {assets?.length || 0} assets
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="liabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Liability Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Liabilities</p>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-2xl font-bold">{formatIndianCurrency(totalLiabilityValue)}</span>
                    </div>
                  </div>
                  
                  <ChartComponent 
                    type="pie"
                    data={liabilityTypesData}
                    currency={true}
                    height={200}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Repayment Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Original Amount</p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        <span className="text-xl font-bold">
                          {formatIndianCurrency(liabilities?.reduce((sum, liability) => sum + liability.amount, 0) || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paid</p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-green-500" />
                        <span className="text-xl font-bold">
                          {formatIndianCurrency((liabilities?.reduce((sum, liability) => sum + liability.amount, 0) || 0) - totalLiabilityValue)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-red-500" />
                        <span className="text-xl font-bold">{formatIndianCurrency(totalLiabilityValue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">Next payment due in 7 days</p>
                    <Button>
                      <IndianRupee className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                placeholder="Search liabilities..."
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Liability
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg">Liabilities Register</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Creditor</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Original Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderLiabilitiesList()}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {liabilities?.length || 0} liabilities
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
