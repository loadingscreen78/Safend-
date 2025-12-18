import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserPlus, Upload, RefreshCw, Edit, UserMinus, CheckCircle2, ShieldAlert, Activity, Trash2, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useBranch } from "@/contexts/BranchContext";
import { useToast } from "@/components/ui/use-toast";
import { UserEditForm } from "./forms/UserEditForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { createFirebaseUser, getAllUsers, updateFirebaseUser, deleteFirebaseUser } from "@/utils/firebaseUserManagement";
import { auditActions } from "@/utils/auditLog";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  branchId: string;
  status: "active" | "inactive";
  lastActive: string;
  avatar: string;
}
export function UserManager() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const {
    isMainBranch,
    currentBranch
  } = useBranch();
  const {
    toast
  } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from Firebase
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const firebaseUsers = await getAllUsers();
      const convertedUsers: User[] = firebaseUsers.map(fu => ({
        id: fu.uid,
        name: fu.name,
        email: fu.email,
        role: fu.roles[0] || 'sales',
        branch: fu.branch,
        branchId: fu.branchId,
        status: fu.status,
        lastActive: fu.lastActive || 'Never',
        avatar: ''
      }));
      setUsers(convertedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on current branch if not main branch
  const filteredUsers = !isMainBranch ? users.filter(user => user.branchId === currentBranch?.id) : users;

  // Filter by status
  const statusFilteredUsers = selectedFilter === "all" ? filteredUsers : filteredUsers.filter(user => user.status === selectedFilter);

  // Search filter
  const searchFilteredUsers = searchTerm ? statusFilteredUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.role.toLowerCase().includes(searchTerm.toLowerCase())) : statusFilteredUsers;
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
    setIsAddingUser(false);
  };
  const handleToggleUserStatus = async (user: User) => {
    const newStatus: "active" | "inactive" = user.status === "active" ? "inactive" : "active";
    const result = await updateFirebaseUser(user.id, { status: newStatus });
    if (result.success) {
      await loadUsers();
      toast({
        title: `User ${newStatus === "active" ? "Activated" : "Deactivated"}`,
        description: `${user.name} has been ${newStatus === "active" ? "activated" : "deactivated"}`
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update status",
        variant: "destructive"
      });
    }
  };
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
  };
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const userToDeleteData = users.find(u => u.id === userToDelete);
    const result = await deleteFirebaseUser(userToDelete);
    if (result.success) {
      await loadUsers();
      // Log user deletion
      if (userToDeleteData) {
        await auditActions.userDeleted(userToDeleteData.name);
      }
      toast({
        title: "User Deleted",
        description: "User has been removed from the system"
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete user",
        variant: "destructive"
      });
    }
    setUserToDelete(null);
  };
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddingUser(true);
    setIsEditDialogOpen(true);
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setIsRefreshing(false);
    toast({
      title: "Data refreshed",
      description: "User data has been refreshed"
    });
  };

  const handleSaveUser = async (userData: Partial<User> & { password?: string }) => {
    if (isAddingUser) {
      const result = await createFirebaseUser(
        userData.email || '',
        userData.password || 'TempPass123!',
        {
          name: userData.name || '',
          email: userData.email || '',
          roles: [userData.role || 'sales'],
          branch: userData.branch || '',
          branchId: userData.branchId || '',
          status: userData.status || 'active'
        }
      );
      if (result.success) {
        await loadUsers();
        // Log user creation
        await auditActions.userCreated(userData.name || '', userData.email || '');
        toast({
          title: "User Created",
          description: `${userData.name} created. Password: ${userData.password}`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create user",
          variant: "destructive"
        });
      }
    } else if (selectedUser) {
      const result = await updateFirebaseUser(selectedUser.id, {
        name: userData.name,
        roles: [userData.role || 'sales'],
        branch: userData.branch,
        branchId: userData.branchId,
        status: userData.status
      });
      if (result.success) {
        await loadUsers();
        // Log user update
        await auditActions.userUpdated(userData.name || selectedUser.name, {
          role: userData.role,
          branch: userData.branch,
          status: userData.status
        });
        toast({
          title: "User Updated",
          description: `${userData.name} updated successfully`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update user",
          variant: "destructive"
        });
      }
    }
    setIsEditDialogOpen(false);
    setIsAddingUser(false);
    setSelectedUser(null);
  };
  return <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="import">Bulk Import</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6 mt-6">
          <Card className="control-centre-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">User Management</CardTitle>
                <CardDescription>
                  {isMainBranch ? "Manage all users across branches" : `Manage users in ${currentBranch?.name}`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedFilter("all")} variant={selectedFilter === "all" ? "default" : "outline"}>All</Button>
                <Button onClick={() => setSelectedFilter("active")} variant={selectedFilter === "active" ? "default" : "outline"}>Active</Button>
                <Button onClick={() => setSelectedFilter("inactive")} variant={selectedFilter === "inactive" ? "default" : "outline"}>Inactive</Button>
                <Button variant="destructive" className="gap-2" onClick={handleAddUser}>
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading users...</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="relative w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
                    </div>
                    
                    <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                  
                  <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchFilteredUsers.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow> : searchFilteredUsers.map(user => <TableRow key={user.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.branch}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleToggleUserStatus(user)} className={user.status === "active" ? "text-amber-600" : "text-green-600"}>
                            {user.status === "active" ? <UserMinus className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
                </>
              )}
            </CardContent>
          </Card>
          
          
        </TabsContent>
        
        <TabsContent value="import" className="mt-6">
          <Card className="control-centre-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Bulk User Import</CardTitle>
              <CardDescription>
                Import multiple users using CSV or connect to LDAP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-10 text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop a CSV file or click to browse
                  </p>
                  <Button variant="default">Select File</Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">LDAP Synchronization</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Status: <span className="text-red-600">Not Connected</span></p>
                      <p className="text-sm text-muted-foreground">Connect to your LDAP server to sync users</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Configure LDAP
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-6">
          <Card className="control-centre-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">User Activity Log</CardTitle>
              <CardDescription>
                Track user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="flex gap-4 p-3 border-b last:border-0">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                      <Activity className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Rahul Sharma {i === 1 ? 'logged in' : i === 2 ? 'updated user settings' : i === 3 ? 'added new branch' : i === 4 ? 'assigned role' : 'exported data'}</p>
                      <p className="text-sm text-muted-foreground">{i} hour{i !== 1 && 's'} ago • IP: 192.168.1.{i}0</p>
                    </div>
                    <Badge variant="outline">{i === 1 ? 'Authentication' : i === 2 ? 'Settings' : i === 3 ? 'Branch' : i === 4 ? 'Role' : 'Export'}</Badge>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Edit Form */}
      <UserEditForm user={selectedUser} isOpen={isEditDialogOpen} onClose={() => {
      setIsEditDialogOpen(false);
      setIsAddingUser(false);
      setSelectedUser(null);
    }} onSave={handleSaveUser} isNew={isAddingUser} />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
}