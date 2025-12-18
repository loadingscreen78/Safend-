
import { Loan, LoanInstallment } from "../index";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Send } from "lucide-react";

interface LoansListProps {
  loans: Loan[];
  installments: LoanInstallment[];
  onViewLoan: (loan: Loan) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onSendToAccounts?: (id: string) => void;
  showAccountsStatus?: boolean;
}

export function LoansList({ 
  loans, 
  installments, 
  onViewLoan,
  onApprove,
  onReject,
  onSendToAccounts,
  showAccountsStatus = false
}: LoansListProps) {
  
  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Requested</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "ACTIVE":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>;
      case "CLOSED":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get accounts status badge
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

  // Find installments for a loan
  const getLoanInstallments = (loanId: string) => {
    return installments.filter(inst => inst.loanId === loanId);
  };

  // Calculate EMI amount
  const getEmiAmount = (loan: Loan) => {
    const loanInstallments = getLoanInstallments(loan.id);
    if (loanInstallments.length > 0) {
      return loanInstallments[0].amount;
    }
    return Math.round(loan.principal / loan.emiMonths);
  };

  // Calculate remaining EMIs
  const getRemainingEmis = (loan: Loan) => {
    const loanInstallments = getLoanInstallments(loan.id);
    return loanInstallments.filter(inst => inst.status === "PENDING").length;
  };

  if (loans.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md bg-gray-50">
        <p className="text-gray-500">No loans found matching the criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Employee</th>
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">EMI</th>
            <th className="text-left p-2">{showAccountsStatus ? "Accounts Status" : "Status"}</th>
            {showAccountsStatus && <th className="text-left p-2">Status</th>}
            <th className="text-left p-2">Date</th>
            <th className="text-right p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{loan.employeeName}</td>
              <td className="p-2">{loan.type.replace('_', ' ')}</td>
              <td className="p-2">{formatCurrency(loan.principal)}</td>
              <td className="p-2">{formatCurrency(getEmiAmount(loan))}</td>
              <td className="p-2">
                {showAccountsStatus 
                  ? getAccountsStatusBadge(loan.accountsRequestStatus)
                  : getStatusBadge(loan.status)
                }
              </td>
              {showAccountsStatus && (
                <td className="p-2">{getStatusBadge(loan.status)}</td>
              )}
              <td className="p-2">
                {loan.status === "REQUESTED" ? formatDate(loan.requestedOn) : 
                 loan.status === "ACTIVE" ? formatDate(loan.startDate) :
                 loan.status === "CLOSED" ? formatDate(loan.endDate) :
                 formatDate(loan.requestedOn)}
              </td>
              <td className="p-2 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onViewLoan(loan)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>
                  
                  {loan.status === "REQUESTED" && onApprove && onReject && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => onApprove(loan.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => onReject(loan.id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </Button>
                    </>
                  )}
                  
                  {loan.status === "REQUESTED" && loan.accountsRequestStatus === "DRAFT" && onSendToAccounts && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onSendToAccounts(loan.id)}
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send</span>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
