
import { useState } from 'react';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { useAccountsContext } from '@/context/AccountsContext';
import { AccountsService, ComplianceReturn, LedgerEntry } from '@/services/accounts/AccountsService';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DateRangeSelector } from '@/components/accounts/DateRangeSelector';
import { 
  Search, FileText, FileCheck, Download, ArrowUpCircle,
  Calculator, IndianRupee, Calendar, MoreHorizontal, 
  BookOpen, FileInput, Receipt, CheckCircle, XCircle,
  Briefcase
} from 'lucide-react';
import { formatIndianCurrency, formatIndianDate } from '@/utils/errorHandler';

export interface ComplianceModuleProps {
  filter: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  
  switch(status) {
    case 'pending': variant = "outline"; break;
    case 'prepared': variant = "secondary"; break;
    case 'filed': variant = "default"; break;
    case 'paid': variant = "default"; break;
    case 'late': variant = "destructive"; break;
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

export function ComplianceModule({ filter }: ComplianceModuleProps) {
  const { selectedBranch, dateRange, setDateRange } = useAccountsContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(filter.toLowerCase().includes('gst') ? 'gst' : 
                                          filter.toLowerCase().includes('tds') ? 'tds' : 
                                          filter.toLowerCase().includes('ledger') ? 'ledger' : 'gst');
  
  const startDate = dateRange?.startDate.toISOString().split('T')[0];
  const endDate = dateRange?.endDate.toISOString().split('T')[0];
  
  // Fetch GST returns data
  const { 
    data: gstReturns, 
    isLoading: isLoadingGst 
  } = useAccountsData(
    () => AccountsService.getComplianceReturns('gst', {
      branchId: selectedBranch || undefined,
      search: searchQuery || undefined
    }),
    [selectedBranch, searchQuery, activeTab],
    [],
    "Failed to load GST returns data"
  );
  
  // Fetch TDS returns data
  const { 
    data: tdsReturns, 
    isLoading: isLoadingTds 
  } = useAccountsData(
    () => activeTab === 'tds' ? AccountsService.getComplianceReturns('tds', {
      branchId: selectedBranch || undefined,
      search: searchQuery || undefined
    }) : Promise.resolve([]),
    [selectedBranch, searchQuery, activeTab],
    [],
    "Failed to load TDS returns data"
  );
  
  // Fetch ledger entries
  const {
    data: ledgerEntries,
    isLoading: isLoadingLedger
  } = useAccountsData(
    () => activeTab === 'ledger' && startDate && endDate 
      ? AccountsService.getLedgerEntries({
          branchId: selectedBranch || undefined,
          startDate,
          endDate,
          search: searchQuery || undefined
        })
      : Promise.resolve([]),
    [selectedBranch, searchQuery, activeTab, startDate, endDate],
    [],
    "Failed to load ledger entries"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Refetch based on active tab
  };
  
  const handleDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderGstReturns = () => {
    if (isLoadingGst) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading GST returns data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!gstReturns || gstReturns.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No GST returns found.
          </TableCell>
        </TableRow>
      );
    }
    
    return gstReturns.map((gstReturn) => (
      <TableRow 
        key={gstReturn.id}
        className="cursor-pointer hover:bg-muted/50"
      >
        <TableCell className="font-medium">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <span>{gstReturn.returnType}</span>
          </div>
        </TableCell>
        <TableCell>{gstReturn.period}</TableCell>
        <TableCell>{formatIndianDate(gstReturn.dueDate)}</TableCell>
        <TableCell>{formatIndianCurrency(gstReturn.amount)}</TableCell>
        <TableCell>
          <StatusBadge status={gstReturn.status} />
        </TableCell>
        <TableCell>{gstReturn.filingDate ? formatIndianDate(gstReturn.filingDate) : '-'}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  
  const renderTdsReturns = () => {
    if (isLoadingTds) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading TDS returns data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!tdsReturns || tdsReturns.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No TDS returns found.
          </TableCell>
        </TableRow>
      );
    }
    
    return tdsReturns.map((tdsReturn) => (
      <TableRow 
        key={tdsReturn.id}
        className="cursor-pointer hover:bg-muted/50"
      >
        <TableCell className="font-medium">
          <div className="flex items-center">
            <FileCheck className="h-4 w-4 mr-2 text-green-500" />
            <span>{tdsReturn.returnType}</span>
          </div>
        </TableCell>
        <TableCell>{tdsReturn.period}</TableCell>
        <TableCell>{formatIndianDate(tdsReturn.dueDate)}</TableCell>
        <TableCell>{formatIndianCurrency(tdsReturn.amount)}</TableCell>
        <TableCell>
          <StatusBadge status={tdsReturn.status} />
        </TableCell>
        <TableCell>{tdsReturn.filingDate ? formatIndianDate(tdsReturn.filingDate) : '-'}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  
  const renderLedgerEntries = () => {
    if (isLoadingLedger) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading ledger data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!ledgerEntries || ledgerEntries.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No ledger entries found for the selected period.
          </TableCell>
        </TableRow>
      );
    }
    
    return ledgerEntries.map((entry) => (
      <TableRow 
        key={entry.id}
        className="hover:bg-muted/50"
      >
        <TableCell>{formatIndianDate(entry.date)}</TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center">
            {entry.referenceType === 'invoice' && <Receipt className="h-4 w-4 mr-2 text-blue-500" />}
            {entry.referenceType === 'payment' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
            {entry.referenceType === 'bill' && <FileText className="h-4 w-4 mr-2 text-orange-500" />}
            {entry.referenceType === 'expense' && <XCircle className="h-4 w-4 mr-2 text-red-500" />}
            {entry.referenceType === 'asset' && <Briefcase className="h-4 w-4 mr-2 text-purple-500" />}
            {entry.referenceType === 'liability' && <ArrowUpCircle className="h-4 w-4 mr-2 text-amber-500" />}
            {entry.referenceType === 'journal' && <BookOpen className="h-4 w-4 mr-2 text-slate-500" />}
            <span>{entry.description}</span>
          </div>
        </TableCell>
        <TableCell>{entry.account} ({entry.accountCode})</TableCell>
        <TableCell className="text-right">{entry.debit > 0 ? formatIndianCurrency(entry.debit) : ''}</TableCell>
        <TableCell className="text-right">{entry.credit > 0 ? formatIndianCurrency(entry.credit) : ''}</TableCell>
        <TableCell className="text-right font-medium">{formatIndianCurrency(entry.balance)}</TableCell>
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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compliance Management</h2>
          <p className="text-muted-foreground">
            Manage GST, TDS and maintain statutory ledgers
          </p>
        </div>
        
        <DateRangeSelector onRangeChange={handleDateRangeChange} className="min-w-72" />
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="gst">GST Compliance</TabsTrigger>
          <TabsTrigger value="tds">TDS Compliance</TabsTrigger>
          <TabsTrigger value="ledger">Ledger Book</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gst" className="space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                placeholder="Search GST returns..."
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
                <Calculator className="h-4 w-4 mr-2" />
                Prepare GST Return
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg">GST Returns</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filing Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderGstReturns()}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {gstReturns?.length || 0} GST returns
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="tds" className="space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                placeholder="Search TDS returns..."
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
                <Calculator className="h-4 w-4 mr-2" />
                Prepare TDS Return
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg">TDS Returns</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filing Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTdsReturns()}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {tdsReturns?.length || 0} TDS returns
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ledger" className="space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                placeholder="Search ledger entries..."
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
                <BookOpen className="h-4 w-4 mr-2" />
                New Journal Entry
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg">Ledger Book</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderLedgerEntries()}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {ledgerEntries?.length || 0} ledger entries
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
