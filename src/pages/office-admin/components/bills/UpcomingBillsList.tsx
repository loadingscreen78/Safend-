
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { formatDistanceToNow, isAfter, isPast } from 'date-fns';

interface UpcomingBillsListProps {
  searchQuery: string;
}

export function UpcomingBillsList({ searchQuery }: UpcomingBillsListProps) {
  // Mock data - would come from API in real implementation
  const upcomingBills = [
    {
      id: "DUE-001",
      billId: "BILL-001",
      name: "Office Rent - May 2025",
      category: "rent",
      vendorName: "Prestige Properties",
      dueDate: "2025-05-15T00:00:00Z",
      amount: 78000,
      currency: "INR",
      status: "upcoming",
      paymentReference: null
    },
    {
      id: "DUE-002",
      billId: "BILL-002",
      name: "Internet Subscription - May 2025",
      category: "utility",
      vendorName: "Airtel Business",
      dueDate: "2025-05-05T00:00:00Z",
      amount: 8999,
      currency: "INR",
      status: "upcoming",
      paymentReference: null
    },
    {
      id: "DUE-003",
      billId: "BILL-004",
      name: "Water Dispenser Rental - Q2 2025",
      category: "equipment",
      vendorName: "Pure Water Co.",
      dueDate: "2025-07-01T00:00:00Z",
      amount: 9000,
      currency: "INR",
      status: "upcoming",
      paymentReference: null
    },
    {
      id: "DUE-004",
      billId: "BILL-005",
      name: "Office Cleaning - April 2025",
      category: "service",
      vendorName: "CleanPro Services",
      dueDate: "2025-04-10T00:00:00Z",
      amount: 15000,
      currency: "INR",
      status: "paid",
      paymentReference: "ACC-PAY-2025-042"
    },
    {
      id: "DUE-005",
      billId: "BILL-002",
      name: "Internet Subscription - April 2025",
      category: "utility",
      vendorName: "Airtel Business",
      dueDate: "2025-04-05T00:00:00Z",
      amount: 8999,
      currency: "INR",
      status: "paid",
      paymentReference: "ACC-PAY-2025-038"
    }
  ];

  const filteredBills = upcomingBills.filter(
    bill => 
      bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status, dueDate) => {
    const date = new Date(dueDate);
    const today = new Date();
    const isOverdue = isPast(date);
    
    switch (status) {
      case 'upcoming': 
        if (isOverdue) {
          return <Badge variant="destructive">Overdue</Badge>;
        }
        // If due in less than 7 days
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);
        if (!isAfter(date, sevenDaysFromNow)) {
          return <Badge variant="outline" className="text-amber-500 border-amber-500">Due Soon</Badge>;
        }
        return <Badge variant="outline">Upcoming</Badge>;
      case 'paid': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Paid</Badge>;
      case 'processing': return <Badge variant="default">Processing</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getDueDisplay = (dueDate, status) => {
    if (status === 'paid') {
      return "Paid";
    }
    
    return formatDistanceToNow(new Date(dueDate), { addSuffix: true });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No upcoming bills found
              </TableCell>
            </TableRow>
          ) : (
            filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-mono text-xs">{bill.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{bill.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{bill.category}</div>
                </TableCell>
                <TableCell>{bill.vendorName}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {getDueDisplay(bill.dueDate, bill.status)}
                    </span>
                    <span className="text-xs">
                      {new Date(bill.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bill.amount, bill.currency)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(bill.status, bill.dueDate)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {bill.status === 'paid' ? (
                      <Button variant="outline" size="sm" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
