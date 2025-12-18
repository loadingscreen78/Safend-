
import { useState } from 'react';
import { useAccountsContext } from '@/context/AccountsContext';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { AccountsService } from '@/services/accounts/AccountsService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Plus, FileText, DollarSign } from 'lucide-react';
import { InvoiceForm } from './forms/InvoiceForm';

interface ReceivablesProps {
  filter: string;
}

export function ManageReceivables({ filter }: ReceivablesProps) {
  const { selectedBranch } = useAccountsContext();
  const [activeTab, setActiveTab] = useState('outstanding');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  
  // Fetch receivables
  const { data: receivables, isLoading } = useAccountsData(
    () => AccountsService.getReceivables({
      branchId: selectedBranch || undefined,
      status: activeTab === 'all' ? undefined : activeTab
    }),
    [selectedBranch, activeTab],
    [],
    "Failed to load receivables"
  );
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'outstanding':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Outstanding</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'partially_paid':
        return <Badge className="bg-blue-500">Partially Paid</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd/MM/yyyy');
  };
  
  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };
  
  // Get counts and totals
  const outstandingCount = receivables?.filter(r => r.status === 'outstanding').length || 0;
  const overdueCount = receivables?.filter(r => r.status === 'overdue').length || 0;
  const outstandingTotal = receivables?.filter(r => r.status === 'outstanding')
    .reduce((sum, r) => sum + r.totalAmount, 0) || 0;
  const overdueTotal = receivables?.filter(r => r.status === 'overdue')
    .reduce((sum, r) => sum + r.totalAmount, 0) || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts Receivable</h2>
          <p className="text-muted-foreground">
            Manage invoices, client payments and collection
          </p>
        </div>
        <Button onClick={() => setShowInvoiceForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(outstandingTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              {outstandingCount} outstanding invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatAmount(overdueTotal)}
            </div>
            <p className="text-xs text-muted-foreground">
              {overdueCount} overdue invoices
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(receivables?.filter(r => {
                const issueDate = new Date(r.issueDate);
                const now = new Date();
                return issueDate.getMonth() === now.getMonth() &&
                       issueDate.getFullYear() === now.getFullYear();
              }).reduce((sum, r) => sum + r.totalAmount, 0) || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Issued this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading invoices...
                      </TableCell>
                    </TableRow>
                  ) : receivables && receivables.length > 0 ? (
                    receivables.map((receivable) => (
                      <TableRow key={receivable.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {receivable.invoiceNumber || receivable.id.slice(0, 8)}
                          </div>
                        </TableCell>
                        <TableCell>{receivable.clientName}</TableCell>
                        <TableCell>{formatDate(receivable.issueDate)}</TableCell>
                        <TableCell>{formatDate(receivable.dueDate)}</TableCell>
                        <TableCell>{formatAmount(receivable.totalAmount)}</TableCell>
                        <TableCell>{getStatusBadge(receivable.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          {(receivable.status === 'outstanding' || receivable.status === 'overdue') && (
                            <Button variant="outline" size="sm" className="ml-2">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Record Payment
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No invoices found. Create a new invoice to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Invoice Form Dialog */}
      <InvoiceForm 
        isOpen={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
      />
    </div>
  );
}
