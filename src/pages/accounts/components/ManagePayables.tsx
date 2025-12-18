
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
import { Calendar, Plus } from 'lucide-react';
import { ExpenseForm } from './forms/ExpenseForm';

interface PayablesProps {
  filter: string;
}

export function ManagePayables({ filter }: PayablesProps) {
  const { selectedBranch } = useAccountsContext();
  const [activeTab, setActiveTab] = useState('pending');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  
  // Fetch payables
  const { data: payables, isLoading } = useAccountsData(
    () => AccountsService.getPayables({
      branchId: selectedBranch || undefined,
      status: activeTab === 'all' ? undefined : activeTab
    }),
    [selectedBranch, activeTab],
    [],
    "Failed to load payables"
  );
  
  // Fetch payment requests
  const { data: paymentRequests, isLoading: isLoadingRequests } = useAccountsData(
    () => AccountsService.getPaymentRequests({
      branchId: selectedBranch || undefined,
      status: activeTab === 'all' ? undefined : activeTab
    }),
    [selectedBranch, activeTab],
    [],
    "Failed to load payment requests"
  );
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts Payable</h2>
          <p className="text-muted-foreground">
            Manage expenses, vendor payments and payment requests
          </p>
        </div>
        <Button onClick={() => setShowExpenseForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Expense
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{payables?.filter(p => p.status === 'pending')
                .reduce((sum, p) => sum + p.totalAmount, 0)
                .toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {payables?.filter(p => p.status === 'pending').length || 0} pending payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ₹{payables?.filter(p => p.status === 'overdue')
                .reduce((sum, p) => sum + p.totalAmount, 0)
                .toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {payables?.filter(p => p.status === 'overdue').length || 0} overdue payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{payables?.filter(p => {
                  const dueDate = new Date(p.dueDate);
                  const now = new Date();
                  return dueDate.getMonth() === now.getMonth() &&
                         dueDate.getFullYear() === now.getFullYear();
                })
                .reduce((sum, p) => sum + p.totalAmount, 0)
                .toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Due this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
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
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor/Employee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading payables...
                      </TableCell>
                    </TableRow>
                  ) : payables && payables.length > 0 ? (
                    payables.map((payable) => (
                      <TableRow key={payable.id}>
                        <TableCell className="font-medium">{payable.description}</TableCell>
                        <TableCell>
                          {payable.vendorName || payable.employeeName || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formatDate(payable.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell>{formatAmount(payable.totalAmount)}</TableCell>
                        <TableCell>{getStatusBadge(payable.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          {payable.status === 'pending' && (
                            <Button variant="outline" size="sm" className="ml-2">
                              Pay
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No payables found. Create a new expense to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Payment Requests Section */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Payment Requests</h3>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingRequests ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading payment requests...
                      </TableCell>
                    </TableRow>
                  ) : paymentRequests && paymentRequests.length > 0 ? (
                    paymentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.purpose}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{formatDate(request.requestedDate)}</TableCell>
                        <TableCell>{formatAmount(request.amount)}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          {request.status === 'requested' && (
                            <>
                              <Button variant="outline" size="sm" className="ml-2">
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="ml-2">
                                Reject
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No payment requests found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Expense Form Dialog */}
      <ExpenseForm 
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
      />
    </div>
  );
}
