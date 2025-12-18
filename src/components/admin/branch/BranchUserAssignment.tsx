
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users, Building2, Plus, Check, X } from "lucide-react";
import type { Branch, BranchUser, Permission } from "@/types/branch";

// Mock user data
const mockUsers = [
  { id: "u1", name: "Rahul Sharma", email: "rahul.sharma@safend.com", role: "admin", status: "active" },
  { id: "u2", name: "Priya Patel", email: "priya.patel@safend.com", role: "sales", status: "active" },
  { id: "u3", name: "Amit Singh", email: "amit.singh@safend.com", role: "operations", status: "active" },
  { id: "u4", name: "Deepika Kumar", email: "deepika.kumar@safend.com", role: "hr", status: "active" },
  { id: "u5", name: "Vijay Reddy", email: "vijay.reddy@safend.com", role: "accounts", status: "active" },
  { id: "u6", name: "Neha Gupta", email: "neha.gupta@safend.com", role: "office_admin", status: "active" },
];

// Mock branch user assignments with proper type compliance
const mockBranchUsers: BranchUser[] = [
  {
    id: "bu1",
    userId: "u1",
    branchId: "b1",
    isManager: true,
    roles: ["admin"],
    permissions: [
      { module: "sales", actions: ["view", "create", "update", "delete"] },
      { module: "operations", actions: ["view", "create", "update", "delete"] },
      { module: "accounts", actions: ["view", "create", "update", "delete"] },
      { module: "hr", actions: ["view", "create", "update", "delete"] },
      { module: "office-admin", actions: ["view", "create", "update", "delete"] },
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-04-15T10:30:00Z",
  },
  {
    id: "bu2",
    userId: "u2",
    branchId: "b2",
    isManager: true,
    roles: ["sales"],
    permissions: [
      { module: "sales", actions: ["view", "create", "update", "delete"] },
    ],
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-04-12T11:20:00Z",
  },
  {
    id: "bu3",
    userId: "u3",
    branchId: "b3",
    isManager: true,
    roles: ["operations"],
    permissions: [
      { module: "operations", actions: ["view", "create", "update", "delete"] },
    ],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-04-10T14:45:00Z",
  },
  {
    id: "bu4",
    userId: "u4",
    branchId: "b4",
    isManager: true,
    roles: ["hr"],
    permissions: [
      { module: "hr", actions: ["view", "create", "update", "delete"] },
    ],
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-04-05T16:30:00Z",
  },
  {
    id: "bu5",
    userId: "u5",
    branchId: "b5",
    isManager: false,
    roles: ["accounts"],
    permissions: [
      { module: "accounts", actions: ["view", "create", "update"] },
    ],
    createdAt: "2024-03-01T12:00:00Z",
    updatedAt: "2024-03-15T09:30:00Z",
  },
  {
    id: "bu6",
    userId: "u6",
    branchId: "b1",
    isManager: false,
    roles: ["office_admin"],
    permissions: [
      { module: "office-admin", actions: ["view", "create", "update"] },
    ],
    createdAt: "2024-03-10T14:00:00Z",
    updatedAt: "2024-04-01T10:15:00Z",
  },
];

interface BranchUserAssignmentProps {
  branches: Branch[];
  searchTerm: string;
}

const assignmentSchema = z.object({
  branchId: z.string().min(1, { message: "Please select a branch" }),
  userId: z.string().min(1, { message: "Please select a user" }),
  isManager: z.boolean().default(false),
  sales: z.object({
    enabled: z.boolean().default(false),
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    update: z.boolean().default(false),
    delete: z.boolean().default(false),
  }),
  operations: z.object({
    enabled: z.boolean().default(false),
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    update: z.boolean().default(false),
    delete: z.boolean().default(false),
  }),
  accounts: z.object({
    enabled: z.boolean().default(false),
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    update: z.boolean().default(false),
    delete: z.boolean().default(false),
  }),
  hr: z.object({
    enabled: z.boolean().default(false),
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    update: z.boolean().default(false),
    delete: z.boolean().default(false),
  }),
  officeAdmin: z.object({
    enabled: z.boolean().default(false),
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    update: z.boolean().default(false),
    delete: z.boolean().default(false),
  }),
});

export function BranchUserAssignment({ branches, searchTerm }: BranchUserAssignmentProps) {
  const [branchUsers, setBranchUsers] = useState<BranchUser[]>(mockBranchUsers);
  const [users] = useState(mockUsers);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      branchId: "",
      userId: "",
      isManager: false,
      sales: {
        enabled: false,
        view: false,
        create: false,
        update: false,
        delete: false,
      },
      operations: {
        enabled: false,
        view: false,
        create: false,
        update: false,
        delete: false,
      },
      accounts: {
        enabled: false,
        view: false,
        create: false,
        update: false,
        delete: false,
      },
      hr: {
        enabled: false,
        view: false,
        create: false,
        update: false,
        delete: false,
      },
      officeAdmin: {
        enabled: false,
        view: false,
        create: false,
        update: false,
        delete: false,
      },
    },
  });

  // Filter branch users based on search and selected tab
  const filteredBranchUsers = useMemo(() => {
    let filtered = branchUsers;
    
    // Filter by selected tab/branch
    if (selectedTab !== "all") {
      filtered = filtered.filter(bu => bu.branchId === selectedTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const user = users.find(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (user) {
        filtered = filtered.filter(bu => bu.userId === user.id);
      } else {
        filtered = [];
      }
    }
    
    return filtered;
  }, [branchUsers, selectedTab, searchTerm, users]);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  const getPermissionDisplay = (permissions: Permission[]) => {
    const modules = permissions.map(p => p.module);
    return modules.join(", ");
  };

  const handleAssignUser = (data: z.infer<typeof assignmentSchema>) => {
    // Convert form data to permissions array
    const permissions: Permission[] = [];
    
    // Helper function to process each module
    const processModule = (
      moduleName: "sales" | "operations" | "accounts" | "hr" | "office-admin", 
      moduleData: { enabled: boolean, view: boolean, create: boolean, update: boolean, delete: boolean }
    ) => {
      if (moduleData.enabled) {
        const actions: ("view" | "create" | "update" | "delete")[] = [];
        if (moduleData.view) actions.push("view");
        if (moduleData.create) actions.push("create");
        if (moduleData.update) actions.push("update");
        if (moduleData.delete) actions.push("delete");
        
        if (actions.length > 0) {
          permissions.push({ 
            module: moduleName, 
            actions 
          });
        }
      }
    };
    
    // Process each module - fix the module data to have explicit values for all properties
    processModule("sales", {
      enabled: !!data.sales.enabled,
      view: !!data.sales.view,
      create: !!data.sales.create,
      update: !!data.sales.update,
      delete: !!data.sales.delete
    });
    
    processModule("operations", {
      enabled: !!data.operations.enabled,
      view: !!data.operations.view,
      create: !!data.operations.create,
      update: !!data.operations.update,
      delete: !!data.operations.delete
    });
    
    processModule("accounts", {
      enabled: !!data.accounts.enabled,
      view: !!data.accounts.view,
      create: !!data.accounts.create,
      update: !!data.accounts.update,
      delete: !!data.accounts.delete
    });
    
    processModule("hr", {
      enabled: !!data.hr.enabled,
      view: !!data.hr.view,
      create: !!data.hr.create,
      update: !!data.hr.update,
      delete: !!data.hr.delete
    });
    
    processModule("office-admin", {
      enabled: !!data.officeAdmin.enabled,
      view: !!data.officeAdmin.view,
      create: !!data.officeAdmin.create,
      update: !!data.officeAdmin.update,
      delete: !!data.officeAdmin.delete
    });
    
    // Determine roles based on permissions
    const roles: string[] = permissions.map(p => p.module === "office-admin" ? "office" : p.module);
    if (data.isManager) roles.push("manager");
    
    // Create new branch user assignment
    const newBranchUser: BranchUser = {
      id: `bu${branchUsers.length + 1}`,
      userId: data.userId,
      branchId: data.branchId,
      isManager: data.isManager,
      roles,
      permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setBranchUsers([...branchUsers, newBranchUser]);
    setAssignDialogOpen(false);
    
    toast({
      title: "User assigned to branch",
      description: `${getUserName(data.userId)} has been assigned to ${getBranchName(data.branchId)}.`,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>All Branches</span>
            </TabsTrigger>
            {branches.map(branch => (
              <TabsTrigger 
                key={branch.id} 
                value={branch.id} 
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                <span>{branch.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button onClick={() => setAssignDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign User
          </Button>
        </div>

        <TabsContent value="all" className="p-0">
          <UserAssignmentTable 
            branchUsers={filteredBranchUsers}
            getUserName={getUserName}
            getBranchName={getBranchName}
            getPermissionDisplay={getPermissionDisplay}
          />
        </TabsContent>

        {branches.map(branch => (
          <TabsContent key={branch.id} value={branch.id} className="p-0">
            <UserAssignmentTable 
              branchUsers={filteredBranchUsers}
              getUserName={getUserName}
              getBranchName={getBranchName}
              getPermissionDisplay={getPermissionDisplay}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign User to Branch</DialogTitle>
            <DialogDescription>
              Select a user and branch, then configure permissions for each module.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAssignUser)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isManager"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Branch Manager</FormLabel>
                      <FormDescription>
                        Designate this user as the branch manager with oversight responsibilities.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Module Permissions</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Module</TableHead>
                        <TableHead className="w-[100px] text-center">Access</TableHead>
                        <TableHead className="text-center">View</TableHead>
                        <TableHead className="text-center">Create</TableHead>
                        <TableHead className="text-center">Update</TableHead>
                        <TableHead className="text-center">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sales Module */}
                      <TableRow>
                        <TableCell className="font-medium">Sales</TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="sales.enabled"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="sales.view"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("sales.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("sales.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="sales.create"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("sales.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("sales.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="sales.update"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("sales.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("sales.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="sales.delete"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("sales.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("sales.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Operations Module */}
                      <TableRow>
                        <TableCell className="font-medium">Operations</TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="operations.enabled"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="operations.view"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("operations.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("operations.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="operations.create"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("operations.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("operations.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="operations.update"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("operations.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("operations.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="operations.delete"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("operations.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("operations.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Accounts Module */}
                      <TableRow>
                        <TableCell className="font-medium">Accounts</TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="accounts.enabled"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="accounts.view"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("accounts.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("accounts.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="accounts.create"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("accounts.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("accounts.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="accounts.update"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("accounts.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("accounts.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="accounts.delete"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("accounts.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("accounts.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>

                      {/* HR Module */}
                      <TableRow>
                        <TableCell className="font-medium">HR</TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="hr.enabled"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="hr.view"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("hr.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("hr.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="hr.create"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("hr.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("hr.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="hr.update"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("hr.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("hr.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="hr.delete"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("hr.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("hr.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Office Admin Module */}
                      <TableRow>
                        <TableCell className="font-medium">Office Admin</TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="officeAdmin.enabled"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="officeAdmin.view"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("officeAdmin.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("officeAdmin.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="officeAdmin.create"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("officeAdmin.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("officeAdmin.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="officeAdmin.update"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("officeAdmin.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("officeAdmin.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <FormField
                            control={form.control}
                            name="officeAdmin.delete"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value && form.watch("officeAdmin.enabled")}
                                    onCheckedChange={field.onChange}
                                    disabled={!form.watch("officeAdmin.enabled")}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Assign User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate component for the user assignment table
function UserAssignmentTable({ 
  branchUsers, 
  getUserName, 
  getBranchName,
  getPermissionDisplay
}: {
  branchUsers: BranchUser[];
  getUserName: (userId: string) => string;
  getBranchName: (branchId: string) => string;
  getPermissionDisplay: (permissions: Permission[]) => string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Branch Assignments</CardTitle>
        <CardDescription>
          View all users assigned to branches and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Modules Access</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Assigned Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branchUsers.length > 0 ? (
              branchUsers.map((bu) => (
                <TableRow key={bu.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{getUserName(bu.userId)}</TableCell>
                  <TableCell>{getBranchName(bu.branchId)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bu.roles.map(role => (
                        <Badge key={role} variant="outline" className="capitalize">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getPermissionDisplay(bu.permissions)}</TableCell>
                  <TableCell>
                    {bu.isManager ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        <Check className="mr-1 h-3 w-3" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <X className="mr-1 h-3 w-3" />
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(bu.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No user assignments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
