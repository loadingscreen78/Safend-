
import { Loan, LoanInstallment } from "../index";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircleDollarSign, CheckCircle, XCircle, Eye } from "lucide-react";

interface LoanCardProps {
  loan: Loan;
  installments: LoanInstallment[];
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function LoanCard({ 
  loan, 
  installments,
  onView,
  onApprove,
  onReject 
}: LoanCardProps) {
  // Calculate progress for active loans
  const progress = loan.principal > 0 
    ? Math.round(((loan.principal - loan.balance) / loan.principal) * 100) 
    : 0;
  
  // Get status badge properties
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { variant: "outline" as const, className: "bg-green-50 text-green-700 border-green-200" };
      case "REQUESTED":
        return { variant: "outline" as const, className: "bg-amber-50 text-amber-700 border-amber-200" };
      case "APPROVED":
        return { variant: "outline" as const, className: "bg-blue-50 text-blue-700 border-blue-200" };
      case "CLOSED":
        return { variant: "outline" as const, className: "bg-gray-50 text-gray-700 border-gray-200" };
      case "REJECTED":
        return { variant: "outline" as const, className: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { variant: "outline" as const, className: "" };
    }
  };
  
  // Get loan type display name
  const getLoanTypeName = (type: string) => {
    switch (type) {
      case "ADVANCE_SALARY": return "Salary Advance";
      case "NEGATIVE_BALANCE": return "Negative Balance";
      case "UNIFORM_FEE": return "Uniform Fee";
      case "TRAINING_FEE": return "Training Fee";
      default: return type;
    }
  };
  
  const statusBadge = getStatusBadge(loan.status);
  const displayDate = new Date(loan.requestedOn).toLocaleDateString();
  const isPending = loan.status === "REQUESTED";
  const nextInstallment = installments.find(i => i.status === "PENDING");
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{loan.employeeName}</h3>
            <p className="text-sm text-muted-foreground">{getLoanTypeName(loan.type)}</p>
          </div>
          <Badge variant={statusBadge.variant} className={statusBadge.className}>
            {loan.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="text-sm">Principal</div>
            <div className="font-medium">₹{loan.principal.toLocaleString()}</div>
          </div>
          
          {loan.status === "ACTIVE" && (
            <>
              <div className="flex justify-between">
                <div className="text-sm">Outstanding</div>
                <div className="font-medium">₹{loan.balance.toLocaleString()}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Repayment Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              {nextInstallment && (
                <div className="flex justify-between">
                  <div className="text-sm">Next Installment</div>
                  <div className="font-medium">
                    ₹{nextInstallment.amount} on {new Date(nextInstallment.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-between">
            <div className="text-sm">EMI Months</div>
            <div className="font-medium">{loan.emiMonths}</div>
          </div>
          
          {loan.status === "REQUESTED" && (
            <div className="flex justify-between">
              <div className="text-sm">Monthly Deduction</div>
              <div className="font-medium">₹{Math.round(loan.principal / loan.emiMonths).toLocaleString()}</div>
            </div>
          )}
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Requested on {displayDate}</span>
            {loan.approvedOn && <span>Approved on {new Date(loan.approvedOn).toLocaleDateString()}</span>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" /> Details
        </Button>
        
        {isPending && onApprove && (
          <Button variant="default" size="sm" onClick={onApprove}>
            <CheckCircle className="h-4 w-4 mr-1" /> Approve
          </Button>
        )}
        
        {isPending && onReject && (
          <Button variant="destructive" size="sm" onClick={onReject}>
            <XCircle className="h-4 w-4 mr-1" /> Reject
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
