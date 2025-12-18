import { useState } from "react";
import { EmployeeDirectoryProps } from "./index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  FileSpreadsheet, Filter, MoreVertical, Search, 
  Upload, UserPlus, PlusCircle, Users
} from "lucide-react";
import { EmployeeForm } from "./employee/EmployeeForm";
import { useToast } from "@/hooks/use-toast";

// Mock employee data
const employees = [
  {
    id: "EMP0001",
    name: "John Smith",
    email: "john.smith@safend.com",
    department: "Operations",
    designation: "Security Supervisor",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0002",
    name: "Sarah Johnson",
    email: "sarah.johnson@safend.com",
    department: "Operations",
    designation: "Security Officer",
    status: "Active",
    joinDate: "2023-03-10",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0003",
    name: "Michael Brown",
    email: "michael.brown@safend.com",
    department: "Operations",
    designation: "Security Officer",
    status: "Active",
    joinDate: "2023-04-22",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0004",
    name: "Emily Wilson",
    email: "emily.wilson@safend.com",
    department: "Admin",
    designation: "HR Manager",
    status: "Active",
    joinDate: "2022-11-05",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0005",
    name: "Robert Davis",
    email: "robert.davis@safend.com",
    department: "Operations",
    designation: "Security Officer",
    status: "On Leave",
    joinDate: "2023-02-18",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0006",
    name: "Jessica Thompson",
    email: "jessica.thompson@safend.com",
    department: "Sales",
    designation: "Sales Manager",
    status: "Active",
    joinDate: "2022-09-30",
    avatar: "/placeholder.svg",
  },
  {
    id: "EMP0007",
    name: "Daniel Moore",
    email: "daniel.moore@safend.com",
    department: "Operations",
    designation: "Security Officer",
    status: "Inactive",
    joinDate: "2023-05-12",
    avatar: "/placeholder.svg",
  },
];

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: string;
  joinDate: string;
  avatar: string;
  phoneNumber?: string;
  address?: string;
}

export function EmployeeDirectory({ filter }: EmployeeDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(filter === "All Employees" ? "all" : filter.toLowerCase());
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const filteredEmployees = employees.filter((emp) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      Object.values(emp).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Apply department filter
    const matchesDepartment =
      departmentFilter === "all" || emp.department === departmentFilter;

    // Apply status filter
    const matchesStatus = 
      statusFilter === "all" ||
      emp.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "Inactive":
        return <Badge variant="destructive">{status}</Badge>;
      case "On Leave":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEmployeeFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsEmployeeFormOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = (employee: any) => {
    toast({
      title: selectedEmployee ? "Employee Updated" : "Employee Added",
      description: `${employee.name} has been ${selectedEmployee ? "updated" : "added"} successfully`,
    });
    setIsEmployeeFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Accounts">Accounts</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button variant="outline" className="flex gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            className="flex gap-2 bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900"
            onClick={handleAddEmployee}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </Button>
        </div>
      </div>

      <Card className="shadow-md border-t-4 border-t-red-600">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            Employee Directory
          </CardTitle>
          <CardDescription>
            Manage employee records, personal details, and documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/30">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-gray-200 p-1 bg-white">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback className="bg-gradient-to-br from-red-50 to-red-100 text-red-600">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditEmployee(employee)}>
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Upload Documents</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">View Salary</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 cursor-pointer">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-muted-foreground">No employees found matching your criteria</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 flex items-center gap-1"
                          onClick={handleAddEmployee}
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add New Employee
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <EmployeeForm 
        isOpen={isEmployeeFormOpen} 
        onClose={handleCloseForm} 
        onSave={handleSaveEmployee} 
        employee={selectedEmployee}
      />
    </div>
  );
}
