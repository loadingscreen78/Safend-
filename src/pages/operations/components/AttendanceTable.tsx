
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
import { useDataStore, AttendanceRecord, Employee, SecurityPost, ManpowerRequirement } from "@/services/DataService";

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
  const attendanceRecords = useDataStore(state => state.attendanceRecords);
  const employees = useDataStore(state => state.employees);
  const securityPosts = useDataStore(state => state.securityPosts);
  const manpowerRequirements = useDataStore(state => state.manpowerRequirements);
  
  // Get employee name
  const getEmployeeName = (employeeId: string): string => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };
  
  // Get post name
  const getPostName = (postId: string): string => {
    const post = securityPosts.find(post => post.id === postId);
    return post ? post.name : 'Unknown';
  };
  
  // Get requirement details
  const getRequirementDetails = (requirementId: string): { shift: string, role: string } | null => {
    const requirement = manpowerRequirements.find(req => req.id === requirementId);
    return requirement ? { shift: requirement.shift, role: requirement.role } : null;
  };
  
  // Filter attendance records based on selected filter
  const filteredAttendance = attendanceRecords.filter(record => {
    const today = new Date().toISOString().split('T')[0];
    
    // Filter by date/status
    if (filter === "Today" && record.date !== today) {
      return false;
    } else if (filter === "This Week") {
      const recordDate = new Date(record.date);
      const currentDate = new Date();
      const firstDay = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      
      if (recordDate < firstDay || recordDate > lastDay) {
        return false;
      }
    } else if (filter === "Issues" && record.status === "Present") {
      return false;
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
            filteredAttendance.map((record) => {
              const requirement = getRequirementDetails(record.requirementId);
              return (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                  <TableCell className="hidden md:table-cell">{getPostName(record.postId)}</TableCell>
                  <TableCell>
                    {requirement && (
                      <>
                        <div>{requirement.shift} Shift</div>
                        <div className="text-xs text-gray-500">{requirement.role}</div>
                      </>
                    )}
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
              );
            })
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
