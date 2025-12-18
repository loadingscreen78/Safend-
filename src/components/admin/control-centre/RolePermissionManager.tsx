
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Save, Shield, RefreshCw, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RoleEditForm } from "./forms/RoleEditForm";
import { RoleAssignmentForm, RoleAssignmentData } from "./forms/RoleAssignmentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllUsers, updateUserRoles } from "@/utils/firebaseUserManagement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auditActions } from "@/utils/auditLog";
import { generatePassword } from "@/utils/firebaseUserManagement";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: "active" | "inactive";
}

export function RolePermissionManager() {
  const [activeTab, setActiveTab] = useState("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Role form state
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  
  // Role assignment state
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<RoleAssignmentData | null>(null);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignmentData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  
  // User credentials edit state
  const [isEditCredentialsOpen, setIsEditCredentialsOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Load users from Firebase
  useEffect(() => {
    loadUsersFromFirebase();
  }, []);

  const loadUsersFromFirebase = async () => {
    setIsLoadingUsers(true);
    try {
      const users = await getAllUsers();
      const assignments: any[] = users.map(user => ({
        id: user.uid,
        userId: user.uid,
        userName: user.name,
        userEmail: user.email,
        branchId: user.branchId,
        branchName: user.branch,
        roles: user.roles,
        assignedBy: "Admin",
        assignedDate: user.createdAt
      }));
      setRoleAssignments(assignments);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Find user to get old role and name
      const user = roleAssignments.find((a: any) => a.userId === userId);
      const oldRole = user?.roles[0] || 'unknown';
      const userName = user?.userName || 'Unknown User';
      
      const result = await updateUserRoles(userId, [newRole]);
      if (result.success) {
        await loadUsersFromFirebase();
        // Log role change
        await auditActions.roleChanged(userName, oldRole, newRole);
        toast({
          title: "Role Updated",
          description: `User role changed to ${newRole.toUpperCase()}`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update role",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleEditUserCredentials = (user: any) => {
    setSelectedUserForEdit(user);
    setNewEmail(user.userEmail || '');
    setNewPassword('');
    setIsEditCredentialsOpen(true);
  };

  const handleGeneratePassword = () => {
    const password = generatePassword();
    setNewPassword(password);
    toast({
      title: "Password Generated",
      description: "New password has been generated"
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    toast({
      title: "Password Copied",
      description: "Password copied to clipboard"
    });
  };

  const handleSaveCredentials = async () => {
    if (!selectedUserForEdit) return;

    // Note: Firebase Auth doesn't allow email/password updates from client
    // This would need Firebase Admin SDK on backend
    // For now, we'll just show a message
    toast({
      title: "Update Credentials",
      description: "Email: " + newEmail + " | Password: " + (newPassword || "Not changed"),
    });

    setIsEditCredentialsOpen(false);
    setSelectedUserForEdit(null);
    setNewEmail('');
    setNewPassword('');
  };
  
  // Permission matrix state
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<string>("r1");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Mock role data
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: "r1", 
      name: "Branch Admin", 
      description: "Full control over branch operations",
      userCount: 2,
      status: "active"
    },
    { 
      id: "r2", 
      name: "HR Manager", 
      description: "Full access to HR module",
      userCount: 3,
      status: "active"
    },
    { 
      id: "r3", 
      name: "Sales Executive", 
      description: "Sales module with limited rights",
      userCount: 5,
      status: "active"
    }
  ]);
  
  // Filter roles based on search term
  const filteredRoles = searchTerm 
    ? roles.filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : roles;
  
  // Modules for permission matrix
  const modules = ["Control Centre", "Sales", "Operations", "Accounts", "HR", "Office Admin", "Reports"];
  
  // Operations for permission matrix
  const operations = ["View", "Create", "Edit", "Delete", "Export", "Approve"];
  
  // Permission matrix state - initialized with some permissions for Branch Admin
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, boolean>>>({
    "Control Centre": { "View": true, "Create": true, "Edit": false, "Delete": false, "Export": true, "Approve": false },
    "Sales": { "View": true, "Create": false, "Edit": false, "Delete": false, "Export": true, "Approve": false },
    "Operations": { "View": true, "Create": false, "Edit": false, "Delete": false, "Export": true, "Approve": false },
    "Accounts": { "View": false, "Create": false, "Edit": false, "Delete": false, "Export": false, "Approve": false },
    "HR": { "View": false, "Create": false, "Edit": false, "Delete": false, "Export": false, "Approve": false },
    "Office Admin": { "View": false, "Create": false, "Edit": false, "Delete": false, "Export": false, "Approve": false },
    "Reports": { "View": true, "Create": false, "Edit": false, "Delete": false, "Export": true, "Approve": false },
  });
  
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsAddingRole(false);
    setIsRoleDialogOpen(true);
  };
  
  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId);
  };
  
  const confirmDeleteRole = () => {
    if (!roleToDelete) return;
    
    const updatedRoles = roles.filter(r => r.id !== roleToDelete);
    setRoles(updatedRoles);
    
    toast({
      title: "Role Deleted",
      description: "Role has been removed from the system",
    });
    
    setRoleToDelete(null);
  };
  
  const handleAddRole = () => {
    setSelectedRole(null);
    setIsAddingRole(true);
    setIsRoleDialogOpen(true);
  };
  
  const handleSaveRole = (roleData: Partial<Role>) => {
    if (isAddingRole) {
      // Generate a unique ID for the new role
      const newId = `r${roles.length + 1}`;
      
      const newRole: Role = {
        id: newId,
        name: roleData.name || '',
        description: roleData.description || '',
        userCount: 0,
        status: roleData.status as "active" | "inactive" || "active"
      };
      
      setRoles([...roles, newRole]);
      
      toast({
        title: "Role Created",
        description: `${newRole.name} has been created successfully`,
      });
    } else if (selectedRole) {
      // Update existing role
      const updatedRoles = roles.map(r => {
        if (r.id === selectedRole.id) {
          return {
            ...r,
            ...roleData,
          };
        }
        return r;
      });
      
      setRoles(updatedRoles);
      
      toast({
        title: "Role Updated",
        description: `${roleData.name} has been updated successfully`,
      });
    }
    
    setIsRoleDialogOpen(false);
    setIsAddingRole(false);
    setSelectedRole(null);
  };
  
  const handlePermissionChange = (module: string, operation: string, checked: boolean) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [operation]: checked
      }
    }));
    
    setUnsavedChanges(true);
  };
  
  const handleApplyPermissionChanges = () => {
    // In a real app, this would call an API to update permissions
    toast({
      title: "Permissions Updated",
      description: "Role permissions have been updated in the system",
    });
    
    setUnsavedChanges(false);
  };

  // Role assignment handlers
  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setIsAssignmentFormOpen(true);
  };

  const handleEditAssignment = (assignment: RoleAssignmentData) => {
    setSelectedAssignment(assignment);
    setIsAssignmentFormOpen(true);
  };

  const handleSaveAssignment = (assignmentData: RoleAssignmentData) => {
    if (selectedAssignment) {
      // Update existing assignment
      setRoleAssignments(prev => 
        prev.map(item => 
          item.id === selectedAssignment.id 
            ? { ...assignmentData, id: item.id } 
            : item
        )
      );
    } else {
      // Create new assignment
      const newId = `ra${roleAssignments.length + 1}`;
      setRoleAssignments(prev => [
        ...prev, 
        { ...assignmentData, id: newId }
      ]);
    }

    setIsAssignmentFormOpen(false);
    setSelectedAssignment(null);
  };
  
  const selectedRoleForMatrix = roles.find(r => r.id === selectedRoleForPermissions) || roles[0];

  // Helper to render role names instead of IDs in assignment table
  const getRoleNames = (roleIds: string[]) => {
    return roleIds.map(id => {
      const role = roles.find(r => r.id === id);
      return role ? role.name : id;
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
          <TabsTrigger value="assignments">Role Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="space-y-6 mt-6">
          <Card className="control-centre-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Users by Role</CardTitle>
                <CardDescription>
                  View all users organized by their assigned roles
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={loadUsersFromFirebase}
                disabled={isLoadingUsers}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingUsers ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading users...</span>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-6">
                    {/* Admin Role */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-black text-white text-sm px-3 py-1">ADMIN</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({roleAssignments.filter((a: any) => a.roles.includes('admin')).length} users)
                        </span>
                      </div>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleAssignments.filter((a: any) => a.roles.includes('admin')).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No admin users
                                </TableCell>
                              </TableRow>
                            ) : (
                              roleAssignments.filter((a: any) => a.roles.includes('admin')).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.userName}</TableCell>
                                  <TableCell>{user.userEmail}</TableCell>
                                  <TableCell>{user.branchName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {new Date(user.assignedDate).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Sales Role */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-red-600 text-white text-sm px-3 py-1">SALES</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({roleAssignments.filter((a: any) => a.roles.includes('sales')).length} users)
                        </span>
                      </div>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleAssignments.filter((a: any) => a.roles.includes('sales')).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No sales users
                                </TableCell>
                              </TableRow>
                            ) : (
                              roleAssignments.filter((a: any) => a.roles.includes('sales')).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.userName}</TableCell>
                                  <TableCell>{user.userEmail}</TableCell>
                                  <TableCell>{user.branchName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {new Date(user.assignedDate).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Operations Role */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-600 text-white text-sm px-3 py-1">OPERATIONS</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({roleAssignments.filter((a: any) => a.roles.includes('operations')).length} users)
                        </span>
                      </div>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleAssignments.filter((a: any) => a.roles.includes('operations')).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No operations users
                                </TableCell>
                              </TableRow>
                            ) : (
                              roleAssignments.filter((a: any) => a.roles.includes('operations')).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.userName}</TableCell>
                                  <TableCell>{user.userEmail}</TableCell>
                                  <TableCell>{user.branchName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {new Date(user.assignedDate).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* HR Role */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-green-600 text-white text-sm px-3 py-1">HR</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({roleAssignments.filter((a: any) => a.roles.includes('hr')).length} users)
                        </span>
                      </div>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleAssignments.filter((a: any) => a.roles.includes('hr')).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No HR users
                                </TableCell>
                              </TableRow>
                            ) : (
                              roleAssignments.filter((a: any) => a.roles.includes('hr')).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.userName}</TableCell>
                                  <TableCell>{user.userEmail}</TableCell>
                                  <TableCell>{user.branchName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {new Date(user.assignedDate).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Accounts Role */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-purple-600 text-white text-sm px-3 py-1">ACCOUNTS</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({roleAssignments.filter((a: any) => a.roles.includes('accounts')).length} users)
                        </span>
                      </div>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleAssignments.filter((a: any) => a.roles.includes('accounts')).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No accounts users
                                </TableCell>
                              </TableRow>
                            ) : (
                              roleAssignments.filter((a: any) => a.roles.includes('accounts')).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.userName}</TableCell>
                                  <TableCell>{user.userEmail}</TableCell>
                                  <TableCell>{user.branchName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {new Date(user.assignedDate).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Reports Role */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-orange-600 text-white text-sm px-3 py-1">REPORTS</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({roleAssignments.filter((a: any) => a.roles.includes('reports')).length} users)
                        </span>
                      </div>
                      <div className="border rounded-lg">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Branch</TableHead>
                              <TableHead>Created</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {roleAssignments.filter((a: any) => a.roles.includes('reports')).length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No reports users
                                </TableCell>
                              </TableRow>
                            ) : (
                              roleAssignments.filter((a: any) => a.roles.includes('reports')).map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.userName}</TableCell>
                                  <TableCell>{user.userEmail}</TableCell>
                                  <TableCell>{user.branchName}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {new Date(user.assignedDate).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          <Card className="control-centre-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Permission Matrix</CardTitle>
                <CardDescription>
                  Define fine-grained permissions for each role
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <select 
                  className="p-2 border rounded-md" 
                  value={selectedRoleForPermissions}
                  onChange={(e) => setSelectedRoleForPermissions(e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <Button 
                  variant="default" 
                  className="gap-2"
                  onClick={handleApplyPermissionChanges}
                  disabled={!unsavedChanges}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="overflow-x-auto">
              <ScrollArea className="h-[400px]">
                <table className="permission-matrix w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 border-b">Module / Action</th>
                      {operations.map(op => (
                        <th key={op} className="text-center p-3 border-b">{op}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module} className="border-b">
                        <td className="text-left p-3 font-medium">{module}</td>
                        {operations.map(op => (
                          <td key={`${module}-${op}`} className="text-center p-3">
                            <Switch 
                              checked={permissionMatrix[module]?.[op] || false}
                              onCheckedChange={(checked) => handlePermissionChange(module, op, checked)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-muted-foreground">
                  Casbin policy will be updated in real-time
                </span>
              </div>
              <Button 
                variant="default"
                onClick={handleApplyPermissionChanges}
                disabled={!unsavedChanges}
              >
                Apply Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6">
          <Card className="control-centre-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">User Roles & Permissions</CardTitle>
                <CardDescription>
                  Manage user roles - all users created in User Manager appear here
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={loadUsersFromFirebase}
                disabled={isLoadingUsers}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingUsers ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading users...</span>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead>Change Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roleAssignments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No users found. Create users in User Manager first.
                          </TableCell>
                        </TableRow>
                      ) : (
                        roleAssignments.map((assignment: any) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.userName}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {assignment.userEmail || 'N/A'}
                            </TableCell>
                            <TableCell>{assignment.branchName}</TableCell>
                            <TableCell>
                              <Badge className="bg-red-600 text-white">
                                {assignment.roles[0]?.toUpperCase() || 'No Role'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={assignment.roles[0] || ''}
                                onValueChange={(value) => handleRoleChange(assignment.userId, value)}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="sales">Sales</SelectItem>
                                  <SelectItem value="operations">Operations</SelectItem>
                                  <SelectItem value="hr">HR</SelectItem>
                                  <SelectItem value="accounts">Accounts</SelectItem>
                                  <SelectItem value="reports">Reports</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUserCredentials(assignment)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Role Edit Form */}
      <RoleEditForm
        role={selectedRole}
        isOpen={isRoleDialogOpen}
        onClose={() => {
          setIsRoleDialogOpen(false);
          setIsAddingRole(false);
          setSelectedRole(null);
        }}
        onSave={handleSaveRole}
        isNew={isAddingRole}
      />
      
      {/* Role Assignment Form */}
      <RoleAssignmentForm
        isOpen={isAssignmentFormOpen}
        onClose={() => {
          setIsAssignmentFormOpen(false);
          setSelectedAssignment(null);
        }}
        onSave={handleSaveAssignment}
        existingAssignment={selectedAssignment}
      />
      
      {/* Edit User Credentials Dialog */}
      <Dialog open={isEditCredentialsOpen} onOpenChange={setIsEditCredentialsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User Credentials</DialogTitle>
            <DialogDescription>
              Update email and password for {selectedUserForEdit?.userName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
              />
              <p className="text-xs text-muted-foreground">
                User will need to login with the new email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-password"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password or generate"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPassword}
                  disabled={!newPassword}
                  title="Copy password"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGeneratePassword}
                  title="Generate password"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave blank to keep current password. Click refresh to generate a new one.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Make sure to copy and share the new password with the user securely.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCredentialsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCredentials}>
              Update Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              role and may affect users who have been assigned this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmDeleteRole}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
