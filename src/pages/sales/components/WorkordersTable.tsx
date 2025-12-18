import { useState, useEffect } from "react";
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
import { Eye, Edit, Trash2, PlayCircle, CheckCircle, XCircle, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { subscribeToWorkOrders, deleteWorkOrder, updateWorkOrder } from "@/services/firebase/WorkOrderFirebaseService";
import { SecurityPostFormModal } from "./SecurityPostFormModal";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Draft":
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    case "Scheduled":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    case "In Progress":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{status}</Badge>;
    case "Completed":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "On Hold":
      return <Badge className="bg-orange-500 hover:bg-orange-600">{status}</Badge>;
    case "Cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface WorkordersTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (workorder: any) => void;
}

export function WorkordersTable({ filter, searchTerm, onEdit }: WorkordersTableProps) {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const { toast } = useToast();

  // Subscribe to real-time work orders from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToWorkOrders((firebaseWorkOrders) => {
      setWorkOrders(firebaseWorkOrders);
    });
    
    return () => unsubscribe();
  }, []);

  // Valid work order filters
  const validWorkOrderFilters = ["All Work Orders", "Draft", "Scheduled", "In Progress", "Completed", "On Hold", "Cancelled"];
  
  // Filter work orders based on selected filter and search term
  const filteredWorkOrders = workOrders.filter(workOrder => {
    // Only apply filter if it's a valid work order filter
    if (validWorkOrderFilters.includes(filter)) {
      if (filter !== "All Work Orders") {
        const statusLower = (workOrder.status || "").toLowerCase();
        const filterLower = filter.toLowerCase();
        
        if (!statusLower.includes(filterLower)) {
          return false;
        }
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchFound = Object.values(workOrder).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
      if (!matchFound) {
        return false;
      }
    }
    
    return true;
  });
  
  const handleDelete = async (id: string) => {
    const result = await deleteWorkOrder(id);
    if (result.success) {
      toast({
        title: "Work Order Deleted",
        description: "Work order has been deleted successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete work order",
        variant: "destructive",
      });
    }
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Work Order",
      description: "Viewing work order details.",
      duration: 3000,
    });
  };
  
  const handleStart = async (workOrder: any) => {
    const result = await updateWorkOrder(workOrder.id, { 
      status: "In Progress",
      startDate: new Date()
    });
    
    if (result.success) {
      toast({
        title: "Work Order Started",
        description: "Work order has been started successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to start work order",
        variant: "destructive",
      });
    }
  };
  
  const handleComplete = async (workOrder: any) => {
    const result = await updateWorkOrder(workOrder.id, { 
      status: "Completed",
      completionDate: new Date()
    });
    
    if (result.success) {
      toast({
        title: "Work Order Completed",
        description: "Work order has been marked as completed.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to complete work order",
        variant: "destructive",
      });
    }
  };
  
  const handleCancel = async (workOrder: any) => {
    const result = await updateWorkOrder(workOrder.id, { status: "Cancelled" });
    
    if (result.success) {
      toast({
        title: "Work Order Cancelled",
        description: "Work order has been cancelled.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to cancel work order",
        variant: "destructive",
      });
    }
  };

  const handleAddPost = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setShowPostForm(true);
  };

  const handlePostFormClose = () => {
    setShowPostForm(false);
    setSelectedWorkOrder(null);
  };

  const handlePostFormSubmit = async (postData: any) => {
    // Post will be synced to operations via the modal
    setShowPostForm(false);
    setSelectedWorkOrder(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-md shadow">
        <Table>
        <TableCaption>List of work orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Agreement Ref.</TableHead>
            <TableHead className="hidden lg:table-cell">Service Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorkOrders.length > 0 ? (
            filteredWorkOrders.map((workOrder, index) => (
              <TableRow key={workOrder.id || `workorder-${index}`}>
                <TableCell className="font-medium">
                  {workOrder.clientName}
                </TableCell>
                <TableCell className="hidden md:table-cell">{workOrder.linkedAgreementId || "N/A"}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="max-w-xs truncate">{workOrder.serviceDetails}</div>
                </TableCell>
                <TableCell>{getStatusBadge(workOrder.status)}</TableCell>
                <TableCell className="hidden lg:table-cell">{workOrder.value}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(workOrder.id)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-blue-500 hover:text-blue-600"
                      onClick={() => handleAddPost(workOrder)}
                      title="Add Security Post"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                    {(workOrder.status === "Draft" || workOrder.status === "Scheduled") && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => handleStart(workOrder)}
                        title="Start Work Order"
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {workOrder.status === "In Progress" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-500 hover:text-green-600"
                        onClick={() => handleComplete(workOrder)}
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {workOrder.status !== "Completed" && workOrder.status !== "Cancelled" && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleCancel(workOrder)}
                        title="Cancel Work Order"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(workOrder)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => handleDelete(workOrder.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No work orders found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {showPostForm && selectedWorkOrder && (
      <SecurityPostFormModal
        isOpen={showPostForm}
        onClose={handlePostFormClose}
        onSubmit={handlePostFormSubmit}
        workOrder={selectedWorkOrder}
      />
    )}
  </>
  );
}
