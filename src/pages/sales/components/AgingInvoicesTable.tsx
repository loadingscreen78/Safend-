
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Mail, Phone, Send, Printer, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for aging invoices
const mockAgingInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2025-0042",
    clientName: "Summit Security Limited",
    contactPerson: "John Smith",
    amount: "₹1,25,000",
    invoiceDate: "2025-03-01",
    dueDate: "2025-04-01",
    agingDays: 25,
    status: "Pending",
    remindersSent: 1,
  },
  {
    id: 2,
    invoiceNumber: "INV-2025-0036",
    clientName: "Metro Building Management",
    contactPerson: "Sarah Johnson",
    amount: "₹2,47,500",
    invoiceDate: "2025-02-15",
    dueDate: "2025-03-15",
    agingDays: 42,
    status: "Overdue",
    remindersSent: 2,
  },
  {
    id: 3,
    invoiceNumber: "INV-2025-0028",
    clientName: "Citywide Properties",
    contactPerson: "Michael Davis",
    amount: "₹1,80,000",
    invoiceDate: "2025-02-01",
    dueDate: "2025-03-01",
    agingDays: 56,
    status: "Overdue",
    remindersSent: 3,
  },
  {
    id: 4,
    invoiceNumber: "INV-2025-0015",
    clientName: "Riverside Apartments",
    contactPerson: "Emma Wilson",
    amount: "₹91,500",
    invoiceDate: "2025-01-10",
    dueDate: "2025-02-10",
    agingDays: 75,
    status: "Severely Overdue",
    remindersSent: 4,
  },
  {
    id: 5,
    invoiceNumber: "INV-2024-0097",
    clientName: "Northern Rail Stations",
    contactPerson: "James Thompson",
    amount: "₹1,80,000",
    invoiceDate: "2024-12-15",
    dueDate: "2025-01-15",
    agingDays: 101,
    status: "Severely Overdue",
    remindersSent: 5,
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    case "Overdue":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    case "Severely Overdue":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    case "Paid":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Partially Paid":
      return <Badge className="bg-purple-500 hover:bg-purple-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getAgingClass = (days: number) => {
  if (days <= 30) return "text-blue-600 dark:text-blue-400";
  if (days <= 60) return "text-amber-600 dark:text-amber-400";
  if (days <= 90) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400 font-bold";
};

interface AgingInvoicesTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (invoice: any) => void;
}

export function AgingInvoicesTable({ filter, searchTerm, onEdit }: AgingInvoicesTableProps) {
  const { toast } = useToast();
  
  // Filter invoices based on selected filter and search term
  const filteredInvoices = mockAgingInvoices.filter(invoice => {
    // Filter by aging range
    if (filter === "0-30 Days" && (invoice.agingDays < 0 || invoice.agingDays > 30)) {
      return false;
    } else if (filter === "31-60 Days" && (invoice.agingDays < 31 || invoice.agingDays > 60)) {
      return false;
    } else if (filter === "61-90 Days" && (invoice.agingDays < 61 || invoice.agingDays > 90)) {
      return false;
    } else if (filter === "90+ Days" && invoice.agingDays <= 90) {
      return false;
    } else if (filter !== "All Invoices" && 
              filter !== "0-30 Days" && 
              filter !== "31-60 Days" && 
              filter !== "61-90 Days" && 
              filter !== "90+ Days") {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !Object.values(invoice).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  const handleDelete = (id: number) => {
    toast({
      title: "Collection Task Deleted",
      description: `Collection task for invoice #${id} has been deleted.`,
      duration: 3000,
    });
  };
  
  const handleView = (id: number) => {
    toast({
      title: "Viewing Invoice Details",
      description: `Viewing details for invoice #${id}.`,
      duration: 3000,
    });
  };
  
  const handleSendEmail = (invoice: any) => {
    toast({
      title: "Payment Reminder Email",
      description: `Sending payment reminder email to ${invoice.clientName}.`,
      duration: 3000,
    });
  };
  
  const handleSendPost = (invoice: any) => {
    toast({
      title: "Send Via Post",
      description: `Preparing to send payment reminder via post to ${invoice.clientName}.`,
      duration: 3000,
    });
  };
  
  const handleCall = (invoice: any) => {
    toast({
      title: "Call Client",
      description: `Initiating follow-up call to ${invoice.contactPerson}.`,
      duration: 3000,
    });
  };
  
  const handleMarkAsPaid = (id: number) => {
    toast({
      title: "Invoice Marked as Paid",
      description: `Invoice #${id} has been marked as paid.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Aging invoices requiring collection</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Amount</TableHead>
            <TableHead className="hidden lg:table-cell">Due Date</TableHead>
            <TableHead>Aging</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>
                  {invoice.clientName}
                  <div className="text-xs text-muted-foreground mt-1">
                    {invoice.contactPerson}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{invoice.amount}</TableCell>
                <TableCell className="hidden lg:table-cell">{invoice.dueDate}</TableCell>
                <TableCell>
                  <span className={getAgingClass(invoice.agingDays)}>
                    {invoice.agingDays} days
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {invoice.remindersSent} reminders
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(invoice.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleSendEmail(invoice)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCall(invoice)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleSendPost(invoice)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-green-500 hover:text-green-600"
                      onClick={() => handleMarkAsPaid(invoice.id)}
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(invoice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No aging invoices found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
