
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
import { Eye, Edit, Trash2, Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for rotas
const mockRotas = [
  {
    id: "R2025-001",
    postName: "Summit Tower - Main Entrance",
    week: "May 6 - May 12, 2025",
    staff: ["John Smith", "Emma Wilson", "Michael Davis", "Sarah Johnson", "James Thompson"],
    status: "Published",
    createdBy: "Admin User",
    createdDate: "2025-05-01",
  },
  {
    id: "R2025-002",
    postName: "Metro Building - Reception",
    week: "May 6 - May 12, 2025",
    staff: ["Lisa Brown", "Robert Green", "Anna Williams"],
    status: "Published",
    createdBy: "Admin User",
    createdDate: "2025-05-01",
  },
  {
    id: "R2025-003",
    postName: "Riverside Apartments - Concierge",
    week: "May 6 - May 12, 2025",
    staff: ["David Jones", "Laura Taylor", "Kevin White", "Helen Miller"],
    status: "Draft",
    createdBy: "Admin User",
    createdDate: "2025-05-02",
  },
  {
    id: "R2025-004",
    postName: "Northern Rail Station - Security",
    week: "May 13 - May 19, 2025",
    staff: ["John Smith", "Emma Wilson", "Michael Davis", "Sarah Johnson", "James Thompson", "Lisa Brown"],
    status: "Draft",
    createdBy: "Admin User",
    createdDate: "2025-05-03",
  },
  {
    id: "R2025-005",
    postName: "SafeEnd Office - Reception",
    week: "May 6 - May 12, 2025",
    staff: ["Robert Green", "Anna Williams"],
    status: "Published",
    createdBy: "Admin User",
    createdDate: "2025-05-01",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Published":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Draft":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface RotaTableProps {
  filter: string;
  searchTerm?: string; // Made searchTerm optional
  onEdit: (rota: any) => void;
}

export function RotaTable({ filter, searchTerm = '', onEdit }: RotaTableProps) {
  const { toast } = useToast();
  
  // Filter rotas based on selected filter and search term
  const filteredRotas = mockRotas.filter(rota => {
    // Filter by keyword
    if (filter === "Current Week" && !rota.week.includes("May 6")) {
      return false;
    } else if (filter === "Next Week" && !rota.week.includes("May 13")) {
      return false;
    } else if (filter !== "All Rotas" && filter !== "Current Week" && 
               filter !== "Next Week" && filter !== "Monthly" && 
               filter !== "Holiday Cover") {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && ![rota.id, rota.postName, rota.week, rota.status, ...rota.staff].some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    toast({
      title: "Rota Deleted",
      description: `Rota ${id} has been deleted successfully.`,
      duration: 3000,
    });
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Rota Details",
      description: `Viewing details for rota ${id}.`,
      duration: 3000,
    });
  };
  
  const handleDownload = (id: string) => {
    toast({
      title: "Downloading Rota",
      description: `Downloading rota ${id} as PDF.`,
      duration: 3000,
    });
  };
  
  const handleSendToStaff = (id: string, staff: string[]) => {
    toast({
      title: "Sending Rota to Staff",
      description: `Sending rota ${id} to ${staff.length} staff members.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Staff rotas and schedules</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Rota ID</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Week</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRotas.length > 0 ? (
            filteredRotas.map((rota) => (
              <TableRow key={rota.id}>
                <TableCell className="font-medium">{rota.id}</TableCell>
                <TableCell>{rota.postName}</TableCell>
                <TableCell>{rota.week}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      {rota.staff.length} Staff
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(rota.status)}</TableCell>
                <TableCell className="hidden md:table-cell">{rota.createdDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(rota.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(rota.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {rota.status === "Published" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleSendToStaff(rota.id, rota.staff)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(rota)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => handleDelete(rota.id)}
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
                No rotas found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
