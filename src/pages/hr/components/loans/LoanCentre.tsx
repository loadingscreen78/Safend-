
import { useState } from "react";
import { LoanCentreProps, Loan, LoanInstallment } from "../index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, CircleDollarSign, FilePlus2, Send, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockLoans } from "@/data/mockLoans";
import { mockLoanInstallments } from "@/data/mockLoanInstallments";
import { LoansList } from "./LoansList";
import { LoanRequestForm } from "./LoanRequestForm";
import { AmortizationChart } from "./AmortizationChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitLoanRequestToAccounts } from "@/services/LoanService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function LoanCentre({ filter = "All" }: LoanCentreProps) {
  const [activeTab, setActiveTab] = useState("active");
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [installments, setInstallments] = useState<LoanInstallment[]>(mockLoanInstallments);
  const [isLoanRequestOpen, setIsLoanRequestOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { toast } = useToast();

  // Stats calculations
  const activeLoans = loans.filter(loan => loan.status === "ACTIVE");
  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
  const pendingRequests = loans.filter(loan => loan.status === "REQUESTED").length;
  
  // Handle sending loan request to accounts
  const handleSendToAccounts = (loanId: string) => {
    const updatedLoan = submitLoanRequestToAccounts(loanId);
    
    if (updatedLoan) {
      setLoans(loans.map(loan => 
        loan.id === loanId ? updatedLoan : loan
      ));
      
      toast({
        title: "Request Sent to Accounts",
        description: "The loan request has been sent to accounts for approval",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send request to accounts",
        variant: "destructive",
      });
    }
  };
  
  // Handle new loan request
  const handleNewLoanRequest = (loanData: Omit<Loan, 'id' | 'requestedOn' | 'status'>) => {
    const newLoan: Loan = {
      id: `LOAN${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: "REQUESTED",
      requestedOn: new Date().toISOString(),
      accountsRequestStatus: 'DRAFT',
      ...loanData
    };
    
    setLoans([...loans, newLoan]);
    setIsLoanRequestOpen(false);
    
    toast({
      title: "Loan Requested",
      description: "New loan request has been created. Please send it to accounts for approval.",
    });
  };
  
  // View loan details
  const handleViewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
  };

  const getAccountsStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch(status) {
      case 'DRAFT':
        return <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">Draft</span>;
      case 'SENT_TO_ACCOUNTS':
        return <span className="text-amber-500 bg-amber-100 px-2 py-1 rounded text-xs">Pending Accounts Approval</span>;
      case 'APPROVED_BY_ACCOUNTS':
        return <span className="text-green-500 bg-green-100 px-2 py-1 rounded text-xs">Approved by Accounts</span>;
      case 'REJECTED_BY_ACCOUNTS':
        return <span className="text-red-500 bg-red-100 px-2 py-1 rounded text-xs">Rejected by Accounts</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employee Loan Centre</h2>
          <p className="text-muted-foreground">
            Manage salary advances, uniform fees, and training fee loans
          </p>
        </div>
        
        <Button 
          onClick={() => setIsLoanRequestOpen(true)}
          className="flex gap-2"
        >
          <Plus className="h-4 w-4" /> Request New Loan
        </Button>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          All loan requests need to be sent to the Accounts department for approval. 
          Create a loan request and then submit it for approval.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalActiveAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingRequests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹8,600</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="requests">Loan Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="history">Loan History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <LoansList
            loans={loans.filter(loan => loan.status === "ACTIVE")}
            installments={installments}
            onViewLoan={handleViewLoan}
          />
          
          {selectedLoan && selectedLoan.status === "ACTIVE" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Loan Repayment Schedule</CardTitle>
                <CardDescription>
                  Amortization schedule for {selectedLoan.employeeName}'s loan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AmortizationChart loan={selectedLoan} installments={installments.filter(i => i.loanId === selectedLoan.id)} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="requests" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">New Loan Requests</h3>
            <p className="text-sm text-muted-foreground">
              These are new loan requests that need to be sent to accounts for approval.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Employee</th>
                  <th className="text-left p-2">Loan Type</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Requested On</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.filter(loan => loan.status === "REQUESTED" && (!loan.accountsRequestStatus || loan.accountsRequestStatus === 'DRAFT')).map(loan => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{loan.employeeName}</td>
                    <td className="p-2">{loan.type.replace('_', ' ')}</td>
                    <td className="p-2">₹{loan.principal.toLocaleString()}</td>
                    <td className="p-2">{new Date(loan.requestedOn).toLocaleDateString()}</td>
                    <td className="p-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleSendToAccounts(loan.id)}
                      >
                        <Send className="h-3 w-3" /> Send to Accounts
                      </Button>
                    </td>
                  </tr>
                ))}
                {loans.filter(loan => loan.status === "REQUESTED" && (!loan.accountsRequestStatus || loan.accountsRequestStatus === 'DRAFT')).length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No new loan requests to process
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Pending Accounts Approval</h3>
            <p className="text-sm text-muted-foreground">
              These loan requests have been sent to the accounts department and are waiting for approval.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Employee</th>
                  <th className="text-left p-2">Loan Type</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Sent On</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.filter(loan => loan.accountsRequestStatus === 'SENT_TO_ACCOUNTS').map(loan => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{loan.employeeName}</td>
                    <td className="p-2">{loan.type.replace('_', ' ')}</td>
                    <td className="p-2">₹{loan.principal.toLocaleString()}</td>
                    <td className="p-2">{loan.sentToAccountsOn ? new Date(loan.sentToAccountsOn).toLocaleDateString() : '-'}</td>
                    <td className="p-2">{getAccountsStatusBadge(loan.accountsRequestStatus)}</td>
                  </tr>
                ))}
                {loans.filter(loan => loan.accountsRequestStatus === 'SENT_TO_ACCOUNTS').length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No loan requests pending approval from accounts
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <LoansList
            loans={loans.filter(loan => ["CLOSED", "REJECTED"].includes(loan.status) || loan.accountsRequestStatus === 'REJECTED_BY_ACCOUNTS')}
            installments={installments}
            onViewLoan={handleViewLoan}
            showAccountsStatus={true}
          />
        </TabsContent>
      </Tabs>
      
      {/* Loan Request Form Modal */}
      <LoanRequestForm
        isOpen={isLoanRequestOpen}
        onClose={() => setIsLoanRequestOpen(false)}
        onSubmit={handleNewLoanRequest}
      />
    </div>
  );
}
