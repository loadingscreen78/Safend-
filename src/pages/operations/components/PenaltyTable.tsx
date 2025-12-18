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
import { Eye, Edit, Trash2, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for penalties
const mockPenaltyData = [
  {
    id: "PEN001",
    staffName: "John Smith",
    post: "Summit Tower - Main Entrance",
    date: "2025-05-01",
    violation: "Late Arrival",
    points: 1,
    description: "Arrived 15 minutes late without notification",
    status: "Open",
  },
  {
    id: "PEN002",
    staffName: "Emma Wilson",
    post: "Metro Building - Reception",
    date: "2025-04-28",
    violation: "Improper Uniform",
    points: 1,
    description: "Not wearing complete uniform as per regulations",
    status: "Resolved",
  },
  {
    id: "PEN003",
    staffName: "Michael Davis",
    post: "Riverside Apartments - Concierge",
    date: "2025-04-29",
    violation: "Unauthorized Absence",
    points: 3,
    description: "Left post without proper handover",
    status: "Appealed",
  },
  {
    id: "PEN004",
    staffName: "Sarah Johnson",
    post: "Northern Rail Station - Security",
    date: "2025-05-02",
    violation: "Protocol Breach",
    points: 2,
    description: "Failed to follow visitor registration protocol",
    status: "Open",
  },
  {
    id: "PEN005",
    staffName: "James Thompson",
    post: "SafeEnd Office - Reception",
    date: "2025-04-27",
    violation: "Mobile Phone Usage",
    points: 1,
    description: "Using mobile phone during duty hours",
    status: "Dismissed",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Open":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    case "Resolved":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Appealed":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    case "Dismissed":
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getViolationBadge = (violation: string) => {
  switch (violation) {
    case "Late Arrival":
      return <Badge className="bg-orange-500 hover:bg-orange-600">{violation}</Badge>;
    case "Unauthorized Absence":
      return <Badge className="bg-red-500 hover:bg-red-600">{violation}</Badge>;
    case "Protocol Breach":
      return <Badge className="bg-purple-500 hover:bg-purple-600">{violation}</Badge>;
    case "Improper Uniform":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{violation}</Badge>;
    case "Mobile Phone Usage":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">{violation}</Badge>;
    default:
      return <Badge>{violation}</Badge>;
  }
};

interface PenaltyTableProps {
  filter: string;
  searchTerm?: string; // Make searchTerm optional
  onEdit: (penalty: any) => void;
}

export function PenaltyTable({ filter, searchTerm = '', onEdit }: PenaltyTableProps) {
  const { toast } = useToast();
  
  // Filter penalties based on selected filter and search term
  const filteredPenalties = mockPenaltyData.filter(penalty => {
    // Filter by status
    if (filter === "Open" && penalty.status !== "Open") {
      return false;
    } else if (filter === "Resolved" && penalty.status !== "Resolved") {
      return false;
    } else if (filter === "Appealed" && penalty.status !== "Appealed") {
      return false;
    } else if (filter === "Dismissed" && penalty.status !== "Dismissed") {
      return false;
    } else if (filter !== "All Penalties" && filter !== "Open" && 
               filter !== "Resolved" && filter !== "Appealed" && 
               filter !== "Dismissed") {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !Object.values(penalty).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    toast({
      title: "Penalty Record Deleted",
      description: `Penalty record ${id} has been deleted successfully.`,
      duration: 3000,
    });
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Penalty Details",
      description: `Viewing details for penalty record ${id}.`,
      duration: 3000,
    });
  };
  
  const handleResolve = (id: string) => {
    toast({
      title: "Penalty Resolved",
      description: `Penalty record ${id} has been marked as resolved.`,
      duration: 3000,
    });
  };
  
  const handleAppeal = (id: string) => {
    toast({
      title: "Penalty Appealed",
      description: `Appeal registered for penalty record ${id}.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Staff penalty records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Penalty ID</TableHead>
            <TableHead>Staff Name</TableHead>
            <TableHead className="hidden md:table-cell">Post</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Violation</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPenalties.length > 0 ? (
            filteredPenalties.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{record.staffName}</TableCell>
                <TableCell className="hidden md:table-cell">{record.post}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{getViolationBadge(record.violation)}</TableCell>
                <TableCell>{record.points}</TableCell>
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
                    {record.status === "Open" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-500 hover:text-green-600"
                          onClick={() => handleResolve(record.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => handleAppeal(record.id)}
                        >
                          <Clock className="h-4 w-4" />
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
                No penalty records found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
