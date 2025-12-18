import { useState } from 'react';
import { useAccountsData } from '@/hooks/accounts/useAccountsData';
import { useAccountsContext } from '@/context/AccountsContext';
import { AccountsService, PaymentRequest, Expense } from '@/services/accounts/AccountsService';
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { formatIndianCurrency, formatIndianDate } from '@/utils/errorHandler';
import { 
  Search, Plus, Filter, CheckCircle, XCircle, 
  FileText, CreditCard, IndianRupee, Download,
  Mail, MoreHorizontal
} from 'lucide-react';

export interface AccountsPayableProps {
  filter: string;
}

export function AccountsPayable({ filter }: AccountsPayableProps) {
  const { selectedBranch } = useAccountsContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('bills');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch expenses data
  const { 
    data: expenses, 
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses
  } = useAccountsData(
    () => AccountsService.getExpenses({ 
      branchId: selectedBranch || undefined,
      status: filter.toLowerCase()
    }),
    [selectedBranch, filter],
    [],
    "Failed to load expenses data"
  );
  
  // Fetch payment requests
  const {
    data: paymentRequests,
    isLoading: isLoadingPaymentRequests,
    refetch: refetchPaymentRequests
  } = useAccountsData(
    () => AccountsService.getPaymentRequests(),
    [selectedBranch],
    [],
    "Failed to load payment requests"
  );
  
  // Handle creating a new expense
  const handleCreateExpense = async (data: Omit<Expense, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    try {
      await AccountsService.createExpense(data);
      refetchExpenses();
      toast({ title: "Success", description: "Expense created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create expense", variant: "destructive" });
    }
  };
  
  // Handle creating a payment request - fixed to include requestedDate
  const handleCreatePaymentRequest = async (data: Omit<PaymentRequest, 'id' | 'status' | 'approvedBy' | 'approvedDate' | 'paidDate'>) => {
    try {
      // Add the current date as requestedDate
      const requestData = {
        ...data,
        requestedDate: new Date().toISOString()
      };
      await AccountsService.createPaymentRequest(requestData);
      refetchPaymentRequests();
      toast({ title: "Success", description: "Payment request created successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create payment request", variant: "destructive" });
    }
  };
  
  // Approve a payment request
  const handleApproveRequest = async (requestId: string) => {
    try {
      await AccountsService.updatePaymentRequestStatus(requestId, "approved");
      refetchPaymentRequests();
      toast({ title: "Success", description: "Payment request approved" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve payment request", variant: "destructive" });
    }
  };
  
  // Reject a payment request
  const handleRejectRequest = async (requestId: string) => {
    try {
      await AccountsService.updatePaymentRequestStatus(requestId, "rejected");
      refetchPaymentRequests();
      toast({ title: "Success", description: "Payment request rejected" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject payment request", variant: "destructive" });
    }
  };
  
  // Mark a payment request as paid
  const handleMarkAsPaid = async (requestId: string) => {
    try {
      await AccountsService.updatePaymentRequestStatus(requestId, "paid");
      refetchPaymentRequests();
      toast({ title: "Success", description: "Payment request marked as paid" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update payment request", variant: "destructive" });
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchExpenses();
    refetchPaymentRequests();
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
    
    switch(status) {
      case 'pending': variant = "outline"; break;
      case 'approved': variant = "secondary"; break;
      case 'paid': variant = "default"; break;
      case 'rejected': variant = "destructive"; break;
      case 'completed': variant = "default"; break;
    }
    
    return (
      <Badge variant={variant} className="capitalize">
        {status}
      </Badge>
    );
  };

  // Render payment requests table
  const renderPaymentRequests = () => {
    if (isLoadingPaymentRequests) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading payment requests...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!paymentRequests || paymentRequests.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No payment requests found.
          </TableCell>
        </TableRow>
      );
    }
    
    return paymentRequests.map((request) => (
      <TableRow key={request.id}>
        <TableCell className="font-medium">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            <span>{request.purpose}</span>
          </div>
        </TableCell>
        <TableCell>{formatIndianCurrency(request.amount)}</TableCell>
        <TableCell>
          <StatusBadge status={request.status} />
        </TableCell>
        <TableCell className="text-right">
          {request.status === 'pending' && (
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleApproveRequest(request.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => handleRejectRequest(request.id)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
          {request.status === 'approved' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleMarkAsPaid(request.id)}
            >
              <IndianRupee className="h-4 w-4 mr-1" />
              Mark as Paid
            </Button>
          )}
          {(request.status === 'paid' || request.status === 'rejected') && (
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </TableCell>
      </TableRow>
    ));
  };
  
  // Render expenses table
  const renderExpenses = () => {
    if (isLoadingExpenses) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            Loading expenses data...
          </TableCell>
        </TableRow>
      );
    }
    
    if (!expenses || expenses.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
            No expenses found for the selected filter.
          </TableCell>
        </TableRow>
      );
    }
    
    return expenses.map((expense) => (
      <TableRow key={expense.id}>
        <TableCell className="font-medium">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
            <span>{expense.description}</span>
          </div>
        </TableCell>
        <TableCell>{expense.employeeName || 'N/A'}</TableCell>
        <TableCell>{expense.branchName || selectedBranch}</TableCell>
        <TableCell>{expense.category}</TableCell>
        <TableCell>{formatIndianDate(expense.date)}</TableCell>
        <TableCell>{formatIndianCurrency(expense.amount)}</TableCell>
        <TableCell>
          <StatusBadge status={expense.status} />
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };
  
  // Render payment requests table for approval tab
  const renderPaymentRequestsForApproval = () => {
    const pendingRequests = paymentRequests?.filter(req => req.status === 'pending') || [];
    
    if (isLoadingPaymentRequests) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            Loading payment requests...
          </TableCell>
        </TableRow>
      );
    }
    
    if (pendingRequests.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            No pending payment requests found.
          </TableCell>
        </TableRow>
      );
    }
    
    return pendingRequests.map((request) => (
      <TableRow key={request.id}>
        <TableCell className="font-medium">PR-{request.id.substring(0, 6)}</TableCell>
        <TableCell>{request.department || 'N/A'}</TableCell>
        <TableCell>{request.purpose || 'N/A'}</TableCell>
        <TableCell>{formatIndianCurrency(request.amount)}</TableCell>
        <TableCell>{request.requestedDate ? formatIndianDate(request.requestedDate) : 'N/A'}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleApproveRequest(request.id)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => handleRejectRequest(request.id)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts Payable</h2>
          <p className="text-muted-foreground">
            Manage expenses, bills, and payment requests
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            placeholder="Search payables..."
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
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="bills" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bills">Bills & Expenses</TabsTrigger>
          <TabsTrigger value="requests">Payment Requests</TabsTrigger>
          <TabsTrigger value="approval">For Approval</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bills" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Expenses & Bills</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderExpenses()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Payment Requests</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderPaymentRequests()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approval" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Pending Approval</CardTitle>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminders
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request #</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderPaymentRequestsForApproval()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Scheduled Payments</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Payment
              </Button>
            </CardHeader>
            <CardContent className="px-0 py-6">
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <IndianRupee className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No scheduled payments</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Schedule recurring payments or future dated transactions to appear here
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
