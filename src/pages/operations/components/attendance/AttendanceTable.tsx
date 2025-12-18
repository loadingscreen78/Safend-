
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
import { Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for attendance records
const mockAttendanceData = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    employeeName: "John Smith",
    postId: "P001",
    postName: "Main Building",
    date: "2025-05-07",
    shift: "Morning",
    role: "Security Guard",
    status: "Present",
    checkInTime: "08:02",
    checkOutTime: "16:01",
    requirementId: "REQ001",
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    employeeName: "Emma Wilson",
    postId: "P001",
    postName: "Main Building",
    date: "2025-05-07",
    shift: "Evening",
    role: "Supervisor",
    status: "Late",
    checkInTime: "16:15",
    checkOutTime: "00:03",
    requirementId: "REQ002",
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    employeeName: "Michael Davis",
    postId: "P002",
    postName: "Warehouse",
    date: "2025-05-07",
    shift: "Night",
    role: "Security Guard",
    status: "Absent",
    checkInTime: "",
    checkOutTime: "",
    requirementId: "REQ003",
  },
  {
    id: "ATT004",
    employeeId: "EMP004",
    employeeName: "Sarah Johnson",
    postId: "P003",
    postName: "Office Complex",
    date: "2025-05-07",
    shift: "Morning",
    role: "Security Guard",
    status: "Present",
    checkInTime: "07:55",
    checkOutTime: "16:00",
    requirementId: "REQ004",
  },
  {
    id: "ATT005",
    employeeId: "EMP005",
    employeeName: "James Thompson",
    postId: "P003",
    postName: "Office Complex",
    date: "2025-05-07",
    shift: "Evening",
    role: "Security Guard",
    status: "Half Day",
    checkInTime: "16:00",
    checkOutTime: "20:30",
    requirementId: "REQ005",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Present":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Late":
    case "Half Day":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    case "Absent":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface AttendanceTableProps {
  filter: string;
  onEdit: (attendance: any) => void;
}

export function AttendanceTable({ filter, onEdit }: AttendanceTableProps) {
  const { toast } = useToast();
  
  // Filter attendance records based on selected filter
  const filteredAttendance = mockAttendanceData.filter(record => {
    if (filter === "daily") {
      return true; // Show all for daily view
    } else if (filter === "weekly") {
      // In a real app, filter by current week
      return true;
    } else if (filter === "monthly") {
      // In a real app, filter by current month
      return true;
    } else if (filter === "issues") {
      return ["Late", "Absent", "Half Day"].includes(record.status);
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    toast({
      title: "Record Deleted",
      description: `Attendance record ${id} has been deleted successfully.`,
      duration: 3000,
    });
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Attendance Record",
      description: `Viewing details for attendance record ${id}.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Staff attendance records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Record ID</TableHead>
            <TableHead>Staff Name</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Shift & Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell className="hidden md:table-cell">{record.postName}</TableCell>
                <TableCell>
                  <div>{record.shift} Shift</div>
                  <div className="text-xs text-gray-500">{record.role}</div>
                </TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {record.status !== 'Absent' ? (
                    <>
                      {record.checkInTime ? record.checkInTime : '--:--'} - {record.checkOutTime ? record.checkOutTime : '--:--'}
                    </>
                  ) : (
                    '--:-- / --:--'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(record.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
                No attendance records found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
