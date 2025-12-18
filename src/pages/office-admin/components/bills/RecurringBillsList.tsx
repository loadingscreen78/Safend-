
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
import { Calendar, Edit, Eye, Trash2 } from "lucide-react";
import { format } from 'date-fns';

interface RecurringBillsListProps {
  searchQuery: string;
}

export function RecurringBillsList({ searchQuery }: RecurringBillsListProps) {
  // Mock data - would come from API in real implementation
  const recurringBills = [
    {
      id: "BILL-001",
      name: "Office Rent",
      category: "rent",
      vendorName: "Prestige Properties",
      frequency: "monthly",
      amount: 78000,
      currency: "INR",
      nextDueDate: "2025-05-15T00:00:00Z",
      status: "active",
      startDate: "2023-01-01T00:00:00Z",
      endDate: null
    },
    {
      id: "BILL-002",
      name: "Internet Subscription",
      category: "utility",
      vendorName: "Airtel Business",
      frequency: "monthly",
      amount: 8999,
      currency: "INR",
      nextDueDate: "2025-05-05T00:00:00Z",
      status: "active",
      startDate: "2023-06-01T00:00:00Z",
      endDate: null
    },
    {
      id: "BILL-003",
      name: "Security Software License",
      category: "subscription",
      vendorName: "SecureTech Solutions",
      frequency: "yearly",
      amount: 120000,
      currency: "INR",
      nextDueDate: "2025-08-15T00:00:00Z",
      status: "active",
      startDate: "2023-08-15T00:00:00Z",
      endDate: null
    },
    {
      id: "BILL-004",
      name: "Water Dispenser Rental",
      category: "equipment",
      vendorName: "Pure Water Co.",
      frequency: "quarterly",
      amount: 9000,
      currency: "INR",
      nextDueDate: "2025-07-01T00:00:00Z",
      status: "active",
      startDate: "2024-01-01T00:00:00Z",
      endDate: null
    },
    {
      id: "BILL-005",
      name: "Office Cleaning",
      category: "service",
      vendorName: "CleanPro Services",
      frequency: "monthly",
      amount: 15000,
      currency: "INR",
      nextDueDate: "2025-05-10T00:00:00Z",
      status: "suspended",
      startDate: "2023-11-01T00:00:00Z",
      endDate: null
    }
  ];

  const filteredBills = recurringBills.filter(
    bill => 
      bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.frequency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Active</Badge>;
      case 'suspended': return <Badge variant="outline" className="text-amber-500 border-amber-500">Suspended</Badge>;
      case 'expired': return <Badge variant="outline" className="text-gray-500">Expired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'biannual': return 'Bi-Annual';
      case 'yearly': return 'Yearly';
      default: return frequency;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bill ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBills.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No recurring bills found
              </TableCell>
            </TableRow>
          ) : (
            filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell className="font-mono text-xs">{bill.id}</TableCell>
                <TableCell className="font-medium">{bill.name}</TableCell>
                <TableCell className="capitalize">{bill.category}</TableCell>
                <TableCell>{bill.vendorName}</TableCell>
                <TableCell>{getFrequencyText(bill.frequency)}</TableCell>
                <TableCell>{format(new Date(bill.nextDueDate), 'dd MMM yyyy')}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(bill.amount, bill.currency)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(bill.status)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit Bill">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete Bill" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
