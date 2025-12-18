
import { useState } from "react";
import { LeaveManagementProps, LeaveApplication, LeaveBalance, UninformedLeave, AbscondCase } from "./index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  XCircle,
  CalendarIcon,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import LeaveHeatMap, UninformedLeaveList and AbscondCaseList components
import { LeaveHeatMap } from "./leave/LeaveHeatMap";
import { UninformedLeaveList } from "./leave/UninformedLeaveList";
import { AbscondCaseList } from "./leave/AbscondCaseList";
import { mockUninformedLeaves } from "@/data/mockUninformedLeaves";
import { mockAbscondCases } from "@/data/mockAbscondCases";

// Mock leave applications data
const mockLeaveApplications: LeaveApplication[] = [
  {
    id: "LA001",
    employeeId: "EMP0001",
    employeeName: "John Smith",
    leaveType: "casual",
    fromDate: "2025-05-10",
    toDate: "2025-05-12",
    days: 3,
    reason: "Family function",
    status: "approved",
    appliedOn: "2025-05-01",
    approvedBy: "HR Manager",
    approvedOn: "2025-05-02",
  },
  {
    id: "LA002",
    employeeId: "EMP0002",
    employeeName: "Sarah Johnson",
    leaveType: "sick",
    fromDate: "2025-05-15",
    toDate: "2025-05-16",
    days: 2,
    reason: "Not feeling well",
    status: "pending",
    appliedOn: "2025-05-05",
  },
  {
    id: "LA003",
    employeeId: "EMP0003",
    employeeName: "Michael Brown",
    leaveType: "earned",
    fromDate: "2025-05-20",
    toDate: "2025-05-25",
    days: 6,
    reason: "Vacation",
    status: "pending",
    appliedOn: "2025-05-01",
  },
  {
    id: "LA004",
    employeeId: "EMP0004",
    employeeName: "Emily Wilson",
    leaveType: "casual",
    fromDate: "2025-05-07",
    toDate: "2025-05-07",
    days: 1,
    reason: "Personal work",
    status: "rejected",
    appliedOn: "2025-05-01",
  },
];

// Mock leave balances data
const mockLeaveBalances: LeaveBalance[] = [
  {
    employeeId: "EMP0001",
    casual: 8,
    sick: 12,
    earned: 15,
    total: 35,
  },
  {
    employeeId: "EMP0002",
    casual: 6,
    sick: 10,
    earned: 15,
    total: 31,
  },
  {
    employeeId: "EMP0003",
    casual: 10,
    sick: 12,
    earned: 9,
    total: 31,
  },
  {
    employeeId: "EMP0004",
    casual: 12,
    sick: 12,
    earned: 15,
    total: 39,
  },
];

export function LeaveManagement({ filter }: LeaveManagementProps) {
  const [activeTab, setActiveTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLeaveDetailsDialog, setShowLeaveDetailsDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [processingLeaveId, setProcessingLeaveId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [branch, setBranch] = useState<string>("all");
  const [uninformedLeaves, setUninformedLeaves] = useState<UninformedLeave[]>(mockUninformedLeaves);
  const [abscondCases, setAbscondCases] = useState<AbscondCase[]>(mockAbscondCases);
  
  const { toast } = useToast();
  
  // Filter leave applications based on filter prop
  const filteredLeaveApplications = filter === "All" || filter === "All Leaves" 
    ? mockLeaveApplications 
    : filter.toLowerCase() === "pending" || filter.toLowerCase() === "approved" || filter.toLowerCase() === "rejected"
    ? mockLeaveApplications.filter(leave => leave.status.toLowerCase() === filter.toLowerCase())
    : mockLeaveApplications;
  
  // Filter leave applications based on search term
  const searchFilteredApplications = searchTerm
    ? filteredLeaveApplications.filter(leave => 
        leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredLeaveApplications;
  
  // Filter based on selected branch for uninformed leaves
  const filteredUninformedLeaves = branch === "all" 
    ? uninformedLeaves 
    : uninformedLeaves.filter(leave => leave.branchId === branch);
  
  const handleViewLeaveDetails = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setShowLeaveDetailsDialog(true);
  };
  
  const handleApproveLeave = async (leaveId: string) => {
    setProcessingLeaveId(leaveId);
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an API to approve the leave
    toast({
      title: "Leave Approved",
      description: "The leave application has been approved",
    });
    
    setProcessingLeaveId(null);
  };
  
  const handleRejectLeave = async (leaveId: string) => {
    setProcessingLeaveId(leaveId);
    
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an API to reject the leave
    toast({
      title: "Leave Rejected",
      description: "The leave application has been rejected",
    });
    
    setProcessingLeaveId(null);
  };
  
  // Handle resolving uninformed leave - from LeaveDashboard
  const handleResolveUninformedLeave = (leaveId: string, resolution: 'Regularized' | 'Converted' | 'Marked Abscond') => {
    setUninformedLeaves(leaves => 
      leaves.map(leave => 
        leave.id === leaveId 
          ? { ...leave, resolution, resolvedBy: "HR Manager" } 
          : leave
      )
    );
    
    toast({
      title: "Leave Updated",
      description: `Leave has been ${resolution.toLowerCase()}`,
    });
    
    // If marked as abscond, create abscond case
    if (resolution === 'Marked Abscond') {
      const leave = uninformedLeaves.find(l => l.id === leaveId);
      if (leave) {
        const newAbscondCase: AbscondCase = {
          id: `ABS${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          employeeId: leave.employeeId,
          employeeName: leave.employeeName,
          startDate: leave.date,
          lastContact: new Date(new Date(leave.date).getTime() - 86400000).toISOString().split('T')[0],
          status: "PENDING",
          remarks: "Created from uninformed leave.",
          createdAt: new Date().toISOString(),
          salaryCut: true
        };
        
        setAbscondCases([...abscondCases, newAbscondCase]);
        toast({
          title: "Abscond Case Created",
          description: `Employee ${leave.employeeName} marked as abscond`,
          variant: "destructive"
        });
      }
    }
  };

  // Handle closing abscond case - from LeaveDashboard
  const handleCloseAbscondCase = (caseId: string, remarks: string) => {
    setAbscondCases(cases => 
      cases.map(c => 
        c.id === caseId 
          ? { 
              ...c, 
              status: "CLOSED", 
              closedAt: new Date().toISOString(),
              closedBy: "HR Manager",
              remarks: remarks
            } 
          : c
      )
    );
    
    toast({
      title: "Case Closed",
      description: "Abscond case has been closed",
    });
  };
  
  const getLeaveTypeBadge = (leaveType: string) => {
    switch (leaveType) {
      case "casual":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Casual</Badge>;
      case "sick":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Sick</Badge>;
      case "earned":
        return <Badge className="bg-green-500 hover:bg-green-600">Earned</Badge>;
      case "unpaid":
        return <Badge variant="outline">Unpaid</Badge>;
      default:
        return <Badge>{leaveType}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Generate months for dropdown - from LeaveDashboard
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };
  
  // Stats calculations - combining from both components
  const plannedLeaveCount = 12; // Mock data, would be calculated from actual leaves
  const unplannedLeaveCount = 5; // Mock data
  const uninformedLeaveCount = uninformedLeaves.filter(leave => !leave.resolution).length;
  const abscondCount = abscondCases.filter(kase => kase.status === "PENDING").length;
  const pendingLeaveCount = mockLeaveApplications.filter(leave => leave.status === "pending").length;
  const approvedLeaveCount = mockLeaveApplications.filter(leave => leave.status === "approved").length;
  const rejectedLeaveCount = mockLeaveApplications.filter(leave => leave.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-muted-foreground">
            Track and manage employee leave applications, uninformed absences, and abscond cases
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="BR001">Main Branch</SelectItem>
                <SelectItem value="BR002">North Branch</SelectItem>
                <SelectItem value="BR003">East Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search leaves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[200px] md:w-[300px]"
            />
          </div>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="flex gap-2">
            <Plus className="h-4 w-4" />
            New Leave
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaveCount}</div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaveCount}</div>
            <p className="text-sm text-muted-foreground">Leaves approved</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Uninformed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{uninformedLeaveCount}</div>
            <p className="text-sm text-muted-foreground">Unplanned absences</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Abscond</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{abscondCount}</div>
            <p className="text-sm text-muted-foreground">Active cases</p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedLeaveCount}</div>
            <p className="text-sm text-muted-foreground">Denied leaves</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="applications">Leave Applications</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="uninformed">Uninformed Leaves</TabsTrigger>
          <TabsTrigger value="abscond">Abscond Cases</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        
        {/* Leave Applications Tab */}
        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Applications</CardTitle>
              <CardDescription>
                Manage employee leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchFilteredApplications.length > 0 ? (
                    searchFilteredApplications.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.employeeName}</TableCell>
                        <TableCell>{getLeaveTypeBadge(leave.leaveType)}</TableCell>
                        <TableCell>{new Date(leave.fromDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(leave.toDate).toLocaleDateString()}</TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell>{new Date(leave.appliedOn).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLeaveDetails(leave)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            
                            {leave.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-500 hover:text-green-600"
                                  onClick={() => handleApproveLeave(leave.id)}
                                  disabled={processingLeaveId === leave.id}
                                >
                                  {processingLeaveId === leave.id ? (
                                    <Clock className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => handleRejectLeave(leave.id)}
                                  disabled={processingLeaveId === leave.id}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No leave applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Leave Balances Tab */}
        <TabsContent value="balances" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Balances</CardTitle>
              <CardDescription>
                Employee leave balance summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Casual Leave</TableHead>
                    <TableHead>Sick Leave</TableHead>
                    <TableHead>Earned Leave</TableHead>
                    <TableHead>Total Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaveBalances.map((balance) => (
                    <TableRow key={balance.employeeId}>
                      <TableCell>{balance.employeeId}</TableCell>
                      <TableCell>{balance.casual}</TableCell>
                      <TableCell>{balance.sick}</TableCell>
                      <TableCell>{balance.earned}</TableCell>
                      <TableCell className="font-bold">{balance.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Uninformed Leaves Tab - From LeaveDashboard */}
        <TabsContent value="uninformed" className="mt-4">
          <UninformedLeaveList 
            leaves={filteredUninformedLeaves} 
            onResolve={handleResolveUninformedLeave}
          />
        </TabsContent>
        
        {/* Abscond Cases Tab - From LeaveDashboard */}
        <TabsContent value="abscond" className="mt-4">
          <AbscondCaseList 
            cases={abscondCases} 
            onClose={handleCloseAbscondCase}
          />
        </TabsContent>
        
        {/* Overview Tab - From LeaveDashboard */}
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Heat Map</CardTitle>
              <CardDescription>
                Visualize leave patterns and identify potential issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveHeatMap month={selectedMonth} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Leave Details Dialog */}
      <Dialog open={showLeaveDetailsDialog} onOpenChange={setShowLeaveDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
            <DialogDescription>
              View complete details of the leave application
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedLeave.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">{selectedLeave.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leave Type</p>
                  <div className="mt-1">{getLeaveTypeBadge(selectedLeave.leaveType)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedLeave.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From Date</p>
                  <p className="font-medium">{new Date(selectedLeave.fromDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To Date</p>
                  <p className="font-medium">{new Date(selectedLeave.toDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days</p>
                  <p className="font-medium">{selectedLeave.days}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-medium">{new Date(selectedLeave.appliedOn).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{selectedLeave.reason}</p>
              </div>
              
              {selectedLeave.status === "approved" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved By</p>
                    <p className="font-medium">{selectedLeave.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved On</p>
                    <p className="font-medium">{selectedLeave.approvedOn ? new Date(selectedLeave.approvedOn).toLocaleDateString() : "-"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowLeaveDetailsDialog(false)}>Close</Button>
            {selectedLeave && selectedLeave.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={() => {
                    handleRejectLeave(selectedLeave.id);
                    setShowLeaveDetailsDialog(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApproveLeave(selectedLeave.id);
                    setShowLeaveDetailsDialog(false);
                  }}
                >
                  Approve
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
