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
import { Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for leave requests
const mockLeaveData = [
  {
    id: "LR001",
    staffName: "John Smith",
    type: "Annual Leave",
    fromDate: "2025-05-10",
    toDate: "2025-05-17",
    days: 7,
    reason: "Family holiday",
    status: "Pending",
    requestDate: "2025-05-01",
  },
  {
    id: "LR002",
    staffName: "Emma Wilson",
    type: "Sick Leave",
    fromDate: "2025-05-05",
    toDate: "2025-05-06",
    days: 2,
    reason: "Flu",
    status: "Approved",
    requestDate: "2025-05-02",
  },
  {
    id: "LR003",
    staffName: "Michael Davis",
    type: "Annual Leave",
    fromDate: "2025-05-20",
    toDate: "2025-05-24",
    days: 5,
    reason: "Personal time",
    status: "Approved",
    requestDate: "2025-04-25",
  },
  {
    id: "LR004",
    staffName: "Sarah Johnson",
    type: "Emergency Leave",
    fromDate: "2025-05-04",
    toDate: "2025-05-05",
    days: 2,
    reason: "Family emergency",
    status: "Approved",
    requestDate: "2025-05-03",
  },
  {
    id: "LR005",
    staffName: "James Thompson",
    type: "Annual Leave",
    fromDate: "2025-06-15",
    toDate: "2025-06-21",
    days: 7,
    reason: "Vacation",
    status: "Pending",
    requestDate: "2025-05-02",
  },
  {
    id: "LR006",
    staffName: "Lisa Brown",
    type: "Sick Leave",
    fromDate: "2025-05-01",
    toDate: "2025-05-03",
    days: 3,
    reason: "Fever",
    status: "Rejected",
    requestDate: "2025-04-30",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Pending":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    case "Rejected":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "Annual Leave":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{type}</Badge>;
    case "Sick Leave":
      return <Badge className="bg-purple-500 hover:bg-purple-600">{type}</Badge>;
    case "Emergency Leave":
      return <Badge className="bg-orange-500 hover:bg-orange-600">{type}</Badge>;
    default:
      return <Badge>{type}</Badge>;
  }
};

interface LeaveManagementTableProps {
  filter: string;
  searchTerm?: string; // Make searchTerm optional
  onEdit: (leave: any) => void;
}

export function LeaveManagementTable({ filter, searchTerm = '', onEdit }: LeaveManagementTableProps) {
  const { toast } = useToast();
  
  // Filter leave requests based on selected filter and search term
  const filteredLeave = mockLeaveData.filter(record => {
    // Filter by status
    if (filter === "Pending" && record.status !== "Pending") {
      return false;
    } else if (filter === "Approved" && record.status !== "Approved") {
      return false;
    } else if (filter === "Rejected" && record.status !== "Rejected") {
      return false;
    } else if (filter === "Expired" && new Date(record.toDate) >= new Date()) {
      return false;
    } else if (filter !== "All Leave" && filter !== "Pending" && 
               filter !== "Approved" && filter !== "Rejected" && 
               filter !== "Expired") {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    toast({
      title: "Leave Request Deleted",
      description: `Leave request ${id} has been deleted successfully.`,
      duration: 3000,
    });
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Leave Request",
      description: `Viewing details for leave request ${id}.`,
      duration: 3000,
    });
  };
  
  const handleApprove = (id: string) => {
    toast({
      title: "Leave Request Approved",
      description: `Leave request ${id} has been approved.`,
      duration: 3000,
    });
  };
  
  const handleReject = (id: string) => {
    toast({
      title: "Leave Request Rejected",
      description: `Leave request ${id} has been rejected.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Staff leave requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Staff Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeave.length > 0 ? (
            filteredLeave.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{record.staffName}</TableCell>
                <TableCell>{getTypeBadge(record.type)}</TableCell>
                <TableCell>{record.fromDate}</TableCell>
                <TableCell>{record.toDate}</TableCell>
                <TableCell>{record.days}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(record.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {record.status === "Pending" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-500 hover:text-green-600"
                          onClick={() => handleApprove(record.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleReject(record.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No leave requests found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
