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
import { Eye, Edit, Trash2, Check, Clock, FileText, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subscribeToFollowups, deleteFollowup, updateFollowup, Followup } from "@/services/firebase/FollowupFirebaseService";

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "High":
      return <Badge className="bg-red-500 hover:bg-red-600">{priority}</Badge>;
    case "Medium":
      return <Badge className="bg-amber-500 hover:bg-amber-600">{priority}</Badge>;
    case "Low":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{priority}</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
    case "Completed":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Overdue":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface FollowupsTableProps {
  filter: string;
  searchTerm: string;
  onEdit: (followup: any) => void;
  onConvertToQuotation?: (followup: Followup) => void;
}

export function FollowupsTable({ filter, searchTerm, onEdit, onConvertToQuotation }: FollowupsTableProps) {
  const { toast } = useToast();
  const [followups, setFollowups] = useState<Followup[]>([]);
  
  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToFollowups((firebaseFollowups) => {
      setFollowups(firebaseFollowups);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Filter follow-ups based on selected filter and search term
  const filteredFollowups = followups.filter(followup => {
    // Safety check for dateTime
    if (!followup.dateTime) return false;
    
    // Extract date from dateTime string
    const followupDate = followup.dateTime.split('T')[0];
    // Filter by time frame
    if (filter === "Today" && followupDate !== today) {
      return false;
    } else if (filter === "This Week") {
      const followupDateTime = new Date(followup.dateTime);
      const currentDate = new Date();
      const daysDifference = Math.floor((followupDateTime.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      if (daysDifference < 0 || daysDifference >= 7) {
        return false;
      }
    } else if (filter === "This Month") {
      const followupMonth = new Date(followup.dateTime).getMonth();
      const currentMonth = new Date().getMonth();
      if (followupMonth !== currentMonth) {
        return false;
      }
    } else if (filter === "Overdue" && followup.status !== "Overdue") {
      return false;
    } else if (filter !== "All Follow-ups" && filter !== "Today" && 
               filter !== "This Week" && filter !== "This Month" && 
               filter !== "Overdue") {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !Object.values(followup).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });
  
  const handleDelete = async (id: string) => {
    const result = await deleteFollowup(id);
    if (result.success) {
      toast({
        title: "Follow-up Deleted",
        description: "Follow-up has been deleted successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete follow-up",
        variant: "destructive",
      });
    }
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Follow-up Details",
      description: `Viewing details for follow-up.`,
      duration: 3000,
    });
  };
  
  const handleMarkComplete = async (id: string) => {
    const result = await updateFollowup(id, { status: "Completed" });
    if (result.success) {
      toast({
        title: "Follow-up Completed",
        description: "Follow-up has been marked as completed.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update follow-up",
        variant: "destructive",
      });
    }
  };
  
  const handleReschedule = (id: string) => {
    toast({
      title: "Follow-up Rescheduled",
      description: "Follow-up has been rescheduled.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Scheduled follow-ups with clients and prospects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead className="hidden md:table-cell">Company</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Date & Time</TableHead>
            <TableHead className="hidden lg:table-cell">Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFollowups.length > 0 ? (
            filteredFollowups.map((followup) => {
              // Parse dateTime to display date and time separately
              const dateTime = new Date(followup.dateTime);
              const displayDate = dateTime.toLocaleDateString('en-IN');
              const displayTime = dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              
              return (
                <TableRow key={followup.id}>
                  <TableCell className="font-medium">{followup.contact}</TableCell>
                  <TableCell className="hidden md:table-cell">{followup.company}</TableCell>
                  <TableCell>{followup.type}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {displayDate} at {displayTime}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {followup.subject}
                    {followup.priority && (
                      <div className="mt-1">
                        {getPriorityBadge(followup.priority)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(followup.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleView(followup.id!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {followup.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-500 hover:text-green-600"
                          onClick={() => handleMarkComplete(followup.id!)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {followup.status !== "Completed" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleReschedule(followup.id!)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                      {followup.status === "Completed" && onConvertToQuotation && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => onConvertToQuotation(followup)}
                          title="Convert to Quotation"
                        >
                          <FileText className="h-4 w-4" />
                          <DollarSign className="h-3 w-3 -ml-1" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(followup)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600" 
                        onClick={() => handleDelete(followup.id!)}
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
              <TableCell colSpan={7} className="text-center py-6">
                No follow-ups found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
