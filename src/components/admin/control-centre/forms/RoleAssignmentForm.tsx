import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Users, Shield } from "lucide-react";
import { RoleAPI } from "@/services/api"; // Changed to use RoleAPI from api.ts

interface RoleAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RoleAssignmentData) => void;
  existingAssignment?: RoleAssignmentData | null;
}

export interface RoleAssignmentData {
  id?: string;
  userId: string;
  userName: string;
  branchId: string;
  branchName: string;
  roles: string[];
  assignedBy?: string;
  assignedDate?: string;
}

export function RoleAssignmentForm({ 
  isOpen, 
  onClose, 
  onSave, 
  existingAssignment 
}: RoleAssignmentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RoleAssignmentData>({
    userId: "",
    userName: "",
    branchId: "",
    branchName: "",
    roles: [],
  });
  const [users, setUsers] = useState<{id: string; name: string}[]>([]);
  const [branches, setBranches] = useState<{id: string; name: string}[]>([]);
  const [availableRoles, setAvailableRoles] = useState<{id: string; name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load mock data
  useEffect(() => {
    // In a real app, these would be API calls
    setUsers([
      { id: "u1", name: "Rahul Sharma" },
      { id: "u2", name: "Priya Patel" },
      { id: "u3", name: "Amit Singh" },
      { id: "u4", name: "Deepa Gupta" },
      { id: "u5", name: "Vikram Mehta" },
    ]);
    
    setBranches([
      { id: "b1", name: "Mumbai HQ" },
      { id: "b2", name: "Delhi Office" },
      { id: "b3", name: "Bangalore Office" },
      { id: "b4", name: "Chennai Branch" },
      { id: "b5", name: "Kolkata Branch" },
    ]);
    
    setAvailableRoles([
      { id: "r1", name: "Branch Admin" },
      { id: "r2", name: "HR Manager" },
      { id: "r3", name: "Sales Executive" },
      { id: "r4", name: "Operations Manager" },
      { id: "r5", name: "Accounts Manager" },
    ]);
  }, []);

  // Populate form if editing an existing assignment
  useEffect(() => {
    if (existingAssignment) {
      setFormData(existingAssignment);
    } else {
      // Reset form for new assignment
      setFormData({
        userId: "",
        userName: "",
        branchId: "",
        branchName: "",
        roles: [],
      });
    }
  }, [existingAssignment, isOpen]);

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    setFormData(prev => ({
      ...prev,
      userId,
      userName: selectedUser?.name || "",
    }));
  };

  const handleBranchChange = (branchId: string) => {
    const selectedBranch = branches.find(branch => branch.id === branchId);
    setFormData(prev => ({
      ...prev,
      branchId,
      branchName: selectedBranch?.name || "",
    }));
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => {
      const roleExists = prev.roles.includes(roleId);
      
      if (roleExists) {
        return {
          ...prev,
          roles: prev.roles.filter(id => id !== roleId)
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, roleId]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!formData.userId || !formData.branchId || formData.roles.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and select at least one role",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, we would save this using an API
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onSave({
        ...formData,
        assignedBy: "Current User",
        assignedDate: new Date().toISOString(),
      });
      
      toast({
        title: "Success",
        description: existingAssignment 
          ? "Role assignment updated successfully" 
          : "Role assignment created successfully",
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving role assignment:", error);
      toast({
        title: "Error",
        description: "Failed to save role assignment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" /> 
            {existingAssignment ? "Edit Role Assignment" : "New Role Assignment"}
          </DialogTitle>
          <DialogDescription>
            {existingAssignment 
              ? "Modify user roles and permissions for this branch"
              : "Assign roles to a user for a specific branch"
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-1">
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user">User *</Label>
                <Select
                  value={formData.userId}
                  onValueChange={handleUserChange}
                  disabled={!!existingAssignment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select
                  value={formData.branchId}
                  onValueChange={handleBranchChange}
                  disabled={!!existingAssignment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Roles *</Label>
              <div className="border rounded-md p-4 space-y-3">
                {availableRoles.map((role) => (
                  <div key={role.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formData.roles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`role-${role.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {role.name}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {role.id === "r1" && "Full control over branch operations"}
                        {role.id === "r2" && "Full access to HR module"}
                        {role.id === "r3" && "Sales module with limited rights"}
                        {role.id === "r4" && "Manage operations and assignments"}
                        {role.id === "r5" && "Access to all financial operations"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-red-600" />
                <span className="font-medium">Assignment Information</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {existingAssignment ? (
                  <>
                    Originally assigned by {existingAssignment.assignedBy} on{" "}
                    {new Date(existingAssignment.assignedDate || "").toLocaleDateString()}
                  </>
                ) : (
                  "New assignments will be logged in the audit trail"
                )}
              </p>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button 
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>{existingAssignment ? "Update Assignment" : "Create Assignment"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
