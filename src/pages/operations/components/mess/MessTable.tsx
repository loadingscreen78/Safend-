
import { useState } from "react";
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
import { Eye, Edit, Trash2, IndianRupee, FileText, CheckCircle2 } from "lucide-react";
import { useToastWithSound } from "@/hooks/use-toast-with-sound";
import { format } from "date-fns";

interface MessTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (data: any) => void;
}

export function MessTable({ filter, searchTerm, onEdit }: MessTableProps) {
  const { toast } = useToastWithSound();
  
  // Mock data for mess records
  const [messRecords] = useState([
    {
      id: "MR-001",
      employeeId: "EMP-001",
      employeeName: "Rajesh Kumar",
      postId: "OP-1234",
      postName: "Corporate Office Security",
      quantity: 10,
      date: "2025-05-01",
      unitPrice: 50,
      totalAmount: 500,
      status: "processed",
      sentToAccounts: true,
      accountsRequestId: "ACC-REQ-001",
      approvedByAccounts: true,
      deductedFromSalary: true
    },
    {
      id: "MR-002",
      employeeId: "EMP-002",
      employeeName: "Amit Singh",
      postId: "OP-1234",
      postName: "Corporate Office Security",
      quantity: 15,
      date: "2025-05-01",
      unitPrice: 50,
      totalAmount: 750,
      status: "processed",
      sentToAccounts: true,
      accountsRequestId: "ACC-REQ-001",
      approvedByAccounts: true,
      deductedFromSalary: false
    },
    {
      id: "MR-003",
      employeeId: "EMP-003",
      employeeName: "Priya Sharma",
      postId: "OP-2345",
      postName: "Factory Security",
      quantity: 12,
      date: "2025-05-01",
      unitPrice: 50,
      totalAmount: 600,
      status: "processed",
      sentToAccounts: true,
      accountsRequestId: "ACC-REQ-002",
      approvedByAccounts: false,
      deductedFromSalary: false
    },
    {
      id: "MR-004",
      employeeId: "EMP-004",
      employeeName: "Suresh Patel",
      postId: "OP-3456",
      postName: "Hotel Security",
      quantity: 8,
      date: "2025-05-02",
      unitPrice: 60,
      totalAmount: 480,
      status: "pending",
      sentToAccounts: false,
      accountsRequestId: null,
      approvedByAccounts: false,
      deductedFromSalary: false
    },
  ]);
  
  // Filter records based on current filter
  const filteredRecords = messRecords.filter(record => {
    // Apply search filter
    if (searchTerm && 
        !record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !record.postName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply tab filter
    if (filter === "consumption") {
      return true; // Show all in consumption tab
    } else if (filter === "charges") {
      return record.status === "processed"; // Show only processed in charges tab
    } else if (filter === "employees") {
      return true; // Show all in employees tab, would be grouped by employee
    } else if (filter === "posts") {
      return true; // Show all in posts tab, would be grouped by post
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    toast.warning({
      title: "Delete Record",
      description: `Are you sure you want to delete record ${id}?`,
    });
  };
  
  const handleSendToAccounts = (id: string) => {
    toast.success({
      title: "Record Sent",
      description: `Record ${id} has been sent to accounts for processing.`,
    });
  };
  
  const getStatusBadge = (record: any) => {
    if (record.deductedFromSalary) {
      return <Badge className="bg-green-600 hover:bg-green-700">Deducted from Salary</Badge>;
    }
    
    if (record.approvedByAccounts) {
      return <Badge className="bg-purple-500 hover:bg-purple-600">Approved by Accounts</Badge>;
    }
    
    if (record.sentToAccounts) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Sent to Accounts</Badge>;
    }
    
    switch (record.status) {
      case "processed":
        return <Badge className="bg-green-500 hover:bg-green-600">Processed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>;
      default:
        return <Badge>{record.status}</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Mess consumption and charge records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            {filter !== "posts" && <TableHead>Post</TableHead>}
            {filter !== "employees" && <TableHead>Employee</TableHead>}
            <TableHead>Meals</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{format(new Date(record.date), "dd MMM yyyy")}</TableCell>
                {filter !== "posts" && <TableCell>{record.postName}</TableCell>}
                {filter !== "employees" && <TableCell>{record.employeeName}</TableCell>}
                <TableCell>{record.quantity}</TableCell>
                <TableCell>₹{record.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(record)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {record.status === "processed" && !record.sentToAccounts && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => handleSendToAccounts(record.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {record.status !== "processed" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                No mess records found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
