
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
import { Eye, Edit, Trash2, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataStore, SecurityPost, ManpowerRequirement } from "@/services/DataService";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Inactive":
      return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

interface PostTableProps {
  filter: string;
  onEdit: (post: SecurityPost) => void;
}

export function PostTable({ filter, onEdit }: PostTableProps) {
  const { toast } = useToast();
  const securityPosts = useDataStore(state => state.securityPosts);
  const manpowerRequirements = useDataStore(state => state.manpowerRequirements);
  
  // Get requirements for a post
  const getRequirementsForPost = (postId: string): ManpowerRequirement[] => {
    return manpowerRequirements.filter(req => req.postId === postId);
  };
  
  // Calculate total staff needed for a post
  const calculateTotalStaff = (postId: string): number => {
    return getRequirementsForPost(postId)
      .reduce((total, req) => total + req.count, 0);
  };
  
  // Get total monthly cost for a post
  const calculateMonthlyCost = (postId: string): number => {
    return getRequirementsForPost(postId)
      .reduce((total, req) => total + (req.monthlySalary * req.count), 0);
  };
  
  // Filter posts based on selected filter
  const filteredPosts = securityPosts.filter(post => {
    if (filter === "Active" && post.status !== "Active") {
      return false;
    } else if (filter === "Inactive" && post.status !== "Inactive") {
      return false;
    } else if (filter === "Client Sites" && post.client === "SafeEnd Security Services") {
      return false;
    } else if (filter === "Internal" && post.client !== "SafeEnd Security Services") {
      return false;
    }
    
    return true;
  });
  
  const handleDelete = (id: string) => {
    toast({
      title: "Post Deleted",
      description: `Post ${id} has been deleted successfully.`,
      duration: 3000,
    });
  };
  
  const handleView = (id: string) => {
    toast({
      title: "Viewing Post Details",
      description: `Viewing details for post ${id}.`,
      duration: 3000,
    });
  };
  
  const handleViewStaff = (id: string, name: string) => {
    toast({
      title: "Viewing Staff",
      description: `Viewing staff assigned to ${name}.`,
      duration: 3000,
    });
  };
  
  const handleViewSchedule = (id: string, name: string) => {
    toast({
      title: "Viewing Schedule",
      description: `Viewing schedule for ${name}.`,
      duration: 3000,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow">
      <Table>
        <TableCaption>Complete list of security posts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Post ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Client</TableHead>
            <TableHead className="hidden lg:table-cell">Location</TableHead>
            <TableHead>Required Staff</TableHead>
            <TableHead>Monthly Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.id}</TableCell>
                <TableCell>{post.name}</TableCell>
                <TableCell className="hidden md:table-cell">{post.client}</TableCell>
                <TableCell className="hidden lg:table-cell">{post.location}</TableCell>
                <TableCell>{calculateTotalStaff(post.id)}</TableCell>
                <TableCell>₹{calculateMonthlyCost(post.id).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(post.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewStaff(post.id, post.name)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewSchedule(post.id, post.name)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600" 
                      onClick={() => handleDelete(post.id)}
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
                No posts found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
